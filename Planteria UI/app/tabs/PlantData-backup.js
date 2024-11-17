import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Button } from 'react-native';
import { db } from '../Data/Firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import plants from '../Data/json';

const PlantData = () => {
  const [todo, setTodo] = useState("");
  const [tasks, setTasks] = useState([]);

  //calc days
  const [inputDays, setInputDays] = useState("");
  const [daysLeft, setDaysLeft] = useState("");
  const [savedData, setSavedData] = useState([]); // saved in db

  const [selectedType, setSelectedType] = useState('plant'); // Default value is 'plant'

  const [daysToGrow, setDaysToGrow] = useState('');


  const addPlant = async () => {
    if (todo.trim() === "" || inputDays.trim() === "") return; // Prevent adding empty values
  
    try {
      const currentDate = new Date();
      const futureDate = new Date();
      const inputNumber = parseInt(inputDays, 10);
      futureDate.setDate(currentDate.getDate() + inputNumber);
  
      const docRef = await addDoc(collection(db, "plants"), {
        text: todo,
        inputDays: inputNumber,
        futureDate: futureDate.toISOString(),
      });
  
      setTasks([...tasks, { id: docRef.id, text: todo }]);
      setTodo("");
      setInputDays("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "plants"));
    const taskList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      inputDays: doc.data().inputDays,
      futureDate: doc.data().futureDate,
    }));
    setTasks(taskList);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //days count
  const calculateDaysLeft = async () => {
    if (inputDays.trim() === "") {
      setDaysLeft("");
      return;
    }

    const inputNumber = parseInt(inputDays, 10); //check if inputDays is number
    if (isNaN(inputNumber)) {
      setDaysLeft("");
      return;
    }

    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + inputNumber);

    const timeDiff = futureDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    setDaysLeft(daysDiff);

    const docRef = await addDoc(collection(db, "dates"), {
      inputDays: inputNumber,
      futureDate: futureDate.toISOString(),
    });

    // After saving, update the savedData
    setSavedData([
      ...savedData,
      { inputDays: inputNumber, futureDate: futureDate.toISOString() },
    ]);
    console.log("Document written with ID:", docRef.id);
  };

  // Retrieve data from Firestore
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "dates"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setSavedData(data);
  };

  // Fetch savedData once you reload
  useEffect(() => {
    fetchData();
  }, []);

  // Function to delete items (tasks or savedData) based on itemType
  const deleteItem = async (collectionName, itemId) => {
    try {
      await deleteDoc(doc(db, collectionName, itemId));

      if (collectionName === "todo_list") {
        setTasks(tasks.filter((taskItem) => taskItem.id !== itemId));
      } else if (collectionName === "dates") {
        setSavedData(savedData.filter((item) => item.id !== itemId));
      }

      console.log("Document deleted successfully:", itemId);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  //Update the saved data in the database:  calculates the remaining days comparing with the future date
  const updateSavedData = async () => {
    const currentDate = new Date();
    const updatedData = savedData.map(async (item) => {
      const futureDate = new Date(item.futureDate);
      const timeDiff = futureDate.getTime() - currentDate.getTime();
      const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (remainingDays == -10) {
        alert(
          `There is only 10 day left for the countdown with ID: ${item.id}`
        );
      } else if (remainingDays) {
        const updatedDocRef = doc(db, "dates", item.id);
        await updateDoc(updatedDocRef, { inputDays: remainingDays });
        return { ...item, inputDays: remainingDays };
      }

      return null;
    });

    const updatedItems = await Promise.all(updatedData); //maps around the savedData
    setSavedData(updatedItems.filter((item) => item !== null));
  };

  useEffect(() => {
    updateSavedData(); // Makes sure savedDated is updated
    // Update every 24 hours
    const intervalId = setInterval(() => {
      //It will refresh the savedData every 24 hours
      updateSavedData();
    }, 24 * 60 * 60 * 1000); // converting it to milliseconds

    return () => {
      clearInterval(intervalId); // Clean up unsavedData
    };
  }, []);

  const submitData = async () => {
    addPlant();
    calculateDaysLeft();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Plants and Days Countdown</Text>
      <TextInput
        style={styles.input}
        placeholder="Grow your plant..."
        value={todo} // todo
        onChangeText={(text) => setTodo(text)} // todo
      />
      <TextInput
        style={styles.input}
        placeholder="Enter number of days"
        keyboardType="numeric"
        value={inputDays}
        onChangeText={setInputDays}
      />

      <Button title="Submit" onPress={() => submitData()} />

      <Text style={styles.result}>
        {/* {` You entered ${daysLeft} days.`} */}
      </Text>
      <FlatList
        style={styles.taskList}
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.text}:</Text>
            <Text>{`Days Left: ${item.inputDays}`}</Text>
            <TouchableOpacity onPress={() => deleteItem("todo_list", item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* <Text style={styles.result}>{` You entered ${daysLeft} days.`}</Text>
      <FlatList
        style={styles.timesSaved}
        data={savedData}
        key={inputDays.id}
        renderItem={({ item }) => (
          <View style={styles.myDays}>
            <Text>{`There are ${item.inputDays} days left `}</Text>
            <TouchableOpacity onPress={() => deleteItem("dates", item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    width: 370,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    color: 'red',
  },
  myDays:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    marginBottom: 10,
  }  
});

export default PlantData;
