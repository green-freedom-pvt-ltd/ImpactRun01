
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
 AlertIOS,
 View,
 Text,
 Dimensions,
 TouchableOpacity,
 AsyncStorage,
 Image,
 NetInfo
} from 'react-native'
var REQUEST_URL = 'http://Dev.impactrun.com/api/causes';
import Icon from 'react-native-vector-icons/Ionicons';
var FBLoginManager = require('NativeModules').FBLoginManager;
import Lodingscreen from '../../components/lodingScreen';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
var deviceHeight = Dimensions.get('window').height;

var deviceWidth = Dimensions.get('window').width;

class Profile extends Component {
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
            user:null,
            loaded: false,
            mycauseDatatCount:null,

        };
      }
  
      componentDidMount() {
        GoogleSignin.configure({
          iosClientId:"437150569320-v8jsqrfnbe07g7omdh4b1h5tn78m0omo.apps.googleusercontent.com", // only for iOS
        })
        .then((user) => {
           console.log('Token:'+user);
        });
        AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
          });
        }) 
        NetInfo.isConnected.fetch().done(
          (isConnected) => {  
          console.log('isConnected3'+ this.state.isConnected);
          if (isConnected) {
            this.fetchData();
            console.log('isConnected'+this.state.isConnected)
           }
          }
        );   
      }


    fetchData(dataValue){
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((causes) => { 
          console.log('mycauseLength',causes);
          var causes = causes;
          let causesData = []
          causes.results.forEach ((item,i)=> {
            causesData.push(['cause'+i, JSON.stringify(item)])
          })
          let newData  =[]
          causes.results.forEach ((item,i)=> {
            newData.push('cause'+i);
          })
          var causeNum = JSON.stringify(newData);
          console.log('somCusecount',causeNum);
          this.setState({
            myCauseNum:JSON.stringify(newData),
          })
          AsyncStorage.multiSet(causesData, (err) => {
            console.log('myCauseErr'+err)
            })
        })
        .done();
      }

      _signInGoogle() { 
        GoogleSignin.signIn()
        .then((user) => {
          this.setState({user:user,loaded:true,});
          var access_token = user.accessToken;
          fetch("http://dev.impactrun.com/api/users/", {
            method: "GET",
            headers: {  
              'Authorization':"Bearer google-oauth2 "+ user.accessToken,
            }
          })
          .then((response) => response.json())
          .then((userdata) => { 
           this.navigateToHomeVaiGoogle();
            AlertIOS.alert('Thankyou for login', 'you are successfully logged in');
           console.log('userdata',userdata);
              var userdata = userdata;
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
                  phone_number:userdata[0].phone_number,
                  Birth_day:userdata[0].birthday,
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
            .done();
           })
        .catch((err) => {
          console.log('WRONG SIGNIN Google', err);
        })
        .done();
      }

      handleFBLogin(){
        var _this = this;
        FBLoginManager.login(function(error, data){
          if (!error) {
            _this.setState({ user : data,loaded:true,});
            console.log('userFbdata'+JSON.stringify(data.credentials.token));
            _this.props.onLogin && _this.props.onLogin();
             var Fb_token = data.credentials.token;
              fetch("http://dev.impactrun.com/api/users/", {
              method: "GET",
               headers: {  
                  'Authorization':"Bearer facebook "+ Fb_token,
                }
              })
          
              .then((response) => response.json())
              .then((userdata) => {

                  _this.navigateToHomeVaiFacebook();
                  AlertIOS.alert('Thankyou for login', 'you are successfully logged in');
                  var userdata = userdata;
                  console.log('userDatafb'+JSON.stringify(userdata));
                  let UID234_object = {
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
      navigateToHomeVaiFacebook(){
         this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
          passProps:{provider:'facebook'},
         })
      }
      navigateToHome(){
        this.props.navigator.push({
        title: 'Gps',
        id:'tab',
        passProps:{dataCauseCount:this.state.mycauseDataCount,dataCauseNum:this.state.myCauseNum},
        navigator: this.props.navigator,
        })
      }
      
      navigateToHomeVaiGoogle(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
          passProps:{provider:'google'},
        })
      }

      renderLoadingView() {
        return (
          <Lodingscreen/>
        );
      }

      render() {
        if (this.state.loaded ) {
          return this.renderLoadingView();
        };
        var _this = this;
        var user = this.state.user;
        var text = this.state.user ? "LOG OUT" : "LOG IN WITH FACEBOOK";
        return  (
          <Image source={require('../../images/login_background.png')} style={styles.shadow}>
            <View style={styles.center}>
              <Image source={require('../../images/Logo.png')} style={styles.logo}/>
            </View>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => this.handleFBLogin()} style={styles.Loginbtnfb}>
                <Text style={{color:'#3b5998',textAlign:'left'}}>{text}</Text>
                <Image source={require('../../images/facebook.png')} style={styles.facebook}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._signInGoogle()} style={styles.Loginbtngg}>
                <Text style={{color:'#db3236',textAlign:'left',marginLeft:3,}}>LOGIN WITH GOOGLE</Text>
                <Image source={require('../../images/google_plus.png')} style={styles.google}/>
              </TouchableOpacity>
              <TouchableOpacity 
               style={styles.skip}
               onPress={() => this.navigateToHome()}>
                <View style={{marginTop: 10,backgroundColor:'transparent'}}>
                  <Text style={{color:'white'}}>SKIP</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Image>    
        )
      }

  }

  var styles = StyleSheet.create({
    container:{
      flex:1,
      top:60,
      alignItems:'center',
    },
    center:{
      flex:1,
      alignItems: 'center',
      top:10,
    },
    Loginbtnfb:{
      flexDirection: 'row',
      width:deviceWidth-100,
      backgroundColor:'white',
      borderRadius:5,
      marginTop:15,
      height:50,
      paddingLeft:5,
      paddingRight:5,
      bottom:10,
      alignItems:'center',
    },
    Loginbtngg:{
      flexDirection: 'row',
      width:deviceWidth-100,
      backgroundColor:'white',
      borderRadius:5,
      marginTop:15,
      height:50,
      paddingLeft:5,
      paddingRight:5,
      bottom:0,
      alignItems:'center',
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
      right:2, 
      marginTop:2,    
    },
    google:{
      position:'absolute',
      width:45,
      height:45,
      right:2, 
      marginTop:2,
    }
   })

export default Profile;
