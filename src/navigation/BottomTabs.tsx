import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TheoryScreen from '../screens/TheoryScreen';
import RecordScreen from '../screens/RecordScreen';
import TrainingScreen from '../screens/TrainingScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Theory" component={TheoryScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="Training" component={TrainingScreen} />
    </Tab.Navigator>
  );
}
