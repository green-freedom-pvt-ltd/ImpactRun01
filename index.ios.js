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
  AsyncStorage,
  NetInfo,
  AlertIOS,
 } from 'react-native';
 import {Navigator} from 'react-native-deprecated-custom-components';

 // import BackgroundTimer from 'react-native-background-timer';
 // import crashlytics from 'react-native-fabric-crashlytics';
import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/Ionicons';
// import BackgroundGeolocation from 'react-native-background-geolocation';
import LodingScreen from './components/LodingScreen';
// global.bgGeo = BackgroundGeolocation;
import RunScreen from './components/gpstracking/home.ios';
import Login from './components/login/login';
import Tabs from './components/homescreen/tab.js';
import CauseDetail from './components/homescreen/CauseDetail';
import Setting from './components/settings/setting';
import Runlogingscreen from './components/gpstracking/runlodingscreen';
import ShareScreen from './components/sharescreen/shareScreen';
import ImpactLeagueForm2 from './components/ImpactLeague/ImpactLeagueForm2';
import ImpactLeagueCode from './components/ImpactLeague/ImpactLeagueCode';
import ImpactLeagueHome from './components/ImpactLeague/ImpactLeagueHome';
import ImpactLeagueLeaderBoard from './components/ImpactLeague/ImpactLeagueLeaderboard';
import Faq from './components/faq/faq';
import MessageCenter from './components/feed/messageCenter';
import MessageCenterData from './components/feed/messageCenterData';
import MessageDetail from './components/feed/messageDetail';
import DownloadShareMeal from './components/downloadsharemeal/downloadShareMeal';
import Leaderboard  from'./components/leaderboard/leaderBoard';
import RunHistory from './components/profile/runhistory/runHistory';
import ProfileForm from './components/profile/profileForm';
import ProfileHeader from './components/profile/profileHeader';
import Profile from './components/profile/profile';
// import BackgroundFetch from "react-native-background-fetch";
import apis from './components/apis'
var REQUEST_URL = 'http://dev.impactrun.com/api/causes/';
const NoBackSwipe ={
  ...Navigator.SceneConfigs.FloatFromRight,
    gestures: {
      pop: {}
    }
};
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
             textState:(this.state.user) ? 'tab':'login',
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
           case 'thankyouscreen':
           return Navigator.SceneConfigs.FloatFromRight
           break;
           case 'impactleaguehome':
           return Navigator.SceneConfigs.FloatFromRight
           break;
           case 'impactleagueform2':
           return Navigator.SceneConfigs.FloatFromRight
           break;
           case 'runlodingscreen':
           return Navigator.SceneConfigs.FloatFromBottom
           break;
           case 'runhistory':
           return Navigator.SceneConfigs.FloatFromRight
           break;
           case 'profileform':

       }
    };

      render() {
        if(this.state.textState != null)
        {
        var mycausecount = this.state.mycauseDataCount;
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
        }
        return this.LodingFunction();
        }

        runScreenRender(route,navigator){
          if (this.state.result != null) {
            return(
                <RunScreen data={JSON.parse(this.state.result).data} navigator={navigator} {...route.passProps} />
              )
          }else{
            return(
                <RunScreen  navigator={navigator} {...route.passProps} />
              )
          }
        }


        renderScene(route, navigator, user,causeLength) {
           switch (route.id) {
                case 'tab':
                return <Tabs dataCauseNum={this.state.myCauseNum} navigator={navigator} {...route.passProps}/>;
                case 'causedetail':
                return <CauseDetail navigator={navigator} {...route.passProps}/>;
                case 'runscreen':
                return this.runScreenRender(route,navigator);
                case 'login':
                return <Login navigator={navigator} {...route.passProps}/>;
                case 'runlodingscreen':
                return <Runlogingscreen navigator={navigator} {...route.passProps}/>;
                case 'sharescreen':
                return <ShareScreen navigator={navigator} {...route.passProps}/>;
                case 'leaderboard':
                return <Leaderboard navigator={navigator} {...route.passProps}/>;

                default :
                return <Login navigator={navigator}{...route.passProps} />
            }

       }
}

AppRegistry.registerComponent('Impactrun', () => Application);