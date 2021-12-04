import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import * as Google from "expo-google-app-auth";
import Dialog from "react-native-dialog";
import { Fontisto, Entypo } from "@expo/vector-icons";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    // Initialize our login state
    this.state = {
      email: "",
      password: "",
      login: true,
      userInfo: [],
      ForgotPasswordAlert: false,
    };
  }

  gLogin = async () => {
    const { navigation } = this.props;
    console.log("LoginScreen.js 22 | loggin in");
    try {
      const { type, user } = await Google.logInAsync({
        iosClientId: `22428134723-pq3rqvntskvn45979el7kmkrnksmajgs.apps.googleusercontent.com`,
        androidClientId: `22428134723-4clne824h5k1q433vh1tmgf6r443t2dp.apps.googleusercontent.com`,
      });

      if (type === "success") {
        // Then you can use the Google REST API
        console.log("LoginScreen.js 31 | success, navigating to profile");
        SecureStore.setItemAsync("user", JSON.stringify(user)).then(() => {
          this.setState({ login: true });
        });
      } else {
        this.setState({ login: false });
      }
    } catch (error) {
      console.log("LoginScreen.js 40 | error with login", error);
      this.setState({ login: false });
    }
  };

  onSubmit = () => {
    const { email, password } = this.state;

    fetch(
      "https://young-chow-productivity-app.herokuapp.com/auth/token/login/",
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        // enter login logic here
        console.log(json);
        if (json.non_field_errors) {
          Alert.alert("Error: ", json.non_field_errors.toString());
        } else if (!json.auth_token) {
          Alert.alert("Error: ", json.password.toString());
        } else {
          SecureStore.setItemAsync("session", json.auth_token).then(() => {
            SecureStore.setItemAsync("priv", "false").then(() => {
              this.props.route.params.onLoggedIn();
              //navigation.navigate('Details')
            });
          });
        }
      })
      .catch((exception) => {
        console.log("Error occured", exception);
        // Do something when login fails
      });
  };

  onForgotPassword = () => {
    fetch(
      "https://young-chow-productivity-app.herokuapp.com/auth/users/reset_password/",
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          email: this.state.email,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        console.log(this.state.email);
        console.log(this.state.userInfo);
      });
  };

  onForgotPasswordAlert = () => {
    if (this.state.ForgotPasswordAlert) {
      this.setState({ ForgotPasswordAlert: false });
    } else {
      this.setState({ ForgotPasswordAlert: true });
    }
  };
  render() {
    const { email, password } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.loginText}>Task Flow</Text>

        <View style={styles.inputContainer}>
          <Fontisto
            style={{ paddingStart: 40, top: 42 }}
            name="email"
            size={24}
            color="black"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ email: text })}
            value={email}
            placeholder="Email"
            placeholderTextColor="rgba(69, 120, 144, 1)"
            textContentType="emailAddress"
          />
          <Entypo
            style={{ paddingStart: 40, top: 42 }}
            name="lock"
            size={20}
            color="black"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ password: text })}
            value={password}
            textContentType="password"
            placeholder="Password"
            placeholderTextColor="rgba(69, 120, 144, 1)"
            secureTextEntry={true}
          />
        </View>
        {/*
        <TouchableOpacity
          onPress = {() => this.onForgotPasswordAlert()}
        >
          <Text style = {{marginRight: '50%', color: 'blue'}}>Forgot Password?</Text>
        </TouchableOpacity>
        <Dialog.Container visible={this.state.ForgotPasswordAlert}>
              <Dialog.Title>Forgot Password</Dialog.Title>
              <Dialog.Description>Input recover email</Dialog.Description>
              <Dialog.Input 
              onChangeText={email => this.setState({email})}
              value={this.state.email}
              placeholder={'Enter Email'}
              ></Dialog.Input>
              <Dialog.Button label="Cancel" onPress={this.onForgotPasswordAlert}/>
              <Dialog.Button label="Confirm" onPress={this.onForgotPassword}/>
            </Dialog.Container>
        */}
        <View style={styles.columnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onSubmit()}
          >
            <Text style={styles.buttonText}> Log In </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Gbutton}
            onPress={() => {
              this.gLogin().then(() => {
                if (this.state.login) navigation.navigate("GoogleRegister");
              });
            }}
          >
            <View style={styles.Gtext}>
              <Fontisto
                style={{ paddingEnd: 10 }}
                name="google"
                size={24}
                color="black"
              />
              <Text style={{ top: 3 }}>Sign up with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.columnContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}> Sign Up </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(244,245,250,1)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginTop: "20%",
    width: "100%",
    justifyContent: "center",
  },
  columnContainer: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  button: {
    height: 45,
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
  registerButton: {
    position: "relative",
    top: 50,
    alignItems: "center",
    backgroundColor: "rgba(69, 120, 144, 0)",
    marginHorizontal: 8,
    color: "#fff",
    width: "45%",
  },
  buttonText: {
    height: 25,
    top: 3,
    color: "rgba(69, 120, 144, 1)",
    fontWeight: "bold",
  },
  registerText: {
    position: "relative",
    color: "rgba(69, 120, 144, 1)",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 40,
    textAlign: "center",
    color: "rgba(29, 53, 87, 1)",
    textShadowColor: "rgba(29, 53, 87, 1)",
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
  Gtext: {
    height: 25,
    flexDirection: "row",
    color: "rgba(69, 120, 144, 1)",
    fontWeight: "bold",
  },
  Gbutton: {
    position: "relative",
    top: 30,
    height: 45,
    width: "65%",
    alignItems: "center",
    shadowRadius: 3,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    backgroundColor: "rgba(256, 256, 256, 1)",
    borderRadius: 10,
    paddingTop: 10,
  },
});
