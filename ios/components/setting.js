
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
    borderBottomColor:'#00b9ff',
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
})

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

class Setting extends Component {
      // Go_Back
    popRoute() {
         this.props.navigator.pop();
    }
     // GOOGLE_LOGOUT
       _signOut() {
         this.navigateToLogin();
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

    	render() {
    		return (
                <View>
                <View style={styles.Navbar}>
                      <TouchableOpacity onPress={()=>this.popRoute()} ><Icon style={{color:'white',fontSize:30,}}name={'md-arrow-back'}></Icon></TouchableOpacity>
                      <Text style={styles.menuTitle}>Settings</Text>
                 </View>
    		         <TouchableOpacity onPress={()=>this._signOut()}><Icon style={{color:'black',fontSize:30,}}name={'md-text'}></Icon><Text>LOG OUT</Text></TouchableOpacity>

                </View>
    					);
    	    }
      }
 export default Setting;