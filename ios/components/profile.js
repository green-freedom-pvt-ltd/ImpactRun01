
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
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Profile extends Component {
	render() {
		return (
       <View>
    	<ScrollableTabView
              style={styles.Navbar}
              initialPage={0}
              renderTabBar={() => <ScrollableTabBar />}>
          <View style={styles.tabContent} tabLabel='Profile'><Text>My</Text></View>
          <View style={styles.tabContent} tabLabel='RunHistory'><Text>favorite</Text></View>
        </ScrollableTabView>
        </View>
		);
	}
 }
var styles = StyleSheet.create({
  Navbar:{
    position:'relative',
    top:0,
    width:deviceWidth,
    backgroundColor:'#d667cd',
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
  tabContent:{

  },
})
 export default Profile;