import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";
import {
  db,
  updateProfile,
  getDoc,
  doc,
  collection,
  updateDoc,
  deleteDoc,
  setDoc,
} from "../Data/Firebase";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PersonalDetailsScreen = () => {
  const [firstname, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  const auth = getAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const onUpdatePressed = async () => {
    const user = auth.currentUser;
    setShowDeleteConfirmation(false);
    if (user) {
      try {
        // Update user profile in Firebase Auth
        await updateProfile(user, {
          photoURL: profilePictureURI ? profilePictureURI.uri : user.photoURL,
        });

        // Checks firstName, lastName, and phoneNumber have valid values
        if (!firstname || !lastname || !phonenumber) {
          console.error("Please fill all required fields.");
          return;
        }

        // Update user details in Firestore using the collection method
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          firstname,
          lastname,
          phonenumber,
        });

        console.log("User profile and details updated successfully!");
      } catch (error) {
        console.error("Error updating user profile and details:", error);
      }
    }
  };

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData({ ...docSnap.data(), id: docSnap.id }); // Include the document ID in the user data
          setFirstName(docSnap.data().firstname);
          setLastName(docSnap.data().lastname);
          setPhoneNumber(docSnap.data().phoneNumber);
          setEmail(docSnap.data().email);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  return (
    <SafeAreaView edges={['top']}>
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back-outline" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.header}>Personal Details</Text>
      <Text style={styles.description}>
        Update your personal information below:
      </Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Cell Phone"
        value={phonenumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.saveButton} onPress={onUpdatePressed}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PersonalDetailsScreen;
