import { ModelEntity } from '../models/ModelEntity'
import type { ModelFilterCriteria } from '../types/model'

export class ModelFilterEngine {
  filter(models: ModelEntity[], criteria: ModelFilterCriteria): ModelEntity[] {
    return models.filter((model) => {
      const pipelineMatch =
        criteria.pipeline === 'all' || model.pipeline === criteria.pipeline
      const familyMatch =
        criteria.family === 'all' || model.family === criteria.family
      const architectureMatch =
        criteria.architecture === 'all' || model.architecture === criteria.architecture
      const weightMatch = criteria.weight === 'all' || model.weight === criteria.weight
      const safetensorMinMatch = model.safetensorCount >= criteria.safetensorMin
      const safetensorMaxMatch = model.safetensorCount <= criteria.safetensorMax

      return (
        pipelineMatch &&
        familyMatch &&
        architectureMatch &&
        weightMatch &&
        safetensorMinMatch &&
        safetensorMaxMatch
      )
    })
  }
}
