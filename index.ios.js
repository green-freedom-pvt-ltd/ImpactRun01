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
  AsyncStorage
 } from 'react-native';
import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/Ionicons';
import BackgroundGeolocation from 'react-native-background-geolocation';
import LodingScreen from './components/LodingScreen';
global.bgGeo = BackgroundGeolocation;
import Home from './ios/components/HomeScreen.ios';
import RunScreen from './ios/components/Home.ios';
import Login from './ios/components/login';
import Tab from './ios/components/tab';
import CauseDetail from './ios/components/CauseDetail';
import Setting from './ios/components/setting';
import Runlogingscreen from './ios/components/runlodingscreen';
import Rateus from './ios/components/Rating';
import ShareScreen from './ios/components/ShareScreen';
import ThankyouScreen from './ios/components/thankyouScreen';
class Application extends Component{
  mixins: [TimerMixin]
  constructor(props) {
    super(props);
    this.state = {
      drawer: undefined,
      timePassed: false,
      Loding:false,
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


  render() {
    console.log('setStateUser'+this.state.user);
    if(!this.state.textState)
    {
      return this.LodingFunction();
    }
    return (
      <View  style={{flex: 1}}>
        <Navigator
           ref={(ref) => this._navigator = ref}

            configureScene={(route) => {
              if(route.id === 'causedetail') {
            return Navigator.SceneConfigs.FloatFromBottom
           }
                if(route.id === 'setting') {
            return Navigator.SceneConfigs.FloatFromLeft
           }
             return Navigator.SceneConfigs.PushFromRight;
            }}
            initialRoute={{id:this.state.textState}}
            renderScene={this.renderScene} />
    
      </View>);

  }

    renderScene(route, navigator, user) {
      
       switch (route.id) {
            case 'home':
            return <Home navigator={navigator} {...route.passProps}/>;
            case 'tab':
            return <Tab navigator={navigator} {...route.passProps}/>;
            case 'causedetail':
            return <CauseDetail navigator={navigator} {...route.passProps}/>;
            case 'runscreen':
            return <RunScreen navigator={navigator} {...route.passProps} locationManager={BackgroundGeolocation}/>;
            case 'login':
            return <Login navigator={navigator} {...route.passProps}/>;
            case 'setting':
            return <Setting navigator={navigator} {...route.passProps}/>;
            case 'runlodingscreen':
            return <Runlogingscreen navigator={navigator} {...route.passProps}/>;
            case 'rateus':
            return <Rateus navigator={navigator} {...route.passProps}/>;
            case 'sharescreen':
            return <ShareScreen navigator={navigator} {...route.passProps}/>;
            case 'thankyouscreen':
            return <ThankyouScreen navigator={navigator} {...route.passProps}/>;            
            default :
             return <Login navigator={navigator}{...route.passProps} locationManager={BackgroundGeolocation}/>
        }

   }
}

AppRegistry.registerComponent('Impactrun', () => Application);