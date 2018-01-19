'use strict';

import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
    TabBarIOS,
    NetInfo,
    AlertIOS,
    AsyncStorage,
    NavigatorIOS,
} from 'react-native';
import DownloadShareMeal from '../downloadsharemeal/downloadShareMeal';
import Welcome from '../homescreen/HomeScreen';
import apis from '../../components/apis';
import styleConfig from '../../components/styleConfig';
import ProfileForm from '../profile/profileForm.js';
import EventEmitter from 'EventEmitter';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var REQUEST_URL = apis.causeListapi;
var base64Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABICAYAAACqT5alAAAABGdBTUEAALGPC/xhBQAABOFJREFUeAHtmlmIFEcYx2dUxDt4YTSieCAqHkgkJARU9EFFgygeICIi+qCgQRHFh4CQhzwsgSiJeGD0yQNR8SDg8WBWvFZNRFkkEW/BCKsuisQcuvl9Zqbt6emq6aquaWd2+4P/dPVX31lfV3X1dGcyhtTU1HQdVAotNgw/08pUodrl04SrvYKl4k8rXGqEqr0/y3K7hSQ+NEhkIrKdDeTLKforxu8bONguCd9CYaCBUjWLrkzncDWXL0rs76PCLwhsCtgcJUDXMu8j4Z3ZbPY4iawHL10nVMpeG43AVvoehPSvgNcrhB+VJXYzJP2cBXMPzSVRFUPkDsCTlTpIC2AMDTLfnssqDcLoszAFBOM8PNT6bWJrbJhjA95Cv718G/3DChsrkr6k5Z7vEVW+zMkvHiOBhlzSTQo/WQU/CvsZQrvBY/AEPM0df+YYpNkwhoFuoHsOYzlOBbakKuQbSbgBDAqx3DOEF5W1ieptiCKM3B3kBB5xOUrAjcB2R9fDM1bYaBDDjwp53lnoHPZ69Y2FBD1AL6LtXU2vVbL47YDuaIX1R5LwNUXnEpRtV2NJ9iL6RoOGfGvwPbo1ipiisFch1D5E8DW8+gwOPgYqOhRURNBklf4T+XlBG2HnyHUGPwETKlilURwB/lIYqPX8IvCbQkjYx4D3NEXbJGHRfwPGec4UDWTEjyl5CaM4FzRoDCwT1/mNx1e09ylimQa/HkOy6l4CXRRyKras9vdUnT7+Q187avMT4uqK8BdgkkZJFsUdXj9K8phYC8pBUZKVqTW/HM5zNmflk5VFS7Z5ci+eA2xGWUzo6N3cyUkRxFDQLqBUJBfotz2tIb+DocoEMQo8BC5pad4ZRjuCb8G/4CaYmO+TI+e3gUv6EWNvi+r3U9BGoDc459DrzFwy07F5L8TuTniyw5KE5Vbmgv7GyJqCxHQnCMucXgDugrgkK+eFEkZE5kwJmSjdckfYDwar8pMVVEkoSv+nYAYYDvqAIcBqF4Sea5LVVx5hZe2RNeAw8/UPju6IQVgHKoH+IYiOppnpJ3S4tbPh7MS5V6mm8T8mNgnLM6yxozIMx2kbm8YJM6qvcLTXxpljnV029owTzjnZZuPMoc45Br7exp5Vwjirw9kJG4eOdL52ZCe6GVbIYUBu8EnTkehRFktaVVjMUOUbHL4pNllWjvxX9mVZPeiMU9pW4GhCJX6Nn8m6eBLpI4gPQF2Zk5Yt4/JEEorihGA6gVNlSlp2VPImobKIoNqCGiCXniu6g6HxlZVpIBoC/BxcBXFI/oj7AVTKQ0ogy8ApgcrjpTz/ngYmFX+C/EbQN2Cyek4JvidYBF4BFcn8HwdaV09mJSIlmUZVtvA3lFB31m298XAWQcKG0oQTHvDE3aUVTnzIE3aYVjjhAU/cXYurcBvXQ8wmQl6nyvvg4GvVthpfI9Gb7+uXl3u/8yfDFR+v8poE3Re4fBn3XeVl6YuIZOXx0DV95HMRu+l6DvePHVGxgX7FLHuO64TtI0lIs8UlrH1dWmrQmawTkFnrkxtD2/vix8eP0zyPsnyVJ9TIyu1fzf/nGvzGvS31xlecbyKjhOr/uO1xFAWdTIu7pNOEdZdDc+hLK9wcqqjLIa2wbnSaQ19a4eZQRV0OcXda8tXbSZ0Dx33yBUBK6QhoRuA/Om5HY4SRRjAAAAAASUVORK5CYII=";
var settingicon = 'data:image/png;base64,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'
var Profileicon = 'data:image/png;base64,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';
var RunIcon = 'data:image/png;base64,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';
var GroupImage = 'data:image/png;base64,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';
var FaqImage = 'data:image/png;base64,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';
import Homescreen from '../homescreen/HomeScreen';
import Profile from '../profile/profile.index.js';
import Leaderboard from '../leaderboard/leaderBoard';
import Faq from '../faq/faq';
import Helpcenter from '../Helpcenter/helpcenter';
import Setting from '../settings/setting';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Lodingscreen from '../LodingScreen';
import MessageCenter from '../feed/messageCenter';
import ImpactLeague from '../ImpactLeague/ImpactLeagueHome';
import HelpCenter from '../Helpcenter/helpcenter';
import getLocalData from '../getLocalData.js';
import fetchDatafromApi from '../getDataFromApi.js';
import setLocalData from '../setLocalData.js';
import postUnsyncRun from '../postUnsyncRun.js';
import fetchRundata from '../fetchRundata.js';
import fetchCauseData from '../fetchCauseData.js';
var pastRunSyncTime = [];
const CleverTap = require('clevertap-react-native');
AsyncStorage.getItem('pastRunSyncTime', (err, result) => {
    if (result != null) {
        pastRunSyncTime.push(JSON.parse(result));
    }else{
        var newDate = new Date();
        var convertepoch = newDate.getTime()/1000
        var epochtime = parseFloat(convertepoch).toFixed(0);
        pastRunSyncTime.push(parseInt(epochtime)+1); 
    }
})

var rightButtonHandler = new EventEmitter();
class Tabs extends Component {

        constructor(props) {
            super(props);       
            this.state = {
                selectedTab: 'welcome',
                loaded: false,
                myCusesDataExist: null,
                user: {},
                open: false,
                overall_impact:'',
                isFetchingRuns:false,
                NetworkResponcePostRun:null,
                isLodaingCause:false,
                latestaRunVersion:0,
                dataCauseNum:null,
            };
            this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
            this.getUserData = this.getUserData.bind(this);
        }
        
        componentDidMount() {
            this.getUserData();
            if (this.props.dataCauseNum) {
                this.setState({
                    dataCauseNum:this.props.dataCauseNum,
                    isLodaingCause:true,
                })
            }; 

        }

        getUserData() {
            getLocalData.getData('USERDATA')
            .then((user)=>{
                this.setState({
                    user: JSON.parse(user),
                    iconImpactleague:(user!= null)?{uri: base64Icon, scale: 6}:{},
                })
                if (this.state.dataCauseNum === null) {
                   this.getCause();
                   this.fetchCauseDataonInternet();
                };
                var newDate = new Date();
                var convertepoch = newDate.getTime()/1000
                var epochtime = parseFloat(convertepoch).toFixed(0);
                var pastTimestamp = JSON.parse(pastRunSyncTime);
                if (this.state.user != null) {         
                    if (parseInt(epochtime) > pastTimestamp) {
                        this.syncCallRunhistory();
                    }
                }

            })
            .catch((err)=>{
                console.log('err', err);
            })
        }


        syncCallRunhistory(){
            NetInfo.isConnected.fetch().then((isConnected) => {
                if (isConnected) {
                    this.postRunData();                     
                }
            })
        }


        postRunData(){
            postUnsyncRun.fetchLocalRunData(this.state.user).
            then((runData)=>{
            })    
        }


        componentWillMount() { 
           
            NetInfo.isConnected.addEventListener(
              'change',
              this.handleFirstConnectivityChange
            );    
            if (this.props.profileTab != null || undefined) {
                this.setState({
                    selectedTab:this.props.profileTab,
                })
            }else{
                return;
            }
        }

        

        fetchCauseDataonInternet(){
            NetInfo.isConnected.fetch().then((isConnected) => {
                this.setState({
                    isConnected:isConnected
                })
                if (isConnected) {
                    this.getCauseDataEvery300Sec();
                }else{
                   this.getCause();
                }
            });
        } 


        fetchData(dataValue) {  
            // Adding token for viewing causes via employee module pn 
            if (this.state.user) {
                var token = this.state.user.auth_token;
                var auth_token = "Bearer " + token;
                fetchCauseData.getCauseFromApi(auth_token)
                .then((causeNumber)=>{
                    this.setState({
                        dataCauseNum:causeNumber,
                        isLodaingCause:true,
                    })
                })
            }else{
                var auth_token = '';
                fetchCauseData.getCauseFromApi(auth_token)
                .then((cause)=>{
                    this.setState({
                        dataCauseNum:cause,
                        isLodaingCause:true,
                    })
                })
            }            
        }


        

        

        getCauseDataEvery300Sec(){
            getLocalData.getData('causeFeatchVersion')
            .then((result)=>{
                var newDate = new Date();
                var convertepoch = newDate.getTime()/1000
                var epochtime = parseFloat(convertepoch).toFixed(0);
                if (result != null) {
                    this.setState({
                      causeFeatchVersion:JSON.parse(result),
                    })        
                    var fetchversion = parseInt(this.state.causeFeatchVersion)+(30);
                    if (fetchversion < epochtime) {
                            this.fetchData();
                    }
                }
                else{
                    this.fetchData();
                       
                }
            })
        }



        getCause(){
            getLocalData.getData('CauseNumber')
            .then((result)=>{  
                if (result != null ) {
                    this.setState({
                       dataCauseNum:JSON.parse(result),
                       isLodaingCause:true,
                    })
                }else{
                    this.fetchCauseDataonInternet();
                }
            })           
        }


        componentWillUnmount() {
            NetInfo.removeEventListener(
                'change',
                this._handleConnectivityChange
            );
        }    
        

        handleNetworkErrors(response){
            this.setState({
              NetworkResponcePostRun:response.status,
              isRunResponseOk:response.ok,
            })
            if (response.ok == true) {
                let newDate = new Date();
                let convertepoch = newDate.getTime()/1000
                let epochtime = parseFloat(convertepoch).toFixed(0);
                this.setState({
                  latestaRunVersion:epochtime,
                })
            };
            return response.json();
        }  

     
        handleFirstConnectivityChange(isConnected) {
            this.setState({
                isConnected:isConnected,
            })
            if (isConnected) {
                this.getCauseDataEvery300Sec();
                // this.fetchLeaderBoard();       
            }else{
                 this.getCause();
            }      
        }
   
        
        loadingScreen(){
            return(
                <Lodingscreen/>
            )
        }

        navigateToProfileForm() {
            this.refs.nav.push({
                title: 'Profile Edit',
                component:ProfileForm,
                rightButtonTitle: 'Save',
                passProps:{user:this.state.user,getUserData:this.getUserData,ref:(component) => {this.pushedComponent = component},},
                onRightButtonPress: () => {
                    this.pushedComponent && this.pushedComponent._onRightButtonClicked();
                }
            })
        }

        navigateToImpactLeague() {
            this.refs.navLeaderBoard.push({
                title: 'ImpactLeague',
                component:ImpactLeague,
                passProps:{user:this.state.user,getUserData:this.getUserData,}
            })
        }

        navigateToFeed() {
            this.refs.Homescreen.push({
                title: 'Feed',
                component:MessageCenter,
                passProps:{user:this.state.user,getUserData:this.getUserData,}
            })
        }

        render() {
            if (this.state.isLodaingCause) {
             
                return (
                <View style={{flex:1}}>
                   <View style={{flex:1}}> 
                   {this.returnCurrentTabUi()}
                   </View>      
                   <View style={{position:'absolute',bottom:0,height:styleConfig.tabHeight,width:deviceWidth,flexDirection:'row',borderTopWidth:1,borderTopColor:'#e6e6e6',backgroundColor:'white'}}>
                    <TouchableOpacity onPress={()=> this.changeTab('help')} style={styles.tabBtn}>
                        <Icon name = "help" style={[styles.tabIcon,{color:(this.state.selectedTab === 'help')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'help')?responsiveFontSize(5):responsiveFontSize(3.7)}]}></Icon>
                        <Text style = {{fontWeight:'600',color:(this.state.selectedTab === 'help')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'help')?responsiveFontSize(1.5):responsiveFontSize(1.4)}}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.changeTab('profile')} style={styles.tabBtn}>
                       <Icon name = "person" style={[styles.tabIcon,{color:(this.state.selectedTab === 'profile')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'profile')?responsiveFontSize(5):responsiveFontSize(3.7)}]}></Icon>
                       <Text style = {[styles.tabnameText,{fontWeight:'600',color:(this.state.selectedTab === 'profile')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'profile')?responsiveFontSize(1.5):responsiveFontSize(1.4)}]}>Me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.changeTab('welcome')} style={styles.tabBtn}>
                       <Icon name ={'view-carousel'} style={[styles.tabIcon,{color:(this.state.selectedTab === 'welcome')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'welcome')?responsiveFontSize(5):responsiveFontSize(3.7)}]}></Icon>
                       <Text style = {[styles.tabnameText,{fontWeight:'600',color:(this.state.selectedTab === 'welcome')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'welcome')?responsiveFontSize(1.5):responsiveFontSize(1.4)}]}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.changeTab('Leaderboard')} style={styles.tabBtn}>
                       <Icon name ={'equalizer'} style={[styles.tabIcon,{color:(this.state.selectedTab === 'Leaderboard')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'Leaderboard')?responsiveFontSize(5):responsiveFontSize(3.7)}]}></Icon>
                       <Text style = {[styles.tabnameText,{fontWeight:'600',color:(this.state.selectedTab === 'Leaderboard')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'Leaderboard')?responsiveFontSize(1.5):responsiveFontSize(1.3)}]}>Leaderboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.changeTab('settings')} style={styles.tabBtn}>
                       <Icon name ={'settings'} style={[styles.tabIcon,{color:(this.state.selectedTab === 'settings')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'settings')?responsiveFontSize(5):responsiveFontSize(3.7)}]}></Icon>
                       <Text style = {[styles.tabnameText,{fontWeight:'600',color:(this.state.selectedTab === 'settings')?styleConfig.light_sky_blue:'#a2a2a2',fontSize:(this.state.selectedTab === 'settings')?responsiveFontSize(1.5):responsiveFontSize(1.4)}]}>Settings</Text>
                    </TouchableOpacity>
                   </View>
                </View>
              );
            }else{
                return(
                  <Lodingscreen/>
                )
            }

        }
        

        changeTab(tab){
            this.setState({
              selectedTab:tab,
            
            })
        }

        returnCurrentTabUi(){
            if (this.state.selectedTab === 'help') {
               return(

                  <HelpCenter user={this.state.user} getUserData={this.getUserData} navigator={this.props.navigator}/>
                )
            } else if (this.state.selectedTab === 'profile') {
                return(
                  <Profile user={this.state.user} getUserData={this.getUserData} navigator={this.props.navigator}/>
                )

            }else if (this.state.selectedTab === 'welcome') {
                return(
                  <Welcome my_currency = {this.props.my_currency} user={this.state.user} getUserData={this.getUserData} myCauseNum={this.state.dataCauseNum} navigator={this.props.navigator}/>
                )

            }else if (this.state.selectedTab === 'Leaderboard') {
                return(
                  <Leaderboard user={this.state.user} getUserData={this.getUserData} navigator={this.props.navigator}/>
                )

            }else if (this.state.selectedTab === 'settings') {
                return(
                  <Setting navigator={this.props.navigator} />
                )

            }else{
                return;
            }
        }

}


    var styles = StyleSheet.create({
        tabsWrap: {
            backgroundColor: 'white',

        },
        tab: {
            height: 50,
            width: 50,
        },
        tabIcon:{
            fontSize:responsiveFontSize(4),
        },
        tabBtn:{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'column',

        },
        tabnameText:{
            fontFamily:styleConfig.LatoRegular,
        }

    })

export default Tabs;








// <TabBarIOS 
//                     style={{height:100,padding:10}}
//                     unselectedTintColor="grey"
//                     tintColor={styleConfig.bright_blue}
//                     barTintColor="white" 
//                     selectedTab={this.state.selectedTab} 
//                     navigator={this.props.navigator}>

//                     <TabBarIOS.Item
//                       selected={this.state.selectedTab === 'settings'}
//                       icon={{uri: settingicon, scale: 5.5}}
//                       title="Settings"
//                       onPress={() => {
//                           this.setState({
//                               selectedTab: 'settings',
//                           });
//                       }}>
//                     <Setting navigator={this.props.navigator} />
//                     </TabBarIOS.Item>
//                     <TabBarIOS.Item
//                         selected={this.state.selectedTab === 'profile'}
//                         title="Me"
//                         icon={{uri: Profileicon, scale: 5}}
//                         onPress={() => {
//                             this.setState({
//                                 selectedTab: 'profile',
//                             });
//                     }}>
//                     <NavigatorIOS
//                         ref="nav"
//                         translucent={false}
//                         navigationBarHidden={false}
//                         style={{flex:1}}
//                         tintColor='black'
//                         titleTextColor='black'
//                         shadowHidden={false}
//                         barTintColor='white'
//                         initialRoute={{
//                         showTabBar: true,
//                         rightButtonTitle: (this.state.user)?'edit':'',
//                         onRightButtonPress: () => this.navigateToProfileForm(),
//                         title:'Profile',
//                         component:Profile,
//                         passProps:{user:this.state.user,getUserData:this.getUserData,isfetchingRun:this.state.isFetchingRuns}
//                     }}/>               
//                     </TabBarIOS.Item>                   
//                     <TabBarIOS.Item
//                       selected={this.state.selectedTab === 'welcome'}
//                       title="Home"
//                       icon={{uri: RunIcon, scale: 5}}
//                       onPress={() => {
//                       this.setState({
//                           selectedTab: 'welcome',
//                       });
//                     }}>
//                     <View>
//                        <Welcome my_currency = {this.props.my_currency} user={this.state.user} getUserData={this.getUserData} myCauseNum={this.state.dataCauseNum} navigator={this.props.navigator}/>                    
//                     </View>
//                     </TabBarIOS.Item>

//                     <TabBarIOS.Item
//                         selected={this.state.selectedTab === 'Leaderboard'}
//                         title="Leaderboard"
//                         icon={{uri: GroupImage, scale: 3.5}}
//                         onPress={() => {
//                             this.setState({
//                                 selectedTab: 'Leaderboard',
//                             });
//                         }}>
//                       <Leaderboard user={this.state.user} getUserData={this.getUserData} navigator={this.props.navigator}/>
//                     </TabBarIOS.Item>
//                     <TabBarIOS.Item
//                         selected={this.state.selectedTab === 'help'}
//                         title="Help"
//                         icon={{uri: FaqImage, scale: 5}}
//                         onPress={() => {

//                             this.setState({
//                                 selectedTab: 'help',
//                                 myFeedStoredCount:this.state.FeedCount
//                             });
//                       }}>
//                      <NavigatorIOS
//                         ref="Help"
//                         translucent={false}
//                         navigationBarHidden={false}
//                         style={{flex:1}}
//                         tintColor='black'
//                         titleTextColor='black'
//                         shadowHidden={false}
//                         barTintColor={'white'}
//                         initialRoute={{
//                         showTabBar: true,
//                         title:'Help',
//                         component:HelpCenter,
//                         passProps:{user:this.state.user,getUserData:this.getUserData}
//                         }}/>                
//                         </TabBarIOS.Item>
//                   </TabBarIOS>