// import React, { createContext, useContext } from "react";
// import { StyleSheet, useColorScheme } from "react-native";

// // Define styles for light mode
// const lightStyles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//   },
//   text: {
//     color: "black",
//   },
// });

// // Define styles for dark mode
// const darkStyles = StyleSheet.create({
//   container: {
//     backgroundColor: "black",
//   },
//   text: {
//     color: "white",
//   },
// });

// // Create the ThemeContext
// const ThemeContext = createContext();

// // Custom hook to access the theme
// export function useTheme() {
//   return useContext(ThemeContext);
// }

// // ThemeProvider component
// export function ThemeProvider({ children }) {
//   const colorScheme = useColorScheme();
//   const themeStyles = colorScheme === "dark" ? darkStyles : lightStyles;

//   return (
//     <ThemeContext.Provider value={themeStyles}>{children}</ThemeContext.Provider>
//   );
// }
