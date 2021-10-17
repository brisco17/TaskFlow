import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import * as Google from "expo-google-app-auth";

export default class LoginScreen extends React.Component{
  constructor(props) {
    super(props)
    // Initialize our login state
    this.state = {
      email: '',
      password: '',
      login: false,
      userInfo: []
    }
  }
  
  gLogin = async () => {
    console.log("LoginScreen.js 22 | loggin in");
    try {
      const { type, user } = await Google.logInAsync({
        iosClientId: `22428134723-pq3rqvntskvn45979el7kmkrnksmajgs.apps.googleusercontent.com`,
        androidClientId: `22428134723-4clne824h5k1q433vh1tmgf6r443t2dp.apps.googleusercontent.com`,
      });

      if (type === "success") {
        // Then you can use the Google REST API
        console.log("LoginScreen.js 31 | success, navigating to profile");
        SecureStore.setItemAsync('user', JSON.stringify(user)).then(() => {
          SecureStore.setItemAsync('session', user.id).then(() => {
            this.props.route.params.onLoggedIn();
          })
        });
        
      }
    } catch (error) {
      console.log("LoginScreen.js 40 | error with login", error);
    }
  }

  onSubmit = () => {
    const { email, password } = this.state;

    fetch("https://young-chow-productivity-app.herokuapp.com/auth/token/login/", {
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
      console.log(`Logging in with json: ${JSON.stringify(json)}`);

      // enter login logic here
      SecureStore.setItemAsync('session', json.auth_token).then(() => {
          SecureStore.setItemAsync('priv', "false").then(() => {
            this.props.route.params.onLoggedIn();
            //navigation.navigate('Details')
          })
      });
      
    })
    .catch(exception => {
        console.log("Error occured", exception);
        // Do something when login fails
    })

  }


  

  render() {
    const { email, password, login } = this.state
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.loginText}>Productivity App</Text>

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
            onPress={() => this.gLogin()}
          >
            <Text style={styles.buttonText}> Google Login </Text>
          </TouchableOpacity>
          
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableOpacity>
        </View>
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
