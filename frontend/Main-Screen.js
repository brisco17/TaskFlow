import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import back from './Images/Background.png'

export default function App() {
  return (
    <><View style={styles.MainScreen}>
   
        <View style={{ height: '10%', width: '100%', backgroundColor: '#A8DADC' , top: '90%'}}/>
        <View style={styles.TaskBarContainer}>
          <View style = {styles.CricleOverlay}>
            <TouchableOpacity style = {styles.innerCircle}/>
          </View>
          <View style = {styles.CricleOverlay}>
            <TouchableOpacity style = {styles.innerCircle}/>
          </View>
          <View style = {styles.CricleOverlay}>
            <TouchableOpacity style = {styles.innerCircle}/>
          </View>
        </View>

       

        <View opacity = {0.2} style = {{ 
          alignItems: "right", 
          marginTop: '-10%',  
          width: '80%',
          height: '5%',
          frontSize: 20,
          backgroundColor: '#457890',
          borderColor: 'black',
          borderWidth: 2}}
        >
          <TextInput sytle = {styles.input} 
            placeholder = "Enter Task here"
            placeholderTextColor = 'white'
            top = {5}
            frontSize = {20}
          />
        </View>
       
        <Text style = {{fontSize: 40, marginTop: '-25%', color: '#457890', right: 80}}>Today</Text>
        <View style={{height: 300, width: 300, backgroundColor: 'transparent', top: '20%'}}>
        </View>
        
        </View>
      </>
      
    );
}

const styles = StyleSheet.create({
  MainScreen: {
    flex: 1,
    backgroundColor: '#FAEBEF',
    alignItems: 'center'
  },
  TaskBarContainer:{
    bottom: '-155%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: '10%',
    justifyContent: 'space-evenly',
  },
  CricleOverlay:{
    top: '10%',
    width: 75,
    height: 75,
    borderRadius: 75/2,
    backgroundColor: '#FAEBEF',
    alignItems: 'center',
  },
  innerCircle:{
    top: '10%',
    width: 60,
    height: 60,
    borderRadius: 60/2,
    backgroundColor: '#457890',
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: 'black',
    borderWidth: 1
  },
  imagestyle:{
    top: '10%',
    width: 60,
    height: 60,
    borderRadius: 60/2,
  }


});