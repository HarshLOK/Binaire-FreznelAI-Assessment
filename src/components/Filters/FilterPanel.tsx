import { Flex, Item, NumberField, Picker, View } from '@adobe/react-spectrum'
import type { ModelFilterCriteria } from '../../types/model'

interface FilterPanelProps {
  criteria: ModelFilterCriteria
  pipelines: string[]
  families: string[]
  architectures: string[]
  weights: string[]
  onChange: (next: ModelFilterCriteria) => void
}

export const FilterPanel = ({
  criteria,
  pipelines,
  families,
  architectures,
  weights,
  onChange,
}: FilterPanelProps) => {
  const pipelineItems = ['all', ...pipelines].map((value) => ({
    id: value,
    label: value === 'all' ? 'All' : value,
  }))
  const familyItems = ['all', ...families].map((value) => ({
    id: value,
    label: value === 'all' ? 'All' : value,
  }))
  const architectureItems = ['all', ...architectures].map((value) => ({
    id: value,
    label: value === 'all' ? 'All' : value,
  }))
  const weightItems = ['all', ...weights].map((value) => ({
    id: value,
    label: value === 'all' ? 'All' : value,
  }))

  return (
    <View UNSAFE_className="panel-card">
      <Flex direction="column" gap="size-200">
        <Flex direction="row" wrap gap="size-200">
          <Picker
            label="Pipeline"
            items={pipelineItems}
            selectedKey={criteria.pipeline}
            onSelectionChange={(key) =>
              onChange({ ...criteria, pipeline: String(key ?? 'all') })
            }
          >
            {(item) => <Item key={item.id}>{item.label}</Item>}
          </Picker>

          <Picker
            label="Family"
            items={familyItems}
            selectedKey={criteria.family}
            onSelectionChange={(key) =>
              onChange({ ...criteria, family: String(key ?? 'all') })
            }
          >
            {(item) => <Item key={item.id}>{item.label}</Item>}
          </Picker>

          <Picker
            label="Architecture"
            items={architectureItems}
            selectedKey={criteria.architecture}
            onSelectionChange={(key) =>
              onChange({ ...criteria, architecture: String(key ?? 'all') })
            }
          >
            {(item) => <Item key={item.id}>{item.label}</Item>}
          </Picker>

          <Picker
            label="Weight"
            items={weightItems}
            selectedKey={criteria.weight}
            onSelectionChange={(key) =>
              onChange({ ...criteria, weight: String(key ?? 'all') })
            }
          >
            {(item) => <Item key={item.id}>{item.label}</Item>}
          </Picker>
        </Flex>

        <Flex direction="row" gap="size-200" wrap>
          <NumberField
            label="Safetensor min"
            value={criteria.safetensorMin}
            minValue={0}
            onChange={(value) =>
              onChange({ ...criteria, safetensorMin: Number(value ?? 0) })
            }
          />
          <NumberField
            label="Safetensor max"
            value={criteria.safetensorMax}
            minValue={0}
            onChange={(value) =>
              onChange({ ...criteria, safetensorMax: Number(value ?? 0) })
            }
          />
        </Flex>
      </Flex>
    </View>
  )
}
