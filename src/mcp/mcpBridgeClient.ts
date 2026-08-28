import { executeMcpTool } from './mcpTools';
import { useDocumentStore } from '../store/useDocumentStore';
import { useProjectStore } from '../store/useProjectStore';

export class McpBridgeClient {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private reconnectTimer: any = null;
  private url = 'ws://127.0.0.1:4040';

  constructor() {
    this.connect();
  }

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.isConnected = true;
        if (this.reconnectTimer) {
          clearInterval(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.socket.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'tool_call' && msg.tool) {
            const document = useDocumentStore.getState().document;
            const activePageId = useDocumentStore.getState().activePageId;

            if (!document) {
              this.sendResponse(msg.id, { success: false, error: 'No active document loaded in editor' });
              return;
            }

            // Execute the tool against current document
            const result = executeMcpTool(msg.tool, msg.args || {}, document, activePageId);

            // If changes occurred, commit to document store & autosave
            if (result.success && result.changes && result.changes.length > 0) {
              useDocumentStore.setState({ document: { ...document } });
              await useProjectStore.getState().saveCurrentProject(document);
            }

            this.sendResponse(msg.id, result);
          }
        } catch (err: any) {
          // ignore error
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.isConnected = false;
      };
    } catch (e) {
      this.isConnected = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setInterval(() => {
        this.connect();
      }, 5000);
    }
  }

  private sendResponse(id: string, result: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'response',
        id,
        result
      }));
    }
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      url: this.url
    };
  }
}

// Global singleton instance
export const mcpBridgeClient = new McpBridgeClient();
