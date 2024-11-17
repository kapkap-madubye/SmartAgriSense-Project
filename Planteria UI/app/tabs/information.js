import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, Alert,RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Data/Firebase';

const Information = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlantsData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "user_plant_details"));
      const fetchedData = querySnapshot.docs.map((doc) => doc.data());
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setRefreshing(true);
    fetchPlantsData();
  }, []);

  useEffect(() => {
    setRefreshing(true);
    fetchPlantsData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlantsData();
  };

  const openImage = (e, plantName, plantDate, plantImage, plantData) => {
    e.preventDefault();
    navigation.navigate('modelScreen', { plantName, plantDate, plantImage, plantData });
  };

  return (
    
    <View style={{ flex: 1, marginTop: 40 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Pressable
            onPress={(e) => openImage(e, item.plantName, item.date, item.images[0].url, item.plantData)}
            style={myStyles.container}
          >
            <Image source={{ uri: item.images[0].url }} style={myStyles.image} />

            <View style={myStyles.textStyle}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item.plantName}</Text>
              <Text>{item.date}</Text>
            </View>
          </Pressable>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
    
  );
};

const myStyles = StyleSheet.create({
  
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  container: {
    width: '90%',
    display: 'flex',
    backgroundColor: '#FFFFFF',
    marginTop: '1%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
    padding: '2%',
    flexDirection: 'row',
  },
  textStyle: {
    justifyContent: 'center',
    marginLeft: '10%',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'green',
    fontWeight: '500',
  },
});

export default Information;
