import { ModelEntity } from '../models/ModelEntity'
import { normalizeModel } from '../utils/modelNormalize'

const MAX_DOWNLOAD_BYTES = 50_000_000

export class ModelApi {
  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async fetchModels(): Promise<ModelEntity[]> {
    const response = await fetch(this.endpoint)
    return this.handleResponse(response)
  }

  fetchModelsWithPromises(): Promise<ModelEntity[]> {
    return fetch(this.endpoint).then((response) => this.handleResponse(response))
  }

  private async handleResponse(response: Response): Promise<ModelEntity[]> {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const contentLength = response.headers.get('content-length')
    if (contentLength) {
      const bytes = Number(contentLength)
      if (Number.isFinite(bytes) && bytes > MAX_DOWNLOAD_BYTES) {
        throw new Error('Response is too large to process safely')
      }
    }

    const payloadText = await response.text()
    if (payloadText.length > MAX_DOWNLOAD_BYTES) {
      throw new Error('Downloaded JSON exceeds maximum safe size')
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(payloadText)
    } catch {
      throw new Error('Received corrupt JSON payload from API')
    }

    const collection = this.pickArray(parsed)
    return collection.map((item, index) =>
      normalizeModel(item as Record<string, unknown>, index),
    )
  }

  private pickArray(payload: unknown): unknown[] {
    if (Array.isArray(payload)) {
      return payload
    }

    if (payload && typeof payload === 'object') {
      const objectPayload = payload as Record<string, unknown>
      if (Array.isArray(objectPayload.models)) {
        return objectPayload.models
      }
      if (Array.isArray(objectPayload.data)) {
        return objectPayload.data
      }
    }

    throw new Error('API payload format is not a model array')
  }
}
