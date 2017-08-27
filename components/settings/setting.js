
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
    RefreshControl,
    ListView,
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
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            user:null,
            loaded: false,
            text:'LOGIN',
            IconText:'md-log-in',
            SettingTabs: ds.cloneWithRows([]),


        };
        this.renderRow = this.renderRow.bind(this);
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
        var settingsLists = [
          {'name':'share',
          'iconName':'share',
          'functionName':'',
         },
          {
          'name':'rate',
          'iconName':'grade',
          'functionName':'',
         },
          {
          'name':'feedback',
          'iconName':'feedback',
          'functionName':'',
         },
          {
          'name':'help',
          'iconName':'help',
          'functionName':'',
         },
         {
          'name':'logout',
          'iconName':'thumbs-up-down',
          'functionName':'',
         },
        ]


        this.setState({
           SettingTabs: this.state.SettingTabs.cloneWithRows(settingsLists),
        })
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

      renderRow(rowData) {
        console.log('rowData',rowData);
        var marginTop = (rowData.name === 'logout')?100:0;
        var borderBottomWidth = (rowData.name === 'logout' || rowData.name === 'help')?0:0.5;
        return (
          <TouchableOpacity style={{height:50, width:deviceWidth,justifyContent: 'center',flexDirection:'row',backgroundColor:"white",marginTop:marginTop}}>
            <View style={{flex:-1,width:50,justifyContent: 'center',alignItems: 'center',}}>
                <Icon style={{color:'#595c5d',fontSize:20,}}name={rowData.iconName}></Icon>
            </View>
            <View style = {{flex:1,justifyContent: 'center',borderBottomWidth:borderBottomWidth,borderBottomColor:'#e2e5e6',}}>
              <Text style={{color:'#595c5d'}}>{rowData.name}</Text>
            </View>
            <View style={{flex:-1,width:50 ,justifyContent: 'center',alignItems: 'center',borderBottomWidth:borderBottomWidth,borderBottomColor:'#e2e5e6',}}>
                <IconSec style={{color:'#c1c6c7',fontSize:20,}}name={'ios-arrow-forward'}></IconSec>
            </View>
          </TouchableOpacity>
        );
      }

      render() {
         return (
              <View style={{height:deviceHeight,width:deviceWidth}}>
                <ListView
                style={{height:deviceHeight,width:deviceWidth,backgroundColor:'#e2e5e6',paddingTop:50}}
                renderRow={this.renderRow}
                dataSource={this.state.SettingTabs}/>
               </View>
              );
          }
      }
 export default Setting;