'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableHighlight,
  StatusBar,
  PushNotificationIOS,
  Text,
  NavigatorIOS,
  AsyncStorage,
  NetInfo,
  AlertIOS,
 } from 'react-native';
 import {Navigator} from 'react-native-deprecated-custom-components';
import styleConfig from './components/styleConfig'
import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/Ionicons';
import LodingScreen from './components/LodingScreen';

import RunScreen from './components/gpstracking/home.ios';
import Login from './components/login/login';
import Tabs from './components/homescreen/tab.js';

import apis from './components/apis'
var REQUEST_URL = 'http://dev.impactrun.com/api/causes/';

class Application extends Component{

      mixins: [TimerMixin]
      constructor(props) {
        super(props);
        this.state = {
          drawer: undefined,
          timePassed: false,
          Loding:false,
          textState:null,
          result:null,
          myCauseNum:null,
        };
      }


      componentDidMount() {
      }


      componentWillMount(){

        AsyncStorage.getItem('CAUSESDATA', (err, result) => {
          this.setState({
              myCauseNum: JSON.parse(result),
          })
        });

        AsyncStorage.getItem('runDataAppKill', (err, result) => {
          console.log("result",result);
          this.setState({
            result:result
          })
        });       
        AsyncStorage.getItem('USERDATA', (err, result) => {
          if (result != null) { 
            var user = JSON.parse(result);
            this.setState({
              user:user,
              loding:true,
            })
          }else{
            this.setState({
              user:null,
              loding:true,
            })
          }
          if (this.state.result != null) {
            console.log("this.state.result",this.state.result);
            this.setState({
              textState:'runscreen',
            })
          }else{
            this.setState({
             textState:(this.state.user) ? Tabs:Login,
            })
          }
        })

          
      }

      // fetchDataonInternet(){
      //   NetInfo.isConnected.fetch().done(
      //       (isConnected) => {
      //           if (isConnected) {
      //               this.fetchData();
      //           }
      //       }
      //   );
      // }



      fetchData(dataValue) {
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((causes) => {
              var causes = causes;
              let causesData = []
              let newData = []
              causes.results.forEach((item, i) => {
                  if (item.is_active) {
                      causesData.push(['cause' + i, JSON.stringify(item)])
                      newData.push('cause' + i);
                  };
              })
              this.setState({
                  myCauseNum: newData,
              })
              let myCauseNum = this.state.myCauseNum;
              AsyncStorage.setItem('myCauseNumindex',JSON.stringify(myCauseNum));
              AsyncStorage.multiSet(causesData, (err) => {
              })
            })
           .catch((err)=>{
             console.log("errorcauseapi ",err)
            })
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
    //   _configureScene(route){
    //    switch (route.id){
    //        case 'tab':
    //        return NoBackSwipe
    //        break;
    //        case 'sharescreen':
    //        return NoBackSwipe
    //        break;
    //        case 'causedetail':
    //        return Navigator.SceneConfigs.FloatFromBottom
    //        break;
    //        case 'messagedetail':
    //        return Navigator.SceneConfigs.FloatFromBottom
    //        break;
    //        case 'setting':
    //        return Navigator.SceneConfigs.FloatFromLeft
    //        break;
    //        case 'thankyouscreen':
    //        return Navigator.SceneConfigs.FloatFromRight
    //        break;
    //        case 'impactleaguehome':
    //        return Navigator.SceneConfigs.FloatFromRight
    //        break;
    //        case 'impactleagueform2':
    //        return Navigator.SceneConfigs.FloatFromRight
    //        break;
    //        case 'runlodingscreen':
    //        return Navigator.SceneConfigs.FloatFromBottom
    //        break;
    //        case 'runhistory':
    //        return Navigator.SceneConfigs.FloatFromRight
    //        break;
    //        case 'MessageCenter':
    //        return Navigator.SceneConfigs.FloatFromRight
    //        break;
    //        case 'profileform':

    //    }
    // };

      render() {
        if(this.state.textState != null)
        {
        var mycausecount = this.state.mycauseDataCount;
        return (
          <View  style={{flex: 1}} >
           {this.renderScene()}
           </View>);
        }
        return this.LodingFunction();
        }

        runScreenRender(){
          if (this.state.result != null) {
            return(
                <RunScreen data={JSON.parse(this.state.result).data}  />
              )
          }else{
            return(
                <RunScreen/>
              )
          }
        }


        renderScene() {
         if (this.state.result != null ) {
           return ( <NavigatorIOS
                    translucent={false}
                    navigationBarHidden={true}
                    style={{flex:1}}
                    tintColor='#FFF'
                    titleTextColor='#FFF'
                    shadowHidden={true}
                    barTintColor={styleConfig.bright_blue}
                    initialRoute={{
                        showTabBar: false,
                        component:RunScreen,
                        passProps:{data:JSON.parse(this.state.result).data}
                    }}/>)
         }else if (this.state.user != null){
            return ( <NavigatorIOS
                    translucent={false}
                    navigationBarHidden={true}
                    style={{flex:1}}
                    tintColor='#FFF'
                    titleTextColor='#FFF'
                    shadowHidden={true}
                    barTintColor={styleConfig.bright_blue}
                    initialRoute={{
                        showTabBar: false,
                        component:Tabs,
                        passProps:{dataCauseNum:this.state.myCauseNum}
                    }}/>)
         }else {
            
            return ( <NavigatorIOS
                    translucent={false}
                    navigationBarHidden={true}
                    style={{flex:1}}
                    tintColor='#FFF'
                    titleTextColor='#FFF'
                    shadowHidden={true}
                    barTintColor={styleConfig.bright_blue}
                    initialRoute={{
                        showTabBar: false,
                        component:Login,
                    }}/>)
         }
        }
}

AppRegistry.registerComponent('Impactrun', () => Application);

// import registerApp from './app/tabScreen.js';
// registerApp();
