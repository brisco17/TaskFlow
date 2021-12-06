import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Dialog from "react-native-dialog";
import { FontAwesome5 } from "@expo/vector-icons";
import ModernHeader from "react-native-modern-header";
import * as Notifications from "expo-notifications";
import DateTimePicker from '@react-native-community/datetimepicker';

export default class CreateTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    // Initialize our login state
    this.state = {
      sessionToken: "",
      title: "",
      description: "",
      due_date: "",
      taskTag: {},
      tagPk: null,
      task: [],
      tags: [],
      subTasks: {},
      notificationsEnabled: false,
      reminder: null,
      reminderTime: null,
      reminderOptions: ["At task deadline", "30 minutes before", "1 hour before", "1 Day before", "2 Days before", "3 Days before"],
      subCreate: false,
      subTitleTemp: "",
      countries: ["Egypt", "Canada", "Australia", "Ireland"],
      drive: {},
      driveChoice: "",
      date: new Date(),
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  async getTags() {
    fetch("https://young-chow-productivity-app.herokuapp.com/tags/", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.sessionToken,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ tags: json }, () => {
          if (this.state.tagPk) {
            for (var tag in json) {
              if (json[tag].pk == this.state.tagPk)
                this.setState({ taskTag: json[tag] });
                console.log(this.state.taskTag)
            }
          }
          return {};
        });
      });
  }

  async checkSettings() {
    fetch("https://young-chow-productivity-app.herokuapp.com/settings/", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.sessionToken,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        json.forEach((obj) => {
          if (obj.name == "Notifications") {
            if (obj.value == "true") {
              this.setState({ notificationsEnabled: true });
              console.log('notifs: ' + this.state.notificationsEnabled);
            }
          }
        });
      });
  }

  async componentDidMount() {
    let taskToken = await SecureStore.getItemAsync("currentTask");
    let token = await SecureStore.getItemAsync("session");
    let driveData = await SecureStore.getItemAsync("DriveData");
    const curTask = JSON.parse(taskToken);

    if (token && taskToken) {
      console.log("Session: " + token);
      //All my homies hate asynchronous functions
      //I promise this either gets the subtasks or sets the varibable to an empty dictionary
      var subtasks = curTask.subtasks ? curTask.subtasks : {};
      console.log("TagPk: " + curTask.tag);
      this.setState(
        {
          sessionToken: token,
          task: curTask,
          title: curTask.title,
          date: new Date(curTask.due_date) ,
          description: curTask.description,
          subTasks: subtasks,
          reminder: curTask.reminder,
          tagPk: curTask.tag,
        },
        () => {
          this.getTags().then(() => {
            console.log("Now tag: " + this.state.taskTag);
          });
        }
      );
      await this.checkSettings();
    }
    if (driveData) {
      var temp = {};

      for (var data in JSON.parse(driveData)) {
        console.log(data);
        temp[JSON.parse(driveData)[data].name] = JSON.parse(driveData)[data].id;
      }

      console.log(temp);

      this.setState({
        drive: temp,
      });

      if (curTask.attachedFile) {
        console.log("file is already attatched!");

        for (const [key, value] in Object.entries(temp)) {
          if (value == curTask.attachedFile)
            this.setState({ driveChoice: key });
        }
      }
    }
  }

  onDateChange(date) {
    this.setState({
      due_date: date,
    });
  }

  onDeleteTask = () => {
    console.log("IN DELETE TASK" + this.state.task.id);
    fetch(
      "https://young-chow-productivity-app.herokuapp.com/tasks/" +
        this.state.task.id,
      {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Token " + this.state.sessionToken,
        }),
      }
    )
      .then(() => {
        console.log("Deleted Task");
        //console.log(json)
        Alert.alert("Task Succesfully Deleted");
      })
      .then(this.onBack());
  };

  async updatePushNotification(currReminder, reminderTime) {
    if (currReminder != "" && currReminder != null) {
      // await Notifications.cancelScheduledNotificationAsync(currReminder)
    }
    var trigger = new Date(this.state.date);
    console.log(trigger)

    if (reminderTime == "" || reminderTime == null) {
      return reminderTime;
    }
    if (reminderTime == "30 minutes before") {
      trigger.setMinutes(trigger.getMinutes() - 30)
    }
    if (reminderTime == "1 hour before") {
      trigger.setHours(trigger.getHours() - 1);
    }
    if (reminderTime == "1 day before") {
      trigger.setDate(trigger.getDate() - 1);
    }
    if (reminderTime == "2 days before") {
      trigger.setDate(trigger.getDate() - 2);
    }
    if (reminderTime == "3 days before") {
      trigger.setDate(trigger.getDate() - 3);
    }
    if (trigger < new Date()) {
      trigger = new Date()
      trigger.setSeconds(trigger.getSeconds() + 1)
    }

    // trigger = new Date();
    // console.log(trigger)
    // trigger.setSeconds(trigger.getSeconds() + 10);
    // console.log(trigger)
    console.log("after: " + this.state.due_date);

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: this.state.title,
        body: "This task is due in " + reminderTime,
      },
      trigger: trigger,
    });
    console.log("NOTIF TEST" + identifier);
    return identifier;
  }

  onSubmit = async () => {
    const { title, description, due_date, taskTag, date } = this.state;
    const { navigation } = this.props;
    const reminder = await this.updatePushNotification(
      this.state.reminder,
      this.state.reminderTime
    );

    //Checks if subTasks is emtpy. If it is, send null. Otherwise send value.
    const subtasks = Object.keys(this.state.subTasks).length
      ? this.state.subTasks
      : null;

    SecureStore.getItemAsync("session").then((sessionToken) => {
      fetch(
        "https://young-chow-productivity-app.herokuapp.com/tasks/" +
          this.state.task.id,
        {
          method: "PUT",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Token " + sessionToken,
          }),
          body: JSON.stringify({
            title: title,
            description: description,
            due_date: date,
            subtasks: subtasks,
            tag: this.state.taskTag.pk,
            reminder: reminder,
            attachedFile: this.state.drive[this.state.driveChoice],
          }),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          // enter login logic here
          console.log("Back to feed");
          if (!json.id) {
            if (json.title) Alert.alert("Error: ", json.title.toString());
            else if (json.description)
              Alert.alert("Error: ", json.description.toString());
            else if (json.due_date)
              Alert.alert("Error: ", json.due_date.toString());
            else {
              console.log("Error: " + JSON.stringify(json));
              Alert.alert(
                "Fatal Error, contact dev because something is wrong"
              );
            }
          } else {
            Alert.alert("Task has been successfully updated.");
            navigation.pop();
          }
        })
        .catch((exception) => {
          console.log("Error occured", exception);
          // Do something when login fails
        });
    });
  };

  changeCompletion(task) {
    var subs = this.state.subTasks;
    subs[task] = !subs[task];

    this.setState({ subTasks: subs });
  }

  makeSubTasks() {
    if (Object.keys(this.state.subTasks).length > 0) {
      return Object.keys(this.state.subTasks).map((task) => {
        const completed = this.state.subTasks[task];
        const color = completed ? "#457890" : "#904b45";
        return (
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[styles.subStyle, { backgroundColor: color }]}
              onPress={() => this.changeCompletion(task)}
            >
              <Text style={styles.subText}> {task} </Text>
            </TouchableOpacity>
          </View>
        );
      });
    }
  }

  createSubTask = () => {
    var tempSubs = this.state.subTasks;
    tempSubs[this.state.subTitleTemp] = false;

    this.setState(
      {
        subCreate: false,
        subTitleTemp: "",
        subTasks: tempSubs,
      },
      () => {
        this.render();
      }
    );
  };

  updateSubModal = () => {
    const toSet = this.state.subCreate ? false : true;
    this.setState({
      subCreate: toSet,
    });
  };
  onBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };

  render() {
    const { navigation } = this.props;
    // const open = false

    return (
      <SafeAreaView style={styles.MainSafe}>
        <ModernHeader
          style={{ backgroundColor: "rgba(244,245,250,0)", top: -15 }}
          rightCustomComponent={
            <FontAwesome5 name="trash-alt" size={24} color="black" />
          }
          onLeftPress={() => this.onBack()}
          onRightPress={() => this.onDeleteTask()}
        />
        <ScrollView
          contentContainerStyle={styles.mainScrollContainer}
          keyboardShouldPersistTaps={"never"}
          contentInset={{ top: -40 }}
          scrollEnabled={true}
        >
          <FontAwesome5 style = {{position: 'absolute',top: '8%', left: 10}} name="tasks" size={24} color="black" />
          <Text style={styles.titleText}>Edit Title & Description</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ title: text })}
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
            onChangeText={(text) => this.setState({ description: text })}
            value={this.state.description}
            placeholder="Description"
            placeholderTextColor="rgba(168, 218, 220, 1)"
            textContentType="none"
            textAlignVertical="top"
            multiline={true}
          />

          <Text style = {{position: 'absolute', top: '30%', left: 50}}>Set Date</Text>
          <Text style = {{position: 'absolute', top: '30%', right: 50}}>Set Time</Text>
          <View style={styles.rowContainer}>
            <TouchableOpacity style = {{flexGrow: 1, top: 25}}>
             <DateTimePicker 
               value={this.state.date}
               mode='date'
               display='default'
               minimumDate={new Date()}
               onChange={ (e, d) => {this.setState({ date: d }); 
                                     console.log(this.state.date.toString()) }}/>
              </TouchableOpacity>
              
              <TouchableOpacity style = {{flexGrow:1, top: 25}}>
             <DateTimePicker 
                 value={this.state.date}
                 mode='time'
                 display='default'
                 minimumDate={new Date()}
                 onChange={ (e, d) => {this.setState({ date: d });
                                      console.log(this.state.date.toString()); }} />
              </TouchableOpacity>
           </View>


          <SelectDropdown
            data={Object.keys(this.state.drive).sort()}
            defaultButtonText={
              this.state.driveChoice
                ? this.state.driveChoice
                : "Select Drive File"
            }
            onSelect={(selectedItem, index) => {
              this.setState({ driveChoice: selectedItem });
              console.log(this.state.drive);
              console.log("new item selected");
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
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

          {this.state.notificationsEnabled == true &&
             (
              <SelectDropdown
                data={this.state.reminderOptions}
                defaultButtonText={"Set Reminder"}
                onSelect={(selectedItem, index) => {
                  this.setState({ reminderTime: selectedItem });
                  console.log("new reminder time selected");
                  console.log(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
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
            )}

          <SelectDropdown
            data={this.state.tags}
            defaultButtonText={
              this.state.taskTag.title
              ? this.state.taskTag.title
              : "Select Tag"
            }
            onSelect={(selectedItem, index) => {
              this.setState({ taskTag: selectedItem });
              console.log("new tag selected");
              console.log(this.state.taskTag.title);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem.title;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item.title;
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
            style={styles.makeSub}
            onPress={this.updateSubModal}
          >
            <Text style={styles.buttonText}> Create New Subtask </Text>
          </TouchableOpacity>

          <Dialog.Container visible={this.state.subCreate}>
            <Dialog.Title>Create Subtask</Dialog.Title>
            <Dialog.Input
              onChangeText={(title) => this.setState({ subTitleTemp: title })}
              value={this.state.subTitleTemp}
              placeholder={"Subtask Title"}
            ></Dialog.Input>
            <Dialog.Button label="Cancel" onPress={this.updateSubModal} />
            <Dialog.Button label="Confirm" onPress={this.createSubTask} />
          </Dialog.Container>

          <View style={{width: "100%", height: 100 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <SafeAreaView>
                <View>{this.makeSubTasks()}</View>
              </SafeAreaView>
            </ScrollView>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onSubmit()}
          >
            <Text style={styles.buttonText}> Submit </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    width: "80%",
    height: 50,
    left: 35,
    backgroundColor: "rgba(256, 256, 256, 1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    top: 10,
    marginBottom: 20,
  },
  dropdown1BtnTxtStyle: { color: "rgba(50, 50, 50, 1)", textAlign: "center" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "rgba(50, 50, 50, 1)", textAlign: "left" },
  container: {
    width: "100%",
    backgroundColor: "rgba(244,245,250,1)",
    alignItems: "center",
  },
  scrollContainer: {
    width: "100%",
    backgroundColor: "rgba(244,245,250,1)",
    justifyContent: "space-evenly",
    left: "10%",
    flexGrow: 1,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
    top: "10%",
    backgroundColor: "black",
  },
  rowContainer: {
    //backgroundColor: 'black',
    height: 75,
    flexDirection: "row",
    right: 30,
    width: '100%',
    position: 'relative',
  },
  calContainer: {
    maxHeight: "30%",
    position: "relative",
    width: Dimensions.get("window").width,
    marginBottom: "40%",
  },
  button: {
    height: 45,
    width: "65%",
    left: 50,
    alignItems: "center",
    position: "relative",
    backgroundColor: "rgba(256, 256, 256, 1)",
    borderRadius: 10,
    padding: 10,
    shadowRadius: 3,
    marginTop: 20,
    shadowColor: "rgba(50, 50, 50, 1)",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
  },
  subStyle: {
    width: "80%",
    height: 50,
    alignContent: 'center',
    backgroundColor: "rgba(69, 120, 144, 1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(50, 50, 50, 1)",
    marginBottom: 10,
    fontSize: 16,
    color: "white",
    paddingEnd: 20,
  },
  makeSub: {
    height: 45,
    width: "70%",
    left: 50,
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "rgba(256, 256, 256, 1)",
    borderRadius: 10,
    padding: 10,
    shadowRadius: 3,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
  },
  buttonText: {
    height: 25,
    top: 3,
    color: "rgba(50, 50, 50, 1)",
    fontWeight: "bold",
  },
  subText: {
    color: "rgba(255, 255, 255, 1)",
    marginTop: 14,
  },
  titleText: {
    textAlign: "center",
    fontSize: 28,
    color: "rgba(50, 50, 50, 1)",
    fontWeight: "bold",
    marginBottom: 25,
  },
  loginText: {
    fontSize: 50,
    textAlign: "center",
    color: "rgba(29, 53, 87, 1)",
    textShadowColor: "rgba(29, 53, 87, 1)",
    textShadowOffset: { height: 2 },
    textShadowRadius: 10,
  },
  input: {
    height: 60,
    width: "100%",
    fontSize: 16,
    paddingStart: 50,
    marginBottom: 20,
    textAlign: "left",
    borderRadius: 20,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    backgroundColor: "rgba(0,0,20,0)",
    color: "rgba(50, 50, 50, 1)",
  },
  largeInput: {
    height: "15%",
    width: "100%",
    fontSize: 16,
    paddingStart: 20,
    borderWidth: 1,
    textAlign: "left",
    paddingTop: "5%",
    borderRadius: 20,
    borderWidth: 2,
    position: "relative",
    backgroundColor: "rgba(244,245,250,1)",
    color: "rgba(50, 50, 50, 1)",
  },
  checkbox: {
    alignSelf: "flex-end",
  },
  MainSafe: {
    flexGrow: 1,
    alignContent: "center",
    backgroundColor: "rgba(244,245,250,1)",
  },
  mainScrollContainer: {
    marginTop: "30%",
    height: '130%',
    marginHorizontal: 20,
  },
});
