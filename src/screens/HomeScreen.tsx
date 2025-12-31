import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../store/hooks';

export default function HomeScreen() {
  const account = useAppSelector((s) => s.account);

  const welcomeText = account.name ? `Welcome, ${account.name}!` : 'Welcome!';

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{welcomeText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
  },
});