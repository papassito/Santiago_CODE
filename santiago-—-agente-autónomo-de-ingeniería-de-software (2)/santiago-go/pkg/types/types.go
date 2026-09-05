// Package types defines the core domain types, enums, and data models
// for the Santiago Autonomous AI Software Engineering Agent.
//
// Compliance:
// - Absolute Rule: DETECTAR != DECIDIR != EJECUTAR
// - Rule: UNKNOWN / UNVERIFIED / INSUFFICIENT EVIDENCE when lacking data
// - Local-First, Zero SaaS Lock-in, Safe for Windows PC execution.
package types

import (
	"time"
)

// PermissionLevel represents the authorization tier of an operation.
type PermissionLevel string

const (
	PermReadOnly PermissionLevel = "READ_ONLY" // Can inspect code, search, read files
	PermAnalyze  PermissionLevel = "ANALYZE"   // Can parse syntax, graph deps, run linters
	PermPropose  PermissionLevel = "PROPOSE"   // Can formulate diffs, plans, suggestions
	PermModify   PermissionLevel = "MODIFY"    // Can write files, create files, apply diffs
	PermExecute  PermissionLevel = "EXECUTE"   // Can run compilers, test runners, safe scripts
	PermAdmin    PermissionLevel = "ADMIN"     // Can run system-level ops, delete, mutate configs
)

// EvidenceStatus represents the epistemic status of an assertion.
// Rule: Santiago never claims an inference as verified proof.
type EvidenceStatus string

const (
	StatusVerified             EvidenceStatus = "VERIFIED"
	StatusInference            EvidenceStatus = "INFERENCE"
	StatusHypothesis           EvidenceStatus = "HYPOTHESIS"
	StatusUnknown              EvidenceStatus = "UNKNOWN"
	StatusUnverified           EvidenceStatus = "UNVERIFIED"
	StatusInsufficientEvidence EvidenceStatus = "INSUFFICIENT_EVIDENCE"
)

// RiskLevel defines the command or operation danger score.
type RiskLevel string

const (
	RiskSafe      RiskLevel = "SAFE"      // Read-only operations, harmless stats
	RiskLow       RiskLevel = "LOW"       // Formatting, linting, read commands
	RiskMedium    RiskLevel = "MEDIUM"    // Compiling, running sandboxed tests
	RiskHigh      RiskLevel = "HIGH"      // Writing files, applying patch sets
	RiskCritical  RiskLevel = "CRITICAL"  // Deletions, shell executions, system mods
)

// ProjectContext holds isolated project metadata.
// Santiago isolates projects strictly to avoid cross-project contamination.
type ProjectContext struct {
	ProjectID    string            `json:"project_id" yaml:"project_id"`
	Name         string            `json:"name" yaml:"name"`
	RootPath     string            `json:"root_path" yaml:"root_path"`
	Language     string            `json:"primary_language" yaml:"primary_language"`
	Stack        []string          `json:"stack" yaml:"stack"`
	Version      string            `json:"version" yaml:"version"`
	ActivePerm   PermissionLevel   `json:"active_perm" yaml:"active_perm"`
	CreatedAt    time.Time         `json:"created_at" yaml:"created_at"`
	LastScanAt   time.Time         `json:"last_scan_at" yaml:"last_scan_at"`
	CustomRules  []string          `json:"custom_rules" yaml:"custom_rules"`
	Metadata     map[string]string `json:"metadata" yaml:"metadata"`
}

// OperationalStage represents the Master Operating Protocol stages.
type OperationalStage string

const (
	StageComprender   OperationalStage = "COMPRENDER"
	StageDemostrar    OperationalStage = "DEMOSTRAR"
	StageProponer     OperationalStage = "PROPONER"
	StageAutorizacion OperationalStage = "AUTORIZACION"
	StageEjecutar     OperationalStage = "EJECUTAR"
	StageVerificar    OperationalStage = "VERIFICAR"
	StageCertificar   OperationalStage = "CERTIFICAR"
)

// AuditEntry defines the immutable transaction record for every action.
type AuditEntry struct {
	ID             string          `json:"id"`
	Timestamp      time.Time       `json:"timestamp"`
	ProjectID      string          `json:"project_id"`
	Operation      string          `json:"operation"`
	Actor          string          `json:"actor"`
	Tool           string          `json:"tool"`
	Target         string          `json:"target"`
	BeforeHash     string          `json:"before_hash,omitempty"`
	AfterHash      string          `json:"after_hash,omitempty"`
	Risk           RiskLevel       `json:"risk"`
	PermRequired   PermissionLevel `json:"perm_required"`
	UserAuthorized bool            `json:"user_authorized"`
	Result         string          `json:"result"` // "SUCCESS", "FAILED", "BLOCKED", "ROLLED_BACK"
	Evidence       string          `json:"evidence"`
	EvidenceStatus EvidenceStatus  `json:"evidence_status"`
	DurationMs     int64           `json:"duration_ms"`
}

// PlanTask represents a subtask produced by the Planner.
type PlanTask struct {
	ID           string           `json:"id"`
	Title        string           `json:"title"`
	Description  string           `json:"description"`
	Stage        OperationalStage `json:"stage"`
	TargetFiles  []string         `json:"target_files"`
	Tools        []string         `json:"tools"`
	Risk         RiskLevel        `json:"risk"`
	Completed    bool             `json:"completed"`
	ResultNotes  string           `json:"result_notes"`
	EvidenceRef  string           `json:"evidence_ref"`
}

// Plan represents an ordered decomposition of a complex engineering task.
type Plan struct {
	ID        string     `json:"id"`
	ProjectID string     `json:"project_id"`
	Goal      string     `json:"goal"`
	Tasks     []PlanTask `json:"tasks"`
	CreatedAt time.Time  `json:"created_at"`
	Status    string     `json:"status"` // "DRAFT", "APPROVED", "EXECUTING", "VERIFIED", "FAILED"
}

// FileSnapshot encapsulates state before a mutating file operation.
type FileSnapshot struct {
	SnapshotID string    `json:"snapshot_id"`
	ProjectID  string    `json:"project_id"`
	FilePath   string    `json:"file_path"`
	Content    []byte    `json:"-"`
	Sha256     string    `json:"sha256"`
	SizeBytes  int64     `json:"size_bytes"`
	CreatedAt  time.Time `json:"created_at"`
}
