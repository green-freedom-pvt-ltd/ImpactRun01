
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
import apis from '../../components/apis';
import Icon from 'react-native-vector-icons/Ionicons';
var FBLoginManager = require('react-native-facebook-login').FBLoginManager;

import Lodingscreen from '../../components/LodingScreen';
import styleConfig from '../../components/styleConfig';

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
            LoginCountTotal:null,

        };
      }

     LoginCountFunction(){
        let TotalLogin = {
          TotalLoginCount:1,
        }
          AsyncStorage.setItem('LoginCount', JSON.stringify(TotalLogin), () => {
            AsyncStorage.getItem('LoginCount', (err, result) => {
              var Logincount = JSON.parse(result);
              this.setState({
                LoginCountTotal:Logincount,
                openModel:true,
              })
          })
        })


      }

      componentWillMount() {
        AsyncStorage.getItem('LoginCount', (err, result) => {
          var Logincount = JSON.parse(result);
          console.log('Logincount',Logincount);
          this.setState({
            LoginCountTotal:Logincount,
          })
        })
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
          if (isConnected) {
            this.fetchData();
           }
          }
        );
      }


    fetchData(dataValue){
        fetch(apis.causeListapi)
        .then((response) => response.json())
        .then((causes) => {
          var causes = causes;
          let causesData = []
          let newData  =[]
          causes.results.forEach ((item,i)=> {
          if (item.is_active) {
            causesData.push(['cause'+i, JSON.stringify(item)])
            newData.push('cause'+i);
          };
          })
          this.setState({
            myCauseNum: newData,
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
          console.log('userdata',user.accessToken);
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
            console.log('responsedata',userdata);
              var userdata = userdata[0];
              let UID234_object = {
                  first_name:userdata.first_name,
                  user_id:userdata.user_id,
                  last_name:userdata.last_name,
                  gender_user:userdata.gender_user,
                  email:userdata.email,
                  phone_number:userdata.phone_number,
                  Birth_day:userdata.birthday,
                  social_thumb:userdata.social_thumb,
                  auth_token:userdata.auth_token,
                  total_amount:userdata.total_amount,
                  is_signup:userdata.sign_up,
                  total_distance:userdata.total_distance,
              };
              // first user, delta values
              let UID234_delta = {
                  first_name:userdata.first_name,
                  user_id:userdata.user_id,
                  last_name:userdata.last_name,
                  gender_user:userdata.gender_user,
                  email:userdata.email,
                  phone_number:userdata.phone_number,
                  Birth_day:userdata.birthday,
                  social_thumb:userdata.social_thumb,
                  auth_token:userdata.auth_token,
                  total_amount:userdata.total_amount,
                  is_signup:userdata.sign_up,
                  total_distance:userdata.total_distance,

               };
              // // second user, initial values
               let UID345_object = {
                  first_name:userdata.first_name,
                  user_id:userdata.user_id,
                  last_name:userdata.last_name,
                  gender_user:userdata.gender_user,
                  email:userdata.email,
                  phone_number:userdata.phone_number,
                  Birth_day:userdata.birthday,
                  social_thumb:userdata.social_thumb,
                  auth_token:userdata.auth_token,
                  total_amount:userdata.total_amount,
                  is_signup:userdata.sign_up,
                  total_distance:userdata.total_distance,
               };

              // // second user, delta values
               let UID345_delta = {
                  first_name:userdata.first_name,
                  user_id:userdata.user_id,
                  last_name:userdata.last_name,
                  gender_user:userdata.gender_user,
                  email:userdata.email,
                  phone_number:userdata.phone_number,
                  Birth_day:userdata.birthday,
                  social_thumb:userdata.social_thumb,
                  auth_token:userdata.auth_token,
                  total_amount:userdata.total_amount,
                  is_signup:userdata.sign_up,
                  total_distance:userdata.total_distance,
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
                         this.navigateToHome();
                      });
                  });
               });
               this.LoginCountFunction();

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
                  var userdata = userdata[0];
                  let UID234_object = {
                      first_name:userdata.first_name,
                      user_id:userdata.user_id,
                      last_name:userdata.last_name,
                      gender_user:userdata.gender_user,
                      email:userdata.email,
                      phone_number:userdata.phone_number,
                      Birth_day:userdata.birthday,
                      social_thumb:userdata.social_thumb,
                      auth_token:userdata.auth_token,
                      total_amount:userdata.total_amount,
                      is_signup:userdata.sign_up,
                      total_distance:userdata.total_distance,
                  };
                  // first user, delta values
                  let UID234_delta = {
                      first_name:userdata.first_name,
                      user_id:userdata.user_id,
                      last_name:userdata.last_name,
                      gender_user:userdata.gender_user,
                      email:userdata.email,
                      phone_number:userdata.phone_number,
                      Birth_day:userdata.birthday,
                      social_thumb:userdata.social_thumb,
                      auth_token:userdata.auth_token,
                      total_amount:userdata.total_amount,
                      is_signup:userdata.sign_up,
                      total_distance:userdata.total_distance,
                 };
                  // // second user, initial values
                   let UID345_object = {
                      first_name:userdata.first_name,
                      user_id:userdata.user_id,
                      last_name:userdata.last_name,
                      gender_user:userdata.gender_user,
                      email:userdata.email,
                      phone_number:userdata.phone_number,
                      Birth_day:userdata.birthday,
                      social_thumb:userdata.social_thumb,
                      auth_token:userdata.auth_token,
                      total_amount:userdata.total_amount,
                      is_signup:userdata.sign_up,
                      total_distance:userdata.total_distance,
                  };

                  // // second user, delta values
                   let UID345_delta = {
                      first_name:userdata.first_name,
                      user_id:userdata.user_id,
                      last_name:userdata.last_name,
                      gender_user:userdata.gender_user,
                      email:userdata.email,
                      phone_number:userdata.phone_number,
                      Birth_day:userdata.birthday,
                      social_thumb:userdata.social_thumb,
                      auth_token:userdata.auth_token,
                      total_amount:userdata.total_amount,
                      is_signup:userdata.sign_up,
                      total_distance:userdata.total_distance,
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
                              _this.navigateToHome();

                          });
                      });
                      _this.LoginCountFunction();
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

      navigateToHome(){
        this.LoginCountFunction();
        this.props.navigator.push({
        title: 'Gps',
        id:'tab',
        passProps:{dataCauseCount:this.state.mycauseDataCount,dataCauseNum:this.state.myCauseNum,show:this.state.openModel},
        navigator: this.props.navigator,
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
        var text = this.state.user ? "LOG OUT" : "LOGIN WITH FACEBOOK";
        return  (
          <View>
          <Image source={require('../../images/login_background.png')} style={styles.shadow}>
            <View style={styles.center}>
            <Image source={require('../../images/Logo.png')} style={styles.logo}/>
            </View>
             <View style={styles.container}>
             <View>
              <TouchableOpacity onPress={() => this.handleFBLogin()} style={styles.Loginbtnfb}>
                <View style={{width:deviceWidth-150,}}>
                  <Text style={{color:'#3b5998',textAlign:'center',fontFamily: styleConfig.FontFamily,fontSize:styleConfig.FontSizeLogin}}>{text}</Text>
                </View>
                <Image source={require('../../images/facebook.png')} style={styles.facebook}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._signInGoogle()} style={styles.Loginbtngg}>
                <View style={{width:deviceWidth-150,}}>
                  <Text style={{color:'#db3236',textAlign:'center',marginLeft:3,fontFamily: styleConfig.FontFamily,fontSize:styleConfig.FontSizeLogin}}>LOGIN WITH GOOGLE</Text>
                </View>
                <Image source={require('../../images/google_plus.png')} style={styles.google}/>
              </TouchableOpacity>
              <View style={styles.skip}>
                <Text style={{color:styleConfig.grey_70,fontFamily:styleConfig.FontFamily,}}>DON’T WANT TO LOGIN?</Text>
                <TouchableOpacity
                 onPress={() => this.navigateToHome()}>
                    <Text style={{marginLeft:5,color:styleConfig.fade_White,fontFamily: styleConfig.FontFamily,}}>SKIP</Text>
                </TouchableOpacity>
              </View>
             </View>
            </View>
          </Image>
          </View>
        )
      }

  }

  var styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent: 'center',
      alignItems:'center',
    },
    center:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    Loginbtnfb:{
      flexDirection: 'row',
      width:deviceWidth-100,
      backgroundColor:'white',
      borderRadius:5,
      marginTop:15,
      height:50,
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
      flex:1,
      top:20,
      flexDirection:'row',
      justifyContent: 'center',
    },
    logo:{
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
