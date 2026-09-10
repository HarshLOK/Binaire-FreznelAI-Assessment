import { Provider, defaultTheme, Flex, Heading, Text, View } from '@adobe/react-spectrum'
import type { PropsWithChildren } from 'react'

export const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <View UNSAFE_className="app-bg">
        <View UNSAFE_className="aurora" />
        <Flex direction="column" gap="size-250" UNSAFE_className="app-container">
          <Heading level={1}>Model Selection Utility</Heading>
          <Text>
            Search, filter, sort, and select AI models with offline-aware caching.
          </Text>
          {children}
        </Flex>
      </View>
    </Provider>
  )
}
