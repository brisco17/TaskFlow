import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get("screen");

export default StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        width: "100%",
        justifyContent: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      calContainer: {
        flexDirection: 'row',
        position: 'relative',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width,
        backgroundColor: "rgba(244,245,250,1)"
      },
    
  });