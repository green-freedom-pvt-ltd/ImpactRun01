
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
  var {FBLogin, FBLoginManager} = require('react-native-facebook-login');

import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Feedback extends Component {

	render() {
         var _this = this;
		return (
			 <FBLogin style={{ marginBottom: 10, }}
        ref={(fbLogin) => { this.fbLogin = fbLogin }}
        permissions={["email","user_friends"]}
        loginBehavior={FBLoginManager.LoginBehaviors.Native}
        onLogin={function(data){
          console.log("Logged in!");
          console.log('MYfbdata'+JSON.stringify(data.token));
          _this.setState({ user : data.credentials });
        }}
        onLogout={function(){
          console.log("Logged out.");
          _this.setState({ user : null });
        }}
        onLoginFound={function(data){
          console.log("Existing login found.");
          console.log('myExistingFbdata'+JSON.stringify(data.credentials.token));
          _this.setState({ user : data.credentials });
        }}
        onLoginNotFound={function(){
          console.log("No user logged in.");
          _this.setState({ user : null });
        }}
        onError={function(data){
          console.log("ERROR");
          console.log(data);
        }}
        onCancel={function(){
          console.log("User cancelled.");
        }}
        onPermissionsMissing={function(data){
          console.log("Check permissions!");
          console.log(data);
        }}
      />
					);
	    }
}
 export default Feedback;