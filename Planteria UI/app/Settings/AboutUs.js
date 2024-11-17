import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
const AboutUs = () => {
  const handleEmailPress = () => {
    Linking.openURL("mailto:Bugsquashers@support.com");
  };
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text style={styles.headerText}>About Planteria</Text>
    </View>
      <Image
        source={require("../../assets/icon.png")} // Replace with your logo image
        style={styles.logo}
      />
      
      <Text style={styles.description}>
        Welcome to Planteria, your digital garden companion. Our mission is to
        empower farmers and plant enthusiasts with the knowledge and tools they
        need to cultivate healthy and thriving plants.
      </Text>
      <Text style={styles.subDescription}>
        Whether you're a seasoned gardener or just starting out, Planteria is
        here to help you succeed. Scan a plant and discover its name, health
        status, and care instructions. With a vast database of plants and expert
        advice, you'll have everything you need at your fingertips to ensure
        your plants flourish.
      </Text>
      <View style={styles.contact}></View>
      <View style={styles.footer}>
        <Text style={styles.contactText}>
          Have any questions or suggestions? Contact us at{" "}
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.email}>danielkapukapu@gmail.com</Text>
          </TouchableOpacity>{" "}
        </Text>
       
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  backIcon:{
    width:30,
    borderRadius:50,
    borderBottomColor:"lightblue",
    backgroundColor:"lightblue",
    marginRight:15,
    marginLeft:15,
}, 
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignItems:"center",
    marginLeft:80,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 17,
    color: "#000",
  },
  subDescription: {
    textAlign: "center",
    marginBottom: 40,
    fontSize: 14,
    color: "#100",
  },
  contact: {
    marginBottom: 40,
  },
  contactText: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  email: {
    fontWeight: "bold",
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    marginLeft:40,
  },
});

export default AboutUs;
