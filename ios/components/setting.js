
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
    Linking
  } from 'react-native';
import SocialShare from './SocialShare';
import Icon from 'react-native-vector-icons/Ionicons';
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
      <TouchableOpacity style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',width:deviceWidth}}
        onPress={this.handleClick}>
         <Icon style={{color:'black',fontSize:25,margin:10}}name={'ios-star-half'}></Icon>
         <View><Text >RATE US</Text></View>   
      </TouchableOpacity>
    );
  }
}
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
    backgroundColor:'#e03ed2',
    borderBottomWidth:2,
    borderBottomColor:'#00b9ff',
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
})
var FBLoginManager = require('NativeModules').FBLoginManager;

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

class Setting extends Component {
     constructor(props) {
        super(props);
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            user:null,
            loaded: false,
            text:'LOGIN',

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
        navigateToRate(){
           this.props.navigator.push({
            title: 'Gps',
            id:'rateus',
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
                console.log('keyremoved' + keys)
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
                text:(this.state.user) ? 'LOGOUT':'LOGIN', 
              })
            };
        });
      })  
      }
      render() {
        if (!this.state.loaded) {
         return(
          <Text>Loding...</Text>
          )
        };
         return (
              <View style={{height:deviceHeight,width:deviceWidth,backgroundColor:'white'}}>
                <View style={styles.Navbar}>
                    <TouchableOpacity style={{height:50,width:50,justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.popRoute()} ><Icon style={{color:'white',fontSize:30,}}name={'md-arrow-back'}></Icon></TouchableOpacity>
                    <Text style={styles.menuTitle}>Settings</Text>
                </View>
                <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',width:deviceWidth}}>
                  <SocialShare/>
                </View>
                <OpenURLButton  url={'https://play.google.com/store/apps/details?id=com.sharesmile.share&hl=en'}/>        
                <TouchableOpacity onPress={()=>this._signOut()} style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',width:deviceWidth}}>
                   <Icon style={{color:'black',fontSize:20,margin:10}}name={'md-log-out'}></Icon>
                   <View><Text>{this.state.text}</Text></View>
                </TouchableOpacity>
              </View>
              );
          }
      }
 export default Setting;