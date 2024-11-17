import React from "react";
import { View, Text } from "react-native";
import CustomButton from "../CustomButton";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const SocialSignInButtons = () => {
  const onSignInGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    try {
      // Sign in with the Google provider using a popup
      const result = await signInWithPopup(auth, provider);
  
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
  
      // The signed-in user info.
      const user = result.user;
  
      // Additional user info from the result
      const additionalUserInfo = result.additionalUserInfo;
  
      if (additionalUserInfo) {
        // Check if the user is new or existing
        const isNewUser = additionalUserInfo.isNewUser;
        if (isNewUser) {
          console.log("New user signed in with Google.");
        } else {
          console.log("Existing user signed in with Google.");
        }
      }
  
      // Display user's profile information
      console.log("User Profile:", user.displayName, user.email, user.photoURL);
  
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
  
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <>
      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      />
    </>
  );
};

export default SocialSignInButtons;
