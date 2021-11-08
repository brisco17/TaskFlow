import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity, Alert, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Dialog from 'react-native-dialog';

export default class CreateTaskScreen extends React.Component{
  constructor(props) {
    super(props)
    // Initialize our login state
    this.state = {
      sessionToken: '',
      title: '',
      description: '',
      due_date: '',
      taskTag: {},
      tagPk: null,
      task: [],
      tags: [],
      subTasks: {},
      subCreate: false,
      subTitleTemp: '',
      countries: ["Egypt", "Canada", "Australia", "Ireland"]
    }
    this.onDateChange = this.onDateChange.bind(this);
  }

  async getTags() {
    fetch("https://young-chow-productivity-app.herokuapp.com/tags/", {
      method: "GET",
      headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.sessionToken
        }),
      })
    .then((response => response.json()))
    .then(json => {
      this.setState({tags: json}, () => {
        if(this.state.tagPk) {
          for (var tag in json) {
            if(json[tag].pk == this.state.tagPk) this.setState({taskTag: json[tag]})
          }
        }
        return {}
      })
     }
    )
  }


  async componentDidMount() {
    let taskToken = await SecureStore.getItemAsync('currentTask')
    let token = await SecureStore.getItemAsync('session')
    const curTask = JSON.parse(taskToken)

    if (token && taskToken) {
      console.log('Session: ' + token)
      //All my homies hate asynchronous functions
      //I promise this either gets the subtasks or sets the varibable to an empty dictionary
      var subtasks = curTask.subtasks ? curTask.subtasks : {}
      console.log("TagPk: " + curTask.tag)
      this.setState({
        sessionToken: token,
        task: curTask,
        title: curTask.title,
        due_date: moment(new Date(curTask.due_date)),
        description: curTask.description,
        subTasks: subtasks,
        tagPk: curTask.tag
      }, () => {
        this.getTags().then(() => {
          console.log("Now tag: " + this.state.taskTag)
        })
      });
      
      
    }
  }


  onDateChange(date) {
    this.setState({
      due_date: date,
    });
  }



  onSubmit = () => {
    const { title, description, due_date, taskTag } = this.state;
    const {navigation} = this.props;
    

    // I don't want to talk about it
    var stringDate = due_date.toString().slice(due_date.toString().indexOf(" ")+1, due_date.toString().indexOf("2021 ")+4)
    const formatted = moment(new Date(stringDate)).format('YYYY-MM-DD')
    //Checks if subTasks is emtpy. If it is, send null. Otherwise send value.
    const subtasks = Object.keys(this.state.subTasks).length ? this.state.subTasks : null

    SecureStore.getItemAsync('session').then(sessionToken => {
      fetch("https://young-chow-productivity-app.herokuapp.com/tasks/" + this.state.task.id, {
        method: "PUT",
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + sessionToken
        }),
        body: JSON.stringify({
          title: title,
          description: description,
          due_date: formatted,
          subtasks: subtasks,
          tag: this.state.taskTag.pk
        })
      })
      .then(response => response.json())
      .then(json => {
        // enter login logic here
        console.log("We here now bois")
        if(!json.id) {
          if (json.title) Alert.alert("Error: ", json.title.toString())
          else if (json.description) Alert.alert("Error: ", json.description.toString())
          else if (json.due_date) Alert.alert("Error: ", json.due_date.toString())
          else Alert.alert("Fatal Error, contact dev because something is wrong")
        }
        else
        {
          Alert.alert("Task has been successfully updated.")
          navigation.pop()
        }
      })
      .catch(exception => {
          console.log("Error occured", exception);
          // Do something when login fails
      })
    })

  }

  changeCompletion(task) {
    var subs = this.state.subTasks
    subs[task] = !subs[task]

    this.setState({subTasks: subs})
  }

  makeSubTasks() {
    if (Object.keys(this.state.subTasks).length > 0) {
      return Object.keys(this.state.subTasks).map((task) => {
        const completed = this.state.subTasks[task]
        const color = completed ? "#457890" : "#904b45"
          return (
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[ styles.subStyle, { backgroundColor: color } ]}   
              onPress={() => this.changeCompletion(task)}
            >
              <Text style={styles.subText}> {task} </Text>
            </TouchableOpacity>
            

          </View>
          )
        })
      }
  }

  createSubTask = () => {
    var tempSubs = this.state.subTasks
    tempSubs[this.state.subTitleTemp] = false


    this.setState({
      subCreate: false,
      subTitleTemp: "",
      subTasks: tempSubs}, () => {
        this.render()
      });
  }

  updateSubModal = () => {
    const toSet = this.state.subCreate ? false : true
    this.setState({
      subCreate: toSet
    })
  }
  
  
  render() {
    const {navigation} = this.props;
    // const open = false

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.titleText}>Edit Title & Description</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => this.setState({ title: text })}
            value={this.state.title}
            placeholder="Title for Reminder"
            placeholderTextColor="rgba(168, 218, 220, 1)"
            textContentType="none"
          />

          {/* <View style={styles.calContainer}>
            <CalendarPicker
              scaleFactor={Dimensions.get('window').width}
              onDateChange={this.onDateChange}
            />
          </View> */}
        
          <TextInput
            style={styles.largeInput}
            onChangeText={text => this.setState({ description: text })}
            value={this.state.description}
            placeholder="Description"
            placeholderTextColor="rgba(168, 218, 220, 1)"
            textContentType="none"
            textAlignVertical="top"
            multiline={true}
          />
        </View>

        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView>
        <View>
          {this.makeSubTasks()}
          <TouchableOpacity
                style={styles.makeSub}
                onPress={this.updateSubModal}
          >
            <Text style={styles.buttonText}> Create New Subtask </Text>
          </TouchableOpacity>
          <Dialog.Container visible={this.state.subCreate}>
              <Dialog.Title>Create Subtask</Dialog.Title>
              <Dialog.Input 
              onChangeText={title => this.setState({subTitleTemp: title})}
              value={this.state.subTitleTemp}
              placeholder={'Subtask Title'}
              ></Dialog.Input>
              <Dialog.Button label="Cancel" onPress={this.updateSubModal}/>
              <Dialog.Button label="Confirm" onPress={this.createSubTask}/>
            </Dialog.Container>
        </View>

        <SelectDropdown
          data={this.state.tags}
          defaultButtonText={"Select Tag"}
          onSelect={(selectedItem, index) => {
            this.setState({taskTag: selectedItem})
            console.log("new tag selected")
            console.log(this.state.taskTag.title)
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem.title
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item.title
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={() => {
            return (
              <FontAwesome name="chevron-down" color={"#444"} size={18} />
            );
          }}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
        

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.onSubmit()}
        >
          <Text style={styles.buttonText}> Submit </Text>
        </TouchableOpacity>
         </SafeAreaView>
      </ScrollView>
     
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    width: "60%",
    height: 50,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 30
  },
  dropdown1BtnTxtStyle: { color: 'rgba(168, 218, 220, 1)', textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  container: {
    flex: 1,
    backgroundColor: '#FAEBEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    marginTop: "25%",
    minHeight: "35%",
    backgroundColor: '#FAEBEF',
    justifyContent: 'center',
    left: "5%",
    flexGrow: 1
  },
  inputContainer: {
    width: "100%",
    justifyContent: 'center',
    top: "10%"
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calContainer: {
    maxHeight: '30%',
    width: Dimensions.get('window').width,
    marginBottom: '40%' 
    
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(69, 120, 144, 1)',
    marginHorizontal: 8,
    color: '#fff',
    borderRadius: 100,
    width: '45%',
    padding: 10,
  },
  subStyle: {
    width: "80%",
    height: 50,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 10,
    fontSize: 16,
    color: 'white',
    paddingStart: 20,
    paddingEnd: 20,
  },
  makeSub: {
    width: "80%",
    height: 50,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 10,
    color: 'white',
    paddingTop: 13,
    paddingStart: 20,
    paddingEnd: 20,
  },
  buttonText: {
    color: 'rgba(168, 218, 220, 1)',
    fontWeight: 'bold'
  },
  subText: {
    color: 'rgba(255, 255, 255, 1)',
    marginTop: 14
  },
  titleText: {
    textAlign: 'center',
    fontSize: 28,
    color: 'rgba(69, 120, 144, 1)',
    fontWeight: 'bold',
    marginBottom: 25,
    bottom: "20%"
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
    marginTop: "10%",
    height: 60,
    bottom: 100,
    width: '90%',
    left: '5%',
    fontSize: 16,
    paddingStart: 40,
    paddingEnd: 40,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'left',
    borderRadius: 100,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    color: 'white',
  },
  largeInput: {
    height: 125,
    width: '90%',
    bottom: 80,
    left: '5%',
    fontSize: 16,
    paddingStart: 40,
    paddingEnd: 40,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'left',
    paddingTop: '3%',
    borderRadius: 100,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    color: 'white',
    marginBottom: '5%'
  },
  checkbox: {
    alignSelf: "flex-end",
  },
});
