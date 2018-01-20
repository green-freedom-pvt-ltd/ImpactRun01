'use strict';

import React, {
    Component
} from 'react';
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
var {
    FBLoginManager
} = require('react-native-facebook-login');
const CleverTap = require('clevertap-react-native');

import Lodingscreen from '../../components/LodingScreen';
import styleConfig from '../../components/styleConfig';
import Tabs from '../homescreen/tab';
import fetchDatafromApi from '../getDataFromApi.js';
import setDataLocally from '../setLocalData.js';
import fetchCauseData from '../fetchCauseData.js';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import {
    GoogleSignin,
    GoogleSigninButton
} from 'react-native-google-signin';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

class Login extends Component {
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
            user: null,
            loaded: false,
            mycauseDatatCount: null,
          };
          this._handleConnectivityChange = this._handleConnectivityChange.bind(this);
      }


      componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'change',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => {
            this.setState({isConnected});
              this.fetchDataonInternet();
            }
        );
        CleverTap.recordEvent('ON_LOAD_LOGIN_SCREEN');
          
      }

      componentWillUnmount(){
        NetInfo.removeEventListener(
            'change',
            this._handleConnectivityChange
        );
      }


      _handleConnectivityChange(isConnected) {
        var _this = this;
        _this.setState({
          isConnected,
        });
         this.fetchDataonInternet(isConnected);
       
      }
     

      componentWillMount() {
          AsyncStorage.getItem('LoginCount', (err, result) => {
              var Logincount = JSON.parse(result);
              this.setState({
                  LoginCountTotal: Logincount,
              })
          })
          GoogleSignin.configure({
                  iosClientId: "437150569320-v8jsqrfnbe07g7omdh4b1h5tn78m0omo.apps.googleusercontent.com", // only for iOS
              })
              .then((user) => {
                  console.log('Token:' + user);
              });
         
      }

      

      fetchDataonInternet(isConnected){
        console.log('isConnected',isConnected);

        if (isConnected) {
           console.log('isConnected2',isConnected);
            this.fetchData();
        }
      }

      handleNetworkErrors(response){
        console.log("response",response);
       if(response.ok){
        console.log("response",response);
        return response.json()
       }else{
        AlertIOS.alert("Network error","There is some problem connecting to internet");
        return;
       }
       return response.json()
      }

      fetchData() {
        console.log('fetching');
        var token = 'noauthuser' ;
        var auth_token = '';
        if (this.state.user) {
            token = this.state.user.auth_token;
            auth_token = "Bearer " + token;
        }
       fetchCauseData.getCauseFromApi(auth_token)
        .then((causeNumber)=>{
            this.setState({
                dataCauseNum:causeNumber,
            })
        })
        .catch((err)=>{
         console.log("errorcauseapi ",err)
        })
      }

      _signInGoogle() {
        GoogleSignin.signIn()
            .then((user) => {
            this.setState({
                user: user,
                loaded: true,
            });
            let headerData = {
              method: "GET",
              headers: {
                  'Authorization': "Bearer google-oauth2 " + user.accessToken,
              }
            }
            fetchDatafromApi.fetchData("http://dev.impactrun.com/api/users/",headerData)
              .then((userdata) => {
                   var userdata = userdata[0];
                   console.log('userdata',userdata);
                   CleverTap.recordEvent('ON_LOGIN_SUCCESS', 
                    { 
                      'eid': userdata.auth_token, 
                      'ios': true,
                      'user_id': userdata.user_id,
                      'is_sign_up_user': false,
                      'Identity':userdata.user_id,
                      'medium': 'g+',
                    }
                  );
                  CleverTap.profileSet({'Name': userdata.first_name +' '+userdata.last_name, 'UserId':userdata.user_id , 'Email': userdata.email,'Identity':userdata.user_id,});

                    
                    console.log('usrerloginGoogle',userdata.body_weight);
                    let userData = {
                      body_weight:userdata.body_weight,
                      first_name: userdata.first_name,
                      user_id: userdata.user_id,
                      last_name: userdata.last_name,
                      gender_user: userdata.gender_user,
                      email: userdata.email,
                      phone_number: userdata.phone_number,
                      Birth_day: userdata.birthday,
                      social_thumb: userdata.social_thumb,
                      auth_token: userdata.auth_token,
                      total_amount: userdata.total_amount,
                      is_signup: userdata.sign_up,
                      total_distance: userdata.total_distance,
                      team_code: userdata.team_code,
                    };
                    setDataLocally.setUserData('USERDATA',JSON.stringify(userData))
                    .then((userdata)=>{
                       this.navigateToHome();
                       console.log('setUserData',userdata);
                    })
                    .catch((err)=>{
                      setDataLocally.setUserData('USERDATA',JSON.stringify(userData))
                      console.log('error',err);
                    })
                })
              })
            .catch((err) => {
                console.log('WRONG SIGNIN Google', err);
                CleverTap.recordEvent('ON_LOGIN_FAILED',{
                  error:err,   
                  medium:'g+'
                });

            })
            .done();
      }

      handleFBLogin() {
        var _this = this;
        FBLoginManager.login(function(error, data) {
          if (!error) {
              _this.setState({
                  user: data,
                  loaded: true,
              });

              _this.props.onLogin && _this.props.onLogin();
              var Fb_token = data.credentials.token;
              let headerData = {
                method: "GET",
                headers: {
                    'Authorization': "Bearer facebook " + Fb_token,
                }
              }
              fetchDatafromApi.fetchData("http://dev.impactrun.com/api/users/",headerData)
              .then((userdata) => {
                console.log('userData',userdata);
                var userdata = userdata[0];
                CleverTap.recordEvent('ON_LOGIN_SUCCESS', 
                  { 
                    'eid': userdata.auth_token, 
                    'ios': true,
                    'user_id': userdata.user_id,
                    'is_sign_up_user': false,
                    'medium': 'fb'
                  }
                );
                CleverTap.profileSet({'Name': userdata.first_name +' '+userdata.last_name, 'UserId':userdata.user_id , 'Email': userdata.email, 'LeagueName': userdata.team_code,'Identity':userdata.user_id,});                
                console.log('usrerloginfacebook',userdata);            
                let userData = {
                    body_weight:userdata.body_weight,
                    first_name: userdata.first_name,
                    user_id: userdata.user_id,
                    last_name: userdata.last_name,
                    gender_user: userdata.gender_user,
                    email: userdata.email,
                    phone_number: userdata.phone_number,
                    Birth_day: userdata.birthday,
                    social_thumb: userdata.social_thumb,
                    auth_token: userdata.auth_token,
                    total_amount: userdata.total_amount,
                    is_signup: userdata.sign_up,
                    total_distance: userdata.total_distance,
                    team_code: userdata.team_code,
                };               
                setDataLocally.setUserData('USERDATA',JSON.stringify(userData))
                .then((userdata)=>{
                   _this.navigateToHome();
                    console.log('setUserData',userdata);
                })
                .catch((err)=>{
                  setDataLocally.setUserData('USERDATA',JSON.stringify(userData))
                  console.log('error',err);
                })
              })
              .catch((err) => {
                CleverTap.recordEvent('ON_LOGIN_FAILED',{
                  error:err,   
                  medium:'fb'
                });
                console.log('WRONG SIGNIN FB', err);
              })
            } else {
           console.log(error, data);
          }
        });
      }

      navigateToHome() {
        this.props.navigator.push({
            title: 'Gps',
            id: 'tab',
            passProps: {
              dataCauseNum: this.state.dataCauseNum,
              causes:this.state.causes,
            },
            navigator: this.props.navigator,
        })
      }


      onPressSkip(){
        CleverTap.recordEvent('ON_CLICK_LOGIN_SKIP');
        this.navigateToHome();
      }



      renderLoadingView() {
          return ( <Lodingscreen / >);
      }


      render() {
          if (this.state.loaded) {
              return this.renderLoadingView();
          };
          var _this = this;
          var user = this.state.user;
          var text = this.state.user ? "LOG OUT" : "LOGIN WITH FACEBOOK";
          return  (
            <View style={{height:deviceHeight+5,width:deviceWidth,backgroundColor:'white'}}>
              <Image source={require('../../images/login_background.png')} style={styles.shadow}>         
                <View style={styles.center}>         
                  <Image source={require('../../images/Logo.png')} style={styles.logo} />
                  <Text style={styles.getFit}>Get Fit. Do Good.</Text>
                </View>

                <View style={styles.container}>
                  <View>
                    <TouchableOpacity onPress={() => this.handleFBLogin()} style={styles.Loginbtnfb}>
                      <View style={{width:deviceWidth-150,}}>
                        <Text style={{color:'#3b5998',textAlign:'center',fontFamily: styleConfig.FontFamily,fontSize:styleConfig.FontSizeLogin}}>{text}</Text>
                      </View>
                      <Image source={require('../../images/facebook.png')} style={styles.facebook} />
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
                       onPress={() => this.onPressSkip()}>
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top:-50,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:200,
    },
    Loginbtnfb: {
        flexDirection: 'row',
        width: deviceWidth - 100,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 15,
        height: 50,
        bottom: 10,
        alignItems: 'center',
    },
    Loginbtngg: {
        flexDirection: 'row',
        width: deviceWidth - 100,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 10,
        height: 50,
        bottom: 0,
        alignItems: 'center',
    },
    shadow: {
        position: 'absolute',
        height: deviceHeight+5,
        width: deviceWidth,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        top:1,
    },
    skip: {
        flex: 1,
        top: 30,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    logo: {
        height:responsiveHeight(8),
        width:responsiveWidth(40),
        resizeMode:'contain',
    },
    facebook: {
        position: 'absolute',
        width: 45,
        height: 45,
        right: 2,
        marginTop: 2,
    },
    google: {
        position: 'absolute',
        width: 45,
        height: 45,
        right: 2,
        marginTop: 2,
    },
    getFit:{
      color:styleConfig.black,
      fontFamily: styleConfig.FontFamily,
      fontSize:responsiveFontSize(1.8),
    }
})

export default Login;