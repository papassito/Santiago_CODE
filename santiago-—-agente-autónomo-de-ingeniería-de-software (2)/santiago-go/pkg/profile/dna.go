package profile

import (
	"crypto/sha256"
	"fmt"
	"strings"
	"sync"
	"time"
)

// SovereignOperator identifies the single authorized human operator.
type SovereignOperator struct {
	OperatorName     string    `json:"operator_name"`
	VoiceprintHash   string    `json:"voiceprint_hash"` // SHA256 of authorized voice acoustic signature
	BiometricStatus  string    `json:"biometric_status"`
	LockoutActive    bool      `json:"lockout_active"`
	LastAuthenticated time.Time `json:"last_authenticated"`
}

// ProgrammingDNA represents learned coding idioms from Jesus's master projects.
type ProgrammingDNA struct {
	AuthorName            string   `json:"author_name"`
	ErrorHandlingStyle    string   `json:"error_handling_style"`
	ArchitectureArchetype string   `json:"architecture_archetype"`
	NamingConventions     []string `json:"naming_conventions"`
	ProhibitedPatterns    []string `json:"prohibited_patterns"`
	MandatoryPractices    []string `json:"mandatory_practices"`
	MaxNestingDepth       int      `json:"max_nesting_depth"`
	ConcurrencyPattern    string   `json:"concurrency_pattern"`
	PreferredDatabase     string   `json:"preferred_database"`
	LearnedAt             time.Time `json:"learned_at"`
}

// SovereignProfileManager manages biometric authorization and coding DNA enforcement.
type SovereignProfileManager struct {
	mu           sync.RWMutex
	operator     SovereignOperator
	dna          ProgrammingDNA
	accessLogs   []string
}

// NewSovereignProfileManager sets up the authorized identity for Jesus.
func NewSovereignProfileManager() *SovereignProfileManager {
	// Authorized voice hash for Comandante Jesus
	authorizedVoiceHash := fmt.Sprintf("%x", sha256.Sum256([]byte("JESUS_SOVEREIGN_VOICE_ACOUSTIC_SPECTROGRAM_V1")))

	mgr := &SovereignProfileManager{
		operator: SovereignOperator{
			OperatorName:     "Comandante Jesús",
			VoiceprintHash:   authorizedVoiceHash,
			BiometricStatus:  "AUTHENTICATED",
			LockoutActive:    false,
			LastAuthenticated: time.Now().UTC(),
		},
		dna: ProgrammingDNA{
			AuthorName:            "Jesús (KlikSoft Pro)",
			ErrorHandlingStyle:    "Guard clauses first, early return, zero blind panics, structured error wrapping",
			ArchitectureArchetype: "Clean Architecture: UI vs Data vs Logic (Bare-Metal Sovereign)",
			NamingConventions: []string{
				"PascalCase for exported structs and public functions",
				"camelCase for private variables and local state",
				"Descriptive domain vocabulary (no generic 'data', 'temp', 'obj')",
				"Explicit error names ending with 'Err' or 'Error'",
			},
			ProhibitedPatterns: []string{
				"Nested if-else chains greater than 3 levels",
				"Direct SQL in presentation/view components",
				"Blind exception swallowing (try-catch empty or unhandled err != nil)",
				"Hardcoded cloud URLs or commercial API dependencies",
				"Use of unverified external packages when standard library suffices",
			},
			MandatoryPractices: []string{
				"Atomic writes with .tmp and rename before modifying files",
				"Always generate .bak backups before code refactoring",
				"SQLite with Write-Ahead Logging (WAL) for local persistence",
				"Defer body.Close() / file.Close() immediately after nil-check",
				"Explicit cryptographic audit log with SHA-256 for all mutations",
			},
			MaxNestingDepth:    3,
			ConcurrencyPattern: "sync.RWMutex with single-responsibility goroutines and cancellation contexts",
			PreferredDatabase:  "SQLite 3 in WAL mode (Bare-Metal Local)",
			LearnedAt:          time.Now().UTC(),
		},
	}
	return mgr
}

// VerifyVoiceprint validates if the incoming voice input matches Jesus's acoustic signature.
// If unauthorized, Santiago enters instant Sovereign Lockout mode.
func (m *SovereignProfileManager) VerifyVoiceprint(inputSignature string) (bool, string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	hash := fmt.Sprintf("%x", sha256.Sum256([]byte(inputSignature)))

	if hash != m.operator.VoiceprintHash {
		m.operator.LockoutActive = true
		m.operator.BiometricStatus = "LOCKOUT_UNAUTHORIZED_VOICE_DETECTED"
		logEntry := fmt.Sprintf("[%s] INTRUSION ALERT: Unauthorized voice attempt. System locked down.", time.Now().UTC().Format(time.RFC3339))
		m.accessLogs = append(m.accessLogs, logEntry)
		return false, "MODO BLOQUEADO: Firma biométrica no autorizada. Santiago ha entrado en bloqueo soberano preventivo."
	}

	m.operator.LockoutActive = false
	m.operator.BiometricStatus = "AUTHENTICATED"
	m.operator.LastAuthenticated = time.Now().UTC()
	return true, "AUTORIZACIÓN SOBERANA CONFIRMADA: Voz reconocida de Jesús. Todos los privilegios activos."
}

// UnlockWithMasterKey allows the operator to unlock the system if locked.
func (m *SovereignProfileManager) UnlockWithMasterKey(masterKey string) bool {
	m.mu.Lock()
	defer m.mu.Unlock()

	// Master sovereignty passkey check
	if strings.Contains(masterKey, "JESUS_SOVEREIGN_OVERRIDE") || masterKey == "SANTIAGO_MASTER_2026" {
		m.operator.LockoutActive = false
		m.operator.BiometricStatus = "AUTHENTICATED"
		m.operator.LastAuthenticated = time.Now().UTC()
		return true
	}
	return false
}

// GetProgrammingDNA returns the exact coding rules that Santiago must emulate.
func (m *SovereignProfileManager) GetProgrammingDNA() ProgrammingDNA {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.dna
}

// AuditCodeStyle checks if candidate code conforms to Jesus's programming DNA.
func (m *SovereignProfileManager) AuditCodeStyle(code string) []string {
	var violations []string

	if strings.Contains(code, "catch (Exception e) {}") || strings.Contains(code, "err == nil { return }") {
		violations = append(violations, "VIOLATION_RULE_DNA: Silencing exceptions without logging or handling")
	}

	if strings.Count(code, "\t\t\t\t") > 0 || strings.Count(code, "                ") > 0 {
		violations = append(violations, "VIOLATION_RULE_DNA: Nesting depth exceeds 3 levels. Apply early return guard clauses.")
	}

	if strings.Contains(code, "SELECT * FROM") && (strings.Contains(code, "Activity") || strings.Contains(code, "View")) {
		violations = append(violations, "VIOLATION_RULE_DNA: Direct SQL query inside Presentation Layer. Encapsulate in Repository.")
	}

	return violations
}

// GetStatus returns the current status of the sovereign operator profile.
func (m *SovereignProfileManager) GetStatus() map[string]interface{} {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return map[string]interface{}{
		"operator":           m.operator.OperatorName,
		"biometric_status":   m.operator.BiometricStatus,
		"lockout_active":     m.operator.LockoutActive,
		"last_authenticated": m.operator.LastAuthenticated,
		"dna_archetype":      m.dna.ArchitectureArchetype,
		"dna_rules_count":    len(m.dna.MandatoryPractices),
	}
}
