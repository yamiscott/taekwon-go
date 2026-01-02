import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import BottomTabs from './src/navigation/BottomTabs';
import AppHeader from './src/components/AppHeader';
import store, { persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { fetchCurrentUser, downloadSchoolLogo } from './src/store/slices/accountSlice';
import type { RootState, AppDispatch } from './src/store';

const paperTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#0066cc',
    secondary: '#888',
    // you can add more custom colors here for theming
  },
};

const Stack = createNativeStackNavigator();

function RootStack() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.account.token);
  const schoolLogoUrl = useSelector((state: RootState) => state.account.schoolLogoUrl);

  // Auto-fetch user data on app start if token exists
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token)).catch((err) => {
        console.log('Failed to fetch current user:', err);
      });
    }
  }, [token, dispatch]);

  // Download school logo when schoolLogoUrl is available
  useEffect(() => {
    if (schoolLogoUrl) {
      dispatch(downloadSchoolLogo(schoolLogoUrl));
    }
  }, [schoolLogoUrl, dispatch]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabs}
        options={{ header: () => <AppHeader /> }}
      />
      <Stack.Screen
        name="AccountModal"
        component={require('./src/screens/AccountScreen').default}
        options={{ presentation: 'modal', title: 'Account' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={paperTheme}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
}