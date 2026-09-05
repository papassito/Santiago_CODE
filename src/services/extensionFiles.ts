import { ExtensionDeliverableFile } from '../types';

export const EXTENSION_DELIVERABLE_FILES: ExtensionDeliverableFile[] = [
  {
    path: 'package.json',
    title: 'Extension Manifest',
    description: 'Defines activation events, view containers, commands, settings and keybindings',
    language: 'json',
    content: `{
  "name": "santiago-agent",
  "displayName": "Santiago Agent",
  "description": "Sovereign, local-first enterprise AI coding engine with ghost-text autocompletions, context commands, and micro-daemons bridge.",
  "version": "1.0.0",
  "publisher": "santiago-sovereign-ai",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": [
    "Programming Languages",
    "AI",
    "Snippets",
    "Machine Learning"
  ],
  "keywords": [
    "santiago",
    "autocomplete",
    "ghost text",
    "local AI",
    "sovereign"
  ],
  "activationEvents": [
    "onStartupFinished"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "santiago-sidebar",
          "title": "Santiago Agent",
          "icon": "resources/icon.svg"
        }
      ]
    },
    "views": {
      "santiago-sidebar": [
        {
          "type": "webview",
          "id": "santiago.chatView",
          "name": "Santiago AI Assistant",
          "contextualTitle": "Santiago Sovereign Engine"
        }
      ]
    },
    "commands": [
      {
        "command": "santiago.explainCode",
        "title": "Santiago: Explain Code",
        "category": "Santiago"
      },
      {
        "command": "santiago.refactor",
        "title": "Santiago: Refactor",
        "category": "Santiago"
      },
      {
        "command": "santiago.generateTests",
        "title": "Santiago: Generate Unit Tests",
        "category": "Santiago"
      },
      {
        "command": "santiago.checkHealth",
        "title": "Santiago: Check Swarm Daemons Health",
        "category": "Santiago"
      },
      {
        "command": "santiago.toggleVoiceListen",
        "title": "Santiago: Toggle Voice Listening (Whisper.cpp)",
        "category": "Santiago"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "command": "santiago.explainCode",
          "group": "santiago_group@1",
          "when": "editorHasSelection"
        },
        {
          "command": "santiago.refactor",
          "group": "santiago_group@2",
          "when": "editorHasSelection"
        },
        {
          "command": "santiago.generateTests",
          "group": "santiago_group@3",
          "when": "editorHasSelection"
        }
      ]
    },
    "configuration": {
      "title": "Santiago Agent",
      "properties": {
        "santiago.gatewayUrl": {
          "type": "string",
          "default": "http://localhost:34820",
          "description": "Gateway API Orchestrator & AI Engine endpoint"
        },
        "santiago.ragUrl": {
          "type": "string",
          "default": "http://localhost:34821",
          "description": "RAG Engine semantic search daemon endpoint"
        },
        "santiago.runnerUrl": {
          "type": "string",
          "default": "http://localhost:34822",
          "description": "Runner command execution daemon endpoint"
        },
        "santiago.vaultUrl": {
          "type": "string",
          "default": "http://localhost:34823",
          "description": "Vault encrypted state daemon endpoint"
        },
        "santiago.autocompleteDebounceMs": {
          "type": "number",
          "default": 35,
          "description": "Debounce delay in milliseconds for ghost text inline completions"
        },
        "santiago.autoSpeakResponse": {
          "type": "boolean",
          "default": false,
          "description": "Automatically play assistant responses using Piper TTS / Bark module"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "package": "vsce package"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/vscode": "^1.85.0",
    "typescript": "^5.3.3",
    "@vscode/vsce": "^2.22.0"
  }
}`
  },
  {
    path: 'src/extension.ts',
    title: 'Extension Entry Point',
    description: 'Manages subscriptions, providers, status bar polling, and command routing',
    language: 'typescript',
    content: `import * as vscode from 'vscode';
import { SantiagoCompletionProvider } from './providers/SantiagoCompletionProvider';
import { SantiagoChatViewProvider } from './providers/SantiagoChatViewProvider';
import { GatewayClient } from './services/gatewayClient';

let statusBarItem: vscode.StatusBarItem;
let healthPollInterval: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('[Santiago Agent] Initializing sovereign local-first extension...');

  // 1. Initialize Gateway & Micro-Daemons Client
  const config = vscode.workspace.getConfiguration('santiago');
  const gatewayUrl = config.get<string>('gatewayUrl', 'http://localhost:34820');
  const ragUrl = config.get<string>('ragUrl', 'http://localhost:34821');
  const runnerUrl = config.get<string>('runnerUrl', 'http://localhost:34822');
  const vaultUrl = config.get<string>('vaultUrl', 'http://localhost:34823');

  const gatewayClient = new GatewayClient({
    gatewayUrl,
    ragUrl,
    runnerUrl,
    vaultUrl,
  });

  // 2. Register Sovereign Inline Autocomplete Provider (Ghost Text)
  const completionProvider = new SantiagoCompletionProvider(gatewayClient);
  const inlineSelector: vscode.DocumentSelector = [
    { scheme: 'file', language: '*' },
    { scheme: 'untitled', language: '*' }
  ];

  context.subscriptions.push(
    vscode.languages.registerInlineCompletionItemProvider(
      inlineSelector,
      completionProvider
    )
  );

  // 3. Register Santiago AI Assistant Sidebar (Webview)
  const chatViewProvider = new SantiagoChatViewProvider(context.extensionUri, gatewayClient);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SantiagoChatViewProvider.viewType,
      chatViewProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  );

  // 4. Initialize Swarm Health Status Bar (Pinned Bottom Right)
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'santiago.checkHealth';
  context.subscriptions.push(statusBarItem);

  // Initial health check & start 10s polling
  checkSwarmHealth(gatewayClient);
  healthPollInterval = setInterval(() => {
    checkSwarmHealth(gatewayClient);
  }, 10000);

  // 5. Register Contextual Editor Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('santiago.explainCode', async () => {
      await handleContextCommand('explain', gatewayClient, chatViewProvider);
    }),
    vscode.commands.registerCommand('santiago.refactor', async () => {
      await handleContextCommand('refactor', gatewayClient, chatViewProvider);
    }),
    vscode.commands.registerCommand('santiago.generateTests', async () => {
      await handleContextCommand('generate_tests', gatewayClient, chatViewProvider);
    }),
    vscode.commands.registerCommand('santiago.checkHealth', async () => {
      await checkSwarmHealth(gatewayClient, true);
    }),
    vscode.commands.registerCommand('santiago.toggleVoiceListen', () => {
      chatViewProvider.triggerVoiceListening();
    })
  );

  console.log('[Santiago Agent] Successfully activated all sovereign capabilities.');
}

async function checkSwarmHealth(gatewayClient: GatewayClient, showNotification = false) {
  try {
    const health = await gatewayClient.checkHealth();
    if (health.allHealthy) {
      statusBarItem.text = '$(check) 🤖 Santiago: Online';
      statusBarItem.tooltip = \`Swarm Daemons Active (Latency: \${health.latencyMs}ms)\\n• Gateway (:34820): Online\\n• RAG Engine (:34821): Online\\n• Runner (:34822): Online\\n• Vault (:34823): Online\`;
      statusBarItem.backgroundColor = undefined;
      statusBarItem.color = '#3fb950'; // Green
      if (showNotification) {
        vscode.window.showInformationMessage(\`[Santiago Agent] Swarm Online! Response: \${health.latencyMs}ms\`);
      }
    } else {
      statusBarItem.text = '$(alert) 🤖 Santiago: Degraded';
      statusBarItem.tooltip = \`Some Daemons are unreachable:\\n\${health.statusSummary}\`;
      statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      statusBarItem.color = '#e3b341'; // Amber
      if (showNotification) {
        vscode.window.showWarningMessage(\`[Santiago Agent] Warning: \${health.statusSummary}\`);
      }
    }
  } catch (error) {
    statusBarItem.text = '$(error) 🤖 Santiago: Offline';
    statusBarItem.tooltip = 'Unable to connect to Gateway at http://localhost:34820\\nMake sure local Go micro-daemons are running.';
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    statusBarItem.color = '#f85149'; // Red
    if (showNotification) {
      vscode.window.showErrorMessage('[Santiago Agent] Gateway offline at http://localhost:34820.');
    }
  }
  statusBarItem.show();
}

async function handleContextCommand(
  action: 'explain' | 'refactor' | 'generate_tests',
  gatewayClient: GatewayClient,
  chatViewProvider: SantiagoChatViewProvider
) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('[Santiago Agent] Open a file and select code to inspect.');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);
  const fullText = editor.document.getText();
  const languageId = editor.document.languageId;
  const fileName = editor.document.fileName;

  if (!selectedText.trim()) {
    vscode.window.showWarningMessage('[Santiago Agent] Please select a block of code first.');
    return;
  }

  // Open / focus chat webview
  await vscode.commands.executeCommand('santiago.chatView.focus');

  // Forward prompt to chat sidebar with streaming response
  chatViewProvider.handleContextAction({
    action,
    selectedCode: selectedText,
    languageId,
    fileName,
    cursorLine: selection.start.line + 1,
  });
}

export function deactivate() {
  if (healthPollInterval) {
    clearInterval(healthPollInterval);
  }
  console.log('[Santiago Agent] Deactivated.');
}`
  },
  {
    path: 'src/providers/SantiagoCompletionProvider.ts',
    title: 'Sovereign Inline Autocomplete Provider',
    description: 'Ghost text inline completion logic with sub-100ms debounce and cancellation tokens',
    language: 'typescript',
    content: `import * as vscode from 'vscode';
import { GatewayClient } from '../services/gatewayClient';

export class SantiagoCompletionProvider implements vscode.InlineCompletionItemProvider {
  private debounceTimer: NodeJS.Timeout | undefined;
  private lastRequestId = 0;
  private cache = new Map<string, { completion: string; timestamp: number }>();
  private cacheTtlMs = 15000;

  constructor(private readonly gatewayClient: GatewayClient) {}

  public async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken
  ): Promise<vscode.InlineCompletionList | vscode.InlineCompletionItem[] | null> {
    // 1. Guard check - abort if requested explicitly or trigger is disabled
    if (token.isCancellationRequested) {
      return null;
    }

    const currentRequestId = ++this.lastRequestId;

    // 2. Extract surrounding context (text before and after cursor)
    const lineText = document.lineAt(position.line).text;
    const prefix = document.getText(
      new vscode.Range(new vscode.Position(Math.max(0, position.line - 50), 0), position)
    );
    const suffix = document.getText(
      new vscode.Range(position, new vscode.Position(Math.min(document.lineCount - 1, position.line + 30), 0))
    );

    // Fast reject on empty whitespace or comment lines if desired
    if (prefix.trim().length === 0) {
      return null;
    }

    // 3. Cache lookup for instant response
    const cacheKey = \`\${document.languageId}:\${prefix.slice(-80)}\`;
    const cachedEntry = this.cache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < this.cacheTtlMs) {
      return [
        new vscode.InlineCompletionItem(
          cachedEntry.completion,
          new vscode.Range(position, position)
        )
      ];
    }

    // 4. Debounce to achieve smooth sub-100ms typing responsiveness
    const config = vscode.workspace.getConfiguration('santiago');
    const debounceMs = config.get<number>('autocompleteDebounceMs', 35);

    await new Promise<void>((resolve) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => resolve(), debounceMs);
    });

    if (token.isCancellationRequested || currentRequestId !== this.lastRequestId) {
      return null;
    }

    try {
      // 5. Query local Gateway (:34820/api/v1/autocomplete)
      const startTime = Date.now();
      const response = await this.gatewayClient.getInlineCompletion({
        prefix,
        suffix,
        language: document.languageId,
        filePath: document.fileName,
        line: position.line,
        column: position.character,
      }, token);

      const elapsed = Date.now() - startTime;

      if (token.isCancellationRequested || !response || !response.completion) {
        return null;
      }

      // 6. Save in LRU cache
      this.cache.set(cacheKey, {
        completion: response.completion,
        timestamp: Date.now()
      });
      if (this.cache.size > 200) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) {
          this.cache.delete(firstKey);
        }
      }

      // 7. Return native VS Code ghost text item
      const completionItem = new vscode.InlineCompletionItem(
        response.completion,
        new vscode.Range(position, position)
      );

      return [completionItem];
    } catch (error) {
      // Gracefully swallow autocomplete network timeouts to keep typing smooth
      return null;
    }
  }
}`
  },
  {
    path: 'src/providers/SantiagoChatViewProvider.ts',
    title: 'Santiago AI Assistant Sidebar Provider',
    description: 'Webview provider hosting the chat interface and handling two-way postMessage communication',
    language: 'typescript',
    content: `import * as vscode from 'vscode';
import { GatewayClient } from '../services/gatewayClient';

export class SantiagoChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'santiago.chatView';
  private view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly gatewayClient: GatewayClient
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    // Two-way communication bridge with the Webview
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'sendMessage': {
          await this.handleUserMessage(data.text);
          break;
        }
        case 'insertAtCursor': {
          await this.insertCodeAtCursor(data.code);
          break;
        }
        case 'copyToClipboard': {
          await vscode.env.clipboard.writeText(data.code);
          vscode.window.showInformationMessage('[Santiago Agent] Code copied to clipboard!');
          break;
        }
        case 'queryRag': {
          const ragResult = await this.gatewayClient.searchRag(data.query);
          this.view?.webview.postMessage({
            type: 'ragResponse',
            results: ragResult
          });
          break;
        }
        case 'executeRunnerCommand': {
          const runOutput = await this.gatewayClient.runCommand(data.command);
          this.view?.webview.postMessage({
            type: 'runnerOutput',
            output: runOutput
          });
          break;
        }
      }
    });
  }

  public async handleContextAction(payload: {
    action: 'explain' | 'refactor' | 'generate_tests';
    selectedCode: string;
    languageId: string;
    fileName: string;
    cursorLine: number;
  }) {
    if (!this.view) {
      return;
    }

    const promptMap = {
      explain: \`Please explain the following \${payload.languageId} code clearly with architectural context:\\n\\n\`\`\`\${payload.languageId}\\n\${payload.selectedCode}\\n\`\`\`,
      refactor: \`Refactor the following \${payload.languageId} code for superior performance, readability, and idiomatic patterns:\\n\\n\`\`\`\${payload.languageId}\\n\${payload.selectedCode}\\n\`\`\`,
      generate_tests: \`Generate comprehensive unit tests covering edge cases for this \${payload.languageId} code:\\n\\n\`\`\`\${payload.languageId}\\n\${payload.selectedCode}\\n\`\`\`\`
    };

    const userPrompt = promptMap[payload.action];

    // Push user message to webview UI
    this.view.webview.postMessage({
      type: 'appendMessage',
      role: 'user',
      content: userPrompt
    });

    // Start streaming assistant response
    try {
      this.view.webview.postMessage({
        type: 'startStreamResponse'
      });

      await this.gatewayClient.streamChat({
        message: userPrompt,
        context: {
          file: payload.fileName,
          language: payload.languageId,
          code: payload.selectedCode
        },
        onChunk: (chunk: string) => {
          this.view?.webview.postMessage({
            type: 'streamChunk',
            chunk
          });
        }
      });

      this.view.webview.postMessage({
        type: 'endStreamResponse'
      });
    } catch (error: any) {
      this.view.webview.postMessage({
        type: 'streamError',
        error: error.message || 'Error communicating with Santiago Gateway'
      });
    }
  }

  public triggerVoiceListening() {
    this.view?.webview.postMessage({
      type: 'toggleVoice'
    });
  }

  private async handleUserMessage(text: string) {
    if (!this.view) return;

    try {
      this.view.webview.postMessage({
        type: 'startStreamResponse'
      });

      await this.gatewayClient.streamChat({
        message: text,
        onChunk: (chunk: string) => {
          this.view?.webview.postMessage({
            type: 'streamChunk',
            chunk
          });
        }
      });

      this.view.webview.postMessage({
        type: 'endStreamResponse'
      });
    } catch (error: any) {
      this.view.webview.postMessage({
        type: 'streamError',
        error: error.message || 'Gateway offline'
      });
    }
  }

  private async insertCodeAtCursor(code: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('[Santiago Agent] No active editor found to insert code.');
      return;
    }

    editor.edit((editBuilder) => {
      if (editor.selection.isEmpty) {
        editBuilder.insert(editor.selection.active, code);
      } else {
        editBuilder.replace(editor.selection, code);
      }
    });

    vscode.window.showInformationMessage('[Santiago Agent] Code inserted into active editor.');
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    // In production, this loads src/webview/chat.html or embeds the compiled asset
    return \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Santiago AI Assistant</title>
  <style>
    :root {
      --vscode-font: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      --bg: var(--vscode-editor-background, #1e1e1e);
      --fg: var(--vscode-editor-foreground, #d4d4d4);
      --input-bg: var(--vscode-input-background, #252526);
      --input-border: var(--vscode-input-border, #3c3c3c);
      --btn-bg: var(--vscode-button-background, #0e639c);
      --btn-hover: var(--vscode-button-hoverBackground, #1177bb);
      --btn-fg: var(--vscode-button-foreground, #ffffff);
      --card-bg: var(--vscode-editorWidget-background, #252526);
      --border: var(--vscode-widget-border, #3c3c3c);
      --badge-bg: var(--vscode-badge-background, #4d4d4d);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--vscode-font);
      background-color: var(--bg);
      color: var(--fg);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    #header {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--input-bg);
    }
    .badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 12px;
      background: #1f6feb26;
      color: #58a6ff;
      border: 1px solid #1f6feb55;
    }
    #chat-container {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .message {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      line-height: 1.5;
    }
    .message.user {
      align-self: flex-end;
      background: #0e639c33;
      border: 1px solid #0e639c66;
      padding: 8px 12px;
      border-radius: 8px;
      max-width: 90%;
    }
    .message.assistant {
      align-self: flex-start;
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 10px 12px;
      border-radius: 8px;
      width: 100%;
    }
    pre {
      background: #141414;
      border: 1px solid #333;
      border-radius: 6px;
      margin: 8px 0;
      overflow-x: auto;
      position: relative;
    }
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 8px;
      background: #1f1f1f;
      border-bottom: 1px solid #333;
      font-size: 11px;
      color: #888;
    }
    .code-actions button {
      background: transparent;
      border: 1px solid #444;
      color: var(--fg);
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 4px;
    }
    .code-actions button:hover {
      background: #333;
    }
    code {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 12px;
      padding: 8px;
      display: block;
      color: #9cdcfe;
    }
    #input-box {
      padding: 10px;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--input-bg);
    }
    textarea {
      width: 100%;
      height: 70px;
      background: var(--bg);
      color: var(--fg);
      border: 1px solid var(--input-border);
      border-radius: 6px;
      padding: 8px;
      font-family: inherit;
      resize: none;
      font-size: 13px;
    }
    textarea:focus {
      outline: 1px solid var(--btn-bg);
    }
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    button.send-btn {
      background: var(--btn-bg);
      color: var(--btn-fg);
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
    }
    button.send-btn:hover {
      background: var(--btn-hover);
    }
  </style>
</head>
<body>
  <div id="header">
    <strong>Santiago Agent</strong>
    <span class="badge">Sovereign v1.0</span>
  </div>
  <div id="chat-container">
    <div class="message assistant">
      <div>Hello! I am <strong>Santiago Agent</strong>, your sovereign local coding assistant. Select any code in your editor and right-click to Explain, Refactor, or Generate Tests, or ask me directly below.</div>
    </div>
  </div>
  <div id="input-box">
    <textarea id="promptInput" placeholder="Ask Santiago or dictate your command..."></textarea>
    <div class="controls">
      <span style="font-size: 11px; color: #888;">Gateway: localhost:34820</span>
      <button class="send-btn" id="sendBtn">Send Prompt</button>
    </div>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    const chatContainer = document.getElementById('chat-container');
    const promptInput = document.getElementById('promptInput');
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', () => {
      const text = promptInput.value.trim();
      if (!text) return;
      promptInput.value = '';
      vscode.postMessage({ type: 'sendMessage', text });
    });

    window.addEventListener('message', event => {
      const msg = event.data;
      if (msg.type === 'appendMessage') {
        const el = document.createElement('div');
        el.className = 'message ' + msg.role;
        el.textContent = msg.content;
        chatContainer.appendChild(el);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  </script>
</body>
</html>\`;
  }
}`
  },
  {
    path: 'src/webview/chat.html',
    title: 'Sidebar Chat UI',
    description: 'Complete standalone Webview HTML interface with VS Code design tokens, markdown parser, and copy/insert actions',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Santiago Sovereign AI Assistant</title>
  <style>
    :root {
      --vscode-font: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      --bg: var(--vscode-editor-background, #18181b);
      --fg: var(--vscode-editor-foreground, #f4f4f5);
      --input-bg: var(--vscode-input-background, #27272a);
      --input-border: var(--vscode-input-border, #3f3f46);
      --btn-bg: var(--vscode-button-background, #2563eb);
      --btn-hover: var(--vscode-button-hoverBackground, #1d4ed8);
      --btn-fg: var(--vscode-button-foreground, #ffffff);
      --card-bg: var(--vscode-editorWidget-background, #202023);
      --border: var(--vscode-widget-border, #3f3f46);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--vscode-font);
      background-color: var(--bg);
      color: var(--fg);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      background: var(--input-bg);
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #4ade80;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 8px #4ade8088;
    }

    .chat-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .msg-card {
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .msg-user {
      align-self: flex-end;
      background: #1e3a8a44;
      border: 1px solid #3b82f655;
      max-width: 88%;
      color: #93c5fd;
    }

    .msg-assistant {
      align-self: flex-start;
      background: var(--card-bg);
      border: 1px solid var(--border);
      width: 100%;
    }

    .code-box {
      margin: 8px 0;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #3f3f46;
      background: #09090b;
    }

    .code-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      background: #18181b;
      font-size: 11px;
      color: #a1a1aa;
      border-bottom: 1px solid #27272a;
    }

    .actions-group {
      display: flex;
      gap: 6px;
    }

    .btn-action {
      background: #27272a;
      border: 1px solid #3f3f46;
      color: #e4e4e7;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .btn-action:hover {
      background: #3f3f46;
    }

    pre code {
      display: block;
      padding: 10px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
      font-size: 12px;
      color: #38bdf8;
      line-height: 1.4;
    }

    .input-panel {
      padding: 12px;
      border-top: 1px solid var(--border);
      background: var(--input-bg);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .textarea-wrapper {
      position: relative;
    }

    textarea {
      width: 100%;
      height: 72px;
      padding: 10px;
      font-family: inherit;
      font-size: 13px;
      background: var(--bg);
      color: var(--fg);
      border: 1px solid var(--input-border);
      border-radius: 6px;
      resize: none;
    }

    textarea:focus {
      outline: 1px solid var(--btn-bg);
    }

    .footer-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .voice-btn {
      background: #27272a;
      border: 1px solid #3f3f46;
      color: #e4e4e7;
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .voice-btn.active {
      background: #ef444433;
      border-color: #ef4444;
      color: #fca5a5;
    }

    .submit-btn {
      background: var(--btn-bg);
      color: var(--btn-fg);
      border: none;
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    }

    .submit-btn:hover {
      background: var(--btn-hover);
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <span style="font-weight: 600; font-size: 13px;">🤖 Santiago Assistant</span>
    <div class="status-indicator">
      <span class="dot"></span>
      <span>Daemon :34820</span>
    </div>
  </div>

  <div class="chat-scroll" id="chatList">
    <div class="msg-card msg-assistant">
      <strong>Santiago Sovereign Agent</strong>
      <p>I am connected directly to your local micro-daemons swarm. Highlight code in the editor for instant explanation, refactoring, or test synthesis.</p>
    </div>
  </div>

  <div class="input-panel">
    <div class="textarea-wrapper">
      <textarea id="chatInput" placeholder="Ask Santiago or command the swarm..."></textarea>
    </div>
    <div class="footer-actions">
      <button class="voice-btn" id="voiceToggle">
        🎙️ <span>Whisper.cpp</span>
      </button>
      <button class="submit-btn" id="sendBtn">Send</button>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const chatList = document.getElementById('chatList');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceToggle = document.getElementById('voiceToggle');

    let currentStreamCard = null;

    sendBtn.addEventListener('click', send);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });

    function send() {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage('user', text);
      chatInput.value = '';
      vscode.postMessage({ type: 'sendMessage', text });
    }

    function appendMessage(role, content) {
      const card = document.createElement('div');
      card.className = 'msg-card msg-' + role;

      if (role === 'assistant') {
        renderMarkdownWithButtons(card, content);
      } else {
        card.textContent = content;
      }

      chatList.appendChild(card);
      chatList.scrollTop = chatList.scrollHeight;
      return card;
    }

    function renderMarkdownWithButtons(container, text) {
      // Basic block parser for demonstration inside webview
      const codeRegex = /\`\`\`([a-zA-Z0-9_-]*)\\n([\\s\\S]*?)\`\`\`/g;
      let lastIndex = 0;
      let match;

      while ((match = codeRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          const textChunk = document.createElement('p');
          textChunk.textContent = text.slice(lastIndex, match.index);
          container.appendChild(textChunk);
        }

        const lang = match[1] || 'code';
        const code = match[2];

        const box = document.createElement('div');
        box.className = 'code-box';

        const top = document.createElement('div');
        top.className = 'code-top';
        top.innerHTML = \`<span>\${lang}</span>\`;

        const actions = document.createElement('div');
        actions.className = 'actions-group';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-action';
        copyBtn.innerHTML = '📋 Copy';
        copyBtn.onclick = () => vscode.postMessage({ type: 'copyToClipboard', code });

        const insertBtn = document.createElement('button');
        insertBtn.className = 'btn-action';
        insertBtn.innerHTML = '⚡ Insert at Cursor';
        insertBtn.onclick = () => vscode.postMessage({ type: 'insertAtCursor', code });

        actions.appendChild(copyBtn);
        actions.appendChild(insertBtn);
        top.appendChild(actions);

        const pre = document.createElement('pre');
        const codeEl = document.createElement('code');
        codeEl.textContent = code;
        pre.appendChild(codeEl);

        box.appendChild(top);
        box.appendChild(pre);
        container.appendChild(box);

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        const trailing = document.createElement('p');
        trailing.textContent = text.slice(lastIndex);
        container.appendChild(trailing);
      }
    }

    window.addEventListener('message', (event) => {
      const msg = event.data;
      switch (msg.type) {
        case 'appendMessage':
          appendMessage(msg.role, msg.content);
          break;
        case 'startStreamResponse':
          currentStreamCard = document.createElement('div');
          currentStreamCard.className = 'msg-card msg-assistant';
          chatList.appendChild(currentStreamCard);
          break;
        case 'streamChunk':
          if (currentStreamCard) {
            currentStreamCard.textContent += msg.chunk;
            chatList.scrollTop = chatList.scrollHeight;
          }
          break;
        case 'endStreamResponse':
          if (currentStreamCard) {
            const raw = currentStreamCard.textContent;
            currentStreamCard.innerHTML = '';
            renderMarkdownWithButtons(currentStreamCard, raw);
            currentStreamCard = null;
          }
          break;
      }
    });
  </script>
</body>
</html>`
  },
  {
    path: 'src/services/gatewayClient.ts',
    title: 'Micro-Daemons Swarm Client',
    description: 'Enterprise HTTP client communicating with ports 34820-34823 with health checker and streaming SSE',
    language: 'typescript',
    content: `import * as vscode from 'vscode';

export interface DaemonConfig {
  gatewayUrl: string; // :34820
  ragUrl: string;     // :34821
  runnerUrl: string;  // :34822
  vaultUrl: string;   // :34823
}

export interface AutocompletePayload {
  prefix: string;
  suffix: string;
  language: string;
  filePath: string;
  line: number;
  column: number;
}

export interface AutocompleteResult {
  completion: string;
  latencyMs: number;
  model: string;
}

export interface SwarmHealthResult {
  allHealthy: boolean;
  latencyMs: number;
  statusSummary: string;
  daemons: {
    gateway: boolean;
    rag: boolean;
    runner: boolean;
    vault: boolean;
  };
}

export class GatewayClient {
  constructor(private readonly config: DaemonConfig) {}

  /**
   * Sovereign Inline Autocomplete (Ghost Text)
   * Sends code context to http://localhost:34820/api/v1/autocomplete
   */
  public async getInlineCompletion(
    payload: AutocompletePayload,
    cancellationToken?: vscode.CancellationToken
  ): Promise<AutocompleteResult | null> {
    const controller = new AbortController();
    if (cancellationToken) {
      cancellationToken.onCancellationRequested(() => controller.abort());
    }

    const timeout = setTimeout(() => controller.abort(), 800);

    try {
      const response = await fetch(\`\${this.config.gatewayUrl}/api/v1/autocomplete\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': 'santiago-vscode-extension'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        completion: data.completion || '',
        latencyMs: data.latencyMs || 45,
        model: data.model || 'santiago-ghost-v1'
      };
    } catch (error) {
      clearTimeout(timeout);
      return null;
    }
  }

  /**
   * Stream Chat response from Gateway
   */
  public async streamChat(options: {
    message: string;
    context?: any;
    onChunk: (chunk: string) => void;
  }): Promise<void> {
    const response = await fetch(\`\${this.config.gatewayUrl}/api/v1/chat\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: options.message,
        context: options.context,
        stream: true
      })
    });

    if (!response.ok || !response.body) {
      throw new Error(\`Gateway returned HTTP \${response.status}\`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      options.onChunk(chunk);
    }
  }

  /**
   * Query Semantic Search & Indexing (RAG Engine :34821)
   */
  public async searchRag(query: string): Promise<any[]> {
    try {
      const response = await fetch(\`\${this.config.ragUrl}/api/v1/search\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 5 })
      });
      if (!response.ok) return [];
      const json = await response.json();
      return json.results || [];
    } catch {
      return [];
    }
  }

  /**
   * Execute shell / script command via Runner Daemon (:34822)
   */
  public async runCommand(command: string): Promise<string> {
    try {
      const response = await fetch(\`\${this.config.runnerUrl}/api/v1/execute\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await response.json();
      return data.output || data.error || 'Execution finished.';
    } catch (err: any) {
      return \`Failed to connect to Runner: \${err.message}\`;
    }
  }

  /**
   * Health status check across all 4 micro-daemons
   */
  public async checkHealth(): Promise<SwarmHealthResult> {
    const startTime = Date.now();

    const checkPort = async (url: string) => {
      try {
        const res = await fetch(\`\${url}/health\`, {
          method: 'GET',
          signal: AbortSignal.timeout(1200)
        });
        return res.ok;
      } catch {
        return false;
      }
    };

    const [gw, rag, run, vault] = await Promise.all([
      checkPort(this.config.gatewayUrl),
      checkPort(this.config.ragUrl),
      checkPort(this.config.runnerUrl),
      checkPort(this.config.vaultUrl),
    ]);

    const elapsed = Date.now() - startTime;
    const allHealthy = gw && rag && run && vault;

    const summaryParts: string[] = [];
    if (!gw) summaryParts.push('Gateway (:34820) down');
    if (!rag) summaryParts.push('RAG (:34821) down');
    if (!run) summaryParts.push('Runner (:34822) down');
    if (!vault) summaryParts.push('Vault (:34823) down');

    return {
      allHealthy,
      latencyMs: elapsed,
      statusSummary: summaryParts.length > 0 ? summaryParts.join(', ') : 'All 4 Daemons Operational',
      daemons: {
        gateway: gw,
        rag,
        runner: run,
        vault,
      }
    };
  }
}`
  },
  {
    path: 'tsconfig.json',
    title: 'TypeScript Configuration',
    description: 'Extension build configuration for compiling to CommonJS/ESNext for VS Code runtime',
    language: 'json',
    content: `{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "dist",
    "lib": ["ES2022"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", ".vscode-test"]
}`
  },
  {
    path: 'README.md',
    title: 'Compilation & Installation Guide',
    description: 'Step-by-step instructions to compile, package with vsce, and run the Santiago Agent extension',
    language: 'markdown',
    content: `# 🤖 Santiago Agent — Sovereign Local-First Enterprise AI Extension

Santiago Agent is a production-ready VS Code Extension connecting directly to 4 sovereign Go micro-daemons running on localhost:
- **Gateway (API Orchestrator & AI Engine):** \`http://localhost:34820\`
- **RAG Engine (Semantic Search & Indexing):** \`http://localhost:34821\`
- **Runner Daemon (Command Execution):** \`http://localhost:34822\`
- **Vault Daemon (Encrypted State):** \`http://localhost:34823\`

---

## 🛠️ Build and Packaging Instructions

### 1. Prerequisites
- Node.js 18+ and npm
- VS Code 1.85.0+
- Visual Studio Code Extension Manager (\`vsce\`):
  \`\`\`bash
  npm install -g @vscode/vsce
  \`\`\`

### 2. Install Dependencies & Compile
\`\`\`bash
npm install
npm run compile
\`\`\`

### 3. Package as .vsix
\`\`\`bash
vsce package
# Outputs: santiago-agent-1.0.0.vsix
\`\`\`

### 4. Install into VS Code
\`\`\`bash
code --install-extension santiago-agent-1.0.0.vsix
\`\`\`

---

## 🚀 Key Features
1. **Sovereign Ghost-Text Inline Autocomplete**: Sub-100ms debounced keystroke inference using \`vscode.InlineCompletionItemProvider\` sending context to \`POST :34820/api/v1/autocomplete\`.
2. **Santiago AI Assistant Sidebar**: Activity Bar webview with live chat, code snippet copy, and "Insert at Cursor" actions.
3. **Contextual Editor Right-Click Actions**:
   - Santiago: Explain Code
   - Santiago: Refactor
   - Santiago: Generate Unit Tests
4. **Swarm Health Status Bar**: Polls every 10 seconds, showing live green/red daemon swarm health status.`
  }
];
