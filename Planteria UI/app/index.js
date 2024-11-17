import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SignUpScreen from "./screens/signUpScreen";
import SignInScreen from "./screens/signInScreen";
import ForgotPasswordScreen from "./screens/forgotPasswordScreen";
import TabContainer from "./screens/tabContainer";
import ModelSecreen from "./screens/modelScreen";
import ResultsScreen from "./screens/apiResultsScreen";
import TermsAndConditionsScreen from "./customs/Terms&Conditions/Terms&Conditions";
import UserSecuritySettings from "./Security/UserSecuritySettings";
import AboutUs from "./Settings/AboutUs";
import PersonalDetailsScreen from "./Settings/PersonalDetails";
import Accessibility from "./Settings/Accessibility";
import PrivacyPolicyScreen from "./customs/Terms&Conditions/PrivacyPolicy";
import { createDrawerNavigator } from "@react-navigation/drawer";

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import PlantData from "./tabs/plantData";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function Page() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        setInitializing(false);
      } else {
        // User is signed out
        setUser(null);
        setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (initializing) return null;

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="tabContainer"
            component={TabContainer}
            options={{ headerShown: false }}
          />


          <Stack.Screen
            name="modelScreen"
            component={ModelSecreen}
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="resultsScreen"
            component={ResultsScreen}
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="PersonalDetails"
            component={PersonalDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="termsandConditions"
            component={TermsAndConditionsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SecuritySettings"
            component={UserSecuritySettings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Accessibility"
            component={Accessibility}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Aboutpage"
            component={AboutUs}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="signInScreen"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signUpScreen"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="forgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="termsandConditions"
            component={TermsAndConditionsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
