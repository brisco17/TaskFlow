import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';

//Add new screens here (also place to add below)
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor() {
    super()

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
  render() {
    // get our session variable from the state
    const { session } = this.state

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer>
          <Stack.Navigator>
            {/* Check to see if we have a session, if so continue, if not login */}
            {session ? (
              <Stack.Screen name="Root" />
            ) : (
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  initialParams={
                    {
                      onLoggedIn: () => this.checkIfLoggedIn()
                    }
                  }
                />
              )
              }
              {/* Also add Screen here */}
              <Stack.Screen name="Logon" component={LoginScreen} />
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
