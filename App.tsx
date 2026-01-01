import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import BottomTabs from './src/navigation/BottomTabs';
import AppHeader from './src/components/AppHeader';
import store, { persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';

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