import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput
} from "react-native";
import { db } from "../Data/Firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import plants from "../Data/json";
import { Picker } from "@react-native-picker/picker";

const PlantData = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedType, setSelectedType] = useState("plant");
  const [selectedItem, setSelectedItem] = useState("");
  const [daysToGrow, setDaysToGrow] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [customPlant, setCustomPlant] = useState("");
  const [customDays, setCustomDays] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "plants"));
    const taskList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      inputDays: doc.data().inputDays,
    }));
    setTasks(taskList);
  };

  const openPicker = () => {
    setPickerVisible(true);
  };

  const closePicker = () => {
    setPickerVisible(false);
  };

  const submitData = async () => {
    if ((!selectedItem && !customPlant) || !selectedType) {
      console.log("Invalid item or type");
      return;
    }
  
    let typeData;
    let selectedItemName;
    let daysToGrow;
  
    if (selectedType === "other") {
      if (!customPlant || !customDays) {
        console.log("Invalid custom plant data");
        return;
      }
      selectedItemName = customPlant;
      daysToGrow = parseInt(customDays, 10);
    } else {
      selectedItemName = selectedItem;
      if (selectedType === "plant") {
        typeData = plants.plants;
      } else if (selectedType === "vegetable") {
        typeData = plants.vegetables;
      } else if (selectedType === "fruit") {
        typeData = plants.fruits;
      }
  
      const selectedItemData = typeData.find(
        (item) => item.name.toLowerCase() === selectedItem.toLowerCase()
      );
  
      if (!selectedItemData) {
        console.log("Selected item not found in data");
        return;
      }
  
      daysToGrow = parseInt(selectedItemData.daysToGrow, 10);
    }
  
    const daysLeft = calculateDaysLeft(daysToGrow);
  
    try {
      const currentDate = new Date();
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + daysToGrow);
  
      const docRef = await addDoc(collection(db, "plants"), {
        text: selectedItemName,
        inputDays: daysLeft,
        futureDate: futureDate.toISOString(),
      });
  
      setTasks([
        ...tasks,
        { id: docRef.id, text: selectedItemName, inputDays: daysLeft },
      ]);
  
  
      setSelectedItem("");
      setCustomPlant(""); // Reset customPlant
      setDaysToGrow(""); // Reset daysToGrow
      setCustomDays(""); // Reset customDays
      setSelectedType(""); // Reset selectedType
  
      setPickerVisible(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  

  const calculateDaysLeft = (inputNumber) => {
    if (!inputNumber) return "";

    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + inputNumber);

    const timeDiff = futureDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff.toString();
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "plants", itemId));
      setTasks(tasks.filter((taskItem) => taskItem.id !== itemId));
      console.log("Document deleted successfully:", itemId);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const submitCustomPlant = () => {
    if (!customPlant || !customDays || !selectedType) {
      console.log("Invalid custom plant data");
      return;
    }

    submitData();
  };

  return (
    <View style={styles.container}>
      
      
      <Text style={styles.header}>Plants and Days Countdown</Text>

      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue)}
        style={styles.pickerContainer}
      >
        <Picker.Item label="Select a category..." value="" />
        <Picker.Item label="Plant" value="plant" />
        <Picker.Item label="Vegetable" value="vegetable" />
        <Picker.Item label="Fruit" value="fruit" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      {selectedType === "other" && (
        <View style={styles.customPlantContainer}>
        <TextInput
          placeholder="Enter Custom Plant"
          value={customPlant}
          onChangeText={setCustomPlant}
          style={styles.customPlantInput}
        />
        <TextInput
          placeholder="Days to Grow"
          value={customDays}
          onChangeText={setCustomDays}
          keyboardType="numeric"
          style={styles.customDaysInput}
        />
        <TouchableOpacity
          style={styles.customPlantSubmitButton}
          onPress={submitCustomPlant}
        >
          <Text style={styles.customPlantSubmitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      )}

      {selectedType !== "" && (
        <TouchableOpacity style={styles.pickerButton} onPress={openPicker}>
          <Text style={styles.pickerButtonText}>Select {selectedType}</Text>
        </TouchableOpacity>
      )}

      {isPickerVisible && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedItem}
            onValueChange={(itemValue) => setSelectedItem(itemValue)}
            style={styles.picker}
            enabled={selectedType !== ""}
          >
            <Picker.Item label={`Select a ${selectedType}...`} value="" />
            {selectedType === "plant" &&
              plants.plants.map((item) => (
                <Picker.Item
                  key={item.name}
                  label={item.name}
                  value={item.name}
                />
              ))}
            {selectedType === "vegetable" &&
              plants.vegetables.map((item) => (
                <Picker.Item
                  key={item.name}
                  label={item.name}
                  value={item.name}
                />
              ))}
            {selectedType === "fruit" &&
              plants.fruits.map((item) => (
                <Picker.Item
                  key={item.name}
                  label={item.name}
                  value={item.name}
                />
              ))}
          </Picker>
          <View style={styles.pickerButtonContainer}>
            <TouchableOpacity
              style={styles.pickerCancelButton}
              onPress={closePicker}
            >
              <Text style={styles.pickerCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerConfirmButton}
              onPress={() => {
                closePicker();
                submitData();
              }}
            >
              <Text style={styles.pickerConfirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        style={styles.taskList}
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.plantname}>{item.text}:</Text>
            <Text style={styles.daysLeft}>{`Days Left: ${item.inputDays}`}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:20,
    marginBottom: 10,
  },
  
  header: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 15,
  },
  picker: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  pickerButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  pickerButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    marginTop: 10,
  },
  pickerButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  pickerCancelButton: {
    paddingVertical: 10,
    marginRight: 10,
  },
  pickerCancelButtonText: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
  pickerConfirmButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  pickerConfirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  taskList: {
    flex: 1,
    marginTop: 20,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  plantname: {
    
  },
  daysLeft: {
    
  },

  deleteButton: {
    color: "red",
  },

  customPlantContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  customPlantInput: {
    flex: 1,
    marginRight: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  customDaysInput: {
    width: 100,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    marginRight:10,
  },
  customPlantSubmitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 40,
    justifyContent: "center", // Vertically align the text within the button
    alignItems: "center", // Horizontally align the text within the button
  },
  customPlantSubmitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PlantData;
