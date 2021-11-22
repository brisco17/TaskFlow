import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Button, ScrollView, Dimensions, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Modal from "react-native-modal";
import {Ionicons,SimpleLineIcons, Foundation,Entypo} from '@expo/vector-icons';
import ScrollingButtonMenu from 'react-native-scroll-menu';
import ModernHeader from "react-native-modern-header";
import BottomBar from 'react-native-bottom-bar';



export default class MainScreen extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      email: SecureStore.getItemAsync("email") || '',
      sessionToken: "",
      isVisible: false,
      tags: [],
      scrollOffset: null,
      taskSet: [],
      displayTasks: [],
      appliedTag: '',
      appliedTagID: 1,
      menus: [],
    }
  }

  async componentDidMount() {
    let token = await SecureStore.getItemAsync('session')
    if (token) {
      console.log('User Token: ' + token)
      this.setState({sessionToken: token})
      this.getTags();
      this.getTasks();
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getTags();
        this.getTasks();
        console.log('task & tag refresh occured')
        }
      );

    }
  }

  goToDetails(task) {
    const {navigation} = this.props;
    SecureStore.setItemAsync('currentTask', JSON.stringify(task)).then(() => {
      navigation.navigate("TaskDetailScreen")
    })
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
      this.setState({tags: json})
      let arr = this.state.tags;
      console.log(this.state.tags)
      let arr2 =  arr.map(tag =>
      ({name: tag.title,id: tag.pk})
      );
      let arr3 = [
        {"id": 1,
        "name": "All"}]
      
      this.setState({menus:arr3.concat(arr2)})
      this.setState({appliedTagID : 1})
      console.log(menus)
     }
    )
  }

  getTasks() {
    fetch("https://young-chow-productivity-app.herokuapp.com/tasks/", {
      method: "GET",
      headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.sessionToken
        }),
      })
    .then((response => response.json()))
    .then(json => { 
      this.setState({taskSet: json, displayTasks: json})
      console.log('Retrived user tasks')
      console.log(this.state.taskSet)
     }
    )
  }

  makeTasks() {
    if (this.state.displayTasks.length > 0) {
      return this.state.displayTasks.map((task) => {
          return (
          <>
          <TouchableOpacity style={styles.button} onPress={() => this.goToDetails(task)}>
            <Text style={styles.titleText}> {task.title} </Text>
            <Text style={styles.buttonText}> {"Discription: " + task.description} </Text>
            <Text style={{color: 'rgba(69, 120, 144, 1)', size: .5, position: 'absolute', top: "95%", left: 10}}> {"Due: " + task.due_date} </Text>
            <Text style={{color: 'rgba(69, 120, 144, 1)', size: .5, position: 'absolute', top: "95%", left: "50%"}}> {"Creation Date: " + task.creation_date} </Text>
          </TouchableOpacity>
          </>
          )
        })
      }
    else {
      return (<Text style={styles.modalText}> No tasks to display </Text>)
    }
  }

  showTasksByTag(tag) {
    /*
    Note: tags are ordinary tag objects as sent by the API
          However, the premade Due Date and Creation tags are
          sent into this function as just strings to make them
          special cases.
    */
    console.log("Applied Tag: " + tag.title)

    var tasks = []

    if (tag == this.state.appliedTag || tag == 'All') {
      this.setState({displayTasks: this.state.taskSet, appliedTag: '', appliedTagID: 1})
      console.log('Removed applied tag')
    }
    else if (tag == 'due_date') {
      console.log('sorting by due date')
      var dateSortedArray = this.state.displayTasks.slice()
      dateSortedArray.sort(
        function(a, b) {
          return new Date(a.due_date) - new Date(b.due_date)
        }
      )
      this.setState({displayTasks: dateSortedArray, appliedTag: tag})
    }
    else if (tag == 'creation_date') {
      console.log('sorting by task creation date')
      var dateSortedArray = this.state.displayTasks.slice()
      dateSortedArray.sort(
        function(a, b) {
          return new Date(b.creation_date) - new Date(a.creation_date)
        }
      )
      this.setState({displayTasks: dateSortedArray, appliedTag: tag})
    }
    else {
      console.log("Sorting by user defined tag")
      if (this.state.taskSet.length > 0) {
        tasks = this.state.taskSet.filter(
          (item) => item.tag == tag.pk)
        console.log(tasks)
      }
      console.log(tasks)
      this.setState({displayTasks: tasks, appliedTag: tag, appliedTagID: tag.pk})
    }
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

    showTags() {
      if (this.state.tags.length > 0) {
        return this.state.tags.map((tag) => {
          return (
          <>
          <TouchableOpacity key={'tag' + tag.id} onPress={() => this.showTasksByTag(tag)}>
            <Text style={styles.button}>{tag.title}</Text>
          </TouchableOpacity>
          <View key={'view' + tag.id}style={{width:screen.width, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
          </>
          )
        })
      }
      else {
        return (<Text style={styles.modalText}> No tags exist </Text>)
      }
    }

  


  render() {
    const {navigation} = this.props;

    return (
      
      <View style={styles.MainScreen}>

          
        <View style={styles.contentContainer}>
        <ScrollingButtonMenu 
          items={this.state.menus}
          onPress={
            (e) => {
              if(e.name === "All") {
                this.showTasksByTag(e.name)
              }
              else{
                this.showTasksByTag(this.state.tags.find(tag => tag.pk === e.id))
              }
            }
            
          }
          selected={this.state.appliedTagID}
          />
        </View>



        <ModernHeader style={{backgroundColor: 'rgba(244,245,250,0)', top: 10}} 
        leftComponentDisable={true} 
        rightCustomComponent={<Entypo name="dots-three-horizontal" size={24} color="black" />}
        />
        {//<BottomBar/>
        }
        <ScrollView contentContainerStyle={styles.contentContainer}>
          { this.makeTasks() }
          <View style={styles.bottomPad} />
        </ScrollView>
        
          <View style = {styles.navBarContainer}>
          <View style={{ height: '100%', width: '100%', position: 'absolute', backgroundColor: '#A8DADC', top: '30%'}}/>
          <View style={styles.TaskBarContainer}>   
            <View style = {styles.CircleOverlay}>
              <TouchableOpacity style = {styles.innerCircle}
                onPress = {() => navigation.navigate("Settings")}>
                  <Ionicons style = {{top: '25%', left: '25%'}} name="settings-sharp" size={40} color="rgba(69, 120, 144, 1)" />
              </TouchableOpacity>
            </View>
            <View style = {styles.CircleOverlayMain}>
              <TouchableOpacity style = {styles.innerCircleMain}
                onPress = {() => navigation.navigate('Create Task')}>
                  <Foundation style = {{top: '25%', left: '32%'}} name="plus" size={50} color="rgba(69, 120, 144, 1)"/>
                </TouchableOpacity>
            </View>
            <View style = {styles.CircleOverlay}>
              <TouchableOpacity style={styles.innerCircle} onPress={this.changeState}>
              <Foundation style = {{top: '30%', left: '30%'}} name="filter" size={40} color="rgba(69, 120, 144, 1)"/>
              </TouchableOpacity>

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
                    <TouchableOpacity onPress={() => this.showTasksByTag('due_date')}>
                      <Text style={styles.button}> Due Date</Text>
                    </TouchableOpacity>
                    <View style={{width:screen.width, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
                    <TouchableOpacity title={"Created"} onPress={() => this.showTasksByTag('creation_date')}>
                      <Text style={styles.button}>Created</Text>
                    </TouchableOpacity>
                    <View style={{width:screen.width, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
                    
                    <Text style={styles.modalHeader}>
                      Manage Tags:
                    </Text>                        
                      <TouchableOpacity
                      onPress = { () => {this.setState({isVisible: false}); navigation.navigate('Create Tag');} }
                      >
                      <Text style={styles.button}>Create new tag</Text>
                      </TouchableOpacity>
                      <View style={{width:screen.width, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>


                  </ScrollView>
                </View>

              </Modal>

            </View>

          </View>
          </View>
      </View>
    );
  };
}


const screen = Dimensions.get("screen");
const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#A8DADC',
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: 'flex-start',
    height: screen.height / 2,
    width: screen.width,
    flex:0,

  },
  contentContainer: {
    width: screen.width,
  },
  modalHeader: {
    fontSize: 20,
    marginLeft:10,
    paddingTop:50,
  },
  bottomPad: {
    marginBottom: 150
  },
  modalText: {
    fontSize: 16,
    marginLeft:10,
    paddingTop:50,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  MainScreen: {
    flex: 1,
    backgroundColor: 'rgba(244,245,250,1)',
    alignItems: 'baseline',
    height: '100%'
  },
  button: {
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: 'rgba(244,245,250,1)',
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 5,
    shadowOpacity: .5,
    shadowColor: 'black',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 2,
    borderColor: 'rgba(69, 120, 144, 1)',
    borderRadius: 20,
  },
  buttonText: {
    color: 'rgba(69, 120, 144, 1)',
    marginBottom: 25,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 28,
    color: 'rgba(69, 120, 144, 1)',
    fontWeight: 'bold',
    marginBottom: 25,
  },
  TaskBarContainer:{
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    top: 30,
    justifyContent: 'space-evenly',
    position: 'absolute',
  },
  CircleOverlay:{
    width: '25%',
    height: '50%',
    borderRadius: 500000/2,
    backgroundColor: 'rgba(244,245,250,1)',
    alignItems: 'center',
  },
  innerCircle:{
    top: '10%',
    width: '80%',
    height: '80%',
    borderRadius: 500000/2,
    borderWidth: 1,
    borderColor: 'rgba(69, 120, 144, 1)',
    backgroundColor: 'rgba(244,245,250,1)',
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 5,
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
  },
  navBarContainer:{
    height: '25%',
    width: '100%',
    position: 'relative',
    top: 60,
    backgroundColor: 'transparent',
  },
  CircleOverlayMain:{
    width: '35%',
    height: '65%',
    bottom: 40,
    borderRadius: 500000/2,
    backgroundColor: 'rgba(244,245,250,1)',
    alignItems: 'center',
  },
  innerCircleMain:{
    top: '10%',
    width: '80%',
    height: '80%',
    borderRadius: 1080/2,
    borderWidth: 1,
    borderColor: 'rgba(69, 120, 144, 1)',
    backgroundColor: 'rgba(244,245,250,1)',
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 5,
    shadowOpacity: .5,
  }
});

