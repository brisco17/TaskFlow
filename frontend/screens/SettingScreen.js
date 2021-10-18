import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

export default class SettingScreen extends React.Component{
    onSubmit = () => {
      const {navigation} = this.props;
        fetch("https://young-chow-productivity-app.herokuapp.com/auth/token/logout/",{
            method: "POST",
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then(response => response.json())
        .then(json => {
          console.log('LogOut Button Hit')

          SecureStore.deleteItemAsync('session').then(() => {
            this.props.route.params.onLoggedIn();
            navigation.pop();
          })

        })
    }


    render() {

        return(
            <View style={styles.MainScreen}>
            <View style={{ height: '10%', width: '100%', backgroundColor: '#A8DADC' , top: '90%'}}/>
            <View style={styles.TaskBarContainer}>
              <View style = {styles.CricleOverlay}>
                <TouchableOpacity style = {styles.innerCircle}
                
                />
              </View>
              <View style = {styles.CricleOverlay}>
                <TouchableOpacity style = {styles.innerCircle}/>
              </View>
              <View style = {styles.CricleOverlay}>
                <TouchableOpacity style = {styles.innerCircle}/>
              </View>
            </View>
            <TouchableOpacity 
            style = {styles.button}
            onPress = {() => this.onSubmit()}
            >
            <Text style = {styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            
            </View>
        );
    }
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

});