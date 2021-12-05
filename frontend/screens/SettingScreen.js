import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  Switch,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Dialog from "react-native-dialog";
import * as Google from "expo-google-app-auth";
import GDrive from "expo-google-drive-api-wrapper";
import ModernHeader from "react-native-modern-header";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      newPassword: "",
      reenterPassword: "",
      alertVisible: false,
      newPasswordAlert: false,
      newGoogleAlert: false,
      google: false,
      notificationsEnabled: false,
      notifSettingID: -1,
      notification: {},
      expoPushToken: "",
      googleSettingID: -1,
      sessionToken: "",
      accessToken: "",
    };
  }

  _handleNotification = (notification) => {
    this.setState({ notification: notification });
  };

  _handleNotificationResponse = (response) => {
    console.log(response);
  };

  addNotifListeners() {
    Notifications.addNotificationReceivedListener(this._handleNotification);
    Notifications.addNotificationResponseReceivedListener(
      this._handleNotificationResponse
    );
  }

  disableNotifListeners() {
    Notifications.removeNotificationSubscription(this._handleNotification);
    Notifications.removeNotificationSubscription(
      this._handleNotificationResponse
    );
  }

  async registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }

  async componentDidMount() {
    let token = await SecureStore.getItemAsync("session");
    let accessToken = await SecureStore.getItemAsync("GoogleToken");
    if (token) {
      console.log("Token " + token);
      this.setState({ sessionToken: token });
    }
    if (accessToken) {
      this.setState({
        accessToken: accessToken,
        google: true,
      });
    }
    await this.checkSettings();
    if (this.state.notificationsEnabled == true) {
      this.addNotifListeners();
    }
    if (this.state.googleSettingID != -1) {
      this.setState({ google: true });
    }
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
            this.setState({ notifSettingID: obj.id });
          } else if (obj.name == "Google Log In") {
            this.setState({ googleSettingID: obj.value });
          }
        });
      });
  }

  async updateNotifications(bool) {
    var alertMessage = "";
    if (bool) {
      this.registerForPushNotificationsAsync();
      this.addNotifListeners();
      alertMessage = "Notifications have been enabled";
    } else {
      this.disableNotifListeners();
      await Notifications.cancelAllScheduledNotificationsAsync();
      alertMessage =
        "Notifications have been disabled.\n\n All pending notifications have been canceled.";
    }
    if (this.state.notifSettingID != -1) {
      fetch(
        "https://young-chow-productivity-app.herokuapp.com/settings/" +
          this.state.notifSettingID,
        {
          method: "PATCH",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Token " + this.state.sessionToken,
          }),
          body: JSON.stringify({
            value: bool.toString(),
          }),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          this.setState({ notificationsEnabled: bool });
          alert(alertMessage);
        });
    } else {
      fetch("https://young-chow-productivity-app.herokuapp.com/settings/", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Token " + this.state.sessionToken,
        }),
        body: JSON.stringify({
          name: "Notifications",
          value: bool.toString(),
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          this.setState({ notificationsEnabled: bool });
          this.setState({ notifSettingID: json.id });
          alert(alertMessage);
        });
    }
  }

  onChangePassword = () => {
    fetch(
      "https://young-chow-productivity-app.herokuapp.com/auth/users/set_password/",
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Token " + this.state.sessionToken,
        }),
        body: JSON.stringify({
          new_password: this.state.reenterPassword,
          re_new_password: this.state.newPassword,
          current_password: this.state.password,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json.current_password.toString());
        if (this.state.reenterPassword != this.state.newPassword) {
          Alert.alert("New Passwords did not match.");
        } else if (json.current_password.toString() == "") {
          Alert.alert("Entered incorrect password. Please try again.");
        } else {
          Alert.alert("Password successfully updated");
        }
      });
  };

  onLogout = () => {
    const { navigation } = this.props;
    fetch(
      "https://young-chow-productivity-app.herokuapp.com/auth/token/logout/",
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("LogOut Button Hit");

        SecureStore.setItemAsync("DriveData", JSON.stringify(json.files)).then(
          () => {
            console.log("Saved drive data.");
            console.log(json);
          }
        );

        SecureStore.deleteItemAsync("session").then(() => {
          this.props.route.params.onLoggedIn();
          navigation.pop();
        });
      });
  };
  loginModal = () => {
    if (this.state.google) {
      return (
        <>
          <TouchableOpacity style={styles.button} disabled={true}>
            <Text style={styles.buttonText}>Sign Out of Google:</Text>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity style={styles.button} onPress={() => this.gLogin()}>
            <Text style={styles.buttonText}>Google Log In:</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  getDriveFiles = (accessToken) => {
    fetch(
      "https://www.googleapis.com/drive/v3/files?key=AIzaSyBEzp_Qpq5hwFoTgHembUAAOZDa9wcnrlE",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        SecureStore.setItemAsync("DriveData", JSON.stringify(json.files)).then(
          () => {
            console.log("Saved drive data.");
          }
        );
      });

    // GDrive.setAccessToken(accessToken)
    // GDrive.init();
    // var files =  GDrive.files.list({})
    // console.log(JSON.stringify(files))
  };

  onDelete = () => {
    const { navigation } = this.props;
    fetch("https://young-chow-productivity-app.herokuapp.com/auth/users/me/", {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.sessionToken,
      }),
      body: JSON.stringify({
        current_password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Account Deleted");
        console.log(json);
        SecureStore.deleteItemAsync("session").then(() => {
          this.props.route.params.onLoggedIn();
          navigation.pop();
          Alert.alert("Account Succesfully Deleted");
        });
      });
  };

  async gLogin() {
    const { navigation } = this.props;
    console.log("SettingScreen.js 106 | logging in");
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        iosClientId: `22428134723-pq3rqvntskvn45979el7kmkrnksmajgs.apps.googleusercontent.com`,
        androidClientId: `22428134723-4clne824h5k1q433vh1tmgf6r443t2dp.apps.googleusercontent.com`,
        scopes: [
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/drive.readonly",
          "https://www.googleapis.com/auth/drive.metadata.readonly",
        ],
      });
      if (type === "success") {
        let userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );
        this.getDriveFiles(accessToken);
        // Then you can use the Google REST API
        console.log("Info: " + userInfoResponse);
        console.log("SettingScreen.js 115 | success, adding to settings");
        SecureStore.setItemAsync(
          "GoogleToken",
          JSON.stringify(accessToken)
        ).then(() => {
          console.log("Right before fetch call");
          console.log(user);
          fetch("https://young-chow-productivity-app.herokuapp.com/settings/", {
            method: "POST",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Token " + this.state.sessionToken,
            }),
            body: JSON.stringify({
              name: "Google Log In",
              value: JSON.stringify(user),
            }),
          })
            //})
            .then((response) => response.json())
            .then((json) => {
              this.setState({ google: true });
              console.log(json);
              if (!json.id) {
                if (json.name) Alert.alert("Error: ", json.name.toString());
                else if (json.value)
                  Alert.alert("Error: ", json.value.toString());
                else
                  Alert.alert(
                    "Fatal Error, contact dev because something is wrong"
                  );
              } else {
                this.setState({ google: true });
                Alert.alert(
                  "Google Sign Setting has been successfully created."
                );
              }
            })
            .catch((exception) => {
              console.log("Error occured", exception);
              this.setState({ google: false });
            });
        });
      } else {
        this.setState({ google: false });
      }
    } catch {
      console.log("Error occured", exception);
      this.setState({ google: false });
    }
  }

  changeAlertState = () => {
    if (this.state.alertVisible) {
      this.setState({ alertVisible: false });
    } else {
      this.setState({ alertVisible: true });
    }
  };

  toggleBothAlerts = () => {
    this.newPasswordAlertState();
    this.onChangePassword();
  };

  newPasswordAlertState = () => {
    if (this.state.newPasswordAlert) {
      this.setState({ newPasswordAlert: false });
    } else {
      this.setState({ newPasswordAlert: true });
    }
  };

  newGoogleAlertState = () => {
    if (this.state.newGoogleAlert) {
      this.setState({ newGoogleAlert: false });
    } else {
      this.setState({ newGoogleAlert: true });
    }
  };

  onBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };
  render() {
    const { navigation } = this.props;
    const notifEnabled = this.state.notificationsEnabled;
    return (
      <View style={styles.MainScreen}>
        <ModernHeader
          style={{ backgroundColor: "rgba(244,245,250,0)", top: 15 }}
          rightComponentDisable={true}
          onLeftPress={() => this.onBack()}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-evenly",
            width: "100%",
            height: "80%",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={this.changeAlertState}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.newPasswordAlertState()}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          {this.loginModal()}

          {/* Current Password Overlay */}
          <Dialog.Container visible={this.state.newPasswordAlert}>
            <Dialog.Title>Change Password</Dialog.Title>
            <Dialog.Input
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              placeholder={"Enter Current Password"}
              secureTextEntry={true}
            ></Dialog.Input>
            <Dialog.Input
              onChangeText={(newPassword) => this.setState({ newPassword })}
              value={this.state.newPassword}
              placeholder={"Enter New Password"}
              secureTextEntry={true}
            ></Dialog.Input>
            <Dialog.Input
              onChangeText={(reenterPassword) =>
                this.setState({ reenterPassword })
              }
              value={this.state.reenterPassword}
              placeholder={"Re-Enter New Password"}
              secureTextEntry={true}
            ></Dialog.Input>
            <Dialog.Button
              label="Cancel"
              onPress={this.newPasswordAlertState}
            />
            <Dialog.Button label="Confirm" onPress={this.toggleBothAlerts} />
          </Dialog.Container>

          {this.state.notificationsEnabled ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.updateNotifications(!this.state.notificationsEnabled)
              }
            >
              <Text style={styles.buttonText}>Disable Reminders</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.updateNotifications(!this.state.notificationsEnabled)
              }
            >
              <Text style={styles.buttonText}>Enable Reminders</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onLogout()}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          {/* Account Deletion */}
          <Dialog.Container visible={this.state.alertVisible}>
            <Dialog.Title>Account Deletion</Dialog.Title>
            <Dialog.Description>
              Are you sure you wish to delete this account?
            </Dialog.Description>
            <Dialog.Input
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              placeholder={"Enter Current Password"}
            ></Dialog.Input>
            <Dialog.Button label="Cancel" onPress={this.changeAlertState} />
            <Dialog.Button label="Confirm" onPress={this.onDelete} />
          </Dialog.Container>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainScreen: {
    flex: 1,
    backgroundColor: "rgba(244,245,250,1)",
    alignItems: "baseline",
    width: "100%",
    height: "100%",
  },
  button: {
    position: "relative",
    height: 45,
    width: "50%",
    left: "25%",
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
});
