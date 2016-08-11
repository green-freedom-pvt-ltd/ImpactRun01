
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
   Image
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
var deviceHeight = Dimensions.get('window').height
var deviceWidth = Dimensions.get('window').width;

class Profile2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            scroll: false,
            user:null,           
        };
    }

    componentWillMount() {
       GoogleSignin.configure({
       iosClientId:"437150569320-362l4gc7qou0r2u8gpple6lkfo3jjjre.apps.googleusercontent.com", // only for iOS
       })
      .then((user) => {
         console.log('Token:'+user);
         this.setState({
          userDetail:user
         })
       });
    }

   // GoogleSignin
    _signIn() {
      GoogleSignin.signIn()
      .then((user) => {
        console.log('usertoken:'+ JSON.stringify(user));
        // var user = JSON.parse(JSON.stringify(user));
        this.setState({user:user});
        var access_token = user.accessToken;
        console.log('MY accessToken:'+ access_token);
        fetch("http://139.59.243.245/api/users/", {
          method: "GET",
          headers: {  
              'Authorization':"Bearer google-oauth2 "+ user.accessToken,
             }
        })
        .then((response) => response.json())
        .then((userdata) => {
          this.navigateToHomeScreen();
          console.log('myuserdata2'+JSON.stringify(userdata[0].first_name));
          var userData =JSON.stringify(userdata);
          var userData2 = JSON.parse(userData);
          console.log('myuserdata4'+userData2[0].first_name);
          let UID234_object = {
           first_name:userData2[0].first_name,
           last_name:userData2[0].last_name,
           email:userData2[0].email,
           user_id:userData2[0].user_id,
           auth_token:userData2[0].auth_token,
          };

          // first user, delta values
          let UID234_delta = {
           first_name:userData2[0].first_name,
           last_name:userData2[0].last_name,
           email:userData2[0].email,
           user_id:userData2[0].user_id,
           auth_token:userData2[0].auth_token,
          };

          // second user, initial values
          let UID345_object = {
           first_name:userData2[0].first_name,
           last_name:userData2[0].last_name,
           email:userData2[0].email,
           user_id:userData2[0].user_id,
           auth_token:userData2[0].auth_token,
          };

          // second user, delta values
          let UID345_delta = {
           first_name:userData2[0].first_name,
           last_name:userData2[0].last_name,
           email:userData2[0].email,
           user_id:userData2[0].user_id,
           auth_token:userData2[0].auth_token,
          };

          let multi_set_pairs   = [['UID234', JSON.stringify(UID234_object)], ['UID345', JSON.stringify(UID345_object)]]
          let multi_merge_pairs = [['UID234', JSON.stringify(UID234_delta)], ['UID345', JSON.stringify(UID345_delta)]]

          AsyncStorage.multiSet(multi_set_pairs, (err) => {
            AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
              AsyncStorage.multiGet(['UID234','UID345'], (err, stores) => {
                stores.map( (result, i, store) => {
                  let key = store[i][0];
                  let val = store[i][1];
                  console.log('Myvalue'+key, val);
                });
              });
            });
          });
          this.setState({
            userdata:userData,
          })
          
          console.log('myfuckingdata'+this.state.userdata[0].first_name);
          



         })
                   // first user, initial values
          
      
       console.log('rundybaaz6'+this.state.userdata)
     
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
     
    
    }
     
    // Store User to localStorage
  
     
     
    // Navigate to home screen 
    navigateToHomeScreen(){
      this.props.navigator.push({
        title: 'Gps',
        id:'home',
        index: 0,
        navigator: this.props.navigator,
      });
    }
    
    // render page 
    render() {
      var _this = this;
      var user = this.state.user;
     var data = this.state.userdata;
     console.log('mydata'+data);
        return  (

          <Image source={require('../../images/login_background.png')} style={styles.shadow}>
            <View style={styles.center}>
              <Image source={require('../../images/Logo.png')} style={styles.logo}/>
            </View>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => this.props.navigator.push({
                title: 'Gps',
                id:'home',
                navigator: this.props.navigator,
               })} style={styles.Loginbtnfb}><Text style={{color:'#3b5998',textAlign:'left'}}>LOGIN WITH FACEBOOK</Text><Image source={require('../../images/facebook.png')} style={styles.facebook}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._signIn.bind(this)} style={styles.Loginbtngg}><Text style={{color:'#db3236',textAlign:'left',marginLeft:3,}}>LOGIN WITH GOOGLE</Text><Image source={require('../../images/google_plus.png')} style={styles.google}/></TouchableOpacity>
              <TouchableOpacity style={styles.skip} onPress={() => this.navigateToHomeScreen()}>
                <View style={{marginTop: 10}}>
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
// <Icon style={{color:'#db3236',marginTop:10,position:'absolute',right:3,top:0,fontSize:30,}} name="logo-googleplus" />
// function bindAction(dispatch) {
//     return {
//         openDrawer: ()=>dispatch(openDrawer()),
//         popRoute: () => dispatch(popRoute())
//     }
// }

export default Profile2;
