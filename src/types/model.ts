export interface ModelRecord {
  id: string
  name: string
  family: string
  pipeline: string
  architecture: string
  weight: string
  safetensorCount: number
  tags: string[]
}

export interface ModelFilterCriteria {
  pipeline: string
  family: string
  architecture: string
  weight: string
  safetensorMin: number
  safetensorMax: number
}

export type ModelSortOption =
  | 'SAFETENSOR_DESC'
  | 'MODEL_NAME_ASC'
  | 'MODEL_NAME_DESC'
