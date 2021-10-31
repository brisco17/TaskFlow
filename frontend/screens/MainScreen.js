import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Touchable,Image, requireNativeComponent, Button, ScrollView, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Modal from "react-native-modal";


export default class MainScreen extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      email: SecureStore.getItemAsync("email") || '',
      sessionToken: "",
      isVisible: false,
      tags: [],
      scrollOffset: null,
    }
  }

  async componentDidMount() {
    let token = await SecureStore.getItemAsync('session')
    
    if (token) {
      console.log('Token ' + token)
      this.setState({sessionToken: token})
      this.getTags();
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getTags();
        console.log('refresh succeeded')
        }
      );

    }
  }

  getTags() {
    fetch("https://young-chow-productivity-app.herokuapp.com/tags/", {
      method: "GET",
      headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.sessionToken
        }),
      })
    .then((response => response.json()))
    .then(json => {
      console.log(json)
      
      this.setState({tags: json})
     }
    )
  }

  componentWillUnmount() {
    this._unsubscribe();
  }


  changeState = () => {
    if(this.state.isVisible){
      this.setState({isVisible: false})
    }else{
      this.setState({isVisible: true})
    }
  }


  handleOnScroll = event => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
      });
    };


  


  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.MainScreen}>
        

          <View style={{ height: '10%', width: '100%', backgroundColor: '#A8DADC' , top: '90%'}}/>
          <View style={styles.TaskBarContainer}>
            
            <View style = {styles.CricleOverlay}>
              <TouchableOpacity style = {styles.innerCircle}
                onPress = {() => navigation.navigate("Settings")}>
              </TouchableOpacity>
            </View>



            <View style = {styles.CricleOverlay}>
              <TouchableOpacity style = {styles.innerCircle}
                onPress = {() => navigation.navigate('Create Task')}/>
            </View>

            <View style = {styles.CricleOverlay}>
              <TouchableOpacity style={styles.innerCircle} onPress={this.changeState} />

                <Modal 
                  isVisible={this.state.isVisible}
                  propagateSwipe={true}
                  animationIn="fadeIn"
                  animationOut="fadeOut"
                  backdropTransitionOutTiming={0}
                  onBackdropPress={this.changeState}
                  onSwipeComplete={this.changeState}
                  swipeDirection={['down']}
                  propagateSwipe
                  scrollOffset={this.state.scrollOffset}
                  style={styles.bottomModal}>
                    

   
                    <View style={styles.modalView}>
                      
                      <ScrollView
                        onScroll={this.handleOnScroll}
                        scrollEventThrottle={16}>

                        <Text style={styles.modalHeader}>
                          Filter by:
                        </Text>
                        <Button title={"Due Date"}></Button>
                        <View style={{width:screen.width, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
                        <Button title={"Created"}></Button>
                        <View style={{width:screen.width, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
                        <Text style={styles.modalHeader}>
                          Apply Tag:
                        </Text>
                         {this.state.tags.map(tag => (
                          <>
                          <Button title={tag.title} key={'tag' + tag.id}></Button>
                          <View key={'view' + tag.id}style={{width:screen.width, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
                          </>
                        ))} 
                        <Text style={styles.modalHeader}>
                          Manage Tags:
                        </Text>                        
                          <Button 
                          title = "Create new Tag"
                          onPress = { () => {this.setState({isVisible: false}); navigation.navigate('Create Tag');} }
                          />
                          <View style={{width:screen.width, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
                          <Button title={"Delete Tag"}></Button>

                      </ScrollView>
                    </View>

                </Modal>

            </View>

          </View>

      </View>
    );
  };
}


const screen = Dimensions.get("screen");
const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: 'flex-start',
    height: screen.height / 2,
    width: screen.width,
    flex:0,

  },
  modalHeader: {
    fontSize: 20,
    marginLeft:10,
    paddingTop:50,
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

