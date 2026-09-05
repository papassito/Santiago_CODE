package ast

import (
	"go/ast"
	"go/parser"
	"go/token"
	"math"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// ModuleMetrics stores AST inspection numbers for a single source file.
type ModuleMetrics struct {
	FilePath             string   `json:"file_path"`
	PackageName          string   `json:"package_name"`
	TotalLines           int      `json:"total_lines"`
	FunctionsCount       int      `json:"functions_count"`
	StructsOrClasses     int      `json:"structs_count"`
	Imports              []string `json:"imports"`
	CyclomaticComplexity int      `json:"cyclomatic_complexity"`
	SyntaxErrors         []string `json:"syntax_errors"`
	Warnings             []string `json:"warnings"`
}

// DependencyEdge represents an import link in the SoftwareGraph.
type DependencyEdge struct {
	SourceModule string `json:"source"`
	TargetModule string `json:"target"`
}

// SoftwareTopology represents the full network of project files.
type SoftwareTopology struct {
	ProjectID      string           `json:"project_id"`
	Modules        []ModuleMetrics  `json:"modules"`
	Edges          []DependencyEdge `json:"edges"`
	TotalFiles     int              `json:"total_files"`
	GlobalHealth   int              `json:"global_health_score"` // 0 to 100
	KeyRiskIndicators KRI           `json:"kri"`
	GeneratedAt    time.Time        `json:"generated_at"`
}

// KRI represents Key Risk Indicators (Criticals, Modules, Log Alerts).
type KRI struct {
	CriticalIncidents int `json:"critical_incidents"`
	TotalModules      int `json:"total_modules"`
	LogAlerts         int `json:"log_alerts"`
	HighComplexityCount int `json:"high_complexity_count"`
}

// ASTEngine orchestrates parallel code parsing and software graph construction.
type ASTEngine struct {
	mu sync.RWMutex
}

// NewASTEngine instantiates the AST parser.
func NewASTEngine() *ASTEngine {
	return &ASTEngine{}
}

// InspectGoSource reads and parses a Go file into AST metrics.
func (e *ASTEngine) InspectGoSource(filePath string) (ModuleMetrics, error) {
	metrics := ModuleMetrics{
		FilePath: filePath,
		Imports:  make([]string, 0),
	}

	content, err := os.ReadFile(filePath)
	if err != nil {
		return metrics, err
	}
	metrics.TotalLines = len(strings.Split(string(content), "\n"))

	fset := token.NewFileSet()
	node, parseErr := parser.ParseFile(fset, filePath, content, parser.ParseComments)
	if parseErr != nil {
		metrics.SyntaxErrors = append(metrics.SyntaxErrors, parseErr.Error())
		return metrics, nil
	}

	metrics.PackageName = node.Name.Name

	// Walk the AST
	ast.Inspect(node, func(n ast.Node) bool {
		switch x := n.(type) {
		case *ast.ImportSpec:
			if x.Path != nil {
				metrics.Imports = append(metrics.Imports, strings.Trim(x.Path.Value, `"`))
			}
		case *ast.FuncDecl:
			metrics.FunctionsCount++
			// Measure complexity for each func
			metrics.CyclomaticComplexity += computeFuncComplexity(x)
		case *ast.TypeSpec:
			if _, ok := x.Type.(*ast.StructType); ok {
				metrics.StructsOrClasses++
			} else if _, ok := x.Type.(*ast.InterfaceType); ok {
				metrics.StructsOrClasses++
			}
		}
		return true
	})

	return metrics, nil
}

// ScanProject scans a directory for Go code files and builds the SoftwareGraph.
func (e *ASTEngine) ScanProject(projectID, rootDir string) (*SoftwareTopology, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	topology := &SoftwareTopology{
		ProjectID:   projectID,
		Modules:     make([]ModuleMetrics, 0),
		Edges:       make([]DependencyEdge, 0),
		GeneratedAt: time.Now().UTC(),
	}

	var goFiles []string
	filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if !info.IsDir() && strings.HasSuffix(path, ".go") && !strings.Contains(path, "vendor") {
			goFiles = append(goFiles, path)
		}
		return nil
	})

	totalComplexity := 0
	totalSyntaxErrors := 0
	highComplexityFiles := 0

	for _, file := range goFiles {
		m, err := e.InspectGoSource(file)
		if err == nil {
			topology.Modules = append(topology.Modules, m)
			totalComplexity += m.CyclomaticComplexity
			totalSyntaxErrors += len(m.SyntaxErrors)

			if m.CyclomaticComplexity > 15 {
				highComplexityFiles++
			}

			// Generate edges from imports
			relSource, _ := filepath.Rel(rootDir, file)
			for _, imp := range m.Imports {
				if strings.Contains(imp, projectID) || !strings.Contains(imp, ".") {
					topology.Edges = append(topology.Edges, DependencyEdge{
						SourceModule: relSource,
						TargetModule: imp,
					})
				}
			}
		}
	}

	topology.TotalFiles = len(topology.Modules)

	// Health score calculation (0 - 100)
	// Base 100 minus penalties for syntax errors, high complexity, and unhandled warnings
	health := 100
	health -= (totalSyntaxErrors * 25)
	health -= (highComplexityFiles * 5)
	if totalComplexity > 200 {
		health -= 10
	}
	if health < 0 {
		health = 0
	}
	if health > 100 {
		health = 100
	}
	topology.GlobalHealth = health

	topology.KeyRiskIndicators = KRI{
		CriticalIncidents:   totalSyntaxErrors,
		TotalModules:        topology.TotalFiles,
		LogAlerts:           highComplexityFiles,
		HighComplexityCount: highComplexityFiles,
	}

	return topology, nil
}

// computeFuncComplexity estimates cyclomatic complexity by counting branch points.
func computeFuncComplexity(fn *ast.FuncDecl) int {
	complexity := 1
	if fn.Body == nil {
		return complexity
	}

	ast.Inspect(fn.Body, func(n ast.Node) bool {
		switch n.(type) {
		case *ast.IfStmt, *ast.ForStmt, *ast.RangeStmt, *ast.CaseClause, *ast.CommClause:
			complexity++
		case *ast.BinaryExpr:
			// Logical operators && and || add decision paths
			b := n.(*ast.BinaryExpr)
			if b.Op == token.LAND || b.Op == token.LOR {
				complexity++
			}
		}
		return true
	})
	return complexity
}

// CalculateHealthScore computes the explicit 0-100 metric.
func CalculateHealthScore(syntaxErrors, criticals, modules, avgComplexity int) int {
	score := 100.0 - (float64(syntaxErrors) * 20.0) - (float64(criticals) * 15.0)
	if avgComplexity > 10 {
		score -= float64(avgComplexity - 10) * 2.0
	}
	if score < 0 {
		return 0
	}
	return int(math.Min(100, score))
}
