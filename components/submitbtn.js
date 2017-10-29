
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
import styleConfig from './styleConfig';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class submitbtn extends Component {
  		render() {
  		  return (
          <View>
           <TouchableOpacity onPress={() => this.props.navigateTOnextpage()} style={styles.submitbtn}>
                  <Text style={{color:'white'}}>SUBMIT</Text>
           </TouchableOpacity>
          </View>
  			);
  	  }
}

const styles = StyleSheet.create({
  submitbtn:{
    justifyContent: 'center',
    alignItems: 'center',
    width:deviceWidth-70,
    height:45,
    borderRadius:2,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
        height: 2,
      },
    backgroundColor:styleConfig.light_gold,
  },
  
});
export default submitbtn;