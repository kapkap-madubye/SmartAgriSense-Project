import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, error, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry && !showPassword}
        autoCapitalize="none"
      />
      {secureTextEntry && (
        <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      )}
      {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    fontSize: 15,
  },
  showPasswordButton: {
    position: 'absolute',
    top: 12,
    right: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomInput;
