import { useEffect, useRef } from "react";
import { MAX_RECONNECT_ATTEMPTS, RECONNECT_INTERVAL } from "../utils/constants";

export const useWebSocket = (
  url: string,
  onMessage: (event: MessageEvent) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isUnmounted = false;

    const connect = () => {
      if (wsRef.current) wsRef.current.close();

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }

        console.log("WebSocket connection established");
        reconnectAttempts.current = 0; // reset counter on each successful connection
      };

      ws.onmessage = onMessage;

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed", event.code, event.reason);

        if (
          !event.wasClean &&
          reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS &&
          !isUnmounted
        ) {
          reconnectAttempts.current++;
          reconnectTimeout.current = setTimeout(connect, RECONNECT_INTERVAL);
        }
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      wsRef.current?.close();

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [url, onMessage]);
};
