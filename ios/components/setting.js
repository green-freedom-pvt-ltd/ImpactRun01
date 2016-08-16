
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

import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var styles = StyleSheet.create({
  Navbar:{
    paddingLeft:10,
    position:'relative',
    top:0,
    height:55,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
    backgroundColor:'#d667cd',
    borderBottomWidth:2,
    borderBottomColor:'#673AB7',
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
})



class Setting extends Component {
      // Go_Back
    popRoute() {
         this.props.navigator.pop();
    }

	render() {
		return (
            <View>
            <View style={styles.Navbar}>
                  <TouchableOpacity onPress={this.popRoute.bind(this)} ><Icon style={{color:'white',fontSize:30,}}name={'md-arrow-back'}></Icon></TouchableOpacity>
                  <Text style={styles.menuTitle}>Settings</Text>
            </View>
			<Text>Setting</Text>
            </View>
					);
	    }
}
 export default Setting;