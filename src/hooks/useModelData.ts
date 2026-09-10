import { useEffect, useMemo, useState } from 'react'
import { ModelApi } from '../api/ModelApi'
import { ModelEntity } from '../models/ModelEntity'
import { SafeCache } from '../offline/SafeCache'

const REFRESH_MS = 60_000

type DataSource = 'network' | 'cache'

export const useModelData = () => {
  const endpoint =
    import.meta.env.VITE_MODELS_API_URL?.trim() || '/models.sample.json'

  const api = useMemo(() => new ModelApi(endpoint), [endpoint])
  const cache = useMemo(() => new SafeCache('freznel-models-cache-v1'), [])

  const [models, setModels] = useState<ModelEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<DataSource>('network')
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    const cached = cache.readModels()
    if (cached && cached.length > 0) {
      setModels(cached)
      setSource('cache')
      setLoading(false)
    }

    if (!navigator.onLine) {
      setLoading(false)
      return () => undefined
    }

    let mounted = true

    const fetchLive = () => {
      return api
        .fetchModels()
        .then((incoming) => {
          if (!mounted) {
            return
          }

          setModels(incoming)
          setSource('network')
          setLastSync(new Date().toISOString())
          setLoading(false)
          setError(null)
          cache.saveModels(incoming)
        })
        .catch((fetchError: Error) => {
          if (!mounted) {
            return
          }

          setLoading(false)
          setError(fetchError.message)
        })
    }

    fetchLive()

    const backgroundRefresh = window.setInterval(() => {
      if (!navigator.onLine) {
        return
      }

      api
        .fetchModelsWithPromises()
        .then((incoming) => {
          if (!mounted) {
            return
          }

          setModels(incoming)
          setSource('network')
          setLastSync(new Date().toISOString())
          setError(null)
          cache.saveModels(incoming)
        })
        .catch(() => {
          if (!mounted) {
            return
          }

          setSource((existing) => existing)
        })
    }, REFRESH_MS)

    const refreshOnReconnect = () => {
      fetchLive()
    }

    window.addEventListener('online', refreshOnReconnect)

    return () => {
      mounted = false
      window.clearInterval(backgroundRefresh)
      window.removeEventListener('online', refreshOnReconnect)
    }
  }, [api, cache])

  return {
    endpoint,
    models,
    loading,
    error,
    source,
    lastSync,
  }
}
