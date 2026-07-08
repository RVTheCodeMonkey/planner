import { useEffect, useState } from 'react'

export function useLiveQuery<T>(query: () => Promise<T>, deps: unknown[] = []): T | undefined {
  const [result, setResult] = useState<T | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    query().then((data) => {
      if (!cancelled) setResult(data)
    })
    return () => { cancelled = true }
  }, deps)

  return result
}
