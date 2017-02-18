
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Text,
  } from 'react-native';
import FaqData from './faq/faqData';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class ThankyouScreen extends Component {

    navigateToHomeScreen(){
      this.props.navigator.push({
      id:'tab',
      navigator: this.props.navigator,
      })
    }
		render() {
      var data = this.props.data;
	    return (
		    <View>
          <TouchableOpacity onPress={()=> this.navigateToHomeScreen()}>
            <Image  style={{resizeMode: 'stretch',height:deviceHeight,width:deviceWidth}} source={{uri:data.cause_thank_you_image}}></Image>
          </TouchableOpacity>
        </View>
		  );
	  }
    
}
 export default ThankyouScreen;