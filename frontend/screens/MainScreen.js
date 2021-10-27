import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Touchable,Image, requireNativeComponent, Button, } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Modal from "react-native-modal";


export default class MainScreen extends React.Component {
  constructor(props) {
    super(props)
    // Initialize our login state
    this.state = {
      email: SecureStore.getItemAsync("email") || '',
      login: true,
      visible: false,
    }

  }

  changeState = () => {
    console.log(this.state.visible)
    if(this.state.visible){
      this.setState({visible: false})
    }else{
      this.setState({visible: true})
    }
  }
  
  
  onSubmit = () => {
    const { email, password } = this.state;
    console.log("HERE")
    console.log(email)
    console.log(password)

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
    const {navigation} = this.props;
    return (
      <View style={styles.MainScreen}>
        

          <View style={{ height: '10%', width: '100%', backgroundColor: '#A8DADC' , top: '90%'}}/>
          <View style={styles.TaskBarContainer}>
            
            <View style = {styles.CricleOverlay}>
              <TouchableOpacity style = {styles.innerCircle}
                onPress = {() => navigation.navigate("Setting")}>
              </TouchableOpacity>
            </View>



            <View style = {styles.CricleOverlay}>
              <TouchableOpacity style = {styles.innerCircle}
                onPress = {() => navigation.navigate('CreateTaskScreen')}/>
            </View>

            <View style = {styles.CricleOverlay}>
              <TouchableOpacity style={styles.innerCircle} onPress={this.changeState} />

                <Modal 
                  isVisible={this.state.visible}
                  animationIn="fadeIn"
                  animationOut="fadeOut"
                  backdropTransitionOutTiming={0}
                  onBackdropPress={this.changeState}
                  onSwipeComplete={this.changeState}
                  swipeDirection="down"
                  style={styles.bottomModal}>

                  <View style={styles.modalContent}>
                    <Text>Tag Settings</Text>
                    <Button 
                      title = "Create new Tag"
                      onPress = { () => {this.setState({visible: false}); navigation.navigate('CreateTagScreen');} }
                      />
                  </View>
                </Modal>

            </View>

          </View>

      </View>
    );
  };
}



const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  MainScreen: {
    flex: 1,
    backgroundColor: '#FAEBEF',
    alignItems: 'baseline',
    width: '100%',
    height: '100%'
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
  },
  modalBackGround:{
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer:{
    flexGrow: 0,
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    marginHorizontal: '65%',
    width: '30%'
  },
  filterButton:{
    marginTop: 2,
    alignItems: 'center',
    backgroundColor: 'rgba(69, 120, 144, 1)',
    color: '#fff',
    borderRadius: 50,
    width: '100%',
    padding: 10,
  }

});

