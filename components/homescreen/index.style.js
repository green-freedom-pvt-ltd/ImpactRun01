import { StyleSheet,Dimensions } from 'react-native';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: 'hsl(15, 55%, 50%)',
    background2: 'hsl(230, 30%, 45%)'
};

export default StyleSheet.create({
    container: {
        height: deviceHeight-114,
        width:deviceWidth,
        backgroundColor: colors.background1
    },
    colorsContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row'
    },
    color1: {
        flex: 1,
        backgroundColor: colors.background1
    },
    color2: {
        flex: 1,
        backgroundColor: colors.background2
    },
    scrollview: {
        height: deviceHeight-114,
        width:deviceWidth,
        paddingTop: 50
    },
    title: {
        marginTop: 15,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subtitle: {
        marginTop: 5,
        marginBottom: 15,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginBottom: 30
    },
    sliderContainer: {
    }
});