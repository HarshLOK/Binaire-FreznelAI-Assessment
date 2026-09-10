import { ModelEntity } from '../models/ModelEntity'

export class ModelSearchEngine {
  search(models: ModelEntity[], query: string): ModelEntity[] {
    if (!query.trim()) {
      return models
    }

    return models.filter((model) => model.matchesQuery(query))
  }
}
