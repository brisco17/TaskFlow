import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Modal from "react-native-modal";
import {
  Ionicons,
  SimpleLineIcons,
  Foundation,
  Entypo,
} from "@expo/vector-icons";
import ModernHeader from "react-native-modern-header";
import * as Font from "expo-font";
import ScrollingButtonMenu from "react-native-scroll-menu";

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: SecureStore.getItemAsync("email") || "",
      sessionToken: "",
      isVisible: false,
      tagVisible: false,
      tags: [],
      scrollOffset: null,
      taskSet: [],
      displayTasks: [],
      appliedTag: "",
      appliedTagID: Number.MAX_SAFE_INTEGER,
      menus: [],
      fontsLoaded: false,
      searchQuery: "",
    };
  }

  async loadFonts() {
    await Font.loadAsync({
      // Load a font `Montserrat` from a static resource
      AvenirNextMedium: require("../assets/AvenirNext-Medium.otf"),

      // Any string can be used as the fontFamily name. Here we use an object to provide more control
      "AvenirNext-Medium": {
        uri: require("../assets/AvenirNext-Medium.otf"),
        display: Font.FontDisplay.FALLBACK,
      },
    });
    this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
    this.loadFonts();
    let token = await SecureStore.getItemAsync("session");

    if (token) {
      console.log("User Token: " + token);
      this.setState({ sessionToken: token });
      this.getTags();
      this.getTasks();
      this._unsubscribe = this.props.navigation.addListener("focus", () => {
        this.getTags();
        this.getTasks();
        console.log("task & tag refresh occured");
      });
    }
  }

  goToDetails(task) {
    const { navigation } = this.props;
    SecureStore.setItemAsync("currentTask", JSON.stringify(task)).then(() => {
      navigation.navigate("TaskDetailScreen");
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
        this.setState({ tags: json });
        let arr = this.state.tags;

        let arr2 = arr.map((tag) => ({ name: tag.title, id: tag.pk }));
        let arr3 = [{ id: Number.MAX_SAFE_INTEGER, name: "All" }];

        this.setState({ menus: arr3.concat(arr2) });
        this.setState({ appliedTagID: Number.MAX_SAFE_INTEGER });
      });
  }

  getTasks() {
    fetch("https://young-chow-productivity-app.herokuapp.com/tasks/", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.sessionToken,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ taskSet: json, displayTasks: json });
        console.log("Retrived user tasks");
        console.log(this.state.taskSet);
      });
  }

  makeTasks() {
    if (this.state.displayTasks.length > 0) {
      console.log("HERE" + this.state.displayTasks.length);
      return this.state.displayTasks.map((task) => {
        const due_date = new Date(task.due_date)
        return (
          <>
            <TouchableOpacity
              style={styles.taskButton}
              onPress={() => this.goToDetails(task)}
            >
              <Text style={styles.titleText}> {task.title} </Text>
              <Text style={styles.buttonText}> {task.description} </Text>
              <Text style={styles.buttonText}>
                {"\n"}
                {"Due Date: " + due_date.toLocaleDateString() + "\n"}
                {"Time: " + due_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                {"\n"}
              </Text>
              <Text style={styles.buttonText}>
                {"Created: " + task.creation_date}{" "}
              </Text>
            </TouchableOpacity>
          </>
        );
      });
    } else {
      return <Text style={styles.modalText}> No tasks to display </Text>;
    }
  }

  showTasksByTag(tag) {
    /*
    Note: tags are ordinary tag objects as sent by the API
          However, the premade Due Date and Creation tags are
          sent into this function as just strings to make them
          special cases.
    */
    console.log("Applied Tag: " + tag.title);

    var tasks = [];

    if (tag == this.state.appliedTag || tag == "All") {
      this.setState({
        displayTasks: this.state.taskSet,
        appliedTag: "",
        appliedTagID: Number.MAX_SAFE_INTEGER,
      });
      console.log("Removed applied tag");
    } else if (tag == "due_date") {
      console.log("sorting by due date");
      var dateSortedArray = this.state.displayTasks.slice();
      dateSortedArray.sort(function (a, b) {
        return new Date(a.due_date) - new Date(b.due_date);
      });
      this.setState({ displayTasks: dateSortedArray, appliedTag: tag });
    } else if (tag == "creation_date") {
      console.log("sorting by task creation date");
      var dateSortedArray = this.state.displayTasks.slice();
      dateSortedArray.sort(function (a, b) {
        return new Date(b.creation_date) - new Date(a.creation_date);
      });
      this.setState({ displayTasks: dateSortedArray, appliedTag: tag });
    } else {
      console.log("Sorting by user defined tag");
      if (this.state.taskSet.length > 0) {
        tasks = this.state.taskSet.filter((item) => item.tag == tag.pk);
        console.log(tasks);
      }
      console.log(tasks);
      this.setState({
        displayTasks: tasks,
        appliedTag: tag,
        appliedTagID: tag.pk,
      });
    }
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  changeState = () => {
    if (this.state.isVisible) {
      this.setState({ isVisible: false });
    } else {
      this.setState({ isVisible: true });
    }
  };

  changeTagState = () => {
    if (this.state.tagVisible) {
      this.setState({ tagVisible: false });
    } else {
      this.setState({ tagVisible: true });
    }
  };

  handleOnScroll = (event) => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
    });
  };

  onDeleteTag(tag) {
    console.log("IN DELETE TAG" + tag.pk);
    const { navigation } = this.props;
    fetch("https://young-chow-productivity-app.herokuapp.com/tags/" + tag.pk, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.sessionToken,
      }),
    })
      .then(() => {
        console.log("Deleted Tag");
        //console.log(json)
        Alert.alert("Tag Succesfully Deleted");
        this.getTags();
      })
      .then(this.changeTagState());
  }

  showTags() {
    if (this.state.tags.length > 0) {
      return this.state.tags.map((tag) => {
        return (
          <>
            <TouchableOpacity
              key={"tag" + tag.id}
              onPress={() => this.showTasksByTag(tag)}
            >
              <Text style={styles.button}>{tag.title}</Text>
            </TouchableOpacity>
            <View
              key={"view" + tag.id}
              style={{
                width: screen.width,
                borderBottomColor: "black",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          </>
        );
      });
    } else {
      return <Text style={styles.modalText}> No tags exist </Text>;
    }
  }

  deleteTag() {
    if (this.state.appliedTagID != Number.MAX_SAFE_INTEGER) {
      return this.state.tags.map((tag) => {
        console.log("TAG: " + tag + "tag.title value " + tag.title);
        console.log(
          "APPLIEDTAG: " +
            this.state.appliedTag +
            "appliedTAg name is" +
            this.state.appliedTag.title
        );
        console.log(tag.title === this.state.appliedTag.title);
        if (tag.title === this.state.appliedTag.title) {
          return (
            <>
              <TouchableOpacity
                key={"tag" + tag.id}
                onPress={() => this.onDeleteTag(tag)}
              >
                <Text style={styles.button}>{tag.title}</Text>
              </TouchableOpacity>
              <View
                key={"view" + tag.id}
                style={{
                  width: screen.width,
                  borderBottomColor: "black",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            </>
          );
        } else {
          return <Text style={styles.modalText}> No tag selected </Text>;
        }
      });
    } else {
      return <Text style={styles.modalText}> No tag selected </Text>;
    }
  }

  render() {
    const taskNum = this.state.displayTasks.length;
    if (!this.state.fontsLoaded) return null;

    const { navigation } = this.props;
    return (
      <View style={styles.MainScreen}>
        <ModernHeader
          style={{ backgroundColor: "rgba(244,245,250,0)", top: 10 }}
          leftComponentDisable={true}
          rightCustomComponent={
            <Entypo name="dots-three-horizontal" size={24} color="black" />
          }
          onRightPress={() => this.changeTagState()}
        />
        <View style={styles.tagContainer}>
          <TextInput
            style={styles.tabItem}
            underlineColorAndroid="transparent"
            placeholder="Search"
            onChangeText={(text) => this.setState({ searchQuery: text })}
            placeholderTextColor="#858585"
          />
          <View
            style={{
              width:
                this.state.searchQuery.length > 7
                  ? screen.width - this.state.searchQuery.length * 10
                  : screen.width - 45,
            }}
          >
            <ScrollingButtonMenu
              // Checks if search query exists. If so, filter by it (excluding "All"). Otherwise don't.
              items={
                this.state.searchQuery
                  ? this.state.menus.filter(
                      (word) =>
                        word.name == "All" ||
                        word.name.includes(this.state.searchQuery)
                    )
                  : this.state.menus
              }
              onPress={(e) => {
                if (e.name === "All") {
                  this.showTasksByTag(e.name);
                } else {
                  this.showTasksByTag(
                    this.state.tags.find((tag) => tag.pk === e.id)
                  );
                }
              }}
              selected={this.state.appliedTagID}
            ></ScrollingButtonMenu>
          </View>
        </View>

        <View style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {this.makeTasks()}
          </ScrollView>
        </View>

        <View
          style={{
            height: 50,
            width: "100%",
            position: "absolute",
            backgroundColor: "#A8DADC",
            bottom: "0%",
          }}
        />
        <View style={styles.TaskBarContainer}>
          <View style={styles.CircleOverlay}>
            <TouchableOpacity
              style={styles.innerCircle}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons
                style={{ padding: 12, left: 5 }}
                name="settings-sharp"
                size={40}
                color="rgba(69, 120, 144, 1)"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.CircleOverlayMain}>
            <TouchableOpacity
              style={styles.innerCircleMain}
              onPress={() => navigation.navigate("Create Task")}
            >
              <Foundation
                style={{ padding: 18, left: 15 }}
                name="plus"
                size={50}
                color="rgba(69, 120, 144, 1)"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.CircleOverlay}>
            <TouchableOpacity
              style={styles.innerCircle}
              onPress={this.changeState}
            >
              <Foundation
                style={{ padding: 15, left: 5 }}
                name="filter"
                size={40}
                color="rgba(69, 120, 144, 1)"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          // FILTER TASK MODAL
          isVisible={this.state.isVisible}
          propagateSwipe={true}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropTransitionOutTiming={0}
          onBackdropPress={this.changeState}
          onSwipeComplete={this.changeState}
          swipeDirection={["down"]}
          propagateSwipe
          scrollOffset={this.state.scrollOffset}
          style={styles.bottomModal}
        >
          <View style={styles.modalView}>
            <ScrollView onScroll={this.handleOnScroll} scrollEventThrottle={16}>
              <Text style={styles.modalHeader}>Filter by:</Text>
              <TouchableOpacity onPress={() => this.showTasksByTag("due_date")}>
                <Text style={styles.button}> Due Date</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: screen.width,
                  borderBottomColor: "black",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
              <TouchableOpacity
                title={"Created"}
                onPress={() => this.showTasksByTag("creation_date")}
              >
                <Text style={styles.button}>Created</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: screen.width,
                  borderBottomColor: "black",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            </ScrollView>
          </View>
        </Modal>

        <Modal
          // MANGE TAGS MODAL
          isVisible={this.state.tagVisible}
          propagateSwipe={true}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropTransitionOutTiming={0}
          onBackdropPress={this.changeTagState}
          onSwipeComplete={this.changeTagState}
          swipeDirection={["down"]}
          propagateSwipe
          scrollOffset={this.state.scrollOffset}
          style={styles.bottomModal}
        >
          <View style={styles.modalView}>
            <ScrollView onScroll={this.handleOnScroll} scrollEventThrottle={16}>
              <View
                style={{
                  width: screen.width,
                  borderBottomColor: "black",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
              <Text style={styles.modalHeader}>Create Tag:</Text>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ tagVisible: false });
                  navigation.navigate("Create Tag");
                }}
              >
                <Text style={styles.button}>Create new tag</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: screen.width,
                  borderBottomColor: "black",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />

              <Text style={styles.modalHeader}>Delete Selected Tag:</Text>

              {this.deleteTag()}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

const screen = Dimensions.get("screen");
const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "#A8DADC",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: screen.height / 2,
    width: screen.width,
    flex: 0,
  },
  contentContainer: {
    width: screen.width,
    flexDirection: "row",

    flexWrap: "wrap",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  tagContainer: {
    width: screen.width,
    flexDirection: "row",
    flex: 0,
  },
  modalHeader: {
    fontSize: 20,
    marginLeft: 10,
    paddingTop: 50,
  },
  modalText: {
    fontSize: 16,
    marginLeft: 10,
    paddingTop: 50,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  MainScreen: {
    flex: 1,
    backgroundColor: "rgba(244,245,250,1)",
    alignItems: "baseline",
    height: "100%",
  },
  taskButton: {
    justifyContent: "center",
    margin: "1%",
    maxWidth: "48%",
    height: 300,
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: "rgba(69, 120, 144, .9)",
    color: "#fff",

    borderRadius: 5,
    shadowColor: "rgba(244,245,250,.1)", // IOS
    shadowOffset: { height: 5, width: 5 }, // IOS
    shadowOpacity: 2, // IOS
    shadowRadius: 2, //IOS
    elevation: 2, // Android
    flexBasis: "50%",
  },
  button: {
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: 'rgba(69, 120, 144, 1)',
    color: '#fff',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "rgba(168, 218, 220, 1)",
    marginBottom: 25,
    alignSelf: "center",
  },
  titleText: {
    textAlign: "center",
    fontSize: 28,
    color: "rgba(168, 218, 220, 1)",
    fontWeight: "bold",
    marginBottom: 25,
  },
  TaskBarContainer: {
    marginTop: 15,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    height: "10%",
    top: 20,
    justifyContent: "space-evenly",
  },
  CircleOverlay: {
    width: "25%",
    height: "50%",
    borderRadius: 500000 / 2,
    backgroundColor: "rgba(244,245,250,1)",
    alignItems: "center",
  },
  innerCircle: {
    width: "80%",
    height: "150%",
    borderRadius: 500000 / 2,
    borderWidth: 1,
    borderColor: "rgba(69, 120, 144, 1)",
    backgroundColor: "rgba(244,245,250,1)",
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 5,
    shadowOpacity: 0.5,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    left: 20,
    color: "white",
  },
  navBarContainer: {
    height: "20%",
    width: "100%",
    position: "relative",
    top: 50,
    backgroundColor: "transparent",
  },
  CircleOverlayMain: {
    width: "35%",
    height: "65%",
    bottom: 40,
    borderRadius: 500000 / 2,
    backgroundColor: "rgba(244,245,250,1)",
    alignItems: "center",
  },
  innerCircleMain: {
    top: "30%",
    width: "80%",

    borderRadius: 1080 / 2,
    borderWidth: 1,
    borderColor: "rgba(69, 120, 144, 1)",
    backgroundColor: "rgba(244,245,250,1)",
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 5,
    shadowOpacity: 0.5,
  },
  tabItem: {
    borderRadius: 5,
    borderColor: "#858585",
    borderStyle: "solid",
    textAlign: "center",
    color: "#858585",
    backgroundColor: "#A8DADC",
    borderWidth: 1,
    padding: 3,
    height: "65%",
    top: 19,
    marginLeft: 5,
    marginRight: -10,
  },
});
