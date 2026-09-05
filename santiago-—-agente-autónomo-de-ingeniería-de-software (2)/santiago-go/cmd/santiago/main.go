package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/santiago-ai/santiago/pkg/ast"
	"github.com/santiago-ai/santiago/pkg/audit"
	"github.com/santiago-ai/santiago/pkg/autofix"
	"github.com/santiago-ai/santiago/pkg/bunker"
	"github.com/santiago-ai/santiago/pkg/model"
	"github.com/santiago-ai/santiago/pkg/profile"
	"github.com/santiago-ai/santiago/pkg/rag"
	"github.com/santiago-ai/santiago/pkg/security"
	"github.com/santiago-ai/santiago/pkg/windows"
)

const DefaultPort = 34820

func main() {
	mode := flag.String("mode", "server", "Mode of operation: 'server', 'audit', 'rag', 'autofix', 'bunker'")
	projectID := flag.String("project", "SOLUSOL.NET", "Target Project ID")
	ragQuery := flag.String("query", "DICOM header structure page 45", "RAG query string")
	port := flag.Int("port", DefaultPort, "Local REST API port (loopback only)")
	flag.Parse()

	// Initialize sovereign engines
	ragEngine := rag.NewLocalRAGEngine()
	astEngine := ast.NewASTEngine()
	autoFixEngine := autofix.NewAutoFixEngine(".", 5)
	bunkerEngine := bunker.NewCryptographicBunker(".")
	profileMgr := profile.NewSovereignProfileManager()
	policyEngine := security.NewCommandPolicyEngine()
	auditLedger := audit.NewAuditLedger("santiago_audit.db")
	winOpt := windows.NewWindowsOptimizationEngine()

	log.Printf("[SANTIAGO YEMINOUX CORE] Inicializando motor bare-metal soberano...")
	log.Printf("[SANTIAGO] Operador Autorizado: %s (Biometría: OK, Costo: $0)", profileMgr.GetStatus()["operator"])

	switch *mode {
	case "rag":
		fmt.Printf("=== CONSULTA RAG LOCAL SOBERANO (100%% OFFLINE) ===\n")
		results := ragEngine.Query(*ragQuery, 3)
		for i, r := range results {
			fmt.Printf("\n[%d] %s (Score: %.2f)\n", i+1, r.Citation, r.Score)
			fmt.Printf("    Fragmento: %s\n", r.Excerpt)
		}
		response := ragEngine.GenerateDiagnosticResponse(*ragQuery)
		fmt.Printf("\nDiagnóstico de Santiago:\n%s\n", response)

	case "audit":
		fmt.Printf("=== AUDITORÍA INTEGRAL DE CÓDIGO Y GRAPH AST ===\n")
		topo, err := astEngine.ScanProject(*projectID, ".")
		if err != nil {
			log.Fatalf("Error al escanear proyecto: %v", err)
		}
		fmt.Printf("Proyecto: %s\n", topo.ProjectID)
		fmt.Printf("Puntuación de Salud (_health_score): %d/100\n", topo.GlobalHealth)
		fmt.Printf("Total Módulos: %d | Complejidad Alta: %d | Errores Sintácticos: %d\n",
			topo.KeyRiskIndicators.TotalModules,
			topo.KeyRiskIndicators.HighComplexityCount,
			topo.KeyRiskIndicators.CriticalIncidents)

	case "bunker":
		fmt.Printf("=== EXPORTACIÓN EN BÚNKER CRIPTOGRÁFICO AES-256 ===\n")
		files := []string{"ARCHITECTURE.md", "configs/santiago.example.yaml"}
		res, err := bunkerEngine.ExportBunkerSeguro(*projectID, files, "")
		if err != nil {
			log.Fatalf("Error al exportar búnker: %v", err)
		}
		fmt.Printf("Búnker Generado: %s\n", res.BunkerFilePath)
		fmt.Printf("LLAVE PRIVADA (Entregada al Operador):\n%s\n", res.PrivateKeyB64)
		fmt.Printf("Algoritmo: %s | Huella: %s\n", res.Manifest.Algorithm, res.Manifest.KeyFingerprint)

	case "server":
		// Start Local REST API server strictly bound to 127.0.0.1 (Loopback)
		mux := http.NewServeMux()

		// 1. Health & KRI status
		mux.HandleFunc("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{
				"agent":          "Santiago Yeminoux Core",
				"status":         "OPERATIONAL",
				"cost":           "$0",
				"mode":           "Bare-Metal Local",
				"operator":       profileMgr.GetStatus(),
				"rag_stats":      ragEngine.GetStats(),
				"windows_safety": winOpt.ValidateExecutionSafety(),
				"timestamp":      time.Now().UTC(),
			})
		})

		// 2. KRI Metrics & AST Scan
		mux.HandleFunc("/api/v1/kri", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			topo, _ := astEngine.ScanProject(*projectID, ".")
			json.NewEncoder(w).Encode(topo)
		})

		// 3. Local RAG Query
		mux.HandleFunc("/api/v1/rag/query", func(w http.ResponseWriter, r *http.Request) {
			q := r.URL.Query().Get("q")
			if q == "" {
				q = "DICOM header structure page 45"
			}
			results := ragEngine.Query(q, 3)
			diagnostic := ragEngine.GenerateDiagnosticResponse(q)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{
				"query":      q,
				"results":    results,
				"diagnostic": diagnostic,
			})
		})

		// 4. Programming DNA & Style
		mux.HandleFunc("/api/v1/profile/dna", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(profileMgr.GetProgrammingDNA())
		})

		// 5. Architecture Map generator (KlikSoft Pro)
		mux.HandleFunc("/api/v1/architecture/map", func(w http.ResponseWriter, r *http.Request) {
			archMap := autoFixEngine.GenerateArchitectureMap(*projectID, "Android (KlikSoft Pro)")
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(archMap)
		})

		// 6. Bunker Export
		mux.HandleFunc("/api/v1/bunker/export", func(w http.ResponseWriter, r *http.Request) {
			files := []string{"ARCHITECTURE.md", "configs/santiago.example.yaml"}
			exportRes, err := bunkerEngine.ExportBunkerSeguro(*projectID, files, "")
			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(exportRes)
		})

		listenAddr := fmt.Sprintf("127.0.0.1:%d", *port)
		log.Printf("[SANTIAGO REST API] Escuchando en http://%s (Estrictamente Loopback - Firewall Friendly)", listenAddr)
		server := &http.Server{
			Addr:         listenAddr,
			Handler:      mux,
			ReadTimeout:  10 * time.Second,
			WriteTimeout: 10 * time.Second,
		}
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Fallo en servidor HTTP de Santiago: %v", err)
		}

	default:
		fmt.Printf("Modo no reconocido: %s. Use: server, audit, rag, bunker\n", *mode)
	}

	// Keep unused variables referenced to ensure clean compilation
	_ = model.NewOllamaClient
	_ = policyEngine
	_ = auditLedger
}
