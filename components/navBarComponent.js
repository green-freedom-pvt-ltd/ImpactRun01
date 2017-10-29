
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
import styleConfig from './styleConfig';
import commonStyles from './styles';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class ThankyouScreen extends Component {

    navigateToHomeScreen(){
      this.props.navigator.push({
      id:'tab',
      navigator: this.props.navigator,
      })
    }

    rightIcon(){
     return this.props.rightIcon
    }
    leftIcon(){
     return this.props.leftIcon
    }
    rightBtnfunction(){
     if (this.props.rightBtn != undefined) {
       this.props.rightBtn();
     }
    }
    leftBtnfunction(){
     if (this.props.leftBtn != undefined) {
     this.props.leftBtn();
     }
    }

		render() {
      var data = this.props.data;
	    return (
		    <View style={commonStyles.Navbar}>
          <TouchableOpacity style={styles.LeftButton} onPress={()=>this.leftBtnfunction()}>
           {this.leftIcon()}
          </TouchableOpacity>        
            <Text  numberOfLines={1} style={commonStyles.menuTitle}>{this.props.title}</Text>
           <TouchableOpacity style={styles.RightButton} onPress={()=>this.rightBtnfunction()} >
           {this.rightIcon()}
          </TouchableOpacity> 
        </View>
		  );
	  }
    
}

var styles = StyleSheet.create({

  RightButton: {
   height:64,
   width:50,
   paddingTop:15,

      
  },
  LeftButton: {
   height:styleConfig.navBarHeight,
   width:50,
  },
})


 export default ThankyouScreen;