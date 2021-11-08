import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Fontisto, Entypo} from '@expo/vector-icons';

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
        <Fontisto style={{paddingStart:40,top:42}} name="email" size={24} color="black"/>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ email: text })}
          value={email}
          placeholder="Email"
          placeholderTextColor="rgba(69, 120, 144, 1)"
          textContentType="emailAddress"
        />
        <Entypo style={{paddingStart:40,top:42}} name="lock" size={20} color="black"/>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ password: text })}
          value={password}
          textContentType="password"
          placeholder="Password"
          placeholderTextColor="rgba(69, 120, 144, 1)"
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
        <Text style = {{position: 'relative', top: 20}}>Already on Task Flow? <TouchableOpacity onPress ={() => navigation.navigate('Login')}><Text style ={{color: 'blue', paddingStart: 5}}>Sign In</Text></TouchableOpacity></Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginBottom: "10%",
    backgroundColor: 'rgba(244,245,250,1)',
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
    height: 45,
    width: '65%',
    alignItems: 'center',
    backgroundColor: 'rgba(256, 256, 256, 1)',
    borderRadius: 10,
    padding: 10,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: .5,
  },
  buttonText: {
    height: 25,
    top: 3,
    color: 'rgba(69, 120, 144, 1)',
    fontWeight: 'bold'
  },
  loginText: {
    fontSize: 40,
    textAlign: "center",
    color: 'rgba(29, 53, 87, 1)',
    textShadowColor: 'rgba(29, 53, 87, 1)',
  },
  input: {
    height: 60,
    width: '90%',
    left: '5%',
    fontSize: 16,
    paddingStart: 50,
    marginBottom: 20,
    textAlign: 'left',
    borderRadius: 20,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    backgroundColor: 'rgba(0,0,20,0)',
    color: 'rgba(69, 120, 144, 1)',
  },


  
});
