'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableHighlight,
  StatusBar,
  Text,
  Navigator,
  AsyncStorage,
  NetInfo
 } from 'react-native';
var REQUEST_URL = 'http://Dev.impactrun.com/api/causes';
import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/Ionicons';
import BackgroundGeolocation from 'react-native-background-geolocation';
import LodingScreen from './components/lodingScreen';
global.bgGeo = BackgroundGeolocation;
import Home from './ios/components/homeScreen.ios';
import RunScreen from './ios/components/home.ios';
import Login from './ios/components/login';
import Tab from './ios/components/tab';
import CauseDetail from './ios/components/causeDetail';
import Setting from './ios/components/setting';
import Runlogingscreen from './ios/components/runlodingscreen';
import ShareScreen from './ios/components/shareScreen';
import ThankyouScreen from './ios/components/thankyouScreen';
import Faq from './ios/components/faq';
import MessageCenter from './ios/components/messageCenterData';
import MessageDetail from './ios/components/messageDetail';
const NoBackSwipe ={
  ...Navigator.SceneConfigs.FloatFromRight,
    gestures: {
      pop: {},
    },
};
class Application extends Component{
  mixins: [TimerMixin]
  constructor(props) {
    super(props);
    this.state = {
      mycauseDataCount:null,
      drawer: undefined,
      timePassed: false,
      Loding:false,
      textState:null,
    };
  }
  componentWillMount() {
    AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
    stores.map((result, i, store) => {
        let key = store[i][0];
        let val = store[i][1];
        this.setState({
           user:val,
           loding:true,
          })
         })
        this.setState({
          userLogin:this.state.user,
          textState:(this.state.user) ? 'tab':'login', 
        })
        this.render();
      });
    var causeno = ["cause0","cause2","cause3","cause4",]
    AsyncStorage.multiGet(causeno, (err, stores) => {
      var _this = this
      stores.map((item) => {
          let key = item[0];
          let val = JSON.parse(item[1]);
          this.setState({
           mycauseDataCount:val,
         })
          NetInfo.isConnected.fetch().done(
        (isConnected) => {  
        console.log('isConnected3'+ this.state.isConnected);
        if (isConnected) {
         if (!this.state.mycauseDataCount) {
          this.fetchData();
          console.log('fetchedData');
          };
          console.log('isConnected'+this.state.isConnected)
         }
        }
        ); 
      })
    })
    
    
      
    }
    
      fetchData(dataValue){
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((causes) => { 
          console.log('mycauseLength',causes.count);
          var causes = causes;
          let causesData = []
          causes.results.forEach ((item,i)=> {
            causesData.push(['cause'+i, JSON.stringify(item)])
          })
          AsyncStorage.multiSet(causesData, (err) => {
            console.log('myCauseErr'+err)
            console.log('myDatatCOunt'+ causesData.length);
            this.setState({
              mycauseDataCount:causesData.length,
            })
          })
        })
        .done();
      }



    onClickMenu() {
      this.refs.drawer.open();
    }
    getDrawer() {
      return this.refs.drawer;
      }
    
    LodingFunction(){
     return(
      <LodingScreen/>
     )
    }
  _configureScene(route){
   switch (route.id){
      case 'tab':
       return NoBackSwipe
       break;
       case 'sharescreen':
       return NoBackSwipe
       break;
       case 'causedetail':
       return Navigator.SceneConfigs.FloatFromBottom
       break;
       case 'messagedetail':
       return Navigator.SceneConfigs.FloatFromBottom
       break;
       case 'setting':
       return Navigator.SceneConfigs.FloatFromLeft
       break;
   }
};

  render() {
    if(this.state.textState != null)
    {
    if (this.state.mycauseDataCount != null) {
    var mycausecount = this.state.mycauseDataCount;
    console.log('mysomedatacount',mycausecount);
    return (
      <View  style={{flex: 1}} >
        <Navigator  
            ref={(ref) => this._navigator = ref}
            configureScene={ this._configureScene }
            initialRoute={{id:this.state.textState}}
            renderScene={this.renderScene.bind(this)}
            passProps={this.state.mycauseDataCount}
            /> 
       </View>);
      }else{
        return this.LodingFunction();
      }
      
    }
    return this.LodingFunction();
    }

    renderScene(route, navigator, user,causeLength) {  
      console.log('mycauseLengthData',user);
       switch (route.id) {
            case 'home':
            return <Home navigator={navigator} {...route.passProps}/>;
            case 'messagecenter':
            return <MessageCenter navigator={navigator} {...route.passProps}/>;
            case 'tab':
            return <Tab  navigator={navigator} {...route.passProps} />;
            case 'causedetail':
            return <CauseDetail navigator={navigator} {...route.passProps}/>;
            case 'messagedetail':
            return <MessageDetail navigator={navigator} {...route.passProps}/>;
            case 'runscreen':
            return <RunScreen navigator={navigator} {...route.passProps} locationManager={BackgroundGeolocation}/>;
            case 'login':
            return <Login navigator={navigator} {...route.passProps}/>;
            case 'setting':
            return <Setting navigator={navigator} {...route.passProps}/>;
            case 'runlodingscreen':
            return <Runlogingscreen navigator={navigator} {...route.passProps}/>;
            case 'sharescreen':
            return <ShareScreen navigator={navigator} {...route.passProps}/>;
            case 'thankyouscreen':
            return <ThankyouScreen navigator={navigator} {...route.passProps}/>;            
            case 'faq':
            return <Faq navigator={navigator} {...route.passProps}/>;            
            default :
             return <Login navigator={navigator}{...route.passProps} locationManager={BackgroundGeolocation}/>
        }

   }
}

AppRegistry.registerComponent('Impactrun', () => Application);