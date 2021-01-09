import "./initializers/hackNextAuth";
import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import GoogleLogIn from "./utils/google";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function LoginScreen () {
    return (
      <View  style={styles.container}>
        <GoogleLogIn />
      </View>
    )
}