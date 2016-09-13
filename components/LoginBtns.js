
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
    AsyncStorage,
  } from 'react-native';
var FBLoginManager = require('NativeModules').FBLoginManager;
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class LoginBtns extends Component {
    propTypes: {
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  }
  constructor(props) {
      super(props);
      this.state = {
          visibleHeight: Dimensions.get('window').height,
          scroll: false,
          loaded: false,
      };
   }
  handleFBLogin(){
    var _this = this;
    FBLoginManager.login(function(error, data){
      if (!error) {
        _this.setState({ user : data,loaded:true,provider:'facebook'});
        console.log('userFbdata'+JSON.stringify(data.credentials.token));
        _this.props.onLogin && _this.props.onLogin();
         var Fb_token = data.credentials.token;
          fetch("http://139.59.243.245/api/users/", {
          method: "GET",
           headers: {  
              'Authorization':"Bearer facebook "+ Fb_token,
            }
          })
      
        .then((response) => response.json())
        .then((userdata) => {
            var userdata = userdata;
            console.log('userDatafb'+JSON.stringify(userdata));
            let UID234_object = {
                first_name:userdata[0].first_name,
                user_id:userdata[0].user_id,
                last_name:userdata[0].last_name,
                gender_user:userdata[0].gender_user,
                email:userdata[0].email,
                phone_number:userdata[0].phone_number,
                Birth_day:userdata[0].birthday,
                social_thumb:userdata[0].social_thumb,
                auth_token:userdata[0].auth_token,
                total_amount:userdata[0].total_amount,
                total_distance:userdata[0].total_distance,
            };
            // first user, delta values
            let UID234_delta = {
                first_name:userdata[0].first_name,
                user_id:userdata[0].user_id,
                last_name:userdata[0].last_name,
                gender_user:userdata[0].gender_user,
                email:userdata[0].email,
                Birth_day:userdata[0].birthday,
                phone_number:userdata[0].phone_number,
                social_thumb:userdata[0].social_thumb,
                auth_token:userdata[0].auth_token,
                total_amount:userdata[0].total_amount,
                total_distance:userdata[0].total_distance,
           };
            // // second user, initial values
             let UID345_object = {
                first_name:userdata[0].first_name,
                user_id:userdata[0].user_id,
                last_name:userdata[0].last_name,
                gender_user:userdata[0].gender_user,
                email:userdata[0].email,
                Birth_day:userdata[0].birthday,
                phone_number:userdata[0].phone_number,
                social_thumb:userdata[0].social_thumb,
                auth_token:userdata[0].auth_token,
                total_amount:userdata[0].total_amount,
                total_distance:userdata[0].total_distance,
            };

            // // second user, delta values
             let UID345_delta = {
                first_name:userdata[0].first_name,
                user_id:userdata[0].user_id,
                last_name:userdata[0].last_name,
                gender_user:userdata[0].gender_user,
                email:userdata[0].email,
                Birth_day:userdata[0].birthday,
                phone_number:userdata[0].phone_number,
                social_thumb:userdata[0].social_thumb,
                auth_token:userdata[0].auth_token,
                total_amount:userdata[0].total_amount,
                total_distance:userdata[0].total_distance,
            };

            let multi_set_pairs = [
                ['UID234', JSON.stringify(UID234_object)],
                ['UID345', JSON.stringify(UID345_object)]
            ]
            let multi_merge_pairs = [
                ['UID234', JSON.stringify(UID234_delta)],
                ['UID345', JSON.stringify(UID345_delta)]
            ]

        AsyncStorage.multiSet(multi_set_pairs, (err) => {
            AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
                AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
                    stores.map((result, i, store) => {
                        let key = store[i][0];
                        let val = store[i][1];
                    });
                });
            });
         });

        })

       .catch((err) => {
          console.log('WRONG SIGNIN FB', err);
        })
      } else {
        console.log(error, data);
      }
    });
  }

   _signInGoogle() {
    
    GoogleSignin.signIn()
    .then((user) => {
      this.setState({user:user,loaded:true,provider:'google'});
      var access_token = user.accessToken;
      fetch("http://139.59.243.245/api/users/", {
      method: "GET",
       headers: {  
          'Authorization':"Bearer google-oauth2 "+ user.accessToken,
        }
      })
      .then((response) => response.json())
      .then((userdata) => { 
       console.log('userdata',userdata);
          var userdata = userdata;
          let UID234_object = {
              first_name:userdata[0].first_name,
              user_id:userdata[0].user_id,
              last_name:userdata[0].last_name,
              gender_user:userdata[0].gender_user,
              email:userdata[0].email,
              phone_number:userdata[0].phone_number,
              social_thumb:userdata[0].social_thumb,
              auth_token:userdata[0].auth_token,
              total_amount:userdata[0].total_amount,
              total_distance:userdata[0].total_distance,
              Birth_day:userdata[0].birthday,
          };
          // first user, delta values
          let UID234_delta = {
              first_name:userdata[0].first_name,
              user_id:userdata[0].user_id,
              last_name:userdata[0].last_name,
              gender_user:userdata[0].gender_user,
              email:userdata[0].email,
              phone_number:userdata[0].phone_number,
              social_thumb:userdata[0].social_thumb,
              auth_token:userdata[0].auth_token,
              total_amount:userdata[0].total_amount,
              total_distance:userdata[0].total_distance,
              Birth_day:userdata[0].birthday,
         };
          // // second user, initial values
           let UID345_object = {
              first_name:userdata[0].first_name,
              user_id:userdata[0].user_id,
              last_name:userdata[0].last_name,
              gender_user:userdata[0].gender_user,
              email:userdata[0].email,
              phone_number:userdata[0].phone_number,
              social_thumb:userdata[0].social_thumb,
              auth_token:userdata[0].auth_token,
              total_amount:userdata[0].total_amount,
              total_distance:userdata[0].total_distance,
              Birth_day:userdata[0].birthday,
          };

          // // second user, delta values
           let UID345_delta = {
              first_name:userdata[0].first_name,
              user_id:userdata[0].user_id,
              last_name:userdata[0].last_name,
              gender_user:userdata[0].gender_user,
              email:userdata[0].email,
              phone_number:userdata[0].phone_number,
              social_thumb:userdata[0].social_thumb,
              auth_token:userdata[0].auth_token,
              total_amount:userdata[0].total_amount,
              total_distance:userdata[0].total_distance,
              Birth_day:userdata[0].birthday,
          };

          let multi_set_pairs = [
              ['UID234', JSON.stringify(UID234_object)],
              ['UID345', JSON.stringify(UID345_object)]
          ]
          let multi_merge_pairs = [
              ['UID234', JSON.stringify(UID234_delta)],
              ['UID345', JSON.stringify(UID345_delta)]
          ]

          AsyncStorage.multiSet(multi_set_pairs, (err) => {
              AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
                  AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
                      stores.map((result, i, store) => {
                          let key = store[i][0];
                          let val = store[i][1];
                      });
                  });
              });
           });
  
          })
        .done();
       })
   .catch((err) => {
      console.log('WRONG SIGNIN Google', err);
    })
    .done();
  }

    onPress(){
      this.state.user
        ? this.handleFBLogout()
        : this.handleFBLogin();

      this.props.onPress && this.props.onPress();
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
          <View style={styles.container}>
            <TouchableOpacity onPress={() => this.onPress()} style={styles.Loginbtnfb}><Text style={{color:'#3b5998',textAlign:'left'}}>LOGIN WITH FACEBOOK </Text><Image source={require('../images/facebook.png')} style={styles.facebook}/>
            </TouchableOpacity>
             <TouchableOpacity onPress={() => this._signInGoogle()} style={styles.Loginbtngg}><Text style={{color:'#db3236',textAlign:'left',marginLeft:3,}}>LOGIN WITH GOOGLE</Text><Image source={require('../images/google_plus.png')} style={styles.google}/>
            </TouchableOpacity>
           </View>
					);
	    }
}
var styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',

       },
    center:{
        flex:1,
        alignItems: 'center',
        top:10,
        },
    Loginbtnfb:{
        flexDirection: 'row',
        width:deviceWidth-98,
        backgroundColor:'white',
        borderRadius:5,
        marginTop:15,
        height:53,
        paddingLeft:5,
        paddingRight:10,
        bottom:10,
        alignItems:'center',
        borderWidth:2,
        borderColor:'#3b5998',


      },
    Loginbtngg:{
        flexDirection: 'row',
        width:deviceWidth-98,
        backgroundColor:'white',
        borderRadius:5,
        marginTop:15,
        height:53,
        paddingLeft:5,
        paddingRight:10,
        bottom:0,
        alignItems:'center',
        borderWidth:2,
        borderColor:'#db3236',

      },
    shadow: {
        position:'absolute',
        height:deviceHeight,
        flex: 1,
        width: deviceWidth,
        backgroundColor: 'transparent',
        justifyContent: 'center',      
      },
     skip:{
       justifyContent: 'center',      
      },
    logo:{
        top:100,
        width:200,
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
             
      },
      facebook:{
        position:'absolute',
        width:45,
        height:45,
        right:5, 
        marginTop:2,    
      },
       google:{
        position:'absolute',
        width:45,
        height:45,
        right:5, 
        marginTop:2,
      }
   })
 export default LoginBtns;