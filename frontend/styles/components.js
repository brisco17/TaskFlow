import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: 'rgba(69, 120, 144, 1)',
        marginHorizontal: 8,
        color: '#fff',
        borderRadius: 100,
        width: '45%',
        padding: 10,
      },
    textInput: {
        height: 60,
        width: '90%',
        left: '5%',
        paddingStart: 40,
        paddingEnd: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 100,
    },
    multiTextInput: {
        height: '40%',
        width: '90%',
        left: '5%',
        paddingStart: 40,
        paddingEnd: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingTop: '5%',
        marginBottom: '5%',
        borderRadius: 100,
    }
  });