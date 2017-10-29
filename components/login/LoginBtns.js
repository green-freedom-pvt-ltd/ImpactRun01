
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
          fetch("http://dev.impactrun.com/api/users/", {
          method: "GET",
           headers: {  
              'Authorization':"Bearer facebook "+ Fb_token,
            }
          })
        .then((response) => response.json())
        .then((userdata) => {
            var userdata = userdata[0];
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
           AsyncStorage.setItem('USERDATA',JSON.stringify(userData), () => {
            AsyncStorage.getItem('USERDATA', (err, result) => {
              console.log("userresult ",result);
            })
            _this.LoginCountFunction();
            _this.props.getUserData();
          })
       
          })
         .done(); 
         } else {
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
      fetch("http://dev.impactrun.com/api/users/", {
      method: "GET",
       headers: {  
          'Authorization':"Bearer google-oauth2 "+ user.accessToken,
        }
      })
      .then((response) => response.json())
      .then((userdata) => { 
       console.log('userdata',userdata);
         var userdata = userdata[0];
             
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


          AsyncStorage.setItem('USERDATA',JSON.stringify(userData), () => {
            AsyncStorage.getItem('USERDATA', (err, result) => {
              console.log("userresult ",result);
            })
            this.LoginCountFunction();
            this.props.getUserData();
            // this.props.tabNavigation();
          })
          
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