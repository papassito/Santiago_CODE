// Package model provides the model router abstraction.
// Local-First: Connects to local Ollama (http://127.0.0.1:11434) by default.
// Santiago Core is decoupled: the model is simply a swappable cognitive component.
package model

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/santiago-ai/santiago/pkg/interfaces"
)

type OllamaProvider struct {
	baseURL    string
	defaultMod string
	client     *http.Client
	mu         sync.RWMutex
	metrics    interfaces.ModelMetrics
}

func NewOllamaProvider(baseURL string, defaultModel string) *OllamaProvider {
	if baseURL == "" {
		baseURL = "http://127.0.0.1:11434"
	}
	if defaultModel == "" {
		defaultModel = "qwen2.5-coder:7b"
	}
	return &OllamaProvider{
		baseURL:    baseURL,
		defaultMod: defaultModel,
		client: &http.Client{
			Timeout: 180 * time.Second,
		},
	}
}

func (o *OllamaProvider) Name() string {
	return "ollama-local"
}

// HealthCheck verifies local Ollama daemon is active.
func (o *OllamaProvider) HealthCheck(ctx context.Context) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("%s/api/tags", o.baseURL), nil)
	if err != nil {
		return err
	}
	resp, err := o.client.Do(req)
	if err != nil {
		return fmt.Errorf("local Ollama unreachable at %s: %w", o.baseURL, err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code from Ollama: %d", resp.StatusCode)
	}
	return nil
}

type ollamaGenerateReq struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	System string `json:"system,omitempty"`
	Stream bool   `json:"stream"`
}

type ollamaGenerateResp struct {
	Response        string `json:"response"`
	PromptEvalCount int    `json:"prompt_eval_count"`
	EvalCount       int    `json:"eval_count"`
	TotalDuration   int64  `json:"total_duration"` // nanoseconds
}

func (o *OllamaProvider) GenerateCompletion(ctx context.Context, req interfaces.ModelRequest) (*interfaces.ModelResponse, error) {
	modelName := req.Model
	if modelName == "" {
		modelName = o.defaultMod
	}

	payload := ollamaGenerateReq{
		Model:  modelName,
		Prompt: req.Prompt,
		System: req.SystemPrompt,
		Stream: false,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, fmt.Sprintf("%s/api/generate", o.baseURL), bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	start := time.Now()
	httpResp, err := o.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("ollama execution failed: %w", err)
	}
	defer httpResp.Body.Close()

	if httpResp.StatusCode != http.StatusOK {
		return nil, errors.New(fmt.Sprintf("ollama returned error status: %d", httpResp.StatusCode))
	}

	var parsed ollamaGenerateResp
	if err := json.NewDecoder(httpResp.Body).Decode(&parsed); err != nil {
		return nil, fmt.Errorf("failed to decode ollama response: %w", err)
	}

	duration := time.Since(start)

	o.mu.Lock()
	o.metrics.TotalRequests++
	o.metrics.TotalTokens += int64(parsed.PromptEvalCount + parsed.EvalCount)
	o.metrics.TotalDuration += duration
	if o.metrics.TotalRequests > 0 {
		o.metrics.AverageLatencyMs = float64(o.metrics.TotalDuration.Milliseconds()) / float64(o.metrics.TotalRequests)
	}
	o.mu.Unlock()

	return &interfaces.ModelResponse{
		Text:         parsed.Response,
		PromptTokens: parsed.PromptEvalCount,
		CompTokens:   parsed.EvalCount,
		Duration:     duration,
	}, nil
}

func (o *OllamaProvider) GetMetrics() interfaces.ModelMetrics {
	o.mu.RLock()
	defer o.mu.RUnlock()
	return o.metrics
}
