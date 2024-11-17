import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  Modal,
  useColorScheme,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import PasswordVerificationModal from "../customs/Validations/PasswordVerificationModal";
import {
  getAuth,
  reauthenticateWithCredential,
  deleteUser,
  EmailAuthProvider,
} from "firebase/auth";
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
import {
  storage,
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

import { useNavigation } from "expo-router";

const Settings = () => {
  // const colorScheme = useColorScheme(); // Get the current color scheme (light or dark)

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [firstname, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePictureURI, setProfilePictureURI] = useState(null);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSecuritySettings = () => {
    navigation.navigate("SecuritySettings");
  };

  const handleTermsandConditions = () => {
    navigation.navigate("termsandConditions");
  };

  const handlePrivacy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleAboutpage = () => {
    navigation.navigate("Aboutpage");
  };

  const handleAccessibility = () => {
    navigation.navigate("Accessibility");
  };

  const handlePersonalDetails = () => {
    navigation.navigate("PersonalDetails");
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const auth = getAuth();

  const onLogout = () => {
    auth.signOut();
    const onSignUpPress = () => {
      navigation.navigate("signInScreen");
    };
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to handle updating user details
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

  // Function to handle selecting a new profile picture from the camera roll
  const pickProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const uploadURL = await uploadProfilePicture(result.assets[0].uri);
      setImage(uploadURL);
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setImage(null);
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const uploadProfilePicture = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(storage, `Images/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);

      // Close the blob
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; // Return null in case of error
    }
  };

  // Use useEffect to handle profile picture selection only once when the component mounts
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

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
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profileContainer}>
        {/* <TouchableOpacity onPress={pickProfilePicture}>
          {image ? (
            <Image
              source={require("../../assets/images/defaultProfilePicture.png")}
              style={styles.profilePicture}
            />
          ) : (
            <>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={styles.profilePicture}
                />
              )}
            </>
          )}
          <Image source={require("../../assets/images/defaultProfilePicture.png")}
              style={styles.profilePicture}/> 
        </TouchableOpacity> */}
      </View>

      <View>
        <View style={styles.Divider}></View>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handlePersonalDetails}
        >
          <Text style={styles.settingsItemText}>Personal Details</Text>
          <Ionicons
            name="chevron-forward-outline"
            style={styles.icon}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handleSecuritySettings}
        >
          <Text style={styles.settingsItemText}>Security Settings</Text>
          <Ionicons
            name="chevron-forward-outline"
            style={styles.icon}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handleAccessibility}
        >
          <Text style={styles.settingsItemText}>Accessibility</Text>
          <Ionicons
            name="chevron-forward-outline"
            style={styles.icon}
            size={24}
          />
        </TouchableOpacity>

        <Text style={{ marginTop: 20, color: "grey", fontSize: 15 }}>More</Text>

        <TouchableOpacity style={styles.settingsItem} onPress={handleAboutpage}>
          <Text style={styles.MoreText}>About Us</Text>
          <Ionicons
            name="chevron-forward-outline"
            style={styles.icon}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handleTermsandConditions}
        >
          <Text style={styles.MoreText}>Terms and Conditions</Text>
          <Ionicons
            name="chevron-forward-outline"
            style={styles.icon}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem} onPress={handlePrivacy}>
          <Text style={styles.MoreText}>Privacy</Text>
          <Ionicons
            name="chevron-forward-outline"
            style={styles.icon}
            size={24}
          />
        </TouchableOpacity>

        <Text style={{ marginTop: 20, color: "grey", fontSize: 15 }}>
          Login
        </Text>
        <TouchableOpacity style={styles.Loginitem} onPress={onLogout}>
          <Text style={styles.Logout}>Log out {firstname} </Text>
          <Ionicons
            name="chevron-forward-outline"
            style={styles.icon}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  Divider: {
    width: 350,
    height: 2,
    backgroundColor: "#CACACA",
  },

  profileContainer: {
    width: "90%",
    marginTop: "5%",
    borderRadius: 12,
    alignItems: "center",

    paddingVertical: 20,
    marginBottom: 30,
  },
  InsideProfileContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  editButton: {
    backgroundColor: "#4caed9",

    marginTop: 20,
    borderRadius: 15,
    width: "25%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "lightblue",
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 100,
    width: "25%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    margin: 2,
    textAlign: "center",
  },
  icon: {
    color: "black",
  },
  personalDetail: {
    width: "90%",
    paddingVertical: "5%",
  },
  title: {
    margin: 8,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    flexDirection: "row",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "45%",
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "green",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ModalbuttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Modalbutton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },

  ModaldeleteButton: {
    backgroundColor: "red",
  },
  ModalbuttonText: {
    // color: "white",
    fontWeight: "bold",
  },
  MoreSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  MoreText: {
    marginTop: 10,
    color: "#000",
    fontSize: 15,
    fontWeight: 400,
  },
  settingsItemText: {
    fontSize: 16,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  Loginitem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  Logout: {
    color: "red",
    fontSize: 16,
    fontWeight: 400,
    marginTop: 10,
  },
});

export default Settings;
