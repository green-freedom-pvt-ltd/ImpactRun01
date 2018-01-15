
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
    AlertIOS,
  } from 'react-native';
var FBLoginManager = require('react-native-facebook-login').FBLoginManager;
import styleConfig from '../styleConfig';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
const CleverTap = require('clevertap-react-native');
import fetchDatafromApi from '../getDataFromApi.js';
import setDataLocally from '../setLocalData.js';

class LoginBtns extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
          loaded: false,
          provider:"",
      };
    }

    componentDidMount() {
    } 


    handleFBLogin(){
     var _this = this;
     FBLoginManager.login(function(error, data){
      if (!error) {
        _this.setState({ user : data,loaded:true,provider:'facebook'});
         var Fb_token = data.credentials.token;
          let headerData = {
            method: "GET",
            headers: {
                'Authorization': "Bearer facebook " + Fb_token,
            }
          }
          fetchDatafromApi.fetchData("http://dev.impactrun.com/api/users/",headerData)
        .then((userdata) => {
            var userdata = userdata[0];
            CleverTap.recordEvent('ON_LOGIN_SUCCESS', 
                    { 
                      'eid': userdata.auth_token, 
                      'ios': true,
                      'user_id': userdata.user_id,
                      'is_sign_up_user': false,
                      'Identity':userdata.user_id,
                      'medium': 'fb',
                    }
                  );
            
             CleverTap.profileSet({'Name': userdata.first_name +' '+userdata.last_name, 'UserId':userdata.user_id , 'Email': userdata.email,'Identity':userdata.user_id,});
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
             _this.LoginCountFunction();
              _this.props.getUserData();
            })
            .catch((err)=>{
              setDataLocally.setUserData('USERDATA',JSON.stringify(userData))
              console.log('error',err);
            })
          })
         .done(); 
         } else {
            CleverTap.recordEvent('ON_LOGIN_FAILED',{
              error:error,   
              medium:'fb'
            });
        console.log(error, data);
       }
     })
    }
    
    LoginCountFunction(){
      AlertIOS.alert('Thankyou for login', 'you are successfully logged in');
    }

   _signInGoogle() {
    
    GoogleSignin.signIn()
    .then((user) => {
      this.setState({user:user,loaded:true,provider:'google'});
      var access_token = user.accessToken;
      let headerData = {
        method: "GET",
        headers: {
            'Authorization': "Bearer google-oauth2 " + user.accessToken,
        }
      }
      fetchDatafromApi.fetchData("http://dev.impactrun.com/api/users/",headerData)
      .then((userdata) => { 
       console.log('userdata',userdata);
         var userdata = userdata[0];
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
          CleverTap.profileSet({'Name': userdata.first_name +' '+userdata.last_name, 'UserId':userdata.user_id , 'Email': userdata.email, 'LeagueName': userdata.team_code,'Identity':userdata.user_id,});    
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
             this.LoginCountFunction();
             this.props.getUserData();
             console.log('setUserData',userdata);
          })
          .catch((err)=>{
            setDataLocally.setUserData('USERDATA',JSON.stringify(userData))
            console.log('error',err);
          }) 
         })
        .done();
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
            <TouchableOpacity onPress={() => this.handleFBLogin()} style={styles.Loginbtnfb}>
              <View style={{width:deviceWidth-150}}>
                <Text style={{color:'#3b5998',textAlign:'center' ,fontSize:styleConfig.FontSizeLogin}}>LOGIN WITH FACEBOOK </Text>
              </View>
              <Image source={require('../../images/facebook.png')} style={styles.facebook}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._signInGoogle()} style={styles.Loginbtngg}>
              <View style={{width:deviceWidth-150,}}>
                <Text style={{color:'#db3236',textAlign:'center',marginLeft:3,fontSize:styleConfig.FontSizeLogin}}>LOGIN WITH GOOGLE</Text>
              </View>
              <Image source={require('../../images/google_plus.png')} style={styles.google}/>
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