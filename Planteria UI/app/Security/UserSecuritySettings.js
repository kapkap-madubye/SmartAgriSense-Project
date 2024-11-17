import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, reauthenticateWithCredential } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail, EmailAuthProvider, updatePassword, deleteUser } from "firebase/auth";
import { useNavigation } from "expo-router";

const UserSecuritySettings = () => {
  const [showAccountRecovery, setShowAccountRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showAccountActivity, setShowAccountActivity] = useState(false);
  const [accountActivityLog, setAccountActivityLog] = useState([]);

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const [isRecoveryEmailValid, setIsRecoveryEmailValid] = useState(false);
  const [isChangePasswordValid, setIsChangePasswordValid] = useState(false);
  const [isDeletePasswordValid, setIsDeletePasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const navigation = useNavigation();
  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true); 
  };

  const confirmDeleteAccount = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && deletePassword) {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);

      reauthenticateWithCredential(user, credential)
        deleteUser(user).then(() => {
          navigation.navigate("signInScreen");
          console.log("Account deleted successfully.");
        })
        .catch((error) => {
          console.error("Error reauthenticating user for account deletion:", error);
        });
    } else {
      console.log("Please provide your current password to delete the account.");
    }

    
    setShowDeleteConfirmation(false);
  };

  const handleAccountRecovery = () => {
    const auth = getAuth();
    if (recoveryEmail) {
      sendPasswordResetEmail(auth, recoveryEmail)
        .then(() => {
          console.log(`Password reset link sent to ${recoveryEmail}`);
        })
        .catch((error) => {
          console.error("Error sending password reset email:", error);
        });
    } else {
      console.log("Please provide a valid email address for recovery.");
    }
  };

  const handleChangePassword = () => {
    const auth = getAuth();

    const user = auth.currentUser;

    if (user && currentPassword && newPassword) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, newPassword)
            .then(() => {
              console.log("Password updated successfully.");
            })
            .catch((error) => {
              console.error("Error updating password:", error);
            });
        })
        .catch((error) => {
          console.error("Error reauthenticating user:", error);
        });
    } else {
      console.log("Please provide current and new passwords.");
    }
  };

  const handleLoginActivity = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const now = new Date();
      const activityData = {
        action: "Login",
        timestamp: now.toISOString(),
        userId: user.uid,
      };

      addDoc(collection(db, "activityLogs"), activityData)
        .then(() => {
          console.log("Login activity logged.");
          fetchAccountActivityLog();
        })
        .catch((error) => {
          console.error("Error logging login activity:", error);
        });
    }
  };

  const fetchAccountActivityLog = async () => {
    try {
      const activitySnapshot = await getDocs(collection(db, "activityLogs"));
      const activityLogs = activitySnapshot.docs.map((doc) => doc.data());
      setAccountActivityLog(activityLogs);
    } catch (error) {
      console.error("Error fetching account activity logs:", error);
    }
  };

  const renderSection = (title, content, isExpanded, toggleDropdown) => {
    return (
      <View style={styles.dropdownSection}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={toggleDropdown}
        >
          <Text style={styles.dropdownHeaderText}>{title}</Text>
          <Ionicons
            name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
        {isExpanded && content()}
      </View>
    );
  };

  const renderAccountRecovery = () => {
    return (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter Recovery Email"
          value={recoveryEmail}
           onChangeText={(text) => {
            setRecoveryEmail(text);
            setIsRecoveryEmailValid(!!text); // only Enable button if text is not empty
          }}
        />
        <TouchableOpacity
           style={[
            styles.sendEmailButton,
            !isRecoveryEmailValid && styles.disabledButton,
          ]}
          onPress={handleAccountRecovery}
          disabled={!isRecoveryEmailValid}
        >
          <Text style={styles.sendEmailButtonText}>Send Recovery Email</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderChangePassword = () => {
    return (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          value={currentPassword}
          onChangeText={(text) => {
            setCurrentPassword(text);
            setIsChangePasswordValid(!!text && newPassword);
          }}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TouchableOpacity style={[
            styles.sendEmailButton,
            !isChangePasswordValid && styles.disabledButton,
          ]}
          onPress={handleChangePassword}
          disabled={!isChangePasswordValid}>
          <Text style={styles.sendEmailButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeleteAccount = () => {
    return (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter Current Password"
          value={deletePassword}
          onChangeText={(text) => {
            setDeletePassword(text);
            setIsDeletePasswordValid(!!text);
          }}
          secureTextEntry
        />
        <TouchableOpacity style={[
            styles.DeleteAccountButton,
            !isDeletePasswordValid && styles.disabledButton,
          ]}
          onPress={handleDeleteAccount}
          disabled={!isDeletePasswordValid}>
          <Text style={styles.sendEmailButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // const renderAccountActivity = () => {
  //   return (
  //     <View>
  //       {accountActivityLog.map((activity, index) => (
  //         <View key={index} style={styles.activityItem}>
  //           <Text style={styles.activityAction}>{activity.action}</Text>
  //           <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
  //         </View>
  //       ))}
  //     </View>
  //   );
  // };

return (
  <ScrollView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color="#333"
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>User Security Settings</Text>
    </View>
    {renderSection(
      "Account Recovery",
      renderAccountRecovery,
      showAccountRecovery,
      () => setShowAccountRecovery(!showAccountRecovery)
    )}
    {renderSection(
      "Change Password",
      renderChangePassword,
      showChangePassword,
      () => setShowChangePassword(!showChangePassword)
    )}
    
    {renderSection(
      "Delete Account",
      renderDeleteAccount,
      showDeleteAccount,
      () => setShowDeleteAccount(!showDeleteAccount)
    )}
    {showDeleteConfirmation && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDeleteConfirmation}
        >
          <View style={styles.modalContainer}>
            <View style={styles.confirmationPopup}>
              <Text style={styles.confirmationText}>
                Are you sure you want to permanently delete your account?
              </Text>
              <View style={styles.confirmationButtonRow}>
                <TouchableOpacity
                  onPress={confirmDeleteAccount}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDeleteConfirmation(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
  </ScrollView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: 10,
    marginTop:20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmationPopup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    marginLeft: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  confirmationPopup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  confirmationText: {
    marginBottom: 15,
    fontSize: 16,
  },
  confirmationButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmButton: {
    backgroundColor: "#e02d2d",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 5, 
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 5, 
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14, // 
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14, 
  },
  
  dropdownSection: {
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dropdownContent: {
    padding: 15,
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin:5,
  },
  sendEmailButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    margin:15,
  },
  DeleteAccountButton: {
    backgroundColor: "#e02d2d",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    margin:15,
  },
  sendEmailButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc", 
  },
});

export default UserSecuritySettings;

