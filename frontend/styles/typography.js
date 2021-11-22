import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get("screen");

export default StyleSheet.create({
    buttonText: {
        color: 'rgba(69, 120, 144, 1)',
        fontWeight: 'bold',
      },
    text: {
        fontSize: 16,
        color: 'white',
        textAlign: 'left',
    },
    
  });