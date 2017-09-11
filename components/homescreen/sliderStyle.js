import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './index.style';
import styleConfig from '../../components/styleConfig';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight-200;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    wraptext2:{
      paddingTop:styleConfig.functionPadding,
      justifyContent: 'space-between',
      flexDirection:'row',
    },
    imageContainer: {
        height:200,
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: 'white',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on ios; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor:'white'
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: 'white'
    },
    title: {
        color: colors.black,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    wraptext:{
      justifyContent: 'space-between',
      flexDirection:'row',
      paddingBottom:2,
      paddingTop:5,
    },
    textMoneyraised:{
      left:0,
      color:styleConfig.greyish_brown_two,
      fontSize:10,
      fontWeight:'600',
      fontFamily:styleConfig.FontFamily,
    },
    titleEven: {
        color: colors.black
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: colors.gray,
    }
});
