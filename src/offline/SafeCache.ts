import { ModelEntity } from '../models/ModelEntity'
import { normalizeModel } from '../utils/modelNormalize'

interface CacheEnvelope {
  version: number
  checksum: number
  savedAt: string
  payload: unknown
}

export class SafeCache {
  private readonly storageKey: string
  private readonly maxBytes: number

  constructor(storageKey: string, maxBytes = 8_000_000) {
    this.storageKey = storageKey
    this.maxBytes = maxBytes
  }

  private checksum(input: string): number {
    let hash = 0
    for (let index = 0; index < input.length; index += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(index)
      hash |= 0
    }

    return hash
  }

  saveModels(models: ModelEntity[]): void {
    const payload = models.map((model) => model.toRecord())
    const payloadText = JSON.stringify(payload)

    if (payloadText.length > this.maxBytes) {
      return
    }

    const envelope: CacheEnvelope = {
      version: 1,
      checksum: this.checksum(payloadText),
      savedAt: new Date().toISOString(),
      payload,
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(envelope))
    } catch {
      localStorage.removeItem(this.storageKey)
    }
  }

  readModels(): ModelEntity[] | null {
    const value = localStorage.getItem(this.storageKey)
    if (!value) {
      return null
    }

    try {
      const envelope = JSON.parse(value) as CacheEnvelope
      const payloadText = JSON.stringify(envelope.payload)
      if (envelope.checksum !== this.checksum(payloadText)) {
        localStorage.removeItem(this.storageKey)
        return null
      }

      if (!Array.isArray(envelope.payload)) {
        localStorage.removeItem(this.storageKey)
        return null
      }

      return envelope.payload.map((raw, index) =>
        normalizeModel(raw as Record<string, unknown>, index),
      )
    } catch {
      localStorage.removeItem(this.storageKey)
      return null
    }
  }
}
