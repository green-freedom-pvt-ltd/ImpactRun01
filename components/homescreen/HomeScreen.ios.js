
'use strict';

import React,{Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
  Platform,
  Navigator,
  Animated,
  Image,
  AlertIOS,
  LayoutAnimation,
  TouchableOpacity,
  AsyncStorage,
  NetInfo,
  PanResponder,
  PushNotificationIOS,
  DeviceEventEmitter,
  Linking,
  TouchableWithoutFeedback
} from 'react-native';
import Modal from '../downloadsharemeal/CampaignModal'
var { RNLocation: Location } = require('NativeModules');
import apis from '../../components/apis';
import styleConfig from '../../components/styleConfig';
import Lodingscreen from '../../components/LodingScreen';
import commonStyles from '../../components/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';

import ProgressBar from './causeprogressbar';
import { TabViewAnimated, TabViewPage } from 'react-native-tab-view';
var REQUEST_URL = 'http://Dev.impactrun.com/api/causes';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;


class Homescreen extends Component {
      constructor(props) {
        super(props);
        this.state = {
          dataSource : null,
          album : {},
          causes : [],
          navigation: {
            index: 0,
            routes: [],
            loadingimage:true,
            FeedCount:0,
            localfeedCount:0,
          },
          isDenied:false,
        };
        this.getfeedCount = this.getfeedCount.bind(this);
      }

      locationManager: undefined
      static propTypes = {
        style: View.propTypes.style,
      };
      
      getfeedCount(){
        AsyncStorage.getItem('Feedcount', (err, result) => { 
          if (result != null) {
          var count = JSON.parse(result).count;
          console.log("FeedCount",);
          this.setState({
            localfeedCount:count,

          })
        }else{
          this.setState({
            localfeedCount:0,
          })
        }
        })
      }



      modelViewdeniedLocationRequest(){
        return(
          <Modal
          onPress={()=>this.closemodel()}
          style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
             isOpen={this.state.isDenied}
               >
                  <View style={styles.modelWrap}>
                    <View  style={styles.contentWrap}>
                    <View style={styles.iconWrapmodel}>
                      <Icon3 style={{color:"white",fontSize:30,}} name={'md-warning'}></Icon3>
                    </View>
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:25}}>DENIED LOCATION REQUEST</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:15}}>You denied the location request this app use your location to track you run please go > settings > Location > Always</Text>
                   <View style={styles.modelBtnWrap}>
                    <TouchableOpacity style={styles.modelbtnEndRun}onPress ={()=>this.navigateToIOSsetting()}><Text style={styles.btntext}>SETTINGS</Text></TouchableOpacity>
                  </View>
                   </View>
                   </View>
                  </View>
            </Modal>
          )
      }
     
     closemodel(){
        this.setState({
          isDenied:false,
        })
      }

      componentWillMount() {
        this.getfeedCount();

        // this.fetchifinternet();
      // PushNotificationIOS.addListener('register', this._onRegistered);
      // PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
      // PushNotificationIOS.addListener('notification', this._onRemoteNotification);
      // PushNotificationIOS.addListener('localNotification', this._onLocalNotification);

        PushNotificationIOS.requestPermissions();          
        AsyncStorage.getItem('RID0', (err, result) => {
          this.setState({
          Rundata:JSON.parse(result),  
          loaded:true,             
           })
          this.PostSavedRundataIfInternetisOn();      
      })  


        AsyncStorage.getItem('SaveRunCount', (err, result) => {
          this.setState({
          RunCount:JSON.parse(result),  
          loaded:true,             
           })
              
        })  
        
      }
       
      componentWillUnmount() {
      }



      getFeedFromlocal(){

       AsyncStorage.getItem('feedData', (err, result) => { 
          if (result != null || undefined) {
          var feeddata = JSON.parse(result);  
          console.log("faqdata",feeddata);
          AlertIOS.alert("result",JSON.stringify(feeddata));
          this.setState({
           FeedData: this.state.FeedData.cloneWithRows(feeddata),
           loaded: true,
          }) 
        }else{
          this.fetchifinternet();
        }
        });
      }
      
      fetchifinternet(){
         NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
              console.log("isind");
               this.fetchFeedData();
            }else{
              this.getFeedFromlocal();
            } 
          }
        );
      }

      fetchFeedData() {
        var url = 'http://139.59.243.245/api/messageCenter/';
        fetch(url)
        .then( response => response.json() )
        .then( jsonData => {
        this.setState({
          loaded: true,
          notificationCount:jsonData.count,
        });
        console.log("jsonData.results",jsonData.results);
        AsyncStorage.setItem('feedData', JSON.stringify(jsonData.results), () => {
        });
        })
        .catch( error => console.log('Error fetching: ' + error) );
      }
  
      PostSavedRundataIfInternetisOn(){
           if(this.props.user) {
           NetInfo.isConnected.fetch().done(
            (isConnected) => {
              if (isConnected && this.state.Rundata != null) {
                  this.postPastRun();
               }
            }
           );  
         }
      }

     

      showImage(route){
        if (this.state.loadingimage === true) {
          return(
            <Image style={styles.cover}></Image>
            )
        }else{
          return(
            <Image source={{uri:this.state.album[route.key][0]}} style={styles.cover}>
                <View style={{position:'absolute',bottom:5,backgroundColor:'rgba(255, 255, 255, 0.75)',width:deviceWidth,padding:5}}>
                  <Text style={{fontWeight:'400',color:styleConfig.greyish_brown_two, fontFamily:styleConfig.FontFamily,}}>
                    {this.state.album[route.key][2]}
                  </Text>
                </View>
            </Image>
            )
        }
      }

      componentDidMount() {       
        var provider = this.props.provider;
        var causeNum = this.props.myCauseNum;
       
        if (causeNum != null || undefined) {
          try {
            AsyncStorage.multiGet(causeNum, (err, stores) => {

                var _this = this
                stores.map((item) => {

                    let key = item[0];
                    let val = JSON.parse(item[1]);
                   
                    let causesArr = _this.state.causes.slice()
                    causesArr.push(val)                  
                    _this.setState({causes: causesArr})
                    _this.setState({album : Object.assign({}, _this.state.album, {[val.cause_title]: [val.cause_image,val.cause_brief,val.cause_category,val.partners[0].partner_ngo,val.is_active,val.pk,val.amount_raised,val.amount,val.total_runs]})})
                    _this.setState({brief : Object.assign({}, _this.state.brief, {[val.cause_brief]: val.cause_image})})
                });
              this.setState({
                loadingimage:false,
                navigation: Object.assign({}, this.state.navigation, {
                index: 0,
                routes: Object.keys(this.state.album).map(key => ({ key })),

              })

              })
          });
          } catch (err) {
            console.log(err)
          } 
        }else{
          this.props.fetchDataonInternet();
        }
      }
     postPastRun(){
      var userdata = this.props.user;
      var user_id =JSON.stringify(userdata.user_id);
      var token = JSON.stringify(userdata.auth_token);
      var tokenparse = JSON.parse(token);
      var runNumber=[];
      var i;
      var runcount = this.state.RunCount;
      for (i = 0; i < runcount+1; i++) {
          runNumber.push("RID" + i )  ;
      }
      
      AsyncStorage.multiGet(runNumber, (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let val = store[i][1];
          this.setState({
          MyRunVal:JSON.parse(val),  
          loaded:true,             
          }) 
         var RunData = this.state.MyRunVal;
         fetch(apis.runApi, {
          method: "POST",
          headers: {  
            'Authorization':"Bearer "+ tokenparse,
            'Accept': 'application/json',
            'Content-Type': 'application/json',    
          },
          body:JSON.stringify({
          cause_run_title:RunData.cause_run_title,
          user_id:RunData.user_id,
          start_time:RunData.start_time,
          distance:RunData.distance,
          peak_speed: 1,
          avg_speed:RunData.avg_speed,
          run_amount:RunData.run_amount,
          run_duration:RunData.run_duration,
          is_flag:false,
          calories_burnt:RunData.calories_burnt,
          // start_location_lat:RunData.start_location_lat,
          // start_location_long:RunData.start_location_long,
          no_of_steps:RunData.no_of_steps,
          is_ios:RunData.is_ios,
        })
       })

      .then((response) => response.json())
      .then((userRunData) => { 
       var epochtime = userRunData.version;
         let responceversion = {
           runversion:epochtime
         }
        AsyncStorage.mergeItem("runversion",JSON.stringify(responceversion),()=>{   
          console.log("removed version",responceversion);

        });      
        this.RemoveStoredRun(runNumber);
       })
      });
      })
    }

    RemoveStoredRun(runNumber){

      let keys = runNumber;
      keys.push("SaveRunCount");
        AsyncStorage.multiRemove(keys, (err) => {
      });

    }
     // SLIDER_COVERFLOW_STYLE
    _buildCoverFlowStyle = ({ layout, position, route, navigationState,data }) => {
      var data = data;
      const { width } = layout;
      const { routes,SecondRoute } = navigationState;
      const currentIndex = routes.indexOf(route);
      const inputRange = routes.map((x, i) => i);
      const translateOutputRange = inputRange.map(i => {
        return width * (currentIndex - i) - ((width-deviceWidth+70) * (currentIndex - i));
      });
      const scaleOutputRange = inputRange.map(i => {
        if (currentIndex === i) {
          return 1;
        } else {
          return 0.9;
        }
      });
      const opacityOutputRange = inputRange.map(i => {
        if (currentIndex === i) {
          return 1;
        } else {
          return 0.7;
        }
      });

      const translateX = position.interpolate({
        inputRange,
        outputRange: translateOutputRange,
      });
      const scale = position.interpolate({
        inputRange,
        outputRange: scaleOutputRange,
      });
      const opacity = position.interpolate({
        inputRange,
        outputRange: opacityOutputRange,
      });

      return {
        width,
        transform: [
          { translateX },
          { scale },
        ],
        opacity,
      };
    };
     

    // ONCHANGE_SLIDER_FUNCTION
    _handleChangeTab = (index) => {
      this.setState({
        navigation: { ...this.state.navigation, index },
      });
     };

    // NAVIGATION
    navigateToRunScreen(cause) {
      var me = this;
      Location.getAuthorizationStatus(function(authorization) {
        if (authorization === "authorizedAlways") {
        // authorization is a string which is either "authorizedAlways",
        // "authorizedWhenInUse", "denied", "notDetermined" or "restricted"
      
        var cause;
        if (!!me.state.causes.length && me.state.navigation.index+1) {
          cause = me.state.causes[me.state.navigation.index]
        } else {
          cause = {}
        }

        Location.startUpdatingLocation();

        me.props.navigator.replace({
        title: 'Gps',
        id:'runlodingscreen',
        index: 0,
        passProps:{data:cause,user:me.props.user,getUserData:me.props.getUserData},
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
        navigator: me.props.navigator,
        });
      }else{
        if (authorization === "denied") {
          me.setState({
            isDenied:true,
          })                 
        }else{
          Location.requestAlwaysAuthorization();
        }
      }
     });
    };

    navigateToIOSsetting(){
     this.closemodel();
     Linking.canOpenURL('app-settings:{6}').then(supported => {
        if (!supported) {
          console.log('Can\'t handle settings url');
        } else {
          return Linking.openURL('app-settings:');
        }
      }).catch(err => console.error('An error occurred', err));

    }

    navigateToCauseDetail() {
      var cause;
      if (!!this.state.causes.length && this.state.navigation.index+1) {
        cause = this.state.causes[this.state.navigation.index]
      } else {
        cause = {}
      }
      this.props.navigator.push({
      title: 'Gps',
      id:'causedetail',
      index: 0,
      passProps:{data:cause,user:this.props.user,getUserData:this.props.getUserData},
      navigator: this.props.navigator,
      });
    };

    functionForIphone4Brief(route){
      if (deviceheight >= 667) {
      return(
        <Text  numberOfLines={4} style={styles.causeBrief}>{this.state.album[route.key][1]}</Text>
        )
      }else{
        if (deviceheight <= 568) {
          return(
          <Text  numberOfLines={2} style={styles.causeBrief}>{this.state.album[route.key][1]}</Text>
          )
        }
    }
    };
    // RENDER_SCREEN
    _renderScene = ({ route }) => {
        var cause;

        if (!!this.state.causes.length && this.state.navigation.index+1) {
          cause = this.state.causes[this.state.navigation.index]

        } else {
          cause = {}
        }


        var money = JSON.stringify(parseFloat(this.state.album[route.key][6]).toFixed(0));
       
      if (money.length > 5) {
        var lenth = money.length;
        var commmaplace = lenth-4;
        var Moneyfinalvalue =JSON.parse(money.slice(0,commmaplace)+ ',' + money.slice(commmaplace,lenth)) ; 
      }else{
        // AlertIOS.alert("someval");
         var Moneyfinalvalue = JSON.parse(money);
      }
        // var moneyslice = money.slice(0,2);

        var Runs = JSON.stringify(parseFloat(this.state.album[route.key][8]).toFixed(0));
        if (Runs.length > 5) {
        var runlength = Runs.length;
        var commmaplacerun =runlength-4;
        var runFinalvalue = JSON.parse(Runs.slice(0,commmaplacerun)+ ',' + Runs.slice(commmaplacerun,lenth));
        }else{
          var runFinalvalue = JSON.parse(Runs);
        }
        // console.log("{this.state.album[route.key][1]",this.state.album[route.key][1]+"   "+route.key+"   "+this.state.album[route.key][3]);
        return (
          <View style={styles.page}>
            <TouchableWithoutFeedback accessible={false} onPress={()=>this.navigateToCauseDetail()} >
            <View style={styles.album}>
              {this.showImage(route)}
              <View style={styles.borderhide}></View>
              <View style={{width:deviceWidth-65,justifyContent: 'center',alignItems: 'center',}}>
                <View style={{width:deviceWidth-105}}>
                  <Text numberOfLines={1} style={styles.causeTitle}>{route.key}</Text>
                  <Text numberOfLines={1} style={{color:styleConfig.warm_grey_three,fontFamily:styleConfig.FontFamily,fontSize:styleConfig.FontSize3,fontWeight:'400',width:200,marginBottom:10,}}>By {this.state.album[route.key][3]}</Text>
                  <View>
                    {this.functionForIphone4Brief(route)}
                  </View>
                </View>
              </View>
              <View style={styles.barWrap}>
                <View style = {styles.wraptext}>
                  <Text style = {styles.textMoneyraised}>Raised <Icon style={{color:styleConfig.greyish_brown_two,fontSize:styleConfig.FontSize3,fontWeight:'400'}}name="inr"></Icon> {Moneyfinalvalue}</Text>
                  <Text style = {styles.textMoneyraised}>{parseFloat((this.state.album[route.key][6])/this.state.album[route.key][7]*100).toFixed(0)}%</Text>
                </View>
                <ProgressBar unfilledColor={'black'} height={styleConfig.barHeight} width={deviceWidth-110} progress={(this.state.album[route.key][6])/this.state.album[route.key][7]}/> 
                <View style = {styles.wraptext2}>
                  <Text style = {styles.textMoneyraised}> {runFinalvalue} ImpactRuns </Text>
                </View>      
              </View>
             
            </View>
            </TouchableWithoutFeedback>

          </View>
        );
      
    };
   

     // RENDER_PAGE
    _renderPage = (props,data,route) => {
      return (
        <TabViewPage
          topcard={300}
          {...props}
          style={this._buildCoverFlowStyle(props)}
          renderScene={this._renderScene}/>
      );
    
    };

    navigateToFeed() {
      this.props.navigator.push({
      title: 'Gps',
      id:'messagecenter',
      index: 0,
      passProps:{getfeedCount:this.getfeedCount},
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      navigator: this.props.navigator,
      });
    };

     notificationIcon(){
        // this.state.notificationCount > this.state.localStorenotificationCount
        if (this.state.notificationCount > this.state.localfeedCount) {
          return(
            <View style={styles.notificationBatch}><Text style={{fontSize:7,color:"white",fontWeight:"600"}}>1</Text></View>
            )
        }else{
          return;
        }
      }

    
    // renderFeedIcon(){

    //     return(
    //        <TouchableOpacity style={{height:70,width:70,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.navigateToFeed()} >
         
    //          <Icon2 style={{fontSize:22,top:5, color:'white'}} name={'notifications'} ></Icon2>
    //            {this.notificationIcon()}
    //         </TouchableOpacity>
    //       );
    //   };


    // RENDER_FUNCTION
    render(route) { 
      if (this.props.myCauseNum != null ) {
      return (
        <View style={{height:deviceheight,width:deviceWidth,backgroundColor:'white'}}>
        <View>
          <View style={commonStyles.Navbar}>
            <Text style={commonStyles.menuTitle}>Impactrun</Text>
          </View>
          <View style={styles.tabwrap}>
           <TabViewAnimated
             style={[ styles.container, this.props.style ]}
             navigationState={this.state.navigation}
             renderScene={this._renderPage}
             onRequestChangeTab={this._handleChangeTab}>
             </TabViewAnimated>
             </View>
             <View style={{top:-65,width:deviceWidth,height:50, justifyContent: 'center',alignItems: 'center',}}>
              <TouchableOpacity  style={styles.btnbegin2} text={'BEGIN RUN'} onPress={()=>this.navigateToRunScreen()}>
                <Text style={{fontSize:18,color:'white',fontWeight:'400',fontFamily:styleConfig.FontFamily}} >Lets Go </Text>
               </TouchableOpacity>
              </View>
             </View>
            {this.modelViewdeniedLocationRequest()}
          </View>
      );
    }else{
      return(
        <Lodingscreen/>
        );
    }
    }
  
  

  }

  var styles = StyleSheet.create({
    tabwrap:{
      height:deviceheight-120,
      width:deviceWidth,
      justifyContent: 'center',
    },
   container: {
      width:deviceWidth,
      backgroundColor:'blue',
      justifyContent: 'center',
    },
    page: {
      width:deviceWidth,
      alignItems: 'center',
      justifyContent: 'center',
    },
     homebgoverlay:{
      height:deviceheight,
      width:deviceWidth,
      opacity:1,
     },
     homebg:{    
      flexDirection: 'row',
      position:'absolute',
      height:deviceheight,
      width:deviceWidth,
     },
     album: {
      paddingBottom:30,
      backgroundColor: '#fff',
      width: deviceWidth-65,
      elevation: 12,
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {
        height: 4,
      },
      borderRadius:5,
     },
     cover: {
      width: deviceWidth-65,
      height:deviceheight/2-110,
      borderRadius:5,
      resizeMode: 'cover',
     },
     borderhide:{
      width: deviceWidth-65,
      height:5,
      backgroundColor:'white',
      top:-5,
     },
     label: {
      margin: 16,
      color: '#fff',
      left:deviceWidth/2-60,
     },
     btnbegin:{
      width:styleConfig.beginRunBtnWidth,
      height:styleConfig.beginRunBtnHeight,
      backgroundColor:'#ffcd4d',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:80,
      shadowColor: '#000000',
      shadowOpacity: 0.4,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
      },
    },
    causeTitle:{
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSizeTitle,
      fontWeight:'400',
      fontFamily:styleConfig.FontFamily,
      marginBottom:0,
    },
    causeBrief:{
      marginBottom:10,
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSizeDisc,
      fontWeight:'400',
      fontFamily:styleConfig.FontFamily3,
    },
  
    barWrap:{
      width: deviceWidth-65,
      justifyContent: 'center',
      alignItems: 'center',
    },
    wraptext:{
      height:20,
      justifyContent: 'space-between',
      width: deviceWidth-105,
      flexDirection:'row',
    },
    wraptext2:{
      top:15,
      height:20,
      justifyContent: 'space-between',
      width: deviceWidth-105,
      flexDirection:'row',
    },
    textMoneyraised:{
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSize3,
      fontWeight:'600',
      fontFamily:styleConfig.FontFamily,
    },
    btnbegin2:{
      width:deviceWidth-65,
      height:50,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:styleConfig.pale_magenta,
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOpacity: 0.4,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
      },
    },
    notificationBatch:{
      marginTop:-18,
      marginLeft:35,
      position:"absolute",
      justifyContent: 'center',
      alignItems: 'center',
      height:10,
      width:10,
      borderRadius:5,
      backgroundColor:"red",
    },
    modelStyle:{
    justifyContent: 'center',
    alignItems: 'center',
   },
   modelWrap:{
    padding:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    paddingBottom:5,
    borderRadius:5,
   },
   iconWrapmodel:{
     justifyContent: 'center',
     alignItems: 'center',
     height:70,
     width:70,
     marginTop:-55,
     borderRadius:35,
     backgroundColor:styleConfig.bright_blue,
     shadowColor: '#000000',
     shadowOpacity: 0.4,
     shadowRadius: 4,
     shadowOffset: {
      height: 2,
     },
   },
   contentWrap:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    width:deviceWidth-100,
   },
   modelBtnWrap:{
    marginTop:10,
    width:deviceWidth-100,
    flexDirection:'row',
    justifyContent: 'space-between',
   },
    modelbtnEndRun:{
    flex:1,
    height:40,
    margin:5,
    borderRadius:5,
    backgroundColor:styleConfig.pale_magenta,
    justifyContent: 'center',
    alignItems: 'center',
   },
   btntext:{
    color:"white",
    textAlign:'center',
    margin:5,
    fontWeight:'600',
    fontFamily: styleConfig.FontFamily,
   },
  });
  export default Homescreen;
  // <View style={{bottom:0, width:deviceWidth-65,justifyContent: 'center',alignItems: 'center',}}>
     
  //     <TouchableOpacity  style={styles.btnbegin} text={'BEGIN RUN'} onPress={()=>this.navigateToRunScreen()}>
  //       <Image style={{height:40,width:60}} source={ require('../../images/RunImage.png')}></Image>
  //     </TouchableOpacity>
     
  // </View>