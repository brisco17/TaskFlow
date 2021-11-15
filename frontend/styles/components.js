import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    button: {
      height: 45,
      bottom: '10%',
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
    textInput: {
      height: 60,
      width: '90%',
      left: '5%',
      fontSize: 16,
      paddingStart: 50,
      textAlign: 'left',
      borderRadius: 20,
      borderBottomColor: "#000",
      borderBottomWidth: 1,
    },
    multiTextInput: {
      height: '40%',
      width: '90%',
      left: '5%',
      fontSize: 16,
      paddingStart: 20,
      borderWidth: 1,
      textAlign: 'left',
      paddingTop: '5%',
      borderRadius: 20,
      borderWidth: 2,
      backgroundColor: 'rgba(244,245,250,1)',
      color: 'rgba(69, 120, 144, 1)',
    }
  });