import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

//Add new screens here (also place to add below)
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import GoogleRegister from './screens/GoogleRegister';
import MainScreen from './screens/MainScreen';
import SettingScreen from './screens/SettingScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import CreateTagScreen from './screens/CreateTagScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import NotficationScreen from './screens/NotificationScreen';

// This is a warning that occurs on new react versions. It wants me to use event listeners instead,
// which isn't happening for the time being.
import { LogBox } from 'react-native';
LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state',]);

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      session: null
    }

    // uncomment this if you'd like to require a login every time the app is started
    // SecureStore.deleteItemAsync('session')
  }
  componentDidMount() {
    // Check if there's a session when the app loads
    this.checkIfLoggedIn();
  }
  checkIfLoggedIn = () => {
    // See if there's a session data stored on the phone and set whatever is there to the state
    SecureStore.getItemAsync('session').then(sessionToken => {
      this.setState({
        session: sessionToken
      })
    });
  }

  

  goRegister = () => {

    // See if there's a session data stored on the phone and set whatever is there to the state
    this.props.navigate("Register")
  }
  render() {
    // get our session variable from the state
    const { session } = this.state
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {session ? (
              <Stack.Screen 
                name="Home" 
                component={MainScreen} 
                initialParams={
                  {
                    onLoggedIn: () => this.checkIfLoggedIn()
                  }
                }
              />
            ) : (
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  initialParams={
                    {
                      onLoggedIn: () => this.checkIfLoggedIn(),
                    }
                  }
                />
              )
              }
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Settings" 
              component ={SettingScreen}
              initialParams={
              {
                onLoggedIn: () => this.checkIfLoggedIn(),
              }
            }/>
          <Stack.Screen name="GoogleRegister" component={GoogleRegister} />
          <Stack.Screen name="Create Task" component={CreateTaskScreen} />
          <Stack.Screen name="Create Tag" component={CreateTagScreen} />
          <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
          <Stack.Screen name="NotificationScreen" component={NotficationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
