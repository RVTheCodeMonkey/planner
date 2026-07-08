import { useEffect, useState } from 'react'
import Dexie from 'dexie'

export function useLiveQuery<T>(querier: () => T | Promise<T>, deps: unknown[] = []): T | undefined {
  const [result, setResult] = useState<T | undefined>(undefined)

  useEffect(() => {
    const observable = Dexie.liveQuery(querier)
    const subscription = observable.subscribe({
      next: (value) => setResult(value as T),
      error: () => {},
    })
    return () => subscription.unsubscribe()
  }, deps)

  return result
}
