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
import Tab from './components/homescreen/tab';

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
import ProfileIndex from './components/profile/profile.index.js';
import Helpcenter from './components/Helpcenter/helpcenter';
import QuestionLists from './components/Helpcenter/listviewQuestions';
import FeedBack from './components/Helpcenter/endFeedBackPage.js';

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
          // console.log("this.state.resultwed",this.state.result);
          // console.log("this.state.user",this.state.user);
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
           case 'MessageCenter':
           return Navigator.SceneConfigs.FloatFromRight
           break;
           case 'profileform':
           return Navigator.SceneConfigs.FloatFromRight
           break;
           case 'impactleagueleaderboard':
           return Navigator.SceneConfigs.FloatFromRight
           break;
           default:
           return Navigator.SceneConfigs.FloatFromRight

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

      // render() {
      //   if(this.state.textState != null)
      //   {
      //   var mycausecount = this.state.mycauseDataCount;
      //   return (
      //     <View  style={{flex: 1}} >
      //      {this.renderScene()}
      //      </View>);
      //   }
      //   return this.LodingFunction();
      //   }

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

       // renderScene(route, navigator, user,causeLength) {
       //     switch (route.id) {
       //          case 'tab':
       //          return <Tabs dataCauseNum={this.state.myCauseNum} navigator={navigator} {...route.passProps}/>;
       //          case 'causedetail':
       //          return <CauseDetail navigator={navigator} {...route.passProps}/>;
       //          case 'runscreen':
       //          return this.runScreenRender(route,navigator);
       //          case 'login':
       //          return <Login navigator={navigator} {...route.passProps}/>;
       //          case 'runlodingscreen':
       //          return <Runlogingscreen navigator={navigator} {...route.passProps}/>;
       //          case 'sharescreen':
       //          return <ShareScreen navigator={navigator} {...route.passProps}/>;
       //          case 'leaderboard':
       //          return <Leaderboard navigator={navigator} {...route.passProps}/>;

       //          default :
       //          return <Login navigator={navigator}{...route.passProps} />
       //      }

       // }

        renderScene(route, navigator, user,causeLength) {
          // console.log("routeid", route.id)
           switch (route.id) {
                case 'home':
                return <Home navigator={navigator} {...route.passProps}/>;
                case 'messagecenter':
                return <MessageCenter navigator={navigator} {...route.passProps}/>;
                case 'messagecenterdata':
                return <MessageCenterData navigator={navigator} {...route.passProps}/>;
                case 'tab':
                return <Tab dataCauseNum={this.state.myCauseNum} navigator={navigator} {...route.passProps}/>;
                case 'causedetail':
                return <CauseDetail navigator={navigator} {...route.passProps}/>;
                case 'messagedetail':
                return <MessageDetail navigator={navigator} {...route.passProps}/>;
                case 'runscreen':
                return this.runScreenRender(route,navigator);
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
                case 'helpcenter':
                return <Helpcenter navigator={navigator} {...route.passProps}/>;
                case 'leaderboard':
                return <Leaderboard navigator={navigator} {...route.passProps}/>;
                case 'impactleagueform2':
                return <ImpactLeagueForm2 navigator={navigator} {...route.passProps}/>;
                case 'impactleaguecode':
                return <ImpactLeagueCode navigator={navigator} {...route.passProps}/>;
                case 'impactleaguehome':
                return <ImpactLeagueHome navigator={navigator} {...route.passProps}/>;
                case 'impactleagueleaderboard':
                return <ImpactLeagueLeaderBoard navigator={navigator} {...route.passProps}/>;
                case 'runhistory':
                return <RunHistory navigator={navigator} {...route.passProps}/>;
                case 'profileform':
                return <ProfileForm navigator={navigator} {...route.passProps}/>;
                case 'profileheader':
                return <ProfileHeader navigator={navigator} {...route.passProps}/>;
                case 'profile':
                return <Profile navigator={navigator} {...route.passProps}/>;
                case 'profileindex':
                return <ProfileIndex navigator={navigator} {...route.passProps}/>;
                case 'listquestions':
                return <QuestionLists navigator={navigator} {...route.passProps}/>;
                case 'feedback':
                return <FeedBack navigator={navigator} {...route.passProps}/>;

                default :
                 return <Login navigator={navigator}{...route.passProps} />
            }

       }
        // renderScene() {
        //  if (this.state.result != null ) {
        //    return ( <NavigatorIOS
        //             ref="Help"
        //             translucent={false}
        //             navigationBarHidden={true}
        //             style={{flex:1}}
        //             tintColor='#FFF'
        //             titleTextColor='#FFF'
        //             shadowHidden={true}
        //             barTintColor={styleConfig.bright_blue}
        //             initialRoute={{
        //                 showTabBar: false,
        //                 component:RunScreen,
        //                 title:'RunScreen',
        //                 passProps:{data:JSON.parse(this.state.result).data}
        //             }}/>)
        //  }else if (this.state.user != null){
        //     return ( <NavigatorIOS
        //             translucent={false}
        //             navigationBarHidden={true}
        //             style={{flex:1}}
        //             tintColor='#FFF'
        //             titleTextColor='#FFF'
        //             shadowHidden={true}
        //             barTintColor={styleConfig.bright_blue}
        //             initialRoute={{
        //                 showTabBar: false,
        //                 component:Tabs,
        //                 title:'Impactrun',
        //                 passProps:{dataCauseNum:this.state.myCauseNum}
        //             }}/>)
        //  }else {
        //   console.log("Ahaha")
            
        //     return ( <NavigatorIOS
        //             translucent={false}
        //             navigationBarHidden={true}
        //             style={{flex:1}}
        //             tintColor='#FFF'
        //             titleTextColor='#FFF'
        //             shadowHidden={true}
        //             barTintColor={styleConfig.bright_blue}
        //             initialRoute={{
        //                 showTabBar: true,
        //                 component:Login,
        //                 title: 'Login',
        //             }}/>)
        //  }
        // }
}

AppRegistry.registerComponent('Impactrun', () => Application);

// import registerApp from './app/tabScreen.js';
// registerApp();
