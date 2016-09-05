
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
    ActivityIndicatorIOS,
  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Loding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animating: true,
    };
  }

		render() {
		return (
			     <View style={styles.LodingWrap}>
             <Image source={require('../images/backgroundLodingscreen.png')} style={styles.LodingBackgroundImg}>
              <ActivityIndicatorIOS
                style={{height: 80}}
                size="large"
              />
             </Image>
           </View>
					);
	    }
 }


 const styles = StyleSheet.create({
  LodingWrap: {
   height:deviceHeight,
   width:deviceWidth,
   justifyContent: 'center',
   alignItems: 'center',
  },
  LodingBackgroundImg:{
   height:deviceHeight,
   width:deviceWidth,
    justifyContent: 'center',
   alignItems: 'center',
  },

});
 export default Loding;