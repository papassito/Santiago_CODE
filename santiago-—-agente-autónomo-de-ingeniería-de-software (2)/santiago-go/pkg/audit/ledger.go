// Package audit implements the immutable audit ledger.
// Requirement: Reconstruct what Santiago did, when, on what, and with what result.
package audit

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/santiago-ai/santiago/pkg/interfaces"
	"github.com/santiago-ai/santiago/pkg/types"
)

type InMemoryFileLedger struct {
	mu      sync.RWMutex
	entries []types.AuditEntry
	logPath string
}

func NewInMemoryFileLedger(logPath string) *InMemoryFileLedger {
	return &InMemoryFileLedger{
		entries: make([]types.AuditEntry, 0),
		logPath: logPath,
	}
}

// ComputeFileHash calculates SHA256 for file integrity tracking before/after mutations.
func ComputeFileHash(filePath string) (string, error) {
	f, err := os.Open(filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return "FILE_NOT_EXISTS", nil
		}
		return "", err
	}
	defer f.Close()

	hasher := sha256.New()
	if _, err := io.Copy(hasher, f); err != nil {
		return "", err
	}
	return hex.EncodeToString(hasher.Sum(nil)), nil
}

func (l *InMemoryFileLedger) Record(ctx context.Context, entry types.AuditEntry) error {
	l.mu.Lock()
	defer l.mu.Unlock()

	if entry.ID == "" {
		entry.ID = uuid.New().String()
	}
	if entry.Timestamp.IsZero() {
		entry.Timestamp = time.Now().UTC()
	}

	l.entries = append(l.entries, entry)

	// Persist append-only log in JSON Lines format if logPath specified
	if l.logPath != "" {
		f, err := os.OpenFile(l.logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0600)
		if err == nil {
			defer f.Close()
			bytes, _ := json.Marshal(entry)
			f.Write(append(bytes, '\n'))
		}
	}

	return nil
}

func (l *InMemoryFileLedger) Query(ctx context.Context, projectID string, limit int) ([]types.AuditEntry, error) {
	l.mu.RLock()
	defer l.mu.RUnlock()

	var result []types.AuditEntry
	count := 0
	for i := len(l.entries) - 1; i >= 0; i-- {
		if l.entries[i].ProjectID == projectID || projectID == "" {
			result = append(result, l.entries[i])
			count++
			if limit > 0 && count >= limit {
				break
			}
		}
	}
	return result, nil
}

func (l *InMemoryFileLedger) ExportLedgerJSON(ctx context.Context, projectID string, w io.Writer) error {
	entries, err := l.Query(ctx, projectID, 0)
	if err != nil {
		return err
	}
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	return encoder.Encode(entries)
}

var _ interfaces.Auditor = (*InMemoryFileLedger)(nil)
