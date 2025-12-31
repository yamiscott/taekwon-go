import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import TheoryScreen from '../screens/TheoryScreen';
import RecordScreen from '../screens/RecordScreen';
import TrainingScreen from '../screens/TrainingScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'circle';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Theory') {
            iconName = 'book';
          } else if (route.name === 'Record') {
            iconName = 'check-square';
          } else if (route.name === 'Training') {
            iconName = 'soccer-ball-o';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Theory" component={TheoryScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="Training" component={TrainingScreen} />
    </Tab.Navigator>
  );
}
