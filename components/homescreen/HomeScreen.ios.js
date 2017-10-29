
'use strict';

import React,{Component} from 'react';
import ReactNative,{
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
  Platform,
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
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
 import {Navigator} from 'react-native-deprecated-custom-components';
import LodingRunScreen from '../gpstracking/runlodingscreen'
import Modal from '../downloadsharemeal/CampaignModal'
var { RNLocation: Location } = require('NativeModules');
var DeviceInfo = require('react-native-device-info');
import ImageLoad from 'react-native-image-placeholder';

import apis from '../../components/apis';
import styleConfig from '../../components/styleConfig';
import Lodingscreen from '../../components/LodingScreen';
import commonStyles from '../../components/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import NavBar from '../navBarComponent';
import ProgressBar from './causeprogressbar';
import CauseDetail from './CauseDetail';
import { TabViewAnimated, TabViewPage } from 'react-native-tab-view';
import { takeSnapshot } from "react-native-view-shot";
import Share, {ShareSheet, Button} from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';

var REQUEST_URL = 'http://Dev.impactrun.com/api/causes';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;
var iphone5 = 568;
var iphone5s = 568;
var iphone6 = 667;
var iphone6s = 667;
var iphone7 = 667;
var iphone6Plus = 736;
var iphone6SPlus = 736;
var iphone7Plus = 736;
import MessageCenter from '../feed/messageCenter';

class Homescreen extends Component {
      constructor(props) {
        super(props);
        this.rows=[];
        this.state = {
          dataSource : null,
          album : {},
          causes : [],
          navigation: {
            index: 0,
            routes: [],
            
          },
          loadingimage:false,
          FeedCount:0,
          localfeedCount:0,
          previewSource: '',
          error: null,
          res: null,
          renderComponent:true,
          value: {
            format: "png",
            quality: 0.9,
            result: "base64",
            snapshotContentContainer: false,
          },
          isDenied:false,
        };
        this.getfeedCount = this.getfeedCount.bind(this);
        this.renderFeedIcon = this.renderFeedIcon.bind(this);
        this.navigateToFeed = this.navigateToFeed.bind(this);
        // AsyncStorage.getItem('my_currency', (err, result) => {
        //     this.setState({
        //       settings_currency:JSON.parse(result),
        //   })
        //   })
        //   console.log('setting_currency', this.state.settings_currency);     

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


      snapshot(){
        var selectedRow = this.rows[this.state.navigation.index-1];
         var ref = this.list;
        takeSnapshot(selectedRow, this.state.value)
        .then(res =>
          this.state.value.result !== "file"
          ? res
          : new Promise((success, failure) =>
          // just a test to ensure res can be used in Image.getSize
          Image.getSize(
            res,
            (width, height) => (console.log(res,width,height), success(res)),
            failure
          )
          )
            
        )
        .then((res) => {
          this.setState({
            error: null,
            res,
            previewSource: { uri:
              this.state.value.result === "base64"
              ? "data:image/"+this.state.value.format+";base64,"+res
              : res }
          })

          var shareOptions = {
            // title: "ImpactRun",
            // message:"I ran "+distance+" kms and raised " +impact+ " rupees for "+cause.partners[0].partner_ngo+" on #Impactrun. Kudos "+cause.sponsors[0].sponsor_company+" for sponsoring my run.",
            url:"data:image/"+this.state.value.format+";base64,"+res,
            // subject: "Download ImpactRun Now " //  for email
          }
          Share.open(shareOptions)
        })
        .catch(error => (console.warn(error), this.setState({ error, res: null, previewSource: null })));
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
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:25}}>Share location access</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:15}}>We need GPS location to track your walks/jogs. Please go to Location and click on > While Using the App </Text>
                   <View style={styles.modelBtnWrap}>
                    <TouchableOpacity style={styles.modelbtnEndRun}onPress ={()=>this.navigateToIOSsetting()}><Text style={styles.btntext}>Allow</Text></TouchableOpacity>
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

      getmyCurrency(countrycode){
        switch(countrycode){
          case 'US': return 'USD';
                    break;
          case 'IN' : return 'INR';
                    break;
          case 'CA': return 'USD';
                    break;
          case 'AT' : 
          case 'BE' :
          case 'HR' :
          case 'BG' :
          case 'CY' :
          case 'CZ' :
          case 'DK' :
          case 'EE' : 
          case 'FI' : 
          case 'FR' :
          case 'DE' :
          case 'GR' :
          case 'HU' :
          case 'IE' :
          case 'IT' :
          case 'LV':
          case 'LT':
          case 'LU': 
          case 'MT':
          case 'NL': 
          case 'PL':
          case 'PT':
          case 'RO':
          case 'SK':
          case 'SI':
          case 'ES':
          case 'SE' : return 'EUR';
                    break;
          case 'JP': return 'JPY';
                    break;
          case 'GB': return 'GBP';
                    break;
          default: return 'INR';

        }
      }

      isKeyAlreadyExists(){
         AsyncStorage.getItem('my_currency', (err, result) => {
          console.log('resas', result);
          return result;
          //   this.setState({
          //     setting_currency:JSON.parse(result),
          // })
          })   

      }


      componentWillMount() {
        this.getfeedCount();
        // console.log('props currency', this.props.my_currency);


        //  AsyncStorage.getItem('my_currency', (err, result) => {
        //   var mycurrency = this.getmyCurrency(DeviceInfo.getDeviceCountry());
        //   console.log('resas', result);
        //   if(result){
        //     if(result != mycurrency) 
        //       {
        //         mycurrency = result;
        //         AsyncStorage.setItem('my_currency',JSON.stringify(mycurrency));
        //       }
        //   }
        //   console.log('mycurrency', mycurrency);
        // AsyncStorage.getItem('exchangeRates', (err, result) => {
        //     this.setState({
        //     exchange_rates:JSON.parse(result),  
        //     })
        //     console.log('exc2', this.state.exchange_rates);
        //     for (var i = 0; i < this.state.exchange_rates.length; i++) { 
        //       if (this.state.exchange_rates[i].currency == mycurrency){
        //         this.setState({
        //           my_rate:this.state.exchange_rates[i].rate,
        //           my_currency:mycurrency,
        //         })
        //       }
        //     }
        //     console.log('countr', this.state.my_rate);
        //     AsyncStorage.setItem('my_rate',JSON.stringify(this.state.my_rate));
        //     // console.log('countr', DeviceInfo.getDeviceCountry());

        //   })
        // })   







        
        // var setting_currency = await AsyncStorage.getItem('my_currency');
        var mycurrency = this.getmyCurrency(DeviceInfo.getDeviceCountry());
        if (typeof this.props.my_currency != 'undefined')
        {
          if(mycurrency != this.props.my_currency){
            mycurrency = this.props.my_currency;
          }
          
        }


        AsyncStorage.setItem('my_currency',JSON.stringify(mycurrency));

        this.fetchifinternet();
        AsyncStorage.getItem('exchangeRates', (err, result) => {
          this.setState({
          exchange_rates:JSON.parse(result),  
          })
          for (var i = 0; i < this.state.exchange_rates.length; i++) { 
            if (this.state.exchange_rates[i].currency == mycurrency){
              this.setState({
                my_rate:this.state.exchange_rates[i].rate,
                my_currency:mycurrency,
              })
            }
          }
          console.log('countr', this.state.my_rate);
          AsyncStorage.setItem('my_rate',JSON.stringify(this.state.my_rate));
          // console.log('countr', DeviceInfo.getDeviceCountry());

        })
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
        this.setState({
          renderComponent:false,
        })
        console.log('thisrenderComponentState',this.state.renderComponent);
      }



      getFeedFromlocal(){
       AsyncStorage.getItem('feedData', (err, result) => { 
          if (result != null || undefined) {
          var feeddata = JSON.parse(result);  
          console.log("faqdata",feeddata);
          // AlertIOS.alert("result",JSON.stringify(feeddata));
          this.setState({
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
              // console.log("isind");
               this.fetchFeedData();
            }else{
              this.getFeedFromlocal();
            } 
          }
        );
      }

      fetchFeedData() {
        var url = 'http://dev.impactrun.com/api/messageCenter/';
        fetch(url)
        .then( response => response.json() )
        .then( jsonData => {
        this.setState({
          loaded: true,
          notificationCount:jsonData.count,
        });
        // console.log("jsonData.results",jsonData);
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


      cardImageheight(){
        if (deviceheight === iphone6) {
         return deviceheight/2-110
        }else if (Dimensions.get('window').height === iphone5){
          return deviceheight/2-110
        }
        else if (Dimensions.get('window').height === iphone6SPlus){
          return deviceheight/2-140
        }
        else if (Dimensions.get('window').height < iphone5){
         return deviceheight/2-110
        }
      }

     

      showImage(cause){
        if (this.state.loadingimage === true) {
          return(
            <Image style={styles.cover}></Image>
            )
        }else{
          return(
            <View>
            <ImageLoad placeholderSource={require('../../images/cause_image_placeholder.jpg')} isShowActivity={true} placeholderStyle={styles.cover} loadingStyle={{size: 'small', color: 'grey'}} source={{uri:cause.cause_image}} style={styles.cover}>        
            </ImageLoad>
              <View style={{paddingTop:5,paddingLeft:15,flex:-1,height:30,backgroundColor:'rgba(255, 255, 255, 0.75)'}}>
                  <Text style={{fontWeight:'400', fontSize:styleConfig.FontSize3, justifyContent: 'center',alignItems: 'center', color:styleConfig.greyish_brown_two, fontFamily:styleConfig.FontFamily,}}>
                    {cause.cause_category}
                  </Text>
              </View>
           </View>
            )
        }
      }


      //  _handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
      //   // Should we become active when the user presses down on the circle?
      
      //   console.log('myparesesponced');
      //   return false;
      // }

      // _handleMoveShouldSetPanResponder(e: Object, gestureState: Object): boolean {
      //   // Should we become active when the user moves a touch over the circle?\
        
      //   console.log('myparesesponced');
      //   return true;
      // }


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
                    // console.log('causesArr',causesArr);                
                    _this.setState({causes: causesArr})
                    _this.setState({album : Object.assign({}, _this.state.album, {[val.cause_title]: [val.amount_raised,val.amount,val.total_runs,val.cause_completed_image,val.is_completed,val]})})
                    _this.setState({brief : Object.assign({}, _this.state.brief, {[val.cause_brief]: val.cause_image})})
                });
              this.setState({
                loadingimage:false,
                navigation: Object.assign({}, this.state.navigation, {index: 0, routes: Object.keys(this.state.album).map(key => ({ key })), })
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
          end_time:RunData.end_time,
          distance:RunData.distance,
          peak_speed: 1,
          avg_speed:RunData.avg_speed,
          run_amount:RunData.run_amount,
          run_duration:RunData.run_duration,
          is_flag:false,
          calories_burnt:RunData.calories_burnt,
          start_location_lat:RunData.start_location_lat,
          start_location_long:RunData.start_location_long,
          end_location_lat:RunData.end_location_lat,
          end_location_long:RunData.end_location_long,
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
    

    distancebetweenCards(width){
      if (deviceheight === iphone6) {
       return width-deviceWidth+80
      }else if (Dimensions.get('window').height === iphone5){
        return width-deviceWidth+82
      }
      else if (Dimensions.get('window').height === iphone6SPlus){
        return width-deviceWidth+95
      }
      else if (Dimensions.get('window').height < iphone5){
        return width-deviceWidth+90
      }
    }
     cardWidth(){
      if (deviceheight === iphone6) {
       return  deviceWidth-80
      }else if (Dimensions.get('window').height === iphone5){
        return  deviceWidth-65
      }
      else if (Dimensions.get('window').height === iphone6SPlus){
        return  deviceWidth-100
      }
      else if (Dimensions.get('window').height < iphone5){
        return  deviceWidth-65
      }
    }

   




     // SLIDER_COVERFLOW_STYLE
    _buildCoverFlowStyle = ({ layout, position, route, navigationState,data }) => {
      var data = data;
      const { width } = layout;
      const { routes,SecondRoute } = navigationState;
      const currentIndex = routes.indexOf(route);
      const inputRange = routes.map((x, i) => i);
      const translateOutputRange = inputRange.map(i => {
        return width * (currentIndex - i) - (this.distancebetweenCards(width) * (currentIndex - i));
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
        if (authorization === "authorizedWhenInUse") {
        // authorization is a string which is either "authorizedAlways",
        // "authorizedWhenInUse", "denied", "notDetermined" or "restricted"
        // Location.startUpdatingLocation();
        var cause;
        if (!!me.state.causes.length && me.state.navigation.index+1) {
          cause = me.state.causes[me.state.navigation.index]
        } else {
          cause = {}
        }

        // Location.startUpdatingLocation();
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
          Location.requestWhenInUseAuthorization();
        }
      }


      //   me.props.navigator.push({
      //   component:LodingRunScreen,
      //   navigationBarHidden: true,
      //   passProps:{data:cause,user:me.props.user,getUserData:me.props.getUserData},
      //   // sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      //   });
      // }else{
      //   if (authorization === "denied") {
      //     me.setState({
      //       isDenied:true,
      //     })                 
      //   }else{
      //     Location.requestWhenInUseAuthorization();
      //   }
      // }
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

    navigateToCauseDetail(cause,some) {
      console.log('some',some);
      this.props.navigator.push({
      title: 'Gps',
      id:'causedetail',
      index: 0,
      passProps:{data:cause,user:this.props.user,getUserData:this.props.getUserData},
      navigator: this.props.navigator,
      });
      // this.props.navigator.push({
      // title: 'Causedetail',
      // component:CauseDetail,
      // navigationBarHidden: false,
      // passProps:{data:cause,user:this.props.user,getUserData:this.props.getUserData},
      // });
    };

    functionForIphone4Brief(cause){
      if (Dimensions.get('window').height === 667) {
      return(
        <Text  numberOfLines={4} style={styles.causeBrief}>{cause.cause_brief}</Text>
        )
      }else if(Dimensions.get('window').height === 568){
      
          return(
          <Text  numberOfLines={4} style={styles.causeBrief}>{cause.cause_brief}</Text>
          )
    
      }else if(Dimensions.get('window').height > 667){
          return(
          <Text  numberOfLines={4} style={styles.causeBrief}>{cause.cause_brief}</Text>
          )
    
      }else if(Dimensions.get('window').height < 568){
          return(
          <View style={{height:30,backgroundColor:"transparent"}}></View>
          )
    
      }
    };




    measureView=(event)=>{
        this.setState({
            x: event.nativeEvent.layout.x,
            y: event.nativeEvent.layout.y,
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height
        })
        // console.log('height',this.state.height);
    };



    // RENDER_SCREEN
    _renderScene = ({ route }) => {
      if (this.state.renderComponent) {
        // console.log('renderComponent',this.state.renderComponent);
        var cause = this.state.album[route.key][5]
        var money = JSON.stringify(parseFloat(parseFloat(this.state.album[route.key][0]).toFixed(0)/parseFloat(this.state.my_rate).toFixed(0)).toFixed(0));
        // var money = JSON.stringify(parseFloat(this.state.album[route.key][0]).toFixed(0)); Old money value used
        // console.log('money2',money);
        if (money.length > 5) {
          var lenth = money.length;
          var commmaplace = lenth-4;
          var Moneyfinalvalue =JSON.parse(money.slice(0,commmaplace)+ ',' + money.slice(commmaplace,lenth)) ; 
        }else{
          // AlertIOS.alert("someval");
          var Moneyfinalvalue = JSON.parse(money);
        }
        // var moneyslice = money.slice(0,2);
        var moneyslice = money.slice(0,2);
        var Runs = JSON.stringify(parseFloat(this.state.album[route.key][2]).toFixed(0));
        if (Runs.length > 5) {
        var runlength = Runs.length;
        var commmaplacerun =runlength-4;
        var runFinalvalue = JSON.parse(Runs.slice(0,commmaplacerun)+ ',' + Runs.slice(commmaplacerun,runlength));
        //This was length copied pasted @Akash avoid such copy pastes dude
        }else{
          var runFinalvalue = JSON.parse(Runs);
        }
        if (cause.is_completed != true) {
        // console.log("{this.state.album[route.key][1]",this.state.album[route.key][1]+"   "+route.key+"   "+this.state.album[route.key][3]);
        return (
          
          <View onLayout={(event) => this.measureView(event)} style={styles.page}  >        
           <TouchableWithoutFeedback  accessible={false} onPress={()=>this.navigateToCauseDetail(cause,this.state.album[route.key][9])} >
            <View  style={styles.album}>
              {this.showImage(cause)}
              <View style={styles.borderhide}></View>
              <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                <View style={{width:deviceWidth-125}}>
                  <Text numberOfLines={1} style={styles.causeTitle}>{route.key}</Text>
                  <Text numberOfLines={1} style={{color:styleConfig.warm_grey_three,fontFamily:styleConfig.FontFamily,fontSize:styleConfig.FontSize3,fontWeight:'400'}}>By {cause.partners[0].partner_ngo}</Text>      
                </View>
              </View>
              <View style={{flex:1.5,justifyContent: 'flex-end',alignItems: 'center'}}>
                    {this.functionForIphone4Brief(cause)}
               </View>
              <View style={styles.barWrap}>
              <View style={{width:deviceWidth-125}}>
                <View style = {styles.wraptext}>
                  <Text style = {styles.textMoneyraised}>Raised <Icon style={{color:styleConfig.greyish_brown_two,fontSize:styleConfig.FontSize3,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}></Icon> {Moneyfinalvalue}</Text>
                  <Text style = {styles.textMoneyraised}>{parseFloat((cause.amount_raised/cause.amount)*100).toFixed(0)}%</Text>
                </View>
                <ProgressBar unfilledColor={'black'} height={styleConfig.barHeight} width={deviceWidth-125} progress={cause.amount_raised/cause.amount}/>
                <View style = {styles.wraptext2}>
                  <Text style = {styles.textMoneyraised}> {runFinalvalue} ImpactRuns </Text>
                </View>
                </View>
              </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
        );
       }else{
        return(
          <View style={styles.page} ref={(instance) => this.rows.push(instance)}>        
            <TouchableWithoutFeedback  accessible={false} onPress={()=>this.navigateToCauseDetail(cause)} >
            <View style={styles.album} >
              <Image source={{uri:cause.cause_completed_image}} style={{height:this.state.height,width:this.state.width,borderRadius:5,}}>
              </Image>
            </View>
            </TouchableWithoutFeedback>
          </View>
          )
      }
       }
      
    };
   

     // RENDER_PAGE
    _renderPage = (props,data,route) => {
      return (
        <TabViewPage
          ref={(instance) => this.list = instance}
          topcard={300}
          {...props}
          style={this._buildCoverFlowStyle(props)}
          renderScene={this._renderScene}/>
      );
    
    };

    navigateToFeed() {
          this.props.navigator.push({
            title: 'Feed',
            component:MessageCenter,
             navigationBarHidden: false,
            passProps:{user:this.state.user,getUserData:this.getUserData,}
        })
        }

     notificationIcon(){
        // this.state.notificationCount > this.state.localStorenotificationCount
        if (this.state.notificationCount > this.state.localfeedCount) {
          return(
            <View style={styles.notificationBatch}><Text style={{fontSize:7,color:"white",fontWeight:"600"}}>1</Text></View>
            )
        }else{
          return;
        }
      };

    
    renderFeedIcon(){

        return(
           <TouchableOpacity style={{justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.navigateToFeed()} >         
             <Icon2 style={{fontSize:22,top:5, color:'white'}} name={'notifications'} ></Icon2>
               {this.notificationIcon()}
            </TouchableOpacity>
          );
      };

   BiginRunBtn(cause){
   
    if (cause.is_completed) {
      return(
         <TouchableOpacity  style={styles.btnbegin2} text={'BEGIN RUN'} onPress={()=> this.snapshot()}>
            <Text style={{fontSize:18,color:'white',fontWeight:'400',fontFamily:styleConfig.FontFamily}} >TELL YOUR FRIENDS</Text>
          </TouchableOpacity>
      )
    }else{
      return(
        <TouchableOpacity  style={styles.btnbegin2} text={'BEGIN RUN'} onPress={()=>this.navigateToRunScreen(cause)}>
          <Text style={{fontSize:18,color:'white',fontWeight:'400',fontFamily:styleConfig.FontFamily}} >LET'S GO</Text>
        </TouchableOpacity>
      )
    }
   }



    // RENDER_FUNCTION
    render(route) { 
       var cause;
       // console.log('prpos rate', this.props.my_currency);
        if (!!this.state.causes.length && this.state.navigation.index+1) {
          cause = this.state.causes[this.state.navigation.index]
        } else {
          cause = {}
        }
      if (this.props.myCauseNum != null ) {
      return (
          <View style={{height:deviceheight,width:deviceWidth}}>
          <View style={commonStyles.Navbar}>
            <Text style={commonStyles.menuTitle}>Impact</Text>
          </View>
          <TabViewAnimated
             
             style={[ styles.container, this.props.style ]}
             navigationState={this.state.navigation}
             renderScene={this._renderPage}
             onRequestChangeTab={this._handleChangeTab}>
             </TabViewAnimated>
             

             
             <View style={styles.BtnWraperWrap}>
              <View style={styles.btnWrap}>
               {this.BiginRunBtn(cause)}
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
      position:'absolute',
      height:deviceheight,
      width:deviceWidth,
      justifyContent: 'center',
    },

    BtnWraperWrap:{
      backgroundColor:'#e2e5e6',
      height:((deviceheight-120)/100)*15,
      width:deviceWidth,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnWrap:{
      flex:1,
      width:deviceWidth-100,
      paddingBottom:((deviceheight-120)/100)*5,
    },

    container: {
      backgroundColor:'#e2e5e6',
      padding:((deviceheight-120)/100)*5,
      paddingLeft:0,
      height:((deviceheight-120)/100)*86,
      justifyContent: 'center',
    },

    page:{
      marginLeft:50,
      flex:-1,
      width:deviceWidth-100,
      backgroundColor:'white',
      paddingLeft:10,
      paddingRight:10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {
        height: 4,
      },
      borderRadius:5,
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
    },
     
     cover: {
      height:((deviceheight-120)/100)*35,
      width:deviceWidth-100,
      borderRadius:5,
      justifyContent:'flex-end',
     },

     cardTexwrap:{
      flex:1,
      padding:15,
      paddingTop:0,
      paddingBottom:0,
     },

     borderhide:{
      top:-5,
      height:5,
      backgroundColor:'white',
     },

     label: {
      margin: 16,
      color: '#fff',
      left:deviceWidth/2-60,
     },


    btnbegin:{   
      flex:1,
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
    },

    causeBrief:{
      width:deviceWidth-125,
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSize4,
      fontWeight:'400',
      fontFamily:styleConfig.FontFamily3,
    },
  
    barWrap:{
      justifyContent: 'center',
      flex:2,
      alignItems: 'center',

    },
    wraptext:{
      justifyContent: 'space-between',
      flexDirection:'row',
      paddingBottom:5,
    },
    wraptext2:{
      paddingTop:styleConfig.functionPadding,
      justifyContent: 'space-between',
      flexDirection:'row',
    },
    textMoneyraised:{
      left:0,
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSize3,
      fontWeight:'600',
      fontFamily:styleConfig.FontFamily,
    },
    textMoneyraised2:{
      left:0,
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSize4,
      fontWeight:'600',
      fontFamily:styleConfig.FontFamily,
    },
    btnbegin2:{
      flex:1,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#00c1f2',
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
      left:23,
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