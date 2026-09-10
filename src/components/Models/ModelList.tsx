import { ActionButton, Flex, Heading, Text, View } from '@adobe/react-spectrum'
import { ModelEntity } from '../../models/ModelEntity'

interface ModelListProps {
  models: ModelEntity[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export const ModelList = ({ models, selectedId, onSelect }: ModelListProps) => {
  if (models.length === 0) {
    return (
      <View UNSAFE_className="panel-card">
        <Text>No models match your current search and filter settings.</Text>
      </View>
    )
  }

  return (
    <Flex direction="column" gap="size-150">
      {models.map((model, index) => {
        const selected = model.id === selectedId

        return (
          <View
            key={`${model.id}-${index}`}
            UNSAFE_className={`model-card ${selected ? 'selected' : ''}`}
          >
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap="size-200"
            >
              <Flex direction="column" gap="size-50">
                <Heading level={3}>{model.name}</Heading>
                <Text>Family: {model.family}</Text>
                <Text>Pipeline: {model.pipeline}</Text>
                <Text>Architecture: {model.architecture}</Text>
                <Text>Weight: {model.weight}</Text>
                <Text>Safetensor files: {model.safetensorCount}</Text>
              </Flex>

              <ActionButton
                isQuiet={!selected}
                onPress={() => {
                  onSelect(model.id)
                }}
              >
                {selected ? 'Selected' : 'Select'}
              </ActionButton>
            </Flex>
          </View>
        )
      })}
    </Flex>
  )
}
