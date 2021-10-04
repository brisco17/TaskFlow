import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default class App extends React.Component{
  constructor(props) {
    super(props)
    const Stack = createNativeStackNavigator();
    // Initialize our login state
    this.state = {
      username: '',
      password: '',
      login: false
    }
  }
  

  onSubmit = () => {
    const { username, password } = this.state;
    console.log("HERE")
    console.log(username)
    console.log(password)

    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", 'localhost:8080/api/login', true);

    // //Send the proper header information along with the request
    // xhr.setRequestHeader("Content-Type", 'application/json');

    // xhr.onreadystatechange = function() { // Call a function when the state changes.
    //     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    //         // Request finished. Do processing here.
    //     }
    // }
    // send = "username=" + username + "&password=" + password
    // xhr.send("username={username}&password=ipsum");
    // // xhr.send(new Int8Array());
    // // xhr.send(document);


    fetch("https://young-chow-productivity-app.herokuapp.com/api/login", {
      method: "POST",
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(response => response.json())
    .then(json => {
      console.log(`Logging in with session token: ${json.token}`);

      // enter login logic here
      this.setState({ login: true })
      
    })
    .catch(exception => {
        console.log("Error occured", exception);
        // Do something when login fails
    })

  }
  

  render() {
    const { username, password, login } = this.state

    if (login) {
      return (<View style={styles.container}><Text style={styles.loginText}>Logged in</Text></View>);
    }
    else
    {
      return (
        <View style={styles.container}>
          <Text style={styles.loginText}>Productivity App</Text>

          <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            onChangeText={text => this.setState({ username: text })}
            value={username}
            placeholder="Username"
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
          </View>
          
          <View style={styles.rowContainer}>
            <TouchableOpacity
            style={styles.button}
            onPress={() => this.onSubmit()}
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
  },


  
});
