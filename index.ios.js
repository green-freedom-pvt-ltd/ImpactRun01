'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableHighlight,
  StatusBar,
  Text,
  Navigator
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


var Application = React.createClass({
  getInitialState: function() {
    return {
      drawer: undefined
    };
  },
  componentDidMount: function() {
    var me = this;
    StatusBar.setBarStyle('default');
    this.setState({
      drawer: this.refs.drawer
    });
  },
  onClickMenu: function() {
    this.refs.drawer.open();
  },
  getDrawer: function() {
    return this.refs.drawer;
  },
  render: function() {
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
                    initialRoute={{id: 'login'}}
                    renderScene={this.renderScene} />
             </View>
    );
  },


    renderScene:function (route, navigator) {
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
            default :
                return <Tab navigator={navigator}{...route.passProps} locationManager={BackgroundGeolocation}/>;
        }
  }


});

AppRegistry.registerComponent('Impactrun', () => Application);