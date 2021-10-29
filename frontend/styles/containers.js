import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get("screen");

export default StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: screen.width,
        height: screen.height,
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
        justifyContent: 'space-between',
        marginTop: 30,
        maxHeight: '30%',
        width: screen.width, 
      },
    
  });