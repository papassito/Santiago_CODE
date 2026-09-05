// Package interfaces establishes the canonical contracts of the Santiago system.
// Santiago Core remains decoupled from any model provider (Ollama, local, remote).
package interfaces

import (
	"context"
	"io"
	"time"

	"github.com/santiago-ai/santiago/pkg/types"
)

// Engine is the central orchestrator of Santiago.
type Engine interface {
	// Initialize prepares the core runtime, memory engines, and tool registries.
	Initialize(ctx context.Context) error

	// ProcessRequest handles an incoming engineering directive following the Master Protocol:
	// COMPRENDER -> DEMOSTRAR -> PROPONER -> AUTORIZACION -> EJECUTAR -> VERIFICAR -> CERTIFICAR
	ProcessRequest(ctx context.Context, projectID string, directive string) (*types.Plan, error)

	// SwitchProject switches active context with total memory and rule isolation.
	SwitchProject(projectID string) (*types.ProjectContext, error)

	// Shutdown safely flushes audit logs and unlinks active sandbox resources.
	Shutdown(ctx context.Context) error
}

// ModelProvider abstracts the cognitive component.
// Santiago is NOT the model. The model is an interchangeable cognitive tool.
type ModelProvider interface {
	// Name returns the provider identifier (e.g. "ollama", "local-llama-cpp").
	Name() string

	// GenerateCompletion streams or yields an inference.
	GenerateCompletion(ctx context.Context, req ModelRequest) (*ModelResponse, error)

	// HealthCheck tests local provider availability (e.g. http://127.0.0.1:11434).
	HealthCheck(ctx context.Context) error

	// GetMetrics returns token usage and latency telemetry for cost and rate controls.
	GetMetrics() ModelMetrics
}

type ModelRequest struct {
	Model       string            `json:"model"`
	SystemPrompt string           `json:"system_prompt"`
	Prompt      string            `json:"prompt"`
	Temperature float32           `json:"temperature"`
	StopTokens  []string          `json:"stop_tokens"`
	Params      map[string]any    `json:"params,omitempty"`
}

type ModelResponse struct {
	Text         string        `json:"text"`
	PromptTokens int           `json:"prompt_tokens"`
	CompTokens   int           `json:"comp_tokens"`
	Duration     time.Duration `json:"duration"`
}

type ModelMetrics struct {
	TotalRequests     int64         `json:"total_requests"`
	TotalTokens       int64         `json:"total_tokens"`
	TotalDuration     time.Duration `json:"total_duration"`
	AverageLatencyMs  float64       `json:"avg_latency_ms"`
}

// MemoryStore manages the 6 distinct tiers of memory.
// All tiers are persisted locally in SQLite and are model-independent.
type MemoryStore interface {
	// Short-term: Current task scratchpad and active diff context
	GetShortTerm(ctx context.Context, sessionID string) (string, error)
	SetShortTerm(ctx context.Context, sessionID string, data string) error

	// Project memory: Knowledge specific to an isolated project
	RecordProjectKnowledge(ctx context.Context, projectID string, key string, value string) error
	QueryProjectKnowledge(ctx context.Context, projectID string, query string) ([]string, error)

	// Long-term: Generalized Santiago engineering rules and patterns
	StoreGeneralPrinciple(ctx context.Context, tag string, principle string) error

	// Decision memory: Past architectural choices and justifications
	LogDecision(ctx context.Context, projectID string, decision string, rationale string) error

	// Failure memory: Known failures, compiler panics, and verified fixes
	RecordFailureResolution(ctx context.Context, symptom string, rootCause string, verifiedFix string) error
	LookupFailure(ctx context.Context, symptom string) (string, bool, error)

	// User Instructions: Operator immutable preferences and constraints
	GetUserInstructions(ctx context.Context) ([]string, error)
}

// Tool represents a capability that Santiago can employ.
type Tool interface {
	Name() string
	Description() string
	RequiredPermission() types.PermissionLevel
	RiskLevel() types.RiskLevel
	Execute(ctx context.Context, args map[string]any) (*ToolResult, error)
}

type ToolResult struct {
	Success  bool           `json:"success"`
	Output   string         `json:"output"`
	Evidence string         `json:"evidence"`
	Status   types.EvidenceStatus `json:"status"`
}

// CommandPolicy inspects every shell or system command before execution.
// Flow: COMMAND -> CLASSIFY -> RISK ANALYSIS -> PERMISSION CHECK -> EXECUTE
type CommandPolicy interface {
	Classify(cmd string) (Category string, risk types.RiskLevel)
	IsAllowed(cmd string, activePerm types.PermissionLevel, isUserApproved bool) (bool, string)
}

// RollbackManager ensures all mutations are reversible via snapshots.
type RollbackManager interface {
	CreateSnapshot(ctx context.Context, projectID string, filePath string) (*types.FileSnapshot, error)
	Rollback(ctx context.Context, snapshotID string) error
	GetDiff(snapshotID string, currentFilePath string) (string, error)
}

// VerificationEngine guarantees that Santiago verifies before claiming success.
// Distinguishes "el código parece correcto" from "el código fue verificado".
type VerificationEngine interface {
	Compile(ctx context.Context, projectID string) (*VerificationResult, error)
	RunTests(ctx context.Context, projectID string, target string) (*VerificationResult, error)
	RunLinters(ctx context.Context, projectID string) (*VerificationResult, error)
	VerifyDiff(ctx context.Context, beforeHash string, afterHash string) bool
}

type VerificationResult struct {
	Passed       bool                 `json:"passed"`
	Stage        string               `json:"stage"`
	Logs         string               `json:"logs"`
	ErrorCount   int                  `json:"error_count"`
	WarningCount int                  `json:"warning_count"`
	Evidence     types.EvidenceStatus `json:"evidence_status"`
}

// Auditor maintains an append-only verifiable ledger of all actions.
type Auditor interface {
	Record(ctx context.Context, entry types.AuditEntry) error
	Query(ctx context.Context, projectID string, limit int) ([]types.AuditEntry, error)
	ExportLedgerJSON(ctx context.Context, projectID string, w io.Writer) error
}

// WindowsOptimizer enforces Windows PC security and resource boundaries:
// 1. Antivirus-friendly process execution (No memory patching, proper manifests).
// 2. Windows Firewall friendly (127.0.0.1 bind only, no 0.0.0.0 unsolicited listens).
// 3. Low resource footprint (Go binary, small RAM, bounded goroutines, WAL SQLite).
type WindowsOptimizer interface {
	ValidateNetworkBinding(host string, port int) error
	SanitizeProcessArgs(binary string, args []string) ([]string, error)
	GetProcessResourceStats() (MemoryMB uint64, Goroutines int, err error)
}
