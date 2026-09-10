import type { ModelRecord } from '../types/model'

export class ModelEntity {
  readonly id: string
  readonly name: string
  readonly family: string
  readonly pipeline: string
  readonly architecture: string
  readonly weight: string
  readonly safetensorCount: number
  readonly tags: string[]

  constructor(record: ModelRecord) {
    this.id = record.id
    this.name = record.name
    this.family = record.family
    this.pipeline = record.pipeline
    this.architecture = record.architecture
    this.weight = record.weight
    this.safetensorCount = record.safetensorCount
    this.tags = record.tags
  }

  toRecord(): ModelRecord {
    return {
      id: this.id,
      name: this.name,
      family: this.family,
      pipeline: this.pipeline,
      architecture: this.architecture,
      weight: this.weight,
      safetensorCount: this.safetensorCount,
      tags: this.tags,
    }
  }

  matchesQuery(query: string): boolean {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return true
    }

    const haystacks = [this.name, this.family, ...this.tags].map((value) =>
      value.toLowerCase(),
    )

    return haystacks.some((value) => value.includes(normalized))
  }
}
