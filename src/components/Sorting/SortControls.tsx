import { Item, Picker, View } from '@adobe/react-spectrum'
import type { ModelSortOption } from '../../types/model'

interface SortControlsProps {
  sort: ModelSortOption
  onChange: (sort: ModelSortOption) => void
}

export const SortControls = ({ sort, onChange }: SortControlsProps) => {
  return (
    <View UNSAFE_className="panel-card">
      <Picker
        label="Sort"
        selectedKey={sort}
        onSelectionChange={(key) => onChange(String(key) as ModelSortOption)}
      >
        <Item key="SAFETENSOR_DESC">Safetensor file count (high to low)</Item>
        <Item key="MODEL_NAME_ASC">Model name A-Z</Item>
        <Item key="MODEL_NAME_DESC">Model name Z-A</Item>
      </Picker>
    </View>
  )
}
