
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
    Linking,
    SegmentedControlIOS,
  } from 'react-native';
import SocialShare from './socialShare';
import IconSec from 'react-native-vector-icons/Ionicons';
import commonStyles from '../../components/styles';
import styleConfig from '../../components/styleConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class OpenURLButton extends React.Component {
  static propTypes = {
    url: React.PropTypes.string,
  };

  handleClick = () => {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
  };

  render() {
    return (
      <TouchableOpacity style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',flex:1}}
        onPress={this.handleClick}>
         <Icon style={{color:'black',fontSize:22,margin:7.5}}name={'grade'}></Icon>
         <View><Text style={{color:'#4a4a4a'}}>Rate us</Text></View>
      </TouchableOpacity>
    );
  }
}

var FBLoginManager = require('react-native-facebook-login').FBLoginManager;
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
class Setting extends Component {
     constructor(props) {
        super(props);
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            user:null,
            loaded: false,
            text:'Login',
            IconText:'md-log-in'

        };
      }
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
             let keys = ['UID234', 'UID345'];
              AsyncStorage.multiRemove(keys, (err) => {
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
      handleFBLogout(){
        var _this = this;
        FBLoginManager.logout(function(error, data){
          if (!error) {
            _this.setState({ user : null});
            _this.props.onLogout && _this.props.onLogout();
            let keys = ['UID234', 'UID345'];
              AsyncStorage.multiRemove(keys, (err) => {
              });

          } else {
            console.log(error, data);
          }
        });
      }
      componentDidMount() {
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
        stores.map((result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
            this.setState({
              user:val,
              loaded:true,
            })
            if (this.state.user) {
              this.setState({
                text:(this.state.user) ? 'Logout':'Login',
                IconText: (this.state.user) ? 'md-log-out':'md-log-in'
              })
            };
        });
      })
      }
      removeItem(){
        let keys = 'Feedcount';
        AsyncStorage.removeItem(keys, (err) => {
        });
      }
      render() {
         return (
              <View style={{height:deviceHeight,width:deviceWidth}}>
                <View style={commonStyles.Navbar}>
                    <Text style={commonStyles.menuTitle}>Settings</Text>
                </View>
                <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',flex:0.2,}}>
                  <SocialShare/>
                </View>
                <View style={{flex:0.2}}>
                  <OpenURLButton  url={'https://itunes.apple.com/us/app/impactrun/id1143265464?mt=8'}/>
                </View>
                <View style={{justifyContent:'flex-start',flex:0.2}}>
                <TouchableOpacity onPress={()=>this._signOut()} style={{marginLeft:1,alignItems:'center',flexDirection:'row',flex:1}}>
                  <IconSec style={{color:'black',fontSize:20,margin:10}}name={this.state.IconText}></IconSec>
                  <View>
                    <Text style={{color:'#4a4a4a'}}>{this.state.text}</Text>
                  </View>
                </TouchableOpacity>
                </View>
                <View style={{flex:1}}></View>
               </View>
              );
          }
      }
 export default Setting;