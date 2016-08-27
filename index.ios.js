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
 
import Icon from 'react-native-vector-icons/Ionicons';
import BackgroundGeolocation from 'react-native-background-geolocation';

global.bgGeo = BackgroundGeolocation;
import Home from './ios/components/HomeScreen.ios';
import RunScreen from './ios/components/Home.ios';
import Login from './ios/components/login';
import Tab from './ios/components/tab';
import CauseDetail from './ios/components/CauseDetail';
import Setting from './ios/components/setting';
import Runlogingscreen from './ios/components/runlodingscreen';



class Application extends Component{
  constructor(props) {
    super(props);
    this.state = {
      drawer: undefined,
      timePassed: false,
    };
  }
  componentWillMount() {
    AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
    stores.map((result, i, store) => {
        let key = store[i][0];
        let val = store[i][1];
        this.setState({
           user:val,
          })
         console.log("UserDatakeyinital:" + key, val);
         console.log("UserDatakeyinital4:" + this.state.user);
         
      });
    console.log('myDataLOgin'+ this.state.user);
    this.setState({
      userLogin:this.state.user,
    })
    });
     
  }

  onClickMenu() {
    this.refs.drawer.open();
  }
  getDrawer() {
    return this.refs.drawer;
  }
  render() {
   console.log("UserDatakeyinitalLogin" + this.state.userLogin);
   return (

      <View style={{flex: 1}}>
        <Navigator
           ref={(ref) => this._navigator = ref}
            configureScene={(route) => {
            return {
                ...Navigator.SceneConfigs.FloatFromRight,
                gestures: {}
            };
            }}
            initialRoute={{id:"text"}}
            renderScene={this.renderScene} />
      </View>);
   
   
    
  }

    renderScene(route, navigator) {
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
            default :
                return <Login navigator={navigator}{...route.passProps} locationManager={BackgroundGeolocation}/>;
        }
  }
}

AppRegistry.registerComponent('Impactrun', () => Application);