import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Appbar, Text } from "react-native-paper";

const TermsAndConditionsScreen = () => {

    const navigation = useNavigation();

    const handleGoBack = () => {
      navigation.goBack();
    };


    return (
      <SafeAreaView style={styles.container} edges={['left', 'right','bottom','top']}>
      <ScrollView >
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
      <Text style={styles.headerText}>Terms of Use</Text>
    </View>
        
        <Text style={{ padding: 20, fontSize: 16, lineHeight: 24 }}>
        Welcome to the Planteria App. These Terms and Conditions
        ("Terms") outline the legally binding agreement between you and
        Planteria ("we," "us," or "our") governing your use of the App. By
        accessing, downloading, or using the App, you acknowledge your
        acceptance of and agreement to these Terms. If you do not agree with
        these Terms, please refrain from using the App.

        {"\n\n"}
        1. Acceptance of Terms
        {"\n\n"}
        Your use of the App constitutes your full acceptance of these Terms. If
        you are using the App on behalf of an organization, you represent that
        you have the authority to bind that organization to these Terms.{"\n\n"}
        2.Purpose and Functionality
        {"\n\n"}
        The App has been designed to assist users in identifying plant species
        and monitoring crop health by leveraging cutting-edge machine learning
        algorithms and advanced sensor data analysis. Please note that the
        information provided by the App is intended for informational purposes
        only and is not a substitute for professional agricultural advice.
        {"\n\n"}
        3. Data Collection and Privacy
        {"\n\n"}
        We value your privacy and are committed to safeguarding your personal
        information. By using the App, you consent to the collection, storage,
        and processing of data as described in our Privacy Policy. Any data
        collected through the App, including sensor data and user input, will be
        anonymized, and used solely for the purpose of enhancing the App's
        functionality and improving user experience.
        {"\n\n"}
        4. Accuracy and Reliability
        {"\n\n"}
        While we strive to provide accurate and up-to-date information, the
        App's accuracy, completeness, and reliability cannot be guaranteed.
        Users are advised to cross-reference the information provided by the App
        with other reputable sources before making any decisions based on the
        data.
        {"\n\n"}
        5. User Responsibilities
        {"\n\n"}
        Users are solely responsible for ensuring the accuracy and completeness
        of the data they input into the App, including sensor data and crop
        information. Any decisions made based on the recommendations provided by
        the App are the user's responsibility.
        {"\n\n"}
        6. Intellectual Property
        {"\n\n"}
        All intellectual property rights related to the App, including its
        content, design, algorithms, trademarks, and logos, are owned by
        Planteria and its licensors. Users are prohibited from reproducing,
        distributing, modifying, or reverse engineering any aspect of the App
        without explicit written permission from Planteria.
        {"\n\n"}
        7. Limitation of Liability
        {"\n\n"}
        The developers, contributors, and affiliates associated with the App
        shall not be liable for any direct, indirect, incidental, consequential,
        or special damages arising from or related to the use of the App. The
        App is provided "as is" without warranties of any kind, whether
        expressed or implied.
        {"\n\n"}
        8. Modifications and Termination
        {"\n\n"}
        We reserve the right to modify, suspend, or terminate the App's
        functionality, features, or availability at any time without prior
        notice. We may also update these Terms periodically, and your continued
        use of the App after such updates indicates your agreement to the
        revised Terms.
        {"\n\n"}
        9. Governing Law and Jurisdiction
        {"\n\n"}
        These Terms and your use of the App shall be governed by and construed
        in accordance with the laws of South Africa. Any disputes arising from
        or related to these Terms shall be subject to the exclusive jurisdiction
        of the courts in South Africa. By continuing to use the App, you
        acknowledge that you have read, understood, and agreed to these detailed
        Terms and Conditions. Should you have any inquiries or concerns, please
        contact us at ( danielkapukapu@gmail.com )
        {"\n\n"}
  
          
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

export default TermsAndConditionsScreen;

