
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
    WebView,
  } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Feedback extends Component {

      componentWillMount() {
       
    }

	render() {
         var _this = this;
		return (
      
        <WebView style={{height:deviceHeight-200,width:deviceWidth}}
        source={{uri: 'https://github.com/facebook/react-native'}}
        style={{marginTop: 20}}
      />
     

					);
	    }
}
 export default Feedback;