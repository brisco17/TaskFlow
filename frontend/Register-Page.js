import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Touchable,Image, requireNativeComponent} from 'react-native';

export default function App() {
  return (
      <View style = {styles.Maincontainer}>
        <Text style = {{fontSize: 30, marginTop: '10%', alignSelf: 'center', color: '#1D3557'}}>Sign up</Text>
        <View style = {styles.PromptContainer}>
          <View style = {styles.PromptTypeContainer}>
            <Text style = {styles.TextStyle}>First Name</Text>
            <View style = {styles.InputBox}>
                <TextInput
                placeholder = 'Enter First Name Here'
                placeholderTextColor = 'white'
                width = '100%'
                height = '100%'
                left = {10}
                />
            </View>
          </View>
          <View style = {styles.PromptTypeContainer}>
            <Text style = {styles.TextStyle}>Last Name</Text>
            <View style = {styles.InputBox}>
              <TextInput
              placeholder = 'Enter Last Name Here'
              placeholderTextColor = 'white'
              width = '100%'
              height = '100%'
              left = {10}
              />
            </View>
          </View>
          <View style = {styles.PromptTypeContainer}>
            <Text style = {styles.TextStyle}>Email</Text>
            <View style = {styles.InputBox}>
                <TextInput
                placeholder = 'Enter Email Here'
                placeholderTextColor = 'white'
                width = '100%'
                height = '100%'
                left = {10}
                />
            </View>
          </View>
          <View style = {styles.PromptTypeContainer}>
            <Text style = {styles.TextStyle}>Password (5 or more characters)</Text>
            <View style = {styles.InputBox}>
              <TextInput
              placeholder = 'Enter Password Here'
              placeholderTextColor = 'white'
              width = '100%'
              height = '100%'
              left = {10}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style = {styles.CreateAccountButton}><Text style = {{color: 'white', fontSize: 25}}>Create Account</Text></TouchableOpacity>
        <Text style = {{fontSize: 20, alignSelf: 'center', bottom: '20%',}}>or</Text>
        <TouchableOpacity style = {styles.CreateAccountButton}><Text style = {{color: 'blue', fontSize: 25}}>Google <Text style = {{color: 'white'}}>Sign in</Text></Text></TouchableOpacity>
        <Text style = {{fontSize: 15, alignSelf: 'center'}}>Already on Productive App? <TouchableOpacity><Text style = {{color:'blue', top: 2}}>Sign in</Text></TouchableOpacity></Text>

      </View>
    );
}

const styles = StyleSheet.create ({
    Maincontainer:{
      height: '100%',
      width: '100%',
      alignItems: 'flex-start',
      backgroundColor: '#FAEBEF',
    },
    PromptContainer:{
      width: '100%',
      flexDirection: "column",
      flexGrow: 0,
      left: '10%',
    },
    TextStyle: {
      color: '#1D3557',
      fontSize: 20
    },
    InputBox: {
      height: '50%',
      width: '80%',
      borderWidth: 1,
      borderRadius: 20,
      borderColor: '#1D3557',
      overflow: 'hidden',
      backgroundColor: 'rgba(69, 120, 144, 0.5)',
      alignItems: 'baseline',
    },
    PromptTypeContainer: {
      height: '15%',
      width: '100%',
    },
    CreateAccountButton: {
      height: '5%',
      width: '50%',
      alignSelf: 'center',
      shadowColor: 'rgba(69, 120, 144, 1)',
      backgroundColor: 'rgba(69, 120, 144, 0.5)',
      borderWidth: 2,
      borderColor: '#457890',
      alignItems: 'center',
      bottom: '20%'
    },
})