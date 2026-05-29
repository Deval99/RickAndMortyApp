import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { DatabaseService } from './src/database/DatabaseService';
import { AppNavigator } from './src/navigation/AppNavigator';
import { loadFavourites, store } from './src/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    DatabaseService.initDatabase()
      .then(() => store.dispatch(loadFavourites()))
      .catch(error =>
        console.error('Failed to initialise database:', error),
      );
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
