import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Touchable, TouchableNativeFeedbackComponent } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default class SettingScreen extends React.Component{

    render() {
        //const {navigation} = this.props;
        return(
            <View style = {styles.container}>
                <TouchableOpacity
                style = {styles.button}
                // onPress={() => navigation.navigate("Login")}
                >
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: '#FAEBEF'
    },
    button: {

    }









});