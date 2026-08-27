import React, { useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { ChigmaMcpServer } from '../../mcp/mcpServer';
import { MCP_TOOL_DEFINITIONS } from '../../mcp/mcpTools';
import { Server, Copy, Check, X, Play } from 'lucide-react';

interface McpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const McpModal: React.FC<McpModalProps> = ({ isOpen, onClose }) => {
  const document = useDocumentStore((s) => s.document);
  const activePageId = useDocumentStore((s) => s.activePageId);

  const [selectedTool, setSelectedTool] = useState(MCP_TOOL_DEFINITIONS[0].name);
  const [toolArgs, setToolArgs] = useState('{}');
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !document) return null;

  const server = new ChigmaMcpServer(document, activePageId);

  const handleExecute = () => {
    try {
      const parsedArgs = JSON.parse(toolArgs || '{}');
      const response = server.handleRequest({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: selectedTool,
          arguments: parsedArgs
        }
      });
      setToolOutput(JSON.stringify(response, null, 2));
    } catch (err: any) {
      setToolOutput(JSON.stringify({ error: err.message }, null, 2));
    }
  };

  const clientConfigJson = JSON.stringify(
    {
      mcpServers: {
        chigma: {
          command: 'node',
          args: ['node_modules/chigma/dist/mcp/server.js'],
          env: {}
        }
      }
    },
    null,
    2
  );

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(clientConfigJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Chigma Model Context Protocol (MCP) Server
              </h2>
              <p className="text-xs text-zinc-500">
                Standard 2026-07-28 JSON-RPC interface for Claude Code, Cursor, and AI agents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Status Bar */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              STATUS: READY
            </span>
            <span className="text-zinc-500">PROTOCOL: 2026-07-28</span>
            <span className="text-zinc-500">{MCP_TOOL_DEFINITIONS.length} TOOLS LOADED</span>
          </div>

          <button
            onClick={handleCopyConfig}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-[11px] font-semibold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Client Config
          </button>
        </div>

        {/* Tool Tester Interface */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tools List */}
          <div className="w-60 border-r border-zinc-100 dark:border-zinc-800 p-3 overflow-y-auto space-y-1 bg-zinc-50/50 dark:bg-zinc-950/30">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-2 px-2">
              Available Tools
            </span>
            {MCP_TOOL_DEFINITIONS.map((tool) => (
              <button
                key={tool.name}
                onClick={() => {
                  setSelectedTool(tool.name);
                  setToolOutput(null);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition ${
                  selectedTool === tool.name
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {tool.name}
              </button>
            ))}
          </div>

          {/* Execution & Output Console */}
          <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  Tool: {selectedTool}
                </span>
                <button
                  onClick={handleExecute}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Execute
                </button>
              </div>
              <p className="text-xs text-zinc-500 mb-2">
                {MCP_TOOL_DEFINITIONS.find((t) => t.name === selectedTool)?.description}
              </p>
              <textarea
                value={toolArgs}
                onChange={(e) => setToolArgs(e.target.value)}
                placeholder='Arguments JSON, e.g. {"nodeId": "node_123"}'
                rows={3}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs outline-none text-zinc-900 dark:text-zinc-100 focus:border-emerald-500"
              />
            </div>

            {/* Output Box */}
            <div className="flex-1 min-h-[140px] flex flex-col">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                JSON-RPC Response Output
              </span>
              <div className="flex-1 bg-zinc-950 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-auto border border-zinc-800 shadow-inner">
                {toolOutput ? (
                  <pre>{toolOutput}</pre>
                ) : (
                  <span className="text-zinc-600 italic">Click Execute to test tool response against canvas state</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
