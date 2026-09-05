// Package security implements the Command Policy and Safety Engine.
// Absolute Rule: DETECTAR != DECIDIR != EJECUTAR
// Santiago distinguishes:
// - observacion
// - evidencia
// - hipotesis
// - recomendacion
// - autorizacion
// - accion
// - resultado
package security

import (
	"fmt"
	"strings"

	"github.com/santiago-ai/santiago/pkg/types"
)

type DefaultCommandPolicy struct {
	BlockedCommands   map[string]bool
	DestructiveTokens []string
}

func NewDefaultCommandPolicy() *DefaultCommandPolicy {
	return &DefaultCommandPolicy{
		BlockedCommands: map[string]bool{
			"format":       true,
			"diskpart":     true,
			"rmdir /s /q":  true,
			"del /f /s /q": true,
			"powershell -w hidden": true,
			"invoke-expression":    true,
			"iex":                  true,
			"shutdown":             true,
			"reg delete":           true,
		},
		DestructiveTokens: []string{
			"rm -rf", "drop table", "drop database", "truncate", "mkfs", "> /dev/sda",
		},
	}
}

// Classify categorizes a command and calculates risk.
func (p *DefaultCommandPolicy) Classify(cmd string) (string, types.RiskLevel) {
	clean := strings.TrimSpace(strings.ToLower(cmd))

	// Check prohibited destructive commands
	for block := range p.BlockedCommands {
		if strings.HasPrefix(clean, block) || strings.Contains(clean, block) {
			return "DESTRUCTIVE_BLOCKED", types.RiskCritical
		}
	}

	for _, token := range p.DestructiveTokens {
		if strings.Contains(clean, token) {
			return "DESTRUCTIVE_TOKEN", types.RiskCritical
		}
	}

	// Safe read-only commands
	if strings.HasPrefix(clean, "go version") ||
		strings.HasPrefix(clean, "git status") ||
		strings.HasPrefix(clean, "git log") ||
		strings.HasPrefix(clean, "git diff") ||
		strings.HasPrefix(clean, "dir") ||
		strings.HasPrefix(clean, "ls") ||
		strings.HasPrefix(clean, "cat") ||
		strings.HasPrefix(clean, "type") {
		return "INSPECTION_SAFE", types.RiskSafe
	}

	// Verification and compilation
	if strings.HasPrefix(clean, "go test") ||
		strings.HasPrefix(clean, "go build") ||
		strings.HasPrefix(clean, "dotnet build") ||
		strings.HasPrefix(clean, "dotnet test") ||
		strings.HasPrefix(clean, "pytest") ||
		strings.HasPrefix(clean, "npm test") {
		return "VERIFICATION", types.RiskMedium
	}

	// File mutations / Git writes
	if strings.HasPrefix(clean, "git commit") ||
		strings.HasPrefix(clean, "git checkout") ||
		strings.HasPrefix(clean, "npm install") ||
		strings.HasPrefix(clean, "go get") {
		return "MUTATION", types.RiskHigh
	}

	return "UNCLASSIFIED_SYSTEM", types.RiskHigh
}

// IsAllowed enforces that no destructive command runs without explicit user authorization.
func (p *DefaultCommandPolicy) IsAllowed(cmd string, activePerm types.PermissionLevel, isUserApproved bool) (bool, string) {
	cat, risk := p.Classify(cmd)

	if cat == "DESTRUCTIVE_BLOCKED" || cat == "DESTRUCTIVE_TOKEN" {
		return false, fmt.Sprintf("Command contains explicitly blocked destructive token or tool (%s). Absolute Safety Rule: denied.", cat)
	}

	switch risk {
	case types.RiskSafe:
		// Safe commands can run if user has at least READ_ONLY or ANALYZE
		return true, "Permitted under read/inspection policy"
	case types.RiskLow, types.RiskMedium:
		if activePerm == types.PermReadOnly || activePerm == types.PermAnalyze {
			return false, "Active permission is read-only. Operation requires EXECUTE permission."
		}
		return true, "Permitted under active execute level"
	case types.RiskHigh, types.RiskCritical:
		if !isUserApproved {
			return false, "High-risk command requires EXPLICIT user authorization before execution. Santiago halts."
		}
		if activePerm != types.PermAdmin && activePerm != types.PermExecute {
			return false, "User confirmed, but active permission level is insufficient. Requires EXECUTE or ADMIN."
		}
		return true, "Explicit user authorization verified and logged."
	default:
		return false, "Unknown risk classification. Epistemic rule: Halt when uncertain."
	}
}
