import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import Dialog from 'react-native-dialog';


export default class SettingScreen extends React.Component{

  constructor(props) {
    super(props)
    
    this.state = {
      password: '',
      newPassword: '',
      reenterPassword: '',
      alertVisible: false,
      newPasswordAlert: false,
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
      fetch("https://young-chow-productivity-app.herokuapp.com/auth/users/set_password/",{
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + this.state.sessionToken
        }),
        body: JSON.stringify({
          new_password: this.state.reenterPassword,
          re_new_password: this.state.newPassword,
          current_password: this.state.password,
        })
      })
      .then(response => response.json())
      .then(json => {
        console.log(json.current_password.toString())
        if(this.state.reenterPassword != this.state.newPassword){
          Alert.alert("New Passwords did not match")
        }
        else if(json.current_password.toString() == ""){
          Alert.alert("Inputed Wrong password")
        }
        else{
          Alert.alert("Password Changed")
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

    
    render() {

        return(
            <View style={styles.MainScreen}>
            <View style = {{flexDirection: 'column', justifyContent: 'space-evenly', width: '100%', height: '80%'}}>
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
            style = {styles.button}
            onPress = {() => this.onLogout()}>
            <Text style = {styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            </View>
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
              <Dialog.Input
              onChangeText={reenterPassword => this.setState({reenterPassword})}
              value={this.state.reenterPassword}
              placeholder={'Re-Enter New Password'}
              secureTextEntry={true}
              ></Dialog.Input>
              <Dialog.Button label="Cancel" onPress={this.newPasswordAlertState}/>
              <Dialog.Button label="Confirm" onPress={this.toggleBothAlerts}/>
            </Dialog.Container>
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
    backgroundColor: 'rgba(244,245,250,1)',
    alignItems: 'baseline',
    width: '100%',
    height: '100%'
  },
  button: {
    position: 'relative',
    height: 45,
    width: '65%',
    alignItems: 'center',
    backgroundColor: 'rgba(256, 256, 256, 1)',
    borderRadius: 10,
    padding: 10,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: .5,
  },
  buttonText: {
    height: 25,
    top: 3,
    color: 'rgba(69, 120, 144, 1)',
    fontWeight: 'bold'
  },

});