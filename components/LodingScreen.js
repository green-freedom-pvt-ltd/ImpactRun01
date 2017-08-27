
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
    ActivityIndicator,
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
              
             </Image>
             <ActivityIndicator
                style={{height: 80,position:'absolute'}}
                size="large"
              />
           </View>
					);
	    }
 }


 const styles = StyleSheet.create({
  LodingWrap: {
   flex:1,
   justifyContent: 'center',
   alignItems: 'center',
  },
  LodingBackgroundImg:{
   flex:1,
   justifyContent: 'center',
   alignItems: 'center',
  },

});
 export default Loding;