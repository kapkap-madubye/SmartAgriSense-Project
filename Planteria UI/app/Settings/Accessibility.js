import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Accessibility = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [systemDefault, setSystemDefault] = useState(true);

  const navigation = useNavigation();

  const handleDarkModeToggle = () => {
    if (systemDefault) {
      setSystemDefault(false);
    }
    setDarkMode(!darkMode);
  };

  const handleSystemDefaultToggle = () => {
    setSystemDefault(!systemDefault);
    if (!systemDefault) {
      setDarkMode(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F0F0" />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="chevron-back-outline" size={24} color="#333" />
        </TouchableOpacity>
      <Text style={styles.heading}>Accessibility Settings</Text>
      
      <View style={styles.setting}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={handleDarkModeToggle}
          disabled={systemDefault}
        />
      </View>
      <View style={styles.setting}>
        <Text style={styles.settingText}>System Default</Text>
        <Switch
          value={systemDefault}
          onValueChange={handleSystemDefaultToggle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingTop: StatusBar.currentHeight, // Adjust for notification bar
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingText: {
    fontSize: 16,
  },
  backIcon:{
    width:30,
    borderRadius:50,
    borderBottomColor:"lightblue",
    backgroundColor:"lightblue",
    
}, 
});

export default Accessibility;
