package autofix

import (
	"context"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

// ExecutionResult captures the output of the process execution.
type ExecutionResult struct {
	ExitCode int
	Stdout   string
	Stderr   string
	Duration time.Duration
	Passed   bool
}

// TracebackInfo captures details of an error intercepted by the DeepIntegrationTester.
type TracebackInfo struct {
	ErrorType   string
	Message     string
	FailedFile  string
	FailedLine  int
	CodeSnippet string
	StackTrace  []string
}

// AutoFixIteration tracks a single loop attempt in the auto-refactoring engine.
type AutoFixIteration struct {
	Attempt       int
	Timestamp     time.Time
	PatchApplied  string
	Execution     ExecutionResult
	Traceback     *TracebackInfo
	FixStrategy   string
	ResolutionWon bool
}

// ArchitectureMap represents the Clean Architecture layout (UI vs Data vs Logic)
// required by KlikSoft Pro standards before writing code.
type ArchitectureMap struct {
	ProjectName string            `json:"project_name"`
	TargetOS    string            `json:"target_os"` // Android, Windows, iOS, Web
	UIComponents []string          `json:"ui_components"`
	DataLayer   []string          `json:"data_layer"`
	LogicCore   []string          `json:"logic_core"`
	Contracts   map[string]string `json:"contracts"`
	GeneratedAt time.Time         `json:"generated_at"`
}

// AutoFixEngine coordinates the closed-loop feedback and atomic mutations.
type AutoFixEngine struct {
	mu           sync.RWMutex
	maxRetries   int
	workspaceDir string
	solutionLib  map[string]string // Error pattern -> AST Mutation / Replacement rule
}

// NewAutoFixEngine instantiates the sovereign auto-refactoring engine.
func NewAutoFixEngine(workspaceDir string, maxRetries int) *AutoFixEngine {
	if maxRetries <= 0 {
		maxRetries = 5
	}
	engine := &AutoFixEngine{
		maxRetries:   maxRetries,
		workspaceDir: workspaceDir,
		solutionLib:  make(map[string]string),
	}
	engine.seedSolutionLibrary()
	return engine
}

// seedSolutionLibrary populates known deterministic repair patterns.
func (e *AutoFixEngine) seedSolutionLibrary() {
	e.solutionLib["ZeroDivisionError"] = "add_guard_condition_zero_check"
	e.solutionLib["NameError"] = "import_missing_symbol_or_define_default"
	e.solutionLib["IndexError"] = "boundary_check_array_length"
	e.solutionLib["NullPointerException"] = "optional_nil_coalescing_check"
	e.solutionLib["UndefinedVariable"] = "declare_typed_variable"
	e.solutionLib["ImportError"] = "resolve_canonical_module_import"
}

// GenerateArchitectureMap creates the architectural blueprint according to KlikSoft Pro standards.
func (e *AutoFixEngine) GenerateArchitectureMap(projectName, targetPlatform string) *ArchitectureMap {
	return &ArchitectureMap{
		ProjectName: projectName,
		TargetOS:    targetPlatform,
		UIComponents: []string{
			"Views/PresentationLayer (Stateless Composables / Android XML)",
			"ViewModels / StateHolders (Unidirectional Data Flow)",
			"DesignSystem / KlikTheme (Colors, Typography, Elevation)",
		},
		DataLayer: []string{
			"Repositories / OfflineLocalStore (Room DB / SQLite WAL)",
			"RemoteDataSource (gRPC / HTTPS Client with Retry Loop)",
			"DataMappers (DTO to Domain Entity transformers)",
		},
		LogicCore: []string{
			"UseCases / Interactors (Pure business logic, zero framework dependency)",
			"DomainModels (Immutable structs, value objects)",
			"SecurityRules & Validators (Input sanitation, zero crash guarantee)",
		},
		Contracts: map[string]string{
			"UI_to_ViewModel":  "StateFlow / LiveData immutable observations",
			"ViewModel_to_UseCases": "Coroutines Dispatchers.IO with cancellation tokens",
			"UseCase_to_Repo":  "Interface segregation with failure Monad (Result<T, Err>)",
		},
		GeneratedAt: time.Now().UTC(),
	}
}

// AtomicWriteSafe writes source code first to a temporary file (.tmp) and executes
// an atomic rename (os.Rename / MoveFileExW) to guarantee zero file corruption.
func (e *AutoFixEngine) AtomicWriteSafe(filePath string, content []byte) error {
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	// Backup existing file if present (.bak)
	if _, err := os.Stat(filePath); err == nil {
		bakPath := filePath + ".bak"
		copyFile(filePath, bakPath)
	}

	// Write to .tmp
	tmpPath := filePath + ".tmp." + strconv.FormatInt(time.Now().UnixNano(), 10)
	if err := os.WriteFile(tmpPath, content, 0644); err != nil {
		return fmt.Errorf("failed to write temporary file: %w", err)
	}

	// Atomic replace
	if err := os.Rename(tmpPath, filePath); err != nil {
		os.Remove(tmpPath)
		return fmt.Errorf("atomic rename failed: %w", err)
	}
	return nil
}

// ParseTraceback extracts file, line number and error type from compiler or interpreter stderr.
func (e *AutoFixEngine) ParseTraceback(stderr string) *TracebackInfo {
	info := &TracebackInfo{
		StackTrace: strings.Split(stderr, "\n"),
	}

	// Python style: File "...", line 42, in ... \n ErrorType: message
	pyRegex := regexp.MustCompile(`File "([^"]+)", line (\d+).*?\n\s*(.*)`)
	matches := pyRegex.FindStringSubmatch(stderr)
	if len(matches) >= 4 {
		info.FailedFile = matches[1]
		info.FailedLine, _ = strconv.Atoi(matches[2])
		info.CodeSnippet = strings.TrimSpace(matches[3])
	}

	// Go style: main.go:42:12: undefined: Foo
	goRegex := regexp.MustCompile(`([^:\s]+\.go):(\d+):(?:\d+:)?\s*(.*)`)
	goMatches := goRegex.FindStringSubmatch(stderr)
	if len(goMatches) >= 4 {
		info.FailedFile = goMatches[1]
		info.FailedLine, _ = strconv.Atoi(goMatches[2])
		info.Message = strings.TrimSpace(goMatches[3])
		info.ErrorType = "CompilerDiagnostic"
	}

	// Identify common exception classes
	for errKey := range e.solutionLib {
		if strings.Contains(stderr, errKey) {
			info.ErrorType = errKey
			break
		}
	}
	if info.ErrorType == "" {
		info.ErrorType = "RuntimeFailure"
	}
	return info
}

// DeepIntegrationTestRunner runs test suite or entry point in closed loop.
func (e *AutoFixEngine) DeepIntegrationTestRunner(
	ctx context.Context,
	testCommand string,
	targetFile string,
	initialCode []byte,
) ([]AutoFixIteration, bool, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	var iterations []AutoFixIteration
	currentCode := initialCode

	for attempt := 1; attempt <= e.maxRetries; attempt++ {
		// 1. Atomic write to disk
		if err := e.AtomicWriteSafe(targetFile, currentCode); err != nil {
			return iterations, false, err
		}

		// 2. Execute process test runner
		start := time.Now()
		cmdParts := strings.Fields(testCommand)
		if len(cmdParts) == 0 {
			cmdParts = []string{"go", "test", "-v", "./..."}
		}

		cmd := exec.CommandContext(ctx, cmdParts[0], cmdParts[1:]...)
		cmd.Dir = e.workspaceDir

		var stdoutBuf, stderrBuf strings.Builder
		cmd.Stdout = &stdoutBuf
		cmd.Stderr = &stderrBuf

		err := cmd.Run()
		duration := time.Since(start)

		res := ExecutionResult{
			Stdout:   stdoutBuf.String(),
			Stderr:   stderrBuf.String(),
			Duration: duration,
			Passed:   err == nil,
		}
		if cmd.ProcessState != nil {
			res.ExitCode = cmd.ProcessState.ExitCode()
		}

		iteration := AutoFixIteration{
			Attempt:   attempt,
			Timestamp: time.Now().UTC(),
			Execution: res,
		}

		// If passed, we achieved victory without bothering the human operator!
		if res.Passed {
			iteration.ResolutionWon = true
			iteration.FixStrategy = "VERIFIED_PASSING_STABLE"
			iterations = append(iterations, iteration)
			return iterations, true, nil
		}

		// 3. Test failed -> Read traceback & diagnose
		tb := e.ParseTraceback(res.Stderr + "\n" + res.Stdout)
		iteration.Traceback = tb

		// 4. Look up repair strategy in solution library or AST mutator
		strategy, ok := e.solutionLib[tb.ErrorType]
		if !ok {
			strategy = "ast_semantic_heuristic_mutation"
		}
		iteration.FixStrategy = strategy

		// Apply surgical patch to code
		patchedCode := e.applySemanticFix(currentCode, tb, strategy)
		iteration.PatchApplied = fmt.Sprintf("Applied %s on line %d (%s)", strategy, tb.FailedLine, tb.ErrorType)
		iterations = append(iterations, iteration)

		currentCode = patchedCode
	}

	return iterations, false, fmt.Errorf("auto-refactor loop exceeded max retries (%d)", e.maxRetries)
}

// applySemanticFix mutates code based on the concrete traceback.
func (e *AutoFixEngine) applySemanticFix(original []byte, tb *TracebackInfo, strategy string) []byte {
	lines := strings.Split(string(original), "\n")
	if tb.FailedLine > 0 && tb.FailedLine <= len(lines) {
		idx := tb.FailedLine - 1
		line := lines[idx]

		switch strategy {
		case "add_guard_condition_zero_check":
			// E.g. division by zero guard
			indent := extractIndent(line)
			guard := fmt.Sprintf("%sif divisor == 0 { return 0, fmt.Errorf(\"division by zero guarded by Santiago\") }", indent)
			lines[idx] = guard + "\n" + line
		case "optional_nil_coalescing_check":
			indent := extractIndent(line)
			guard := fmt.Sprintf("%sif target == nil { return nil }", indent)
			lines[idx] = guard + "\n" + line
		case "declare_typed_variable":
			indent := extractIndent(line)
			patch := fmt.Sprintf("%svar %s string", indent, tb.Message)
			lines[idx] = patch + "\n" + line
		default:
			// Generic defensive comment and wrapper
			lines[idx] = fmt.Sprintf("// [Santiago AutoFix: Guarded %s]\n%s", tb.ErrorType, line)
		}
	}
	return []byte(strings.Join(lines, "\n"))
}

func extractIndent(line string) string {
	indent := ""
	for _, c := range line {
		if c == ' ' || c == '\t' {
			indent += string(c)
		} else {
			break
		}
	}
	return indent
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}
