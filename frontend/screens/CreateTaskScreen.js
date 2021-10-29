import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'

export default class CreateTaskScreen extends React.Component{
  constructor(props) {
    super(props)
    // Initialize our login state
    this.state = {
      title: '',
      description: '',
      due_date: '',
    }
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    console.log(Dimensions.get('window').width)
    this.setState({
      due_date: date,
    });
  }

  onSubmit = () => {
    const { title, description, due_date } = this.state;
    const {navigation} = this.props;
    

    // I don't want to talk about it
    var stringDate = due_date.toString().slice(due_date.toString().indexOf(" ")+1, due_date.toString().indexOf("2021 ")+4)
    const formatted = moment(new Date(stringDate)).format('YYYY-MM-DD')
    console.log(formatted)

    SecureStore.getItemAsync('session').then(sessionToken => {
      fetch("https://young-chow-productivity-app.herokuapp.com/tasks/", {
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + sessionToken
        }),
        body: JSON.stringify({
          title: title,
          description: description,
          due_date: formatted
        })
      })
      .then(response => response.json())
      .then(json => {
        // enter login logic here
        console.log(json)
        if(!json.id) {
          if (json.title) Alert.alert("Error: ", json.title.toString())
          else if (json.description) Alert.alert("Error: ", json.description.toString())
          else if (json.due_date) Alert.alert("Error: ", json.due_date.toString())
          else Alert.alert("Fatal Error, contact dev because something is wrong")
        }
        else
        {
          Alert.alert("Task has been successfully created.")
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
    // const open = false

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => this.setState({ title: text })}
            value={this.state.title}
            placeholder="Title for Reminder"
            placeholderTextColor="rgba(168, 218, 220, 1)"
            textContentType="none"
          />
        </View>

        <View style={styles.calContainer}>
          <CalendarPicker
            scaleFactor={Dimensions.get('window').width}
            onDateChange={this.onDateChange}
          />
        </View>

        <View style={styles.inputContainer}>
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
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: "100%",
    justifyContent: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    maxHeight: '30%',
    width: Dimensions.get('window').width
    
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
  buttonText: {
    color: 'rgba(168, 218, 220, 1)',
    fontWeight: 'bold'
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
    height: 60,
    width: '90%',
    left: '5%',
    fontSize: 16,
    paddingStart: 40,
    paddingEnd: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'left',
    borderRadius: 100,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    color: 'white',
  },
  largeInput: {
    height: '40%',
    width: '90%',
    left: '5%',
    fontSize: 16,
    paddingStart: 40,
    paddingEnd: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'left',
    paddingTop: '5%',
    marginBottom: '5%',
    borderRadius: 100,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    color: 'white',
  },


  
});
