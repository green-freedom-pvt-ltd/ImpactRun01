
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    Text,
  } from 'react-native';
import SocialShare from './SocialShare';
import Icon from 'react-native-vector-icons/Ionicons';
import Rating from './Rating';
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
    borderBottomColor:'#00b9ff',
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
})
var FBLoginManager = require('NativeModules').FBLoginManager;

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

class Setting extends Component {
      // Go_Back
    popRoute() {
         this.props.navigator.pop();
    }
     // GOOGLE_LOGOUT
       _signOut() {
         this.navigateToLogin();
         this.handleFBLogout();
           GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
           this.setState({user: null});
             console.log('userLogout:');
             let keys = ['UID234', 'UID345'];
              AsyncStorage.multiRemove(keys, (err) => {
                console.log('keyremoved' + keys)
              });

             })
          .catch((err) => {
          console.log('WRONG SIGNIN', err);
         })
        }
        navigateToLogin(){
           this.props.navigator.push({
            title: 'Gps',
            id:'login',
            index: 0,
            navigator: this.props.navigator,
           })
        }
        navigateToRate(){
           this.props.navigator.push({
            title: 'Gps',
            id:'rateus',
            index: 0,
            navigator: this.props.navigator,
           })
        }
          handleFBLogout(){
        var _this = this;
        FBLoginManager.logout(function(error, data){
          if (!error) {
            _this.setState({ user : null});
            _this.props.onLogout && _this.props.onLogout();
          } else {
            console.log(error, data);
          }
        });
      }
    	render() {
    		return (
              <View>
                <View style={styles.Navbar}>
                    <TouchableOpacity style={{height:50,width:50,justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.popRoute()} ><Icon style={{color:'white',fontSize:30,}}name={'md-arrow-back'}></Icon></TouchableOpacity>
                    <Text style={styles.menuTitle}>Settings</Text>
                </View>
                <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',width:deviceWidth}}>
                   <Icon style={{color:'black',fontSize:20,margin:10}}name={'md-log-out'}></Icon>
      		         <TouchableOpacity onPress={()=>this._signOut()}><Text >LOG OUT</Text></TouchableOpacity>
                </View>
                <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',width:deviceWidth}}>
                   <Icon style={{color:'black',fontSize:25,margin:10}}name={'ios-star-half'}></Icon>
                   <TouchableOpacity onPress={()=>this.navigateToRate()}><Text >RATE US</Text></TouchableOpacity>
                </View>
                <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',width:deviceWidth}}>
                  <Icon style={{color:'black',fontSize:20,margin:10}}name={'md-share'}></Icon>
                  <SocialShare/>
                </View>
              </View>
    					);
    	    }
      }
 export default Setting;