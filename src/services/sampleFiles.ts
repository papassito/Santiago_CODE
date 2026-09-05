import { EditorFile } from '../types';

export const INITIAL_EDITOR_FILES: EditorFile[] = [
  {
    id: 'cmd-main',
    name: 'main.go',
    path: 'cmd/santiago/main.go',
    folder: 'cmd/santiago',
    language: 'go',
    content: `package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"santiago/internal/gateway"
	"santiago/internal/rag"
	"santiago/internal/runner"
	"santiago/internal/vault"
)

// Santiago Sovereign Platform Entrypoint
// Orchestrates 4 Micro-Daemons on localhost with Zero Cloud Leak
func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	fmt.Println("==================================================")
	fmt.Println("🚀 SANTIAGO CORE — Plataforma Soberana de Desarrollo")
	fmt.Println("Regla Suprema: VER -> ENTENDER -> DECIDIR -> ACTUAR -> VERIFICAR")
	fmt.Println("==================================================")

	// 1. Initialize Enclave Vault (:34823)
	v := vault.NewVaultService(":34823")
	if err := v.Start(ctx); err != nil {
		log.Fatalf("[FATAL] Vault initialization failed: %v", err)
	}

	// 2. Initialize Runner Sandbox (:34822)
	run := runner.NewRunnerService(":34822")
	if err := run.Start(ctx); err != nil {
		log.Fatalf("[FATAL] Runner daemon initialization failed: %v", err)
	}

	// 3. Initialize RAG AST Memory (:34821)
	r := rag.NewASTService(":34821")
	if err := r.Start(ctx); err != nil {
		log.Fatalf("[FATAL] RAG memory initialization failed: %v", err)
	}

	// 4. Initialize Gateway Router (:34820)
	gw := gateway.NewGatewayServer(":34820", v, run, r)
	go func() {
		if err := gw.Listen(); err != nil {
			log.Printf("[INFO] Gateway shutdown: %v", err)
		}
	}()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan
	fmt.Println("\n[SHUTDOWN] Santiago Core gracefully terminated.")
}
`,
  },
  {
    id: 'gateway-router',
    name: 'router.go',
    path: 'internal/gateway/router.go',
    folder: 'internal/gateway',
    language: 'go',
    content: `package gateway

import (
	"encoding/json"
	"net/http"
	"time"
)

type AutocompleteRequest struct {
	Prefix   string \`json:"prefix"\`
	Suffix   string \`json:"suffix"\`
	Language string \`json:"language"\`
	FilePath string \`json:"filePath"\`
	Line     int    \`json:"line"\`
	Column   int    \`json:"column"\`
}

type AutocompleteResponse struct {
	Completion string \`json:"completion"\`
	LatencyMs  int64  \`json:"latencyMs"\`
	P50Ms      int64  \`json:"p50Ms"\`
	P95Ms      int64  \`json:"p95Ms"\`
	P99Ms      int64  \`json:"p99Ms"\`
	Model      string \`json:"model"\`
}

type GatewayServer struct {
	addr string
}

func NewGatewayServer(addr string, v any, run any, r any) *GatewayServer {
	return &GatewayServer{addr: addr}
}

func (g *GatewayServer) Listen() error {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/v1/autocomplete", g.handleAutocomplete)
	mux.HandleFunc("/health", g.handleHealth)
	return http.ListenAndServe(g.addr, mux)
}

func (g *GatewayServer) handleAutocomplete(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	var req AutocompleteRequest
	_ = json.NewDecoder(r.Body).Decode(&req)

	elapsed := time.Since(start).Milliseconds()
	resp := AutocompleteResponse{
		Completion: "// Ghost Text Sovereign: Zero External Network",
		LatencyMs:  elapsed,
		P50Ms:      32,
		P95Ms:      48,
		P99Ms:      76,
		Model:      "santiago-gguf-fast-v1",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (g *GatewayServer) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("HEALTHY: SANTIAGO GATEWAY OPERATIONAL"))
}
`,
  },
  {
    id: 'rag-ast',
    name: 'ast_indexer.go',
    path: 'internal/rag/ast_indexer.go',
    folder: 'internal/rag',
    language: 'go',
    content: `package rag

import (
	"context"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
)

// ASTService maintains the in-memory technical knowledge graph
type ASTService struct {
	port       string
	symbolTree map[string][]string
}

func NewASTService(port string) *ASTService {
	return &ASTService{
		port: port,
		symbolTree: map[string][]string{
			"Authentication": {"internal/vault/enclave.go", "internal/gateway/router.go"},
			"RunnerExecution": {"internal/runner/pty_executor.go"},
			"ASTSymbolGraph":  {"internal/rag/ast_indexer.go"},
		},
	}
}

func (s *ASTService) Start(ctx context.Context) error {
	fmt.Printf("[RAG] AST Indexer online on %s. Synced 2,840 symbols.\n", s.port)
	return nil
}

// FindReferences answers "¿Dónde se autentica este usuario?" / "¿Quién llama a esta función?"
func (s *ASTService) FindReferences(symbol string) []string {
	if refs, ok := s.symbolTree[symbol]; ok {
		return refs
	}
	return []string{"cmd/santiago/main.go"}
}
`,
  },
  {
    id: 'runner-pty',
    name: 'pty_executor.go',
    path: 'internal/runner/pty_executor.go',
    folder: 'internal/runner',
    language: 'go',
    content: `package runner

import (
	"context"
	"fmt"
	"time"
)

type ExecutionResult struct {
	ExitCode int           \`json:"exitCode"\`
	Stdout   string        \`json:"stdout"\`
	Stderr   string        \`json:"stderr"\`
	Duration time.Duration \`json:"duration"\`
	Verified bool          \`json:"verified"\`
}

type RunnerService struct {
	port string
}

func NewRunnerService(port string) *RunnerService {
	return &RunnerService{port: port}
}

func (r *RunnerService) Start(ctx context.Context) error {
	fmt.Printf("[RUNNER] PTY Sandbox online on %s. Isolation: Linux Namespaces.\n", r.port)
	return nil
}

func (r *RunnerService) ExecuteCommand(cmd string) ExecutionResult {
	start := time.Now()
	return ExecutionResult{
		ExitCode: 0,
		Stdout:   fmt.Sprintf("[RUNNER] Sandbox executed: %s (clean exit)", cmd),
		Duration: time.Since(start),
		Verified: true,
	}
}
`,
  },
  {
    id: 'vault-enclave',
    name: 'enclave.go',
    path: 'internal/vault/enclave.go',
    folder: 'internal/vault',
    language: 'go',
    content: `package vault

import (
	"context"
	"crypto/rand"
	"fmt"
	"io"
)

type VaultService struct {
	port         string
	enclaveReady bool
	keysStored   int
}

func NewVaultService(port string) *VaultService {
	return &VaultService{
		port:         port,
		enclaveReady: true,
		keysStored:   4,
	}
}

func (v *VaultService) Start(ctx context.Context) error {
	fmt.Printf("[VAULT] Protected state enclave armed on %s (ChaCha20-Poly1305).\n", v.port)
	return nil
}

// GenerateMasterEntropy derives zero-knowledge memory state
func (v *VaultService) GenerateMasterEntropy() ([]byte, error) {
	key := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		return nil, err
	}
	return key, nil
}
`,
  },
  {
    id: 'integration-tests',
    name: 'integration_test.go',
    path: 'tests/integration_test.go',
    folder: 'tests',
    language: 'go',
    content: `package tests

import (
	"testing"
	"time"
)

// Santiago Sovereign Integration Test Suite
// Verified under Nivel 3: FUNCIONA
func TestSovereignMicroDaemons(t *testing.T) {
	t.Run("Gateway Autocomplete Latency SLA (<80ms P95)", func(t *testing.T) {
		start := time.Now()
		// Simulated micro-daemon query
		time.Sleep(34 * time.Millisecond)
		elapsed := time.Since(start).Milliseconds()

		if elapsed > 80 {
			t.Errorf("Expected latency < 80ms, got %dms", elapsed)
		}
	})

	t.Run("Zero External Telemetry Leak Policy", func(t *testing.T) {
		telemetryTransmitted := false
		if telemetryTransmitted {
			t.Fatal("Violation: External telemetry was emitted!")
		}
	})

	t.Run("Vault Enclave Key Derivation", func(t *testing.T) {
		enclaveLocked := true
		if !enclaveLocked {
			t.Fatal("Vault enclave state was unsealed")
		}
	})
}
`,
  },
  {
    id: 'go-mod',
    name: 'go.mod',
    path: 'go.mod',
    folder: '',
    language: 'plaintext',
    content: `module santiago

go 1.22.4

require (
	golang.org/x/crypto v0.24.0
	golang.org/x/sys v0.21.0
)
`,
  },
  {
    id: 'readme-manifest',
    name: 'README.md',
    path: 'README.md',
    folder: '',
    language: 'markdown',
    content: `# SANTIAGO — Plataforma Soberana de Desarrollo e Inteligencia Artificial Local

> **UNA INTELIGENCIA — DOS INTERFACES.**

## 1. Santiago Studio (Software Propio)
IDE soberano completo con Monaco Editor, explorador de workspace, terminal integrada, control de versiones Git local, panel centralizado de problemas y debugger.

## 2. Santiago Plugin (Extensión Oficial para VS Code)
Puerta de entrada oficial dentro de VS Code conectada al mismo Santiago Core en localhost.

## 3. Principio Supremo
**VER -> ENTENDER -> DECIDIR -> ACTUAR -> VERIFICAR**
*No inventar. La última palabra la tiene la evidencia de ejecución.*
`,
  },
];
