
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
import ModalDropDown from './modelindex.js'
import DistanceModalDropDown from './modelindex2.js'
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var DeviceInfo = require('react-native-device-info');
var my_distance = 'km';
var my_currency = 'USD $';



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
        // this.getUserData = this.getUserData.bind(this);
      }

    componentWillMount() {        
          AsyncStorage.getItem('my_currency', (err, result) => {
            this.setState({
              my_currency:JSON.parse(result),
          })
          var optionsdata = [  'USD $',
                   'EUR €',
                   'JPY ¥',
                   'GBP £',
                   'INR ₹']
          for (var i=0;i<optionsdata.length - 1; i++){
            
            if(optionsdata[i].substring(0,3) == this.state.my_currency){ 
              my_currency = optionsdata[i];
              console.log('mydefaultValue',my_currency);
            }
          }

          })     
          AsyncStorage.getItem('my_distance', (err, result) => {
            this.setState({
              my_distance:JSON.parse(result),
          })
            if(this.state.my_distance != '')
            {
              my_distance = this.state.my_distance;
            }
            // console.log('my_distance', this.state.my_distance);
          })     

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
            id:'login',
            
           })
        }
        // navigateToLogin(){
        //    this.props.navigator.push({
        //     component:Login,
        //     navigationBarHidden: true,
        //     showTabBar: false,
        //    })
        // }


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
        console.log('props',this.props,this.props.getUserData);
        var settingsLists = [
          {'name':'Share',
          'iconName':'share',
          'functionName':'',
         },
          {
          'name':'Rate',
          'iconName':'grade',
          'functionName':'',
         },
        {
          'name':'Distance',
          'iconName':'directions-run',
          'functionName':'',
         },
        {
          'name':'ExchangeRate',
          'iconName':'show-chart',
          'functionName':'',
         },

         {
          'name':'Logout',
          'iconName':'exit-to-app',
          'functionName':'',
         },
         {
          'name':'Version',
          'iconName':'',
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
            console.log('this.state.Usr ', this.state.user);
              this.setState({
                text:(this.state.user) ? 'LOGOUT':'LOGIN',
                IconText: (this.state.user) ? 'md-log-out':'md-log-in'
              })
            ;
            console.log('this.state.Usr ', this.state.text);
          })  
      }





      onClickLi(rowData){
        let shareOptions = {
          title: "ImpactRun",
          message: "I use Impact to track my daily walks and runs and 'do good' for society with every step. Check it out. It's amazing!",
          url: "http://www.impactrun.com/#",
          subject: "Download Impact Now " //  for email
        };
        if (rowData.name === 'Share') {
         return Share.open(shareOptions);
        }else if(rowData.name === 'Rate'){
         return this.handleClick();
        }else if(rowData.name === 'Logout'){
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
          if(rowData.iconName != ''){
          return(
            

            <Icon style={{color:'#595c5d',fontSize:20,}}name={rowData.iconName}></Icon>
          )
        }
      }


      navigateToHome() {
        // console.log('hual', this.state.my_currency);
        this.props.navigator.push({
            title: 'Gps',
            id: 'tab',
            passProps: {
              my_currency:this.state.my_currency,
              // my_distance:this.state.my_distance,
            },
            navigator: this.props.navigator,
        })
      }


        // getUserData() {
        //  console.log("tabscreenuser");
        //   AsyncStorage.getItem('USERDATA', (err, result) => {
        //     let user = JSON.parse(result);
        //     this.setState({
        //       user2: user,
        //       iconImpactleague:(user!= null)?{uri: base64Icon, scale: 6}:{},
        //     })
        //     this.render();
        //     console.log("result",user,this.state.iconImpactleague);
        //   })
    //     // }

    // navigateToProfile(){
    //   this.props.navigator.push({
    //   title: 'Gps',
    //   id:'profileindex',
    //   passProps:{profileTab:'profile', user:this.state.user2, getUserData:this.getUserData},
    //   navigator: this.props.navigator,
    //   })

    //  }


      onSelectExchangeRate(idx,value){
        this.setState({
          value:value,
        })
        // console.log('value', value.substring(0,3));
        this.setState({
          my_currency: value.substring(0,3),
        })
        AsyncStorage.removeItem('my_rate',(err) => {
        });
        AsyncStorage.removeItem('my_currency',(err) => {
        });

        AsyncStorage.setItem('my_currency',JSON.stringify(value.substring(0,3)));
        AsyncStorage.getItem('exchangeRates', (err, result) => {
          this.setState({
          exchange_rates:JSON.parse(result),  
          })
          for (var i = 0; i < this.state.exchange_rates.length; i++) { 
            if (this.state.exchange_rates[i].currency == value.substring(0,3)){
              this.setState({
                my_rate:this.state.exchange_rates[i].rate,
                // my_currency:this.state.exchange_rates[i].currency,
              })
            }
          }
          AsyncStorage.setItem('my_rate',JSON.stringify(this.state.my_rate));
          my_currency = value;
          this.navigateToHome();
        })

        


      }

      onSelectDistance(idx,value){
        this.setState({
          value:value,
        })
        // console.log('value', value.substring(0,3));

        AsyncStorage.removeItem('my_distance',(err) => {
        });

        AsyncStorage.setItem('my_distance',JSON.stringify(value));
        my_distance = value;
        this.navigateToHome();
      }

      getDevVersion(rowData){
        var mydefaultValue = 'USD $';
        var myindex;
          if(rowData.name == 'Version'){
          return(
            

            <Text>{DeviceInfo.getVersion()}</Text>
          )
        }
        else if (rowData.name == 'ExchangeRate'){
          var optionsdata = [  'USD $',
                               'EUR €',
                               'JPY ¥',
                               'GBP £',
                               'INR ₹']
          // for (var i=0;i<optionsdata.length - 1; i++){
            
          //   if(optionsdata[i].substring(0,3) == this.state.my_currency){ 
          //     mydefaultValue = optionsdata[i];
          //     // console.log('mydefaultValue',mydefaultValue);
          //   }
          // }
          return (
              <ModalDropDown textStyle={{flex:1,marginTop:9,justifyContent: 'flex-end',borderBottomColor:'#e2e5e6'}} defaultValue = {my_currency} options={optionsdata} onSelect={(idx, value) => this.onSelectExchangeRate(idx, value)} >
              </ModalDropDown>
              )
        }

        else if (rowData.name == 'Distance'){
          var optionsdata = [  'km',
                               'miles']
          return (
              <DistanceModalDropDown textStyle={{flex:1,marginTop:9,justifyContent: 'flex-end',borderBottomColor:'#e2e5e6'}} defaultValue = {my_distance} options={optionsdata} onSelect={(idx, value) => this.onSelectDistance(idx, value)} >
              </DistanceModalDropDown>
              )
        }
      }

      renderRow(rowData) {
        var alignItems = (rowData.name === 'Logout')? 'flex-start':'flex-start';
        // console.log('rowData',rowData);
        var marginTop = (rowData.name === 'Logout')?15:(rowData.name === 'Version')?deviceHeight-440:0;
        var borderBottomWidth = (rowData.name === 'Logout' || rowData.name === 'help')?0:0.5;
        return (
          <TouchableOpacity  onPress={()=> this.onClickLi(rowData)}style={{height:50, width:deviceWidth,justifyContent: 'center',flexDirection:'row',backgroundColor:"white",marginTop:marginTop}}>
            <View style={{flex:-1,width:50,justifyContent: 'center',alignItems: 'center',}}>
               {this.ListIconfirst(rowData)}
            </View>
            <View style = {{flex:1,justifyContent: 'center',borderBottomWidth:borderBottomWidth,borderBottomColor:'#e2e5e6',alignItems:alignItems}}>
              <Text style={{color:'#595c5d'}}>{(rowData.name == 'Logout' ? (this.state.user != null ? rowData.name : 'Login') : rowData.name)}</Text>
            </View>
            <View style={{flex:-1,width:50 ,justifyContent: 'center',alignItems: 'center',borderBottomWidth:borderBottomWidth,borderBottomColor:'#e2e5e6',}}>
             {this.getDevVersion(rowData)}
            </View>
          </TouchableOpacity>
        );
      }

      render() {
         return (
              <View style={{height:deviceHeight,width:deviceWidth}}>
                  <View style={commonStyles.Navbar}>
                    <Text style={commonStyles.menuTitle}>Settings</Text>
                  </View>
                <ListView
                style={{height:deviceHeight,width:deviceWidth,backgroundColor:'#e2e5e6'}}
                renderRow={this.renderRow}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.SettingTabs}
                scrollEnabled={false}/>
               </View>
              );
          }
      }
 export default Setting;