import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';

import PlantData from '../tabs/plantData';
import Information from '../tabs/information';
import CameraScreen from '../tabs/camera';
import Graphs from '../tabs/graphs';
import Settings from '../tabs/settings';

const TabContainer = () => {
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();
  const Tab = createBottomTabNavigator(); 

  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'plantData') {
            iconName = 'leaf';
          } else if (route.name === 'information') {
            iconName = 'information-circle';
          } else if (route.name === 'camera') {
            iconName = 'camera';
            size += 20;
          } else if (route.name === 'Graphs') {
            iconName = 'analytics';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Ionicons name={iconName} size={30} color={color} style={route.name === 'camera' ? { marginTop: -5 } : {}} />;
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
        },
      })}
    >

      <Tab.Screen 
        component={PlantData}
        name="plantData"
        options={{ 
          headerShown: false,
          title: 'Plant Data',
        }} 
      />

      <Tab.Screen 
        component={Information}
        name="information"
        options={{ 
          headerShown: false,
          title: 'Information',
        }} 
      />

      <Tab.Screen 
        component={CameraScreen}
        name="camera"
        options={{ 
          headerShown: false,
          title: 'Camera',
        }} 
      />

      <Tab.Screen 
        component={Graphs}
        name="Graphs"
        options={{ 
          headerShown: false,
          title: 'Graphs',
        }} 
      />

      <Tab.Screen 
        component={Settings}
        name="Settings"
        options={{ 
          headerShown: false,
          title: 'Settings',
        }} 
      />

    </Tab.Navigator>
  )
}

export default TabContainer;
