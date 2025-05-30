// app/_layout.tsx
import { AuthProvider } from '@/contexts/authContext'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Modals */}
        <Stack.Screen
          name="(modals)/profileModal"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="(modals)/walletModal"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="(modals)/transactionModal"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="(modals)/searchModal"
          options={{ presentation: 'modal' }}
        />

      </Stack>
    </AuthProvider>
  )
}
