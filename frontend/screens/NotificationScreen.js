import React from 'react';
import { Text, View, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// This screen is a proof of concept of requesting cross platform device notifications
// and triggering push notifications with the press of a button. 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class NotificationScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notification: {},
            expoPushToken: ''
        };
    }

  async componentDidMount() {
    this.registerForPushNotificationsAsync();
    

    Notifications.addNotificationReceivedListener(this._handleNotification);
    
    Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  _handleNotificationResponse = response => {
    console.log(response);
  };

  async registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    };

    async schedulePushNotification() {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Notifications proof of concept ❗",
            body: 'Task descriptions will go here!',
          },
          trigger: { seconds: 2 },
        });
        return identifier
      }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Your expo push token: {this.state.expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: Test Screen</Text>
        </View>
        <Button
        title="Press to schedule a notification"
        onPress={async () => {
          const identifier = await this.schedulePushNotification();
          console.log(identifier)
        }}
      />
      </View>
    );
  }
}
