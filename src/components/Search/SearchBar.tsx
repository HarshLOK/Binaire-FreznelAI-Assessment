import { SearchField, View } from '@adobe/react-spectrum'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <View UNSAFE_className="panel-card">
      <SearchField
        label="Search by model name or family"
        value={value}
        onChange={onChange}
        width="100%"
      />
    </View>
  )
}
