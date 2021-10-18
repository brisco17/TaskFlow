import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default class RegisterScreen extends React.Component{
  constructor(props) {
    super(props)
    // Initialize our login state
    this.state = {
      email: '',
      password: '',
      login: false
    }
  }
  

  onSubmit = () => {
    const { email, password } = this.state;
    const {navigation} = this.props;

    fetch("https://young-chow-productivity-app.herokuapp.com/auth/users/", {
      method: "POST",
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(json => {
      // enter login logic here
      if(!json.email) {
        Alert.alert("Error: ", json.password.toString())
      }
      else if (json.email.toString().includes("already exists.")) {
        Alert.alert("Error: Email is already in use.")
      }
      else
      {
        SecureStore.setItemAsync('email', json.email.toString() ).then(() => {
          SecureStore.setItemAsync('user', json.id.toString()).then(() => {
            SecureStore.setItemAsync('priv', "false").then(() => {
              navigation.pop()
              Alert.alert("Account has been created. You may now login")
            })
          });
        });
      }
    })
    .catch(exception => {
        console.log("Error occured", exception);
        // Do something when login fails
    })

  }
  

  render() {
    const { email, password, login } = this.state;
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.loginText}>Register</Text>

        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ email: text })}
          value={email}
          placeholder="Email"
          placeholderTextColor="rgba(168, 218, 220, 1)"
          textContentType="emailAddress"
        />

        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ password: text })}
          value={password}
          textContentType="password"
          placeholder="Password"
          placeholderTextColor="rgba(168, 218, 220, 1)"
          secureTextEntry={true}
        />
        {/*
        <TextInput
        style={styles.input}
        onChangeText={text => this.setState({ password: text })}
        value={password}
        textContentType="password"
        placeholder="Re-Enter Password"
        placeholderTextColor="rgba(168, 218, 220, 1)"
        secureTextEntry={true}/>
        */}
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
          style={styles.button}
          onPress={() => this.onSubmit()}
        >
          <Text style={styles.buttonText}> Sign Up </Text>
        </TouchableOpacity>
        </View>
        <Text>Already on Productivity App? <TouchableOpacity onPress ={() => navigation.navigate('Login')}><Text style ={{color: 'blue'}}>Sign In</Text></TouchableOpacity></Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginTop: "10%",
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
  },


  
});
