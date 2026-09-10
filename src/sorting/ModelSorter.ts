import { ModelEntity } from '../models/ModelEntity'
import type { ModelSortOption } from '../types/model'

export class ModelSorter {
  sort(models: ModelEntity[], option: ModelSortOption): ModelEntity[] {
    const sorted = [...models]

    if (option === 'SAFETENSOR_DESC') {
      sorted.sort((left, right) => right.safetensorCount - left.safetensorCount)
      return sorted
    }

    if (option === 'MODEL_NAME_ASC') {
      sorted.sort((left, right) => left.name.localeCompare(right.name))
      return sorted
    }

    sorted.sort((left, right) => right.name.localeCompare(left.name))
    return sorted
  }
}
