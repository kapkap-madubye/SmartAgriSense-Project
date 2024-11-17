import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import CustomInput from "../customs/CustomInput/CustomInput";
import CustomButton from "../customs/CustomButton/CustomButton";
import SocialSignInButtons from "../customs/SocialSignInButtons/SocialSignInButtons";
import { doc, setDoc } from "firebase/firestore"; // Import doc and setDoc functions
import { auth, db } from "../Data/Firebase"; // Make sure you have a consistent approach for importing auth and db
import "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "expo-router";
import validateForm from "../customs/Validations/formValidator";

const SignUpScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  // const [passwordRepeat, setPasswordRepeat] = useState('');

  const navigation = useNavigation();

  const onRegisterPressed = async () => {
    const { isValid, errors } = validateForm(
      email,
      password,
      firstname,
      lastName,
      phoneNumber
    );

    if (isValid) {
      setIsLoading(true);

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          firstname: firstname,
          lastname: lastName,
          email: email,
          phoneNumber: phoneNumber,
        });

        console.log("User data added to Firestore successfully!");
        navigation.navigate("tabContainer");
      } catch (error) {
        // Handle authentication errors
        if (error.code === "auth/email-already-in-use") {
          setEmailError("That email address is already in use!");
        } else if (error.code === "auth/invalid-email") {
          setEmailError("That email address is invalid!");
        } else if (error.code === "auth/weak-password") {
          setPasswordError("Password should be at least 6 characters long!");
        } else {
          console.error(error);
        }
      }

      setIsLoading(false);
    } else {
      // Display form validation errors
      setEmailError(errors.email || "");
      setPasswordError(errors.password || "");
      setFirstNameError(errors.firstname || "");
      setLastNameError(errors.lastName || "");
      setPhoneNumberError(errors.phoneNumber || "");
    }
  };

  const onEmailChange = (text) => {
    setEmail(text);
    setEmailError(""); // Clear email error when the user starts typing
  };

  // Clear error when the user starts typing
  const onPasswordChange = (text) => {
    setPassword(text);
    setPasswordError("");
  };

  const onFirstNameChange = (text) => {
    setFirstName(text);
    setFirstNameError("");
  };

  const onLastNameChange = (text) => {
    setLastName(text);
    setLastNameError("");
  };

  const onPhoneNumberChange = (text) => {
    setPhoneNumber(text);
    setPhoneNumberError("");
  };

  // const onRegisterPressed = () => {
  //   createUserWithEmailAndPassword(auth, email, password,)
  //     .then(async (userCredential) => {
  //       const user = userCredential.user;
  //       console.log(user);

  //       try {
  //         const docRef = await addDoc(collection(db, 'users'), {
  //           firstname: firstname,
  //           lastname: lastName,
  //           email: email,
  //           phoneNumber: phoneNumber,
  //         });
  //         console.error('Document written with ID: ', docRef.id);
  //         console.error('User data added to Firestore successfully!');
  //         navigation.navigate('tabContainer');
  //       } catch (e) {
  //         console.error('Error adding document: ', e);
  //       }
  //     })

  //     .catch((error) => {
  //       if (error.code === 'auth/email-already-in-use') {
  //         alert('That email address is already in use!');
  //       }

  //       if (error.code === 'auth/invalid-email') {
  //         alert('That email address is invalid!');
  //       }

  //       console.error(error);
  //     });
  // };

  const onSignInPress = () => {
    navigation.navigate("signInScreen");
  };

  const onTermsOfUsePressed = () => {
    navigation.navigate("termsandConditions");
  };

  

  const onPrivacyPressed = () => {
    navigation.navigate("PrivacyPolicy");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>
        
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <CustomInput
          placeholder="Email"
          value={email}
          setValue={onEmailChange}
          error={emailError}
        />
        
        {firstNameError ? (
          <Text style={styles.errorText}>{firstNameError}</Text>
        ) : null}
        <CustomInput
          placeholder="First Name"
          value={firstname}
          setValue={onFirstNameChange}
          error={emailError}
        />

        {lastNameError ? (
          <Text style={styles.errorText}>{lastNameError}</Text>
        ) : null}
        <CustomInput
          placeholder="Last Name"
          value={lastName}
          setValue={onLastNameChange}
          error={emailError}
        />

        {phoneNumberError ? (
          <Text style={styles.errorText}>{phoneNumberError}</Text>
        ) : null}
        <CustomInput
          placeholder="Phone Number"
          value={phoneNumber}
          setValue={onPhoneNumberChange}
          error={emailError}
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={onPasswordChange}
          secureTextEntry
          error={emailError}
        />
        
        {/* <CustomInput
          placeholder="Repeat Password"
          value={passwordRepeat}
          setValue={setPasswordRepeat}
          secureTextEntry
        /> */}

        <CustomButton text="Register" onPress={onRegisterPressed} />

        {isLoading && <ActivityIndicator size="large" color="#051C60" />}

        <Text style={styles.text}>
          By registering, you confirm that you accept our{" "}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy
          </Text>
        </Text>

        <SocialSignInButtons />

        <CustomButton
          text="Have an account? Sign in"
          onPress={onSignInPress}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
  text: {
    color: "gray",
    marginVertical: 10,
  },
  link: {
    color: "#FDB075",
  },
  errorText: {
    color: "red",
    marginLeft: 5,
  },
});

export default SignUpScreen;
