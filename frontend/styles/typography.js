import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get("screen");

export default StyleSheet.create({
    buttonText: {
        color: 'rgba(50, 50, 50, 1)',
        fontWeight: 'bold',
      },
    text: {
        fontSize: 16,
        color: 'white',
        textAlign: 'left',
    },
    
  });