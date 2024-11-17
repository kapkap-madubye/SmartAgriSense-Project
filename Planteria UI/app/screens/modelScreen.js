import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

const ModelScreen = ({ route, navigation }) => {
  const { plantName, plantDate, plantImage, plantData, dateTaken } =
    route.params;
  const navigateBack = () => {
    navigation.goBack(); // Navigate back to the previous screen (Information screen)
  };

  const formattedDate = plantDate
    ? plantDate.toDate().toLocaleString()
    : "No date available";

  return (
    
      <View style={{ flex: 1, marginTop: 40 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={myStyles.backIcon}>
          <Ionicons name="chevron-back-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Image source={{ uri: plantImage }} style={myStyles.image} />
        <View style={myStyles.Container}>
          <Text style={myStyles.header}>Name: {plantName}</Text>
          <Text style={myStyles.header}>
            Date Taken: {new Date(dateTaken).toLocaleString()}
          </Text>
          <Text style={myStyles.dataAPI}>
            {plantData?.wiki_description?.value || "No data available"}
          </Text>
          <Pressable onPress={navigateBack} style={myStyles.button}>
            <Text style={myStyles.buttonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    
  );
};

const myStyles = StyleSheet.create({
  image: {
    width: "90%",
    height: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 8,
  },
  backIcon:{
    borderRadius:50,
    borderBottomColor:"lightblue",
    backgroundColor:"lightblue",
    marginRight:15,
    marginLeft:15,
}, 
  Container: {
    
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "5%",
    backgroundColor: "grey",
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    color: "green",
    marginBottom: 2,
  },
  dataAPI: {
    marginTop: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#00cc66",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ModelScreen;
