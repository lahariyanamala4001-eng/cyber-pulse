// WebSocket Service
// Placeholder for FastAPI WebSocket integration
// Connect to: ws://your-backend/ws/notifications?token=JWT_TOKEN

export type NotificationHandler = (data: unknown) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: NotificationHandler[] = [];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnected = false;

  /**
   * Connect to the WebSocket server.
   * TODO: Replace MOCK_URL with real FastAPI WebSocket endpoint.
   */
  connect(token: string): void {
    // TODO: Uncomment when backend is ready
    // const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    // this.ws = new WebSocket(`${WS_URL}/ws/notifications?token=${token}`);
    // this.ws.onopen = () => { this.isConnected = true; };
    // this.ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   this.handlers.forEach((h) => h(data));
    // };
    // this.ws.onclose = () => {
    //   this.isConnected = false;
    //   this.reconnectTimer = setTimeout(() => this.connect(token), 5000);
    // };
    // this.ws.onerror = (err) => console.error('WS error', err);

    // Mock: Simulate receiving a notification after 3 seconds
    void token;
    this.isConnected = true;
    console.info('[WebSocket] Mock WebSocket connected. Ready for FastAPI integration.');
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  onNotification(handler: NotificationHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const wsService = new WebSocketService();
