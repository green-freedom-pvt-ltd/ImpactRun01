
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
import SocialShare from '../socialShare';
import IconSec from 'react-native-vector-icons/Ionicons';
import commonStyles from '../styles';
import styleConfig from '../styleConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar from '../navBarComponent';
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
         <Icon style={{color:'black',fontSize:styleConfig.fontSizerlabe+10,margin:7.5,paddingRight:14}}name={'grade'}></Icon>
         <View><Text style={{color:'#4a4a4a',fontSize:styleConfig.fontSizerlabel+2,fontFamily:styleConfig.FontFamily}}>RATE US</Text></View>   
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
            text:'LOGIN',
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
             let keys = ['UID234', 'UID345','USERDATA'];
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
            let keys = ['UID234', 'UID345','USERDATA','fetchRunhistoryData'];
              AsyncStorage.multiRemove(keys, (err) => {
              });
       
          } else {
            console.log(error, data);
          }
        });
      }
      componentDidMount() {
          AsyncStorage.getItem('USERDATA', (err, result) => {
            let user = JSON.parse(result);
            this.setState({
              user:user,
              loaded:true
            })
            if (this.state.user) {
              this.setState({
                text:(this.state.user) ? 'LOGOUT':'LOGIN',
                IconText: (this.state.user) ? 'md-log-out':'md-log-in'
              })
            };
          })  
      }

      
      render() {
         return (
              <View style={{height:deviceHeight,width:deviceWidth}}>
                <NavBar title = {'SETTINGS'}/>
                <View style={{paddingLeft:10,paddingTop:10,}}>
                <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',flex:0.2,}}>
                  <SocialShare/>
                </View>
                <View style={{flex:0.2}}>
                  <OpenURLButton  url={'https://itunes.apple.com/us/app/impactrun/id1143265464?mt=8'}/> 
                </View> 
                <View style={{justifyContent:'flex-start',flex:0.2}}>      
                <TouchableOpacity onPress={()=>this._signOut()} style={{marginLeft:1,alignItems:'center',flexDirection:'row',flex:1}}>
                  <IconSec style={{color:'black',fontSize:styleConfig.fontSizerlabel+4,margin:10,paddingRight:10}}name={this.state.IconText}></IconSec>
                    <Text style={{color:'#4a4a4a',fontSize:styleConfig.fontSizerlabel+2,fontFamily:styleConfig.FontFamily}}>{this.state.text}</Text>
                </TouchableOpacity>
                </View>
               
                </View>
                 <View style={{ position:'absolute',bottom:50,height:100,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
                <Text style={{color:'#4a4a4a',fontSize:styleConfig.fontSizerlabel+2,fontFamily:styleConfig.FontFamily}}>Version 2.7.7</Text>
                </View>
               </View>
              );
          }
      }
 export default Setting;