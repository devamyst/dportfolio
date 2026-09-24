"use client";

import { useEffect, useRef, useState } from "react";
import { DISCORD_USER_ID, fetchLanyard, type LanyardData } from "@/lib/lanyard";

export function useLanyard(): { data: LanyardData | null; loading: boolean } {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    fetchLanyard().then((initial) => {
      if (cancelled) return;
      if (initial) setData(initial);
      setLoading(false);
    });

    function startPolling() {
      if (pollRef.current) return;
      pollRef.current = setInterval(async () => {
        const fresh = await fetchLanyard();
        if (!cancelled && fresh) {
          setData(fresh);
          setLoading(false);
        }
      }, 20000);
    }

    function connect() {
      if (cancelled) return;
      const ws = new WebSocket("wss://api.lanyard.rest/socket");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.op === 1) {
          const interval = msg.d.heartbeat_interval;
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
          heartbeatRef.current = setInterval(() => {
            ws.send(JSON.stringify({ op: 3 }));
          }, interval);
        } else if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
          if (!cancelled) {
            setData(msg.d as LanyardData);
            setLoading(false);
          }
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      };

      ws.onclose = () => {
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        if (cancelled) return;
        attemptsRef.current += 1;
        if (attemptsRef.current >= 3) startPolling();
        const delay = Math.min(1000 * 2 ** attemptsRef.current, 30000);
        reconnectRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      cancelled = true;
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
      wsRef.current?.close();
    };
  }, []);

  return { data, loading };
}
