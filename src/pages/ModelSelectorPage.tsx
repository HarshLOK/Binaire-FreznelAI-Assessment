import {
  Divider,
  Flex,
  Heading,
  ProgressCircle,
  StatusLight,
  Text,
  View,
} from '@adobe/react-spectrum'
import { useMemo, useState } from 'react'
import { AuthPanel } from '../components/Auth/AuthPanel'
import { FilterPanel } from '../components/Filters/FilterPanel'
import { AppShell } from '../components/Layout/AppShell'
import { ModelList } from '../components/Models/ModelList'
import { SearchBar } from '../components/Search/SearchBar'
import { SortControls } from '../components/Sorting/SortControls'
import { ModelFilterEngine } from '../filters/ModelFilterEngine'
import { useAuth } from '../hooks/useAuth'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useModelData } from '../hooks/useModelData'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useThrottledValue } from '../hooks/useThrottledValue'
import { ModelSearchEngine } from '../search/ModelSearchEngine'
import { ModelSorter } from '../sorting/ModelSorter'
import type { ModelFilterCriteria, ModelSortOption } from '../types/model'

const defaultCriteria: ModelFilterCriteria = {
  pipeline: 'all',
  family: 'all',
  architecture: 'all',
  weight: 'all',
  safetensorMin: 0,
  safetensorMax: 99_999,
}

const uniqueSorted = (values: string[]): string[] => {
  return Array.from(new Set(values.filter(Boolean))).sort((left, right) =>
    left.localeCompare(right),
  )
}

export const ModelSelectorPage = () => {
  const online = useOnlineStatus()
  const { endpoint, models, loading, error, source, lastSync } = useModelData()
  const { user, firebaseEnabled, loading: authLoading, error: authError, login, signup, logout } =
    useAuth()

  const [rawQuery, setRawQuery] = useState('')
  const [criteria, setCriteria] = useState<ModelFilterCriteria>(defaultCriteria)
  const [sort, setSort] = useState<ModelSortOption>('SAFETENSOR_DESC')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const debouncedQuery = useDebouncedValue(rawQuery, 350)
  const throttledQuery = useThrottledValue(debouncedQuery, 250)

  const searchEngine = useMemo(() => new ModelSearchEngine(), [])
  const filterEngine = useMemo(() => new ModelFilterEngine(), [])
  const sorter = useMemo(() => new ModelSorter(), [])

  const pipelines = useMemo(
    () => uniqueSorted(models.map((model) => model.pipeline)),
    [models],
  )
  const families = useMemo(
    () => uniqueSorted(models.map((model) => model.family)),
    [models],
  )
  const architectures = useMemo(
    () => uniqueSorted(models.map((model) => model.architecture)),
    [models],
  )
  const weights = useMemo(
    () => uniqueSorted(models.map((model) => model.weight)),
    [models],
  )

  const visibleModels = useMemo(() => {
    const searched = searchEngine.search(models, debouncedQuery)
    const filtered = filterEngine.filter(searched, criteria)
    return sorter.sort(filtered, sort)
  }, [criteria, debouncedQuery, models, searchEngine, filterEngine, sorter, sort])

  return (
    <AppShell>
      <AuthPanel
        user={user}
        loading={authLoading}
        firebaseEnabled={firebaseEnabled}
        error={authError}
        onLogin={login}
        onSignup={signup}
        onLogout={logout}
      />

      <View UNSAFE_className="panel-card">
        <Flex direction="row" alignItems="center" justifyContent="space-between" wrap gap="size-200">
          <StatusLight variant={online ? 'positive' : 'negative'}>
            {online ? 'Online' : 'Offline'}
          </StatusLight>
          <Text>Data source: {source}</Text>
          <Text>Endpoint: {endpoint}</Text>
          <Text>Last sync: {lastSync ?? 'not yet synced'}</Text>
        </Flex>
      </View>

      <SearchBar value={rawQuery} onChange={setRawQuery} />

      <FilterPanel
        criteria={criteria}
        pipelines={pipelines}
        families={families}
        architectures={architectures}
        weights={weights}
        onChange={setCriteria}
      />

      <SortControls sort={sort} onChange={setSort} />

      <View UNSAFE_className="panel-card">
        <Flex direction="row" justifyContent="space-between" alignItems="center" gap="size-200" wrap>
          <Heading level={3}>Visible models: {visibleModels.length}</Heading>
          <Text>Applied query (debounced + throttled): {throttledQuery || 'none'}</Text>
          <Text>Selected model: {selectedId ?? 'none'}</Text>
        </Flex>
      </View>

      <Divider size="S" />

      {loading ? (
        <View UNSAFE_className="panel-card">
          <Flex direction="row" alignItems="center" gap="size-200">
            <ProgressCircle aria-label="Loading models" isIndeterminate />
            <Text>Loading model data...</Text>
          </Flex>
        </View>
      ) : null}

      {error ? (
        <View UNSAFE_className="panel-card">
          <Text UNSAFE_className="error-text">Failed to load models: {error}</Text>
        </View>
      ) : null}

      <ModelList models={visibleModels} selectedId={selectedId} onSelect={setSelectedId} />
    </AppShell>
  )
}
