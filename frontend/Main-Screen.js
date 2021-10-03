import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Touchable,Image, requireNativeComponent} from 'react-native';

export default function App() {
  const [task, setTask] = useState('Homework');
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

       

        <View opacity = {0.3} style = {{ 
          alignItems: "right",  
          width: '80%',
          height: '5%',
          frontSize: 20,
          backgroundColor: '#457890',
          borderColor: 'black',
          borderWidth: 2,
          left: '10%',
          borderRadius: '20%',
          shadowOpacity: 20}}
        >
          <TextInput sytle = {styles.input} 
            placeholder = "Create new task"
            placeholderTextColor = 'white'
            top = {7}
            width = {'100%'}
            color = 'white'
            frontSize = {20}
            left = {10}
            onChangeText = {(text) => setTask(text)}/>
        </View>
        
       
        <Text style = {{fontSize: 40, color: '#457890', left: '10%', bottom: '13%'}}>Today</Text>
        <View style = {styles.tagHeader}>
          <Text style = {{fontSize: 20, position: 'relative'}}>Homework</Text>
          <Text style = {{fontSize: 15}}>1</Text>
        </View>

        <View style ={ styles.taskBox}>
          <View style = {styles.mainTaskHeader}> 
            <TouchableOpacity style = {styles.checkCircle}/>
            <Text style = {{fontSize: 18 ,color:  '#457890', left: 15, top: 4}}>Math Homework</Text>
          </View>
          <View style = {styles.subtaskHeader}> 
            <TouchableOpacity style = {styles.checkCircle}/>
            <Text style = {{fontSize: 18 ,color:  '#457890',left: 15, top: 4}}>Part A</Text>
          </View>
          <View style = {styles.subtaskHeader}>
            <TouchableOpacity style = {styles.checkCircle}/>
            <Text style = {{fontSize: 18 ,color:  '#457890',left: 15, top: 4}}>Part B</Text>
          </View>
          <View style = {styles.subtaskHeader}>
            <TouchableOpacity style = {styles.checkCircle}/>
            <Text style = {{fontSize: 18 ,color:  '#457890',left: 15, top: 4}}>Part C</Text>
          </View>
          <View style = {styles.subtaskHeader}>
            <TouchableOpacity style = {styles.checkCircle}/>
            <Text style = {{fontSize: 18 ,color:  '#457890',left: 15, top: 4}}>Part E</Text>
          </View>
        </View>
        </View>
      </>
      
      
    );
}



const styles = StyleSheet.create({
  MainScreen: {
    flex: 1,
    backgroundColor: '#FAEBEF',
    alignItems: 'baseline',
    width: '100%',
    height: '100%'
  },
  TaskBarContainer:{
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: '10%',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 30
  },
  CricleOverlay:{
    width: '20%',
    height: '90%',
    borderRadius: 500000/2,
    backgroundColor: '#FAEBEF',
    alignItems: 'center',
  },
  innerCircle:{
    top: '10%',
    width: '80%',
    height: '80%',
    borderRadius: 500000/2,
    backgroundColor: '#457890',
    shadowOpacity: .5,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    left: 20,
    color: 'white'
  },
  imagestyle:{
    top: '10%',
    width: 60,
    height: 60,
    borderRadius: 60/2,
  },
  checkCircle:{
    width: 25,
    height: 25,
    borderRadius: 500/2,
    backgroundColor: 'transparent',
    borderWidth: 2,
    top: 2,
    left: 9
  },
  tagHeader: {color: '#457890', 
  left: '5%', 
  flexDirection: 'row'
},
  taskBox: {
    flexGrow: 0,
    width: '80%',
    backgroundColor: '#A8DADC', 
    left: '10%', borderRadius: 25, 
    flexDirection: 'column'
  },
  mainTaskHeader:{
    flexGrow: 0,
    flexDirection: 'row', 
    height: 50, 
    width: '100%'
  },
  subtaskHeader:{
    flexDirection: 'row', 
    height: 50, 
    width: '100%', 
    left: 30
  }

});