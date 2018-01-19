
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
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

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
        <View>
        <View style={{backgroundColor:styleConfig.light_sky_blue,width:deviceWidth,height:20}}></View>
		    <View style={styles.Navbar}>
          <TouchableOpacity style={styles.LeftButton} onPress={()=>this.leftBtnfunction()}>
           {this.leftIcon()}
           </TouchableOpacity>        
            <Text  numberOfLines={1} style={styles.menuTitle}>{this.props.title}</Text>
           <TouchableOpacity style={styles.RightButton} onPress={()=>this.rightBtnfunction()} >
           {this.rightIcon()}
          </TouchableOpacity> 
        </View>
        </View>
		  );
	  }
    
}

var styles = StyleSheet.create({

  RightButton: {
   height:64,
   width:64,
   justifyContent:'center',
   alignItems:'flex-end',
   backgroundColor:'transparent',
  },

   Navbar:{
    position:'relative',
    height:styleConfig.navBarHeight,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: {
        height: 1,
      },

  },


  menuTitle:{
    backgroundColor:'transparent',
    flex:1,
    textAlign:'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight:'900',
    color:'#000',
    fontSize:styleConfig.fontNavTitle,
    fontFamily:styleConfig.LatoBlack,
    opacity:.80,
    paddingBottom:3,
  },

  LeftButton: {
   height:styleConfig.navBarHeight,
   width:64,
   paddingLeft:responsiveWidth(3),
   backgroundColor:'white',
  },
})


 export default ThankyouScreen;