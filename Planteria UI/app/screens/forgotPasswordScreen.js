import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomInput from '../customs/CustomInput/CustomInput';
import CustomButton from '../customs/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Data/Firebase';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const navigation = useNavigation();

  const onSendPressed = () => {
    if (!email || !email.trim()) {
      setEmailError('Email is required');
    } else {
      // Send password reset email
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setEmailError(''); // Clear the error message if email is successfully sent
          navigation.navigate('signInScreen'); // Navigate back to SignInScreen or any other appropriate screen
        })
        .catch((error) => {
          setEmailError('Error sending email. Please check the email address and try again.');
          console.error(error);
        });
    }
  };

  const onSignInPress = () => {
    navigation.navigate('signInScreen');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>

        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <CustomButton text="Send" onPress={onSendPressed} />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginBottom: 10,
  },
});

export default ForgotPasswordScreen;
