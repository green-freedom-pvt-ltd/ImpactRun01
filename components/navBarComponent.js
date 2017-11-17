
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
		    <View style={styles.Navbar}>
          <View style={styles.LeftButton} onPress={()=>this.leftBtnfunction()}>
           {this.leftIcon()}
           </View>        
            <Text  numberOfLines={1} style={styles.menuTitle}>{this.props.title}</Text>
           <View style={styles.RightButton} onPress={()=>this.rightBtnfunction()} >
           {this.rightIcon()}
          </View> 
        </View>
		  );
	  }
    
}

var styles = StyleSheet.create({

  RightButton: {
   height:64,
   width:50,
   paddingTop:15,
   justifyContent:'center',
   alignItems:'center',
  },

   Navbar:{
    paddingTop:20,
    position:'relative',
    height:styleConfig.navBarHeight,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    shadowColor: '#000000',
      shadowOpacity: 0.8,
      shadowRadius: 1,
      shadowOffset: {
        height: 0,
      },
  },


  menuTitle:{
    backgroundColor:'transparent',
    flex:1,
    textAlign:'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight:'400',
    color:'#2a2a2a',
    fontSize:styleConfig.TitleFontSize,
    fontFamily:styleConfig.FontFamily,
  },

  LeftButton: {
   height:styleConfig.navBarHeight,
   width:50,
  },
})


 export default ThankyouScreen;