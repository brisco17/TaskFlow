import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Productivity App</Text>

      <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
        //onChangeText={text => this.setState({ email: text })}
        value={""}
        placeholder="Email"
        placeholderTextColor="rgba(168, 218, 220, 1)"
        textContentType="emailAddress"
      />
      <TextInput
        style={styles.input}
        //onChangeText={text => this.setState({ password: text })}
        value={""}
        textContentType="password"
        placeholder="Password"
        placeholderTextColor="rgba(168, 218, 220, 1)"
        secureTextEntry={true}
      />
      </View>
      
      <View style={styles.rowContainer}>
        <TouchableOpacity
        style={styles.button}
        //onPress={() => 1onSubmit()}
      >
        <Text style={styles.buttonText}> Log In </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        //onPress={() => 1onSubmit()}
      >
        <Text style={styles.buttonText}> Sign Up </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginTop: "20%",
    width: "100%",
    justifyContent: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: 'rgba(69, 120, 144, 1)',
    marginHorizontal: 8,
    color: '#fff',
    borderRadius: 100,
    width: '45%',
    padding: 10,
  },
  buttonText: {
    color: 'rgba(168, 218, 220, 1)',
    fontWeight: 'bold'
  },
  loginText: {
    bottom: "10%",
    fontSize: 50,
    textAlign: "center",
    color: 'rgba(29, 53, 87, 1)',
    textShadowColor: 'rgba(29, 53, 87, 1)',
    textShadowOffset: {height: 2},
    textShadowRadius: 10
  },
  input: {
    height: 60,
    width: '90%',
    left: '5%',
    fontSize: 16,
    paddingStart: 40,
    paddingEnd: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'left',
    borderRadius: 100,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    color: 'white',
  }
});
