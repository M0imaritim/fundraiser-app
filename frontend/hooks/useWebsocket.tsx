// hooks/useWebsocket.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  type: string;
  data: any;
}

interface UseWebsocketReturn {
  messages: { [key: string]: any };
  subscribe: (type: string, callback: (data: any) => void) => void;
  sendMessage: (message: Message) => void;
}

export function useWebsocket(): UseWebsocketReturn {
  const [messages, setMessages] = useState<{ [key: string]: any }>({});
  const wsRef = useRef<WebSocket | null>(null);
  const callbacksRef = useRef<{ [type: string]: ((data: any) => void)[] }>({});

  useEffect(() => {
    // TODO: Replace with actual WebSocket URL from backend
    wsRef.current = new WebSocket("ws://localhost:8080"); // Placeholder

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data);
      setMessages((prev) => ({ ...prev, [msg.type]: msg.data }));
      callbacksRef.current[msg.type]?.forEach((cb) => cb(msg.data));
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const subscribe = (type: string, callback: (data: any) => void) => {
    if (!callbacksRef.current[type]) {
      callbacksRef.current[type] = [];
    }
    callbacksRef.current[type].push(callback);
  };

  const sendMessage = (message: Message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { messages, subscribe, sendMessage };
}
