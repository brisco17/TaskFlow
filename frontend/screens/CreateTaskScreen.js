import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
      tags: [],
      taskTag: {},
      notificationsEnabled: false,
      reminderTime: null,
      reminderOptions: ["1 Day", "2 Days", "3 Days"],
      date: new Date(),
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  async componentDidMount() {
    let token = await SecureStore.getItemAsync("session");

    if (token) {
      console.log("Token " + token);
      this.setState({ sessionToken: token });
      this.getTags();
    }
    await this.checkSettings();
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
            }
          }
        });
      });
  }

  getTags() {
    fetch("https://young-chow-productivity-app.herokuapp.com/tags/", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.sessionToken,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        var tagArray = [];
        for (var tag in json) {
          tagArray.push(json[tag].title);
        }
        this.setState({ tags: json });
        console.log(this.state.tags);
      });
  }

  onDateChange(date) {
    console.log(Dimensions.get("window").width);
    this.setState({
      due_date: date,
    });
  }

  onBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };

  async schedulePushNotification(reminderTime) {
    var trigger = new Date(this.state.due_date);

    if (reminderTime == "" || reminderTime == null) {
      return reminderTime;
    }
    if (reminderTime == "1 day") {
      trigger.setDate(trigger.getDate() - 1);
    }
    if (reminderTime == "2 days") {
      trigger.setDate(trigger.getDate() - 2);
    }
    if (reminderTime == "3 days") {
      trigger.setDate(trigger.getDate() - 3);
    }

    // trigger = new Date();
    // console.log(trigger)
    // trigger.setSeconds(trigger.getSeconds() + 10);
    // console.log(trigger)

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: this.state.title,
        body: "This task is due in " + reminderTime,
      },
      trigger: trigger,
    });
    console.log("NOTIF TEST" + identifier);
    console.log(trigger);
    return identifier;
  }

  onSubmit = async () => {
    const { title, description, due_date, taskTag, date } = this.state;
    const { navigation } = this.props;
    const reminder = await this.schedulePushNotification(
      this.state.reminderTime
    );

    const formatted = moment(date).format("YYYY-MM-DD");
    console.log("Due Date: " + formatted);

    SecureStore.getItemAsync("session").then((sessionToken) => {
      fetch("https://young-chow-productivity-app.herokuapp.com/tasks/", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Token " + sessionToken,
        }),
        body: JSON.stringify({
          title: title,
          description: description,
          due_date: date,
          tag: parseInt(taskTag.pk),
          reminder: reminder,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          // enter login logic here
          console.log(json);
          if (!json.id) {
            if (json.title) Alert.alert("Error: ", json.title.toString());
            else if (json.description)
              Alert.alert("Error: ", json.description.toString());
            else if (json.due_date)
              Alert.alert("Error: ", json.due_date.toString());
            else
              Alert.alert(
                "Fatal Error, contact dev because something is wrong"
              );
          } else {
            Alert.alert("Task has been successfully created.");
            navigation.pop();
          }
        })
        .catch((exception) => {
          console.log("Error occured", exception);
          // Do something when login fails
        });
    });
  };

  render() {
    const { navigation } = this.props;
    // const open = false

    return (
      <View style={styles.MainScreen}>
        <ModernHeader
          style={{ backgroundColor: "rgba(244,245,250,0)", top: 10 }}
          rightComponentDisable={true}
          onLeftPress={() => this.onBack()}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <FontAwesome5
            style={{ postion: "absolute", right: "37%", top: "6%" }}
            name="tasks"
            size={24}
            color="black"
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ title: text })}
              value={this.state.title}
              placeholder="Title for Reminder"
              placeholderTextColor="rgba(69, 120, 144, 1)"
              textContentType="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.largeInput}
              onChangeText={(text) => this.setState({ description: text })}
              value={this.state.description}
              placeholder="Description"
              placeholderTextColor="rgba(69, 120, 144, 1)"
              textContentType="none"
              textAlignVertical="top"
              multiline={true}
            />
          </View>
          <Text style = {{position: 'absolute', top: '53%', left: 50}}>Set Date</Text>
          <Text style = {{position: 'absolute', top: '53%', left: 227}}>Set Time</Text>
          <View style={styles.rowContainer}>
            <TouchableOpacity style = {{flexGrow: 1, top: 10}}>
             <DateTimePicker 
               value={this.state.date}
               mode='date'
               display='default'
               minimumDate={new Date()}
               onChange={ (e, d) => {this.setState({ date: d }); 
                                     console.log(this.state.date.toString()) }}/>
              </TouchableOpacity>
              
              <TouchableOpacity style = {{flexGrow:1, top: 10}}>
             <DateTimePicker 
                 value={this.state.date}
                 mode='time'
                 display='default'
                 minimumDate={new Date()}
                 onChange={ (e, d) => {this.setState({ date: d });
                                      console.log(this.state.date.toString()); }} />
              </TouchableOpacity>
           </View>
          {this.state.notificationsEnabled == true && (
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
            defaultButtonText={"Select Tag"}
            onSelect={(selectedItem, index) => {
              this.setState({ taskTag: selectedItem });
              console.log("new tag selected");
              console.log(selectedItem);
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
            style={styles.button}
            onPress={() => this.onSubmit()}
          >
            <Text style={styles.buttonText}> Submit </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    width: "60%",
    height: 50,
    bottom: "25%",
    backgroundColor: "rgba(256, 256, 256, 1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    bottom: 100,
  },
  dropdown1BtnTxtStyle: { color: "rgba(69, 120, 144, 1)", textAlign: "center" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  container: {
    flex: 1,
    backgroundColor: "rgba(244,245,250,1)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    justifyContent: "center",
  },
  rowContainer: {
    //backgroundColor: 'black',
    flex: 1,
    flexDirection: "row",
    right: 30,
    width: '100%',
    height: 40,
    position: 'relative',
    zIndex: 999,
    bottom: 80,
    marginTop: 10,
    marginBottom: 20,
  },
  calContainer: {
    flexDirection: "row",
    position: "relative",
    justifyContent: "space-between",
    marginTop: 10,
    maxHeight: "30%",
    width: Dimensions.get("window").width,
    backgroundColor: "rgba(244,245,250,1)",
  },
  button: {
    height: 45,
    bottom: "10%",
    width: "65%",
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
    color: "rgba(69, 120, 144, 1)",
    fontWeight: "bold",
  },
  loginText: {
    bottom: "10%",
    fontSize: 50,
    textAlign: "center",
    color: "rgba(29, 53, 87, 1)",
    textShadowColor: "rgba(29, 53, 87, 1)",
    textShadowOffset: { height: 2 },
    textShadowRadius: 10,
  },
  input: {
    height: 60,
    width: "90%",
    left: "5%",
    fontSize: 16,
    paddingStart: 50,
    marginBottom: 20,
    textAlign: "left",
    borderRadius: 20,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    backgroundColor: "rgba(0,0,20,0)",
    color: "rgba(69, 120, 144, 1)",
  },
  largeInput: {
    height: "40%",
    width: "90%",
    left: "5%",
    fontSize: 16,
    paddingStart: 20,
    borderWidth: 1,
    marginBottom: 20,
    textAlign: "left",
    paddingTop: "5%",
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "rgba(244,245,250,1)",
    color: "rgba(69, 120, 144, 1)",
  },
  MainScreen: {
    flex: 1,
    backgroundColor: "rgba(244,245,250,1)",
    height: "100%",
  },
});
