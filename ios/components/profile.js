
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
var {FBLoginManager} = require('react-native-facebook-login');
import ProfileForm from './profileForm';
import RunHistory from './runHistory';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Profile extends Component {
	render() {
		return (
       <View>
      	<ScrollableTabView
              style={styles.scrollTabWrapper}
              initialPage={1}
              vertical={false}
              renderTabBar={() => <ScrollableTabBar/>}>
          <View style={styles.tabContent1} tabLabel='Profile'><ProfileForm/></View>
          <View style={styles.tabContent} tabLabel='RunHistory'><RunHistory/></View>
        </ScrollableTabView>
        </View>
		);
	}
 }
var styles = StyleSheet.create({
  scrollTabWrapper:{
    position:'relative',
    width:deviceWidth,
    backgroundColor:'white',
    height:deviceHeight,
    top:0,
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
  tabContent1:{
    position:'relative',
    top:-130,
    backgroundColor:'white',

  },
    tabContent:{
    position:'relative',
    backgroundColor:'white',
    height:deviceHeight-200,
  },
 
})
 export default Profile;