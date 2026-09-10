import { ModelEntity } from '../models/ModelEntity'
import type { ModelRecord } from '../types/model'

const asString = (value: unknown, fallback = 'unknown'): string => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return fallback
}

const asNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

const inferWeight = (input: unknown): string => {
  const source = asString(input, '')
  if (source) {
    return source
  }

  const numeric = asNumber(input)
  if (numeric >= 60_000_000_000) {
    return '60B+'
  }
  if (numeric >= 13_000_000_000) {
    return '13B-59B'
  }
  if (numeric >= 7_000_000_000) {
    return '7B-12B'
  }
  if (numeric > 0) {
    return '<7B'
  }

  return 'unknown'
}

const getSafetensorCount = (raw: Record<string, unknown>): number => {
  const direct = asNumber(raw.safetensorCount)
  if (direct > 0) {
    return direct
  }

  const nestedSafetensors =
    typeof raw.safetensors === 'object' && raw.safetensors !== null
      ? asNumber((raw.safetensors as Record<string, unknown>).total)
      : 0

  if (nestedSafetensors > 0) {
    return nestedSafetensors
  }

  const files = Array.isArray(raw.files) ? raw.files : []
  if (files.length > 0) {
    return files.filter((file) =>
      asString(file, '').toLowerCase().includes('.safetensors'),
    ).length
  }

  return 0
}

export const normalizeModel = (raw: Record<string, unknown>, index: number): ModelEntity => {
  const name = asString(raw.name ?? raw.model_name ?? raw.id, `model-${index}`)
  const family = asString(raw.family ?? raw.model_family, 'unknown')
  const pipeline = asString(raw.pipeline ?? raw.pipeline_tag ?? raw.task, 'unknown')
  const architecture = asString(raw.architecture ?? raw.base_model, 'unknown')
  const weight = inferWeight(raw.weight ?? raw.parameters ?? raw.parameter_count)
  const safetensorCount = getSafetensorCount(raw)

  const incomingTags = Array.isArray(raw.tags)
    ? raw.tags.map((tag) => asString(tag, '')).filter(Boolean)
    : []

  const record: ModelRecord = {
    id: asString(raw.id, `${name}-${index}`),
    name,
    family,
    pipeline,
    architecture,
    weight,
    safetensorCount,
    tags: Array.from(new Set([family, pipeline, architecture, ...incomingTags])),
  }

  return new ModelEntity(record)
}
