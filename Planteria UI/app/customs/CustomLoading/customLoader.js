import {
  View,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Text,
} from "react-native";

const CustomLoader = ({ visible = false }) => {
  const { height, width } = useWindowDimensions();



  return (
    visible && (
      <View style={[style.container, { height, width }]}>
        <View style={style.loader}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={{marginRight: 10, fontSize: 20}}>loading...</Text>
        </View>
      </View>
    )
  );
};

const style = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    // alignItems:'center',
  },
  loader: {
    height: "10%",
    backgroundColor: "#fff",
    marginHorizontal: 50,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
export default CustomLoader;
