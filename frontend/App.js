import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

//Add new screens here (also place to add below)
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/Main-Screen';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      session: null
    }

    // uncomment this if you'd like to require a login every time the app is started
    //SecureStore.deleteItemAsync('session')
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
    console.log("HERE")
    //navigation.navigate('Details')
    this.props.navigate("Register")
  }
  render() {
    // get our session variable from the state
    const { session } = this.state

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            initialParams={
              {
                onLoggedIn: () => this.checkIfLoggedIn(),
                goRegister: () => this.goRegister()
              }
            }
          />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer>
          <Stack.Navigator>
            {/* Check to see if we have a session, if so continue, if not login */}
            {session ? (
              <Stack.Screen name="Login"/>
            ) : (
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  initialParams={
                    {
                      onLoggedIn: () => this.checkIfLoggedIn(),
                      goRegister: () => this.goRegister()
                    }
                  }
                />
              )
              }
              <Stack.Screen name="Logon" component={LoginScreen} />
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>

        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
