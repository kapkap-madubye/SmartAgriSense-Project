import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicyScreen = () => {

    const navigation = useNavigation();

    const handleGoBack = () => {
      navigation.goBack();
    };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right','bottom','top']}>
    <ScrollView >
      <View  style={styles.TopBar}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="black"
        style={styles.backIcon}
        onPress={handleGoBack}
      />
      <Text style={{ fontSize: 20, lineHeight: 24 }}>Privacy Policy</Text>
      </View>
      
      <Text style={{ padding: 20, fontSize: 16, lineHeight: 24 }}>
        Your privacy is important to us. It is SmartAgriSensor's policy to respect your
        privacy regarding any information we may collect from you through our
        app, SmartAgriSensor.{"\n\n"}

        We only ask for personal information when we truly need it to provide a
        service to you. We collect it by fair and lawful means, with your
        knowledge and consent. We also let you know why we're collecting it and
        how it will be used.{"\n\n"}

        We only retain collected information for as long as necessary to provide
        you with your requested service. What data we store, we'll protect
        within commercially acceptable means to prevent loss and theft, as well
        as unauthorized access, disclosure, copying, use, or modification.{"\n\n"}

        We don't share any personally identifying information publicly or with
        third-parties, except when required to by law.{"\n\n"}

        Our app may link to external sites that are not operated by us. Please
        be aware that we have no control over the content and practices of these
        sites, and cannot accept responsibility or liability for their
        respective privacy policies.{"\n\n"}

        Your continued use of our app will be regarded as acceptance of our
        practices around privacy and personal information. If you have any
        questions about how we handle user data and personal information, feel
        free to contact us.{"\n\n"}

        
      </Text>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
            backgroundColor: "white", // Set background color if needed
      },
      content: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
      },
      text: {
        fontSize: 16,
        lineHeight: 24,
      },
      backIcon:{
        
        borderRadius:50,
        borderBottomColor:"lightblue",
        backgroundColor:"lightblue",
        marginRight:15,
        marginLeft:15,
    }, 
    TopBar: {
      flexDirection: "row",
    },
  });
export default PrivacyPolicyScreen;


