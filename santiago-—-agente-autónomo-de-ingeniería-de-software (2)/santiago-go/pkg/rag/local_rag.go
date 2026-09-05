package rag

import (
	"fmt"
	"math"
	"sort"
	"strings"
	"sync"
	"time"
)

// DocumentChunk represents an indexed slice of a technical manual or spec.
type DocumentChunk struct {
	DocID       string            `json:"doc_id"`
	Title       string            `json:"title"`
	PageNumber  int               `json:"page_number"`
	SectionName string            `json:"section_name"`
	Content     string            `json:"content"`
	Metadata    map[string]string `json:"metadata"`
	Tokens      []string          `json:"-"`
}

// SearchResult returns relevant excerpts with citation metadata.
type SearchResult struct {
	DocID       string  `json:"doc_id"`
	Title       string  `json:"title"`
	PageNumber  int     `json:"page_number"`
	SectionName string  `json:"section_name"`
	Excerpt     string  `json:"excerpt"`
	Score       float64 `json:"score"`
	Citation    string  `json:"citation"`
}

// LocalRAGEngine is a 100% offline, pure-Go vector & inverted index search engine.
// Implements BM25 / TF-IDF semantic matching without Python or external servers.
type LocalRAGEngine struct {
	mu           sync.RWMutex
	chunks       []DocumentChunk
	invertedIdx  map[string][]int // term -> chunk indices
	docFreq      map[string]int   // term -> count of chunks containing term
	totalChunks  int
	avgDocLen    float64
}

// NewLocalRAGEngine creates a fresh local RAG instance.
func NewLocalRAGEngine() *LocalRAGEngine {
	engine := &LocalRAGEngine{
		chunks:      make([]DocumentChunk, 0),
		invertedIdx: make(map[string][]int),
		docFreq:     make(map[string]int),
	}
	engine.seedTechnicalManuals()
	return engine
}

// seedTechnicalManuals loads standard technical specifications (DICOM, KlikSoft, Android).
func (r *LocalRAGEngine) seedTechnicalManuals() {
	manuals := []DocumentChunk{
		{
			DocID:       "DICOM-PS3.5-2023",
			Title:       "DICOM PS3.5 Data Structures and Encoding",
			PageNumber:  45,
			SectionName: "Section 7.1.2: Data Element Structure with Explicit VR",
			Content:     "For Data Elements with Explicit VR of OB, OW, OF, SQ, UC, UR, UT and UN, the 16-bit Value Representation is followed by two reserved bytes (0000H) and a 32-bit Value Length field. Misalignment in the 2-byte padding causes header corruption and parser rejection.",
			Metadata:    map[string]string{"standard": "ISO 12052", "domain": "medical_imaging"},
		},
		{
			DocID:       "DICOM-PS3.5-2023",
			Title:       "DICOM PS3.5 Data Structures and Encoding",
			PageNumber:  46,
			SectionName: "Section 7.1.3: Little Endian Transfer Syntax",
			Content:     "Default Transfer Syntax 1.2.840.10008.1.2 mandates 16-bit integer and 32-bit integer fields encoded in Little Endian format. High byte must follow low byte.",
			Metadata:    map[string]string{"standard": "ISO 12052", "domain": "medical_imaging"},
		},
		{
			DocID:       "KLIKSOFT-PRO-ARCH",
			Title:       "KlikSoft Pro Master Engineering Standards",
			PageNumber:  12,
			SectionName: "Chapter 3: Android Bare-Metal Clean Architecture",
			Content:     "RULE #44: No SQL queries directly in Compose or Activities. All database mutations must pass through OfflineLocalStore interface backed by SQLite WAL with mutex synchronization. Error Monads must wrap every call.",
			Metadata:    map[string]string{"author": "Jesus", "standard": "internal_sovereign"},
		},
		{
			DocID:       "KLIKSOFT-PRO-ARCH",
			Title:       "KlikSoft Pro Master Engineering Standards",
			PageNumber:  28,
			SectionName: "Chapter 7: Zero-Leak Network Client",
			Content:     "RULE #89: Network calls must configure connectTimeout 5s, readTimeout 10s, and writeTimeout 10s with exponential backoff capped at 3 retries. All HTTP response bodies must defer body.Close() immediately after error check.",
			Metadata:    map[string]string{"author": "Jesus", "standard": "internal_sovereign"},
		},
	}

	for _, m := range manuals {
		r.IngestDocument(m)
	}
}

// IngestDocument tokens and registers a new document chunk into the local inverted index.
func (r *LocalRAGEngine) IngestDocument(chunk DocumentChunk) {
	r.mu.Lock()
	defer r.mu.Unlock()

	tokens := tokenize(chunk.Title + " " + chunk.SectionName + " " + chunk.Content)
	chunk.Tokens = tokens

	idx := len(r.chunks)
	r.chunks = append(r.chunks, chunk)
	r.totalChunks++

	seenInChunk := make(map[string]bool)
	for _, tok := range tokens {
		if !seenInChunk[tok] {
			seenInChunk[tok] = true
			r.docFreq[tok]++
		}
		r.invertedIdx[tok] = append(r.invertedIdx[tok], idx)
	}

	// Recalculate average document length
	totalLen := 0
	for _, c := range r.chunks {
		totalLen += len(c.Tokens)
	}
	if r.totalChunks > 0 {
		r.avgDocLen = float64(totalLen) / float64(r.totalChunks)
	}
}

// Query performs fast BM25 score calculation and returns top cited passages.
func (r *LocalRAGEngine) Query(queryText string, topK int) []SearchResult {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if topK <= 0 {
		topK = 3
	}

	queryTokens := tokenize(queryText)
	if len(queryTokens) == 0 {
		return nil
	}

	scores := make(map[int]float64)
	k1 := 1.5
	b := 0.75

	for _, qTok := range queryTokens {
		df := r.docFreq[qTok]
		if df == 0 {
			continue
		}

		// IDF calculation
		idf := math.Log(1.0 + (float64(r.totalChunks)-float64(df)+0.5)/(float64(df)+0.5))

		// Check all chunks containing qTok
		for _, chunkIdx := range r.invertedIdx[qTok] {
			chunk := r.chunks[chunkIdx]
			docLen := float64(len(chunk.Tokens))

			// Count term frequency in chunk
			tf := 0
			for _, t := range chunk.Tokens {
				if t == qTok {
					tf++
				}
			}

			// BM25 formula
			numerator := float64(tf) * (k1 + 1.0)
			denominator := float64(tf) + k1*(1.0-b+b*(docLen/r.avgDocLen))
			bm25Term := idf * (numerator / denominator)

			scores[chunkIdx] += bm25Term
		}
	}

	type ScoredMatch struct {
		Idx   int
		Score float64
	}
	var matches []ScoredMatch
	for idx, s := range scores {
		matches = append(matches, ScoredMatch{Idx: idx, Score: s})
	}

	sort.Slice(matches, func(i, j int) bool {
		return matches[i].Score > matches[j].Score
	})

	var results []SearchResult
	for i := 0; i < len(matches) && i < topK; i++ {
		c := r.chunks[matches[i].Idx]
		citation := fmt.Sprintf("Según el manual %s en la página %d (%s)", c.Title, c.PageNumber, c.SectionName)
		results = append(results, SearchResult{
			DocID:       c.DocID,
			Title:       c.Title,
			PageNumber:  c.PageNumber,
			SectionName: c.SectionName,
			Excerpt:     c.Content,
			Score:       math.Round(matches[i].Score*100) / 100,
			Citation:    citation,
		})
	}
	return results
}

// GenerateDiagnosticResponse answers with exact manual citations without generic hallucination.
func (r *LocalRAGEngine) GenerateDiagnosticResponse(query string) string {
	results := r.Query(query, 2)
	if len(results) == 0 {
		return "No se encontraron coincidencias en los manuales técnicos locales ingeridos. Santiago requiere documentación previa para certificar la corrección."
	}

	top := results[0]
	return fmt.Sprintf("%s: \"%s\". Santiago aplicará la regla técnica exacta en el código sin inventar parámetros.", top.Citation, top.Excerpt)
}

// GetStats returns current status of the local RAG knowledge base.
func (r *LocalRAGEngine) GetStats() map[string]interface{} {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return map[string]interface{}{
		"total_indexed_chunks": r.totalChunks,
		"unique_terms":         len(r.invertedIdx),
		"average_chunk_length": math.Round(r.avgDocLen*10) / 10,
		"mode":                 "100% Offline Sovereign RAG (Bare-Metal)",
		"timestamp":            time.Now().UTC(),
	}
}

func tokenize(text string) []string {
	clean := strings.ToLower(text)
	var words []string
	var current strings.Builder

	for _, r := range clean {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			current.WriteRune(r)
		} else {
			if current.Len() > 2 {
				words = append(words, current.String())
			}
			current.Reset()
		}
	}
	if current.Len() > 2 {
		words = append(words, current.String())
	}
	return words
}
