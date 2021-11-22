import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get("screen");

export default StyleSheet.create({
    buttonText: {
        color: 'rgba(168, 218, 220, 1)',
        fontWeight: 'bold',
      },
    text: {
        fontSize: 16,
        color: 'white',
        textAlign: 'left',
    },
    
  });