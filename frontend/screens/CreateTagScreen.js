import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Dimensions, Keyboard } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import colors from '../styles/colors.js';
import components from '../styles/components.js';
import containers from '../styles/containers.js';
import typography from '../styles/typography.js';
import ModernHeader from "react-native-modern-header";

export default class CreateTagScreen extends React.Component{
  constructor(props) {
    super(props)
    // Initialize our tag state variables
    this.state = {
      title: '',
      description: '',
    }
  }

  onBack = () => {
    const {navigation} = this.props;
    navigation.pop()

  }
  onSubmit = () => {
    const { title, description } = this.state;
    const {navigation} = this.props;


    SecureStore.getItemAsync('session').then(sessionToken => {
      fetch("https://young-chow-productivity-app.herokuapp.com/tags/", {
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + sessionToken
        }),
        body: JSON.stringify({
          title: title,
          description: description
        })
      })
      .then(response => response.json())
      .then(json => {
        // enter tag creation logic here
        console.log(json)
        if(!json.pk) {
          if (json.title) Alert.alert("Error: ", json.title.toString())
          else if (json.description) Alert.alert("Error: ", json.description.toString())
          else Alert.alert("Fatal Error, contact dev because something is wrong")
        }
        else
        {
          Alert.alert("Tag has been successfully created.")
          navigation.pop()
        }
      })
      .catch(exception => {
          console.log("Error occured", exception);
          // Do something when login fails
      })
    })

  }
  

  render() {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <ModernHeader style={{backgroundColor: 'rgba(244,245,250,0)', top: 10}} rightComponentDisable={true} onLeftPress={() => this.onBack()}/>
        <AntDesign style={{zIndex: 999,position: 'relative',right: '37%', top: 48}} name="tags" size={30} color="black"/>
        <View style={styles.inputContainer}>
          <TextInput
            onSubmitEditing={Keyboard.dismiss}
            style={styles.input}
            onChangeText={text => this.setState({ title: text })}
            value={this.state.title}
            placeholder="Tag Title"
            placeholderTextColor="rgba(168, 218, 220, 1)"
            textContentType="none"
            multiline={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            onSubmitEditing={Keyboard.dismiss}
            style={styles.largeInput}
            onChangeText={text => this.setState({ description: text })}
            value={this.state.description}
            placeholder="Tag Description"
            placeholderTextColor="rgba(168, 218, 220, 1)"
            textContentType="none"
            textAlignVertical="top"
            multiline={true}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.onSubmit()}
        >
          <Text style={styles.buttonText}> Submit </Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...containers.main,
    ...colors.background,
  },
  inputContainer: {
    ...containers.inputContainer
  },
  rowContainer: {
    ...containers.rowContainer,
  },
  button: {
    ...components.button,
  },
  buttonText: {
    ...typography.buttonText,
  },
  input: {
    ...components.textInput,
    ...colors.textField,
    ...typography.text,
  },
  largeInput: {
    ...components.multiTextInput,
    ...colors.textField,
    ...typography.text,
  },


  
});

