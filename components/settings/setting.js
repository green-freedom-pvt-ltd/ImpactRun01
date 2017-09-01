
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
import Share, {ShareSheet, Button} from 'react-native-share';
import IconSec from 'react-native-vector-icons/Ionicons';
import commonStyles from '../styles';
import styleConfig from '../styleConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar from '../navBarComponent';
import Login from '../login/login.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;


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



    handleClick = () => {
      Linking.canOpenURL('https://itunes.apple.com/us/app/impactrun/id1143265464?mt=8').then(supported => {
        if (supported) {
          Linking.openURL('https://itunes.apple.com/us/app/impactrun/id1143265464?mt=8');
        } else {
          console.log('Don\'t know how to open URI: ' + 'https://itunes.apple.com/us/app/impactrun/id1143265464?mt=8');
        }
      });
    };
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
            component:Login,
            navigationBarHidden: true,
            showTabBar: false,
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





      onClickLi(rowData){
        let shareOptions = {
          title: "ImpactRun",
          message: "I use ImpactRun to track my daily runs and 'do good' for society with every step. Check it out. It's amazing!",
          url: "http://www.impactrun.com/#",
          subject: "Download ImpactRun Now " //  for email
        };
        if (rowData.name === 'share') {
         return Share.open(shareOptions);
        }else if(rowData.name === 'rate'){
         return this.handleClick();
        }else if(rowData.name === 'logout'){
          return this._signOut();
        }else if(rowData.name === 'help'){
          return this.navigateToHelp();
        }
      }

      navigateToHelp(){
        this.props.navigator.push({
          title:'Help',         
          component:HelpCenter,
          navigationBarHidden: false,
          showTabBar: false,
        })
      }
      
 
      ListIconfirst(rowData){
        if(rowData.name === 'logout'){
          return;
        }else{
          return(
            <Icon style={{color:'#595c5d',fontSize:20,}}name={rowData.iconName}></Icon>
          )
        }   
      }


      renderRow(rowData) {
        var alignItems = (rowData.name === 'logout')? 'center':'flex-start';
        console.log('rowData',rowData);
        var marginTop = (rowData.name === 'logout')?100:0;
        var borderBottomWidth = (rowData.name === 'logout' || rowData.name === 'help')?0:0.5;
        return (
          <TouchableOpacity  onPress={()=> this.onClickLi(rowData)}style={{height:50, width:deviceWidth,justifyContent: 'center',flexDirection:'row',backgroundColor:"white",marginTop:marginTop}}>
            <View style={{flex:-1,width:50,justifyContent: 'center',alignItems: 'center',}}>
               {this.ListIconfirst(rowData)}
            </View>
            <View style = {{flex:1,justifyContent: 'center',borderBottomWidth:borderBottomWidth,borderBottomColor:'#e2e5e6',alignItems:alignItems}}>
              <Text style={{color:'#595c5d'}}>{rowData.name}</Text>
            </View>
            <View style={{flex:-1,width:50 ,justifyContent: 'center',alignItems: 'center',borderBottomWidth:borderBottomWidth,borderBottomColor:'#e2e5e6',}}>
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