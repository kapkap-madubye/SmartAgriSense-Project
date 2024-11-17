import React, { useState } from 'react';
import { View, Image, StyleSheet, useWindowDimensions, ScrollView, Text, ActivityIndicator, } from 'react-native';
import image from '../../assets/images/plantImage.jpg';
import CustomInput from '../customs/CustomInput/CustomInput';
import CustomButton from '../customs/CustomButton/CustomButton';
import SocialSignInButtons from '../customs/SocialSignInButtons/SocialSignInButtons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Data/Firebase';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); // New state variable for loading animation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const onSignInPressed = async () => {
    if (email.trim() === '' || password.trim() === '') {
      setEmailError(email.trim() === '' ? 'Email is required' : '');
      setPasswordError(password.trim() === '' ? 'Password is required' : '');
      return;
    }

    setIsLoading(true); // Start loading animation

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      navigation.navigate('tabContainer');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorMessage);
    }

    setIsLoading(false); // Stop loading animation
  };

  const onEmailChange = (text) => {
    setEmail(text);
    setEmailError(''); // Clear email error when the user starts typing
  };

  const onPasswordChange = (text) => {
    setPassword(text);
    setPasswordError(''); // Clear password error when the user starts typing
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('forgotPasswordScreen');
  };

  const onSignUpPress = () => {
    navigation.navigate('signUpScreen');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={image}
          style={[styles.image, { height: height * 0.3 }]}
          resizeMode="cover"
        />

        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <CustomInput
          placeholder="Email"
          value={email}
          setValue={onEmailChange}
          error={emailError}
        />

        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={onPasswordChange}
          secureTextEntry
          error={passwordError}
        />

        <CustomButton text="Sign In" onPress={onSignInPressed} />

        {isLoading && <ActivityIndicator size="large" color="#051C60" />}

        <CustomButton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <SocialSignInButtons />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
    marginTop: 20,
  },
  image: {
    width: '100%',
    marginTop: 40,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginLeft: 5,
  },
});

export default SignInScreen;
