import { View, Text, SafeAreaView, Dimensions, screenWidth, Image, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import CustomButton from "../customs/CustomButton/CustomButton";
import * as Location from 'expo-location';
import CustomLoader from "../customs/CustomLoading/customLoader";
import { useNavigation } from "expo-router";
import { DevSettings } from "react-native";

import Axios from "axios";
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const CameraScreen = () => {
    let apiData;
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [pictureUri, setPictureUri] = useState(null);
    const [formatedPic, setFormatedPic] = useState([]);
    const cameraRef = useRef(null); 
    const [latCoord, setLatCoord] = useState();
    const [longCoord, setLongCoord] = useState();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      //get the coordinates. latitude and longitude:
      (async () => {     
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
         setLongCoord(location.coords.longitude);
         setLatCoord(location.coords.latitude);
      })();

      //get camera permission:
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    const handleCameraType = () => {
      setCameraType(
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    };
  
    const handleTakePicture = async (e) => {
      e.preventDefault();
      setLoading(true);
      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        const data = await cameraRef.current.takePictureAsync();
        setPictureUri(data.uri);
        //setPlantInfo({ name: 'Monstera Deliciosa', state: 'Good Moisture', info: 'Monstera Deliciosa prefers bright, indirect light but can also tolerate low light. Water your Monstera when the top 1-2 inches of soil feels dry.' });

        try{
          if(formatedPic.length <= 3){        
            //setFormatedPic(...formatedPic, image64);
            formatedPic.push(await FileSystem.readAsStringAsync(data.uri, {encoding: FileSystem.EncodingType.Base64,}));       
            if(formatedPic.length == 3){
              callAPI();
            }
          }
          
        }
        catch(error){
          console.error(error);
          window.alert("There was a problem with your picture...")
        }
      }
      setLoading(false);
    };
  
    const handleSeeMore = () => {
      // prompt for user to answer yes or No
    };
  
    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    //run api function after the image is converted to base64:
    const callAPI = () => {
      setLoading(true);
      if(formatedPic.length > 0){
        //const axios = require('axios');
        console.log("access point is triggered");
        const data = {
          api_key: "4SVwYwK2SpxNsVtJOySrcalg54M8M2KgY48l3tKFhFrQ6OiqVX",
          //api_key: "4SVwYwK2SpxNsVtJOySrcalg54M8M2KgY48l3tKFhFrQ6OiqVX",
          images: formatedPic,
          latitude: latCoord,
          longitude: longCoord,
          health: "only",
          modifiers: ["crops_fast", "similar_images"],
          plant_language: "en",
          plant_details: ["common_names",
              "url",
              "name_authority",
              "wiki_description",
              "taxonomy",
              "synonyms"],
        };
  
        Axios.post('https://api.plant.id/v2/identify', data).then(res => {
          //console.log('Success:', res.data);
          
          apiData = {...res.data};
          let plantData = apiData.suggestions;
          //console.log(apiData.suggestions[0].plant_details);
          //console.log(apiData.suggestions[0].plant_name);
          navigation.navigate('resultsScreen', {data:plantData});
          setLoading(false);
        }).catch(error => {
          console.error('Error: ', error)
        })    
        setFormatedPic([]);
  
      }else{
        console.log("code did not execute")
      }
    }

    return(     
      <View style={styles.container}>
      {pictureUri === null ? (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCameraType}>
              <Ionicons name="camera-reverse-outline" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
              <Ionicons name="camera-outline" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </Camera> 
        
      ) : (           
            <View style={{flex: 1, justifyContent: "center", }}> 
              <View style={{marginTop: "auto", marginBottom: "auto",alignItems: "center"}}>    
                <CustomButton text="Scan Again" onPress={() => setPictureUri(null)} /> 
                <CustomButton text="Done" onPress={() => callAPI()} /> 
                <Text styele={{marginTop: 50}}>scan image multiple times for better results</Text> 
              </View>
                <CustomLoader visible={loading} />
            </View>                                        
      )}
    </View>
      
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {  
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    marginHorizontal: 20,
  },
  seeMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 30,
    borderRadius: 5,
  },
  seeMoreText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noPlantInfo: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  centerButton: {
    
  },
});

export default CameraScreen;
