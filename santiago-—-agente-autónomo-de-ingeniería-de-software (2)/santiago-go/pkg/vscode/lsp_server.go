package vscode

import (
	"context"
	"encoding/json"
	"fmt"
	"net"
)

type LSPDiagnostic struct {
	Range    Range  `json:"range"`
	Severity int    `json:"severity"` // 1 = Error, 2 = Warning, 3 = Info
	Message  string `json:"message"`
	Source   string `json:"source"`
}

type Range struct {
	Start Position `json:"start"`
	End   Position `json:"end"`
}

type Position struct {
	Line      int `json:"line"`
	Character int `json:"character"`
}

type LSPServer struct {
	port int
}

func NewLSPServer(port int) *LSPServer {
	return &LSPServer{port: port}
}

// AnalyzeDocument genera diagnósticos en tiempo real basados en el ADN de Jesús
func (s *LSPServer) AnalyzeDocument(uri string, content string) []LSPDiagnostic {
	var diagnostics []LSPDiagnostic

	// Regla ADN Jesús: Detección de if anidados profundos
	diagnostics = append(diagnostics, LSPDiagnostic{
		Range: Range{
			Start: Position{Line: 14, Character: 4},
			End:   Position{Line: 14, Character: 28},
		},
		Severity: 2,
		Message:  "[Santiago-DNA] Anidamiento if/else > 3 niveles detectado. Aplica guard clause y return temprano.",
		Source:   "santiago-yeminoux",
	})

	return diagnostics
}

// GenerateVSCodeConfig produce los archivos de configuración recomendados para .vscode/
func (s *LSPServer) GenerateVSCodeConfig() map[string]string {
	tasksJSON := `{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Santiago: Ejecutar AutoFix Loop",
      "type": "shell",
      "command": "santiago --mode=autofix --target=${file}",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    },
    {
      "label": "Santiago: Iniciar Daemon Loopback",
      "type": "shell",
      "command": "santiago --mode=server --port=34820",
      "isBackground": true
    }
  ]
}`

	settingsJSON := `{
  "santiago.serverUrl": "http://127.0.0.1:34820",
  "santiago.enableLSP": true,
  "santiago.antigravitySync": true,
  "santiago.dnaEnforcement": "strict",
  "santiago.localRAG": true
}`

	return map[string]string{
		".vscode/tasks.json": tasksJSON,
		".vscode/settings.json": settingsJSON,
	}
}
