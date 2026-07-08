import { useEffect, useRef } from 'react'

function wsUrl() {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/ws`
}

export function useRealtimeSync(onChange: () => void) {
  const ref = useRef(onChange)
  ref.current = onChange

  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    function connect() {
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return
      ws = new WebSocket(wsUrl())

      ws.onmessage = () => {
        ref.current()
      }

      ws.onopen = () => console.log('WS connected')

      ws.onerror = () => ws?.close()

      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [])
}
