import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import Dialog from 'react-native-dialog';
import * as Google from "expo-google-app-auth";


export default class SettingScreen extends React.Component{

  constructor(props) {
    super(props)
    
    this.state = {
      password: '',
      newPassword: '',
      alertVisible: false,
      newPasswordAlert: false,
      newGoogleAlert: false,
      google: false,
      sessionToken:'',
    }
    
  }
  async componentDidMount() {
    let token = await SecureStore.getItemAsync('session')
    if (token) {
      console.log('Token ' + token)
      this.setState({sessionToken: token})
    }
  }

    onChangePassword = () => {
      const {navigation} = this.props
      fetch("https://young-chow-productivity-app.herokuapp.com/auth/users/set_password/",{
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + this.state.sessionToken
        }),
        body: JSON.stringify({
          new_password: this.state.newPassword,
          re_new_password: this.state.newPassword,
          current_password: this.state.password,
        })
      })
      .then(response => response.json())
      .then(json => {
        if(json.new_password){
          Alert.alert("Successful change password")
        }
        

      })
    }

    onLogout = () => {
      const {navigation} = this.props;
        fetch("https://young-chow-productivity-app.herokuapp.com/auth/token/logout/",{
            method: "POST",
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then(response => response.json())
        .then(json => {
          console.log('LogOut Button Hit')

          SecureStore.deleteItemAsync('session').then(() => {
            this.props.route.params.onLoggedIn();
            navigation.pop();
          })

        })
    }
    onDelete = () => {

      const {navigation} = this.props;
          fetch("https://young-chow-productivity-app.herokuapp.com/auth/users/me/",{
            method: "DELETE",
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.sessionToken
            }),
            body: JSON.stringify({
              current_password: this.state.password,
            })
        })
        .then(response => response.json())
        .then(json => {
          console.log('Account Deleted')
          console.log(json)
          SecureStore.deleteItemAsync('session').then(() => {
            this.props.route.params.onLoggedIn();
            navigation.pop();

            Alert.alert("Account Succesfully Deleted")
          })
        })
      }

      async gLogin  () {

        const {navigation} = this.props;
        console.log("SettingScreen.js 106 | logging in");
        try {
          const { type, user } = await Google.logInAsync({
            iosClientId: `22428134723-pq3rqvntskvn45979el7kmkrnksmajgs.apps.googleusercontent.com`,
            androidClientId: `22428134723-4clne824h5k1q433vh1tmgf6r443t2dp.apps.googleusercontent.com`,
          });
    
          if (type === "success") {
            // Then you can use the Google REST API
            console.log("SettingScreen.js 115 | success, adding to settings");
            //SecureStore.setItemAsync('google_details', JSON.stringify(user)).then(() => {
                  //const google_details = SecureStore.getItemAsync('google_details')
                  console.log('Right before fetch call');
                  console.log(user)
                  fetch("https://young-chow-productivity-app.herokuapp.com/settings/", {
                    method: "POST",
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + this.state.sessionToken
                    }),
                    body: JSON.stringify({
                      name: "Google Log In",
                      value: String(user)
                    })
                  })
                //})
              .then(response => response.json())
              .then(json => {
                
                console.log(json)
                if(!json.id) {
                  if (json.name) Alert.alert("Error: ", json.name.toString())
                  else if (json.value) Alert.alert("Error: ", json.value.toString())
                  else Alert.alert("Fatal Error, contact dev because something is wrong")
                }
                else
                {
                  Alert.alert("Setting has been successfully created.")
                }
              })
              .catch(exception => {
                  console.log("Error occured", exception);
                  // Do something when login fails
              });

            }
          else {
            this.setState({google: false})
          }
        } catch (error) {
          console.log("SettingScreen.js 125 | error with login", error);
          this.setState({google: false})
        }
}

      changeAlertState = () => {
        if(this.state.alertVisible){
          this.setState({alertVisible: false})
        }else{
          this.setState({alertVisible: true})
        }
      }

      toggleBothAlerts = () => {
        this.newPasswordAlertState()
        this.onChangePassword()
      }

      newPasswordAlertState = () => {
        if(this.state.newPasswordAlert){
          this.setState({newPasswordAlert: false})
        }else{
          this.setState({newPasswordAlert: true})
        }
      }

      newGoogleAlertState = () => {
        if(this.state.newGoogleAlert){
          this.setState({newGoogleAlert: false})
        }else{
          this.setState({newGoogleAlert: true})
        }
      }

    render() {

        return(
            <View style={styles.MainScreen}>
            <View style={{ height: '10%', width: '100%', backgroundColor: '#A8DADC' , top: '90%'}}/>
            <View style={styles.TaskBarContainer}>
              <View style = {styles.CricleOverlay}>
                <TouchableOpacity style = {styles.innerCircle}
                
                />
              </View>
              <View style = {styles.CricleOverlay}>
                <TouchableOpacity style = {styles.innerCircle}/>
              </View>
              <View style = {styles.CricleOverlay}>
                <TouchableOpacity style = {styles.innerCircle}/>
              </View>
            </View>
            
            <TouchableOpacity 
            style = {styles.button}
            onPress = {this.changeAlertState}>
            <Text style = {styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style = {styles.button}
            onPress = {() => this.newPasswordAlertState()}>
            <Text style = {styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.button}
            onPress = {() => this.gLogin()}>
            <Text style = {styles.buttonText}>Google Log In:         Status: {String(this.state.google)}</Text>
            </TouchableOpacity>

            {/* Current Password Overlay */}
            <Dialog.Container visible={this.state.newPasswordAlert}>
              <Dialog.Title>Change Password</Dialog.Title>
              <Dialog.Input 
              onChangeText={password => this.setState({password})}
              value={this.state.password}
              placeholder={'Enter Current Password'}
              secureTextEntry={true}
              ></Dialog.Input>
              <Dialog.Input
              onChangeText={newPassword => this.setState({newPassword})}
              value={this.state.newPassword}
              placeholder={'Enter New Password'}
              secureTextEntry={true}
              ></Dialog.Input>
              <Dialog.Button label="Cancel" onPress={this.newPasswordAlertState}/>
              <Dialog.Button label="Confirm" onPress={this.toggleBothAlerts}/>
            </Dialog.Container>
            
            <TouchableOpacity 
            style = {styles.button}
            onPress = {() => this.onLogout()}>
            <Text style = {styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            {/* Account Deletion */}
            <Dialog.Container visible={this.state.alertVisible}>
              <Dialog.Title>Account Deletion</Dialog.Title>
              <Dialog.Description>Are you sure you wish to delete this account?</Dialog.Description>
              <Dialog.Input 
              onChangeText={password => this.setState({password})}
              value={this.state.password}
              placeholder={'Enter Current Password'}
              ></Dialog.Input>
              <Dialog.Button label="Cancel" onPress={this.changeAlertState}/>
              <Dialog.Button label="Confirm" onPress={this.onDelete} />
            </Dialog.Container>

            </View>
        );
    }
}

const styles = StyleSheet.create({
  MainScreen: {
    flex: 1,
    backgroundColor: '#FAEBEF',
    alignItems: 'baseline',
    width: '100%',
    height: '100%'
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

});