
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
  } from 'react-native';
import FaqData from './faqData';
import NavBar from '../navBarComponent';
import commonStyles from '../../components/styles';
import styleConfig from '../../components/styleConfig';

import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Faq extends Component {
  
      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
        })
      }

      goBack(){
          this.props.navigator.pop({});
      }

  		render() {
  		  return (
          <View>
  			    <FaqData user = {this.props.user}/>
          </View>
  			);
  	  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    height:deviceHeight-114,
    width:deviceWidth,
  },
  thumb: {
    backgroundColor: '#5bb75b',
    marginBottom: 5,
    elevation: 1
  },
  img: {
    height: 300
  },
  txt: {
    color:'white',
    margin: 10,
    fontSize: 16,
    textAlign: 'left'
  },
  txtSec:{
    padding:10,
    fontSize:15
  },
  FaqSubmitWrap:{
    paddingLeft:10,
    height:55,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
    backgroundColor:'#673ab7',
    borderBottomWidth:2,
    borderBottomColor:'#673ab7',
  },
  textEdit: {
    marginLeft:-5,
    height:48, 
    borderColor: '#673ab7', 
    backgroundColor: 'white',
    borderWidth:5 ,
    borderRadius:8,
    width:deviceWidth-100,
    color:'black',
    padding:10,
    top:4,
  },
  submitFaqbtn:{
    height:42, 
    width:85,
    right:-4,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:styleConfig.light_sky_blue, 
  }
});
 export default Faq;