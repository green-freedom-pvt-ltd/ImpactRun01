
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

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import {Navigator} from 'react-native-deprecated-custom-components';
import LodingRunScreen from '../gpstracking/runlodingscreen';
import Modal from '../downloadsharemeal/CampaignModal';
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
import AnimateNumber from './numberAnimate.js';
const CleverTap = require('clevertap-react-native');
import getLocalData from '../getLocalData.js';

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
          my_currency:'INR',
          renderComponent:true,
          value: {
            format: "png",
            quality: 0.9,
            result: "base64",
            snapshotContentContainer: false,
          },
          isDenied:false,
          overall_impact:'',
          my_rate:1,
          loadingImpact:true,
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


      snapshot(captureScreenShot){
        var selectedRow = this.rows[this.state.navigation.index-1];
         var ref = this.list;
        takeSnapshot(this.state.navigation.index-1, this.state.value)
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
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:25}}>GPS Unavailable</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:15}}>Your distance might not get tracked. Please turn GPS on and try using app in open areas. Please go to Location and click on > While Using the App </Text>
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
          if (result == null)
          {
            
            AsyncStorage.setItem('my_currency',JSON.stringify('INR'));

          }else{
          this.setState({
            my_currency:JSON.parse(result)
          })
          // AsyncStorage.removeItem('my_currency',(err) => {
          // });

          AsyncStorage.setItem('my_currency',result);
        }
          this.getExchangeRate();
          return result;
          //   this.setState({
          //     setting_currency:JSON.parse(result),
          // })
          })   

      }

      getExchangeRate(){
        AsyncStorage.getItem('exchangeRates', (err, result) => {
          this.setState({
          exchange_rates:JSON.parse(result),  
          })
          if(this.state.exchange_rates){
            for (var i = 0; i < this.state.exchange_rates.length; i++) { 
              if (this.state.exchange_rates[i].currency == this.state.my_currency){
                this.setState({
                  my_rate:this.state.exchange_rates[i].rate,
                  // my_currency:mycurrency,
                })
              }
            }
          }
          else {
            this.setState({
              my_rate: 1.0,
            })
          }
          var my_rate = JSON.stringify(this.state.my_rate);
          AsyncStorage.setItem('my_rate',my_rate);

        })
      }


      componentWillMount() {
        var me = this;
        setTimeout(()=>{
          me.setState({
          loadingImpact:false,
        })
        },200);
        
        this.getfeedCount();
         this.isKeyAlreadyExists();
       
        // this.fetchifinternet();      
        PushNotificationIOS.requestPermissions();              
        
      }
      


      componentDidMount() { 
       CleverTap.recordEvent('ON_LOAD_CAUSE_SELECTION'); 
        AsyncStorage.getItem('my_rate', (err, result) => {
          this.setState({
            my_rate:(result != null )? JSON.parse(result):1,
          })
            
        })
        getLocalData.getData('overall_impact')
        .then ((result )=> {
          this.setState({
            overall_impact:(result != null)? JSON.parse(result):0,
          }) 
        })    

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


      
       
      componentWillUnmount() {
        this.setState({
          renderComponent:false,
        })
      }



 



     removeByAttr (arr, attr, value){
          var i = arr.length;
          while(i--){
             if( arr[i] 
                 && arr[i].hasOwnProperty(attr) 
                 && (arguments.length > 2 && arr[i][attr] === value ) ){ 

                 arr.splice(i,1);

             }
          }

          return arr;

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
            <Image style={styles.cover} ></Image>
            )
        }else{
          return(
            <View>
              <ImageLoad placeholderSource={require('../../images/cause_image_placeholder.jpg')} isShowActivity={true} placeholderStyle={styles.cover} loadingStyle={{size: 'small', color: 'grey'}} source={{uri:cause.cause_image}} style={styles.cover}>        
              </ImageLoad>
              <View style={{paddingLeft:15,width:responsiveWidth(71),backgroundColor:'rgba(255, 255, 255, 0.65)',top:-responsiveHeight(3),height:responsiveHeight(3),justifyContent:'center'}}>
                  <Text style={{fontWeight:'400', fontSize:responsiveFontSize(1.5),  color:styleConfig.greyish_brown_two, fontFamily:styleConfig.FontFamily,}}>
                    {cause.cause_category}
                  </Text>
              </View>
            </View>
            )
        }
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
        return width * (currentIndex - i) - (responsiveWidth(25) * (currentIndex - i));
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
        backgroundColor:'transparent',
        paddingLeft:-100,
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
        CleverTap.recordEvent('ON_CLICK_LETS_GO',{
        'cause_index':me.state.navigation.index,
        'cause_id':cause.pk,
        });
        // Location.startUpdatingLocation();
        me.props.navigator.replace({
        title: 'Gps',
        id:'runlodingscreen',
        passProps:{cause_index:me.state.navigation.index,data:cause,user:me.props.user,getUserData:me.props.getUserData,killRundata:null},
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
      CleverTap.recordEvent('ON_LOAD_CAUSE_DETAILS');
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
        <Text  numberOfLines={2} style={styles.causeBrief}>{cause.cause_brief}</Text>
        )
      }else if(Dimensions.get('window').height === 568){
      
          return(
          <Text  numberOfLines={2} style={styles.causeBrief}>{cause.cause_brief}</Text>
          )
    
      }else if(Dimensions.get('window').height > 667){
          return(
          <Text  numberOfLines={2} style={styles.causeBrief}>{cause.cause_brief}</Text>
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
    };
   
   putComma(data){
    if (data.length > 4) {
      var numlength = data.length;
      var commmaplacerun = numlength-4;
      return JSON.parse(data.slice(0,commmaplacerun)+ ',' + data.slice(commmaplacerun,numlength));
      }else{
        return JSON.parse(data);
      }
   }


    // RENDER_SCREEN
    _renderScene = ({ route }) => {
      if (this.state.renderComponent) {
        var cause = this.state.album[route.key][5]
        // var money = JSON.stringify(parseFloat(parseFloat(this.state.album[route.key][0]).toFixed(0)/parseFloat(this.state.my_rate).toFixed(0)).toFixed(0));
        
        // var Moneyfinalvalue = (Math.round(JSON.parse(money)* 100)/100).toLocaleString(); 
       
        var runFinalvalue = (this.state.album[route.key][2] != null)?(Math.round(JSON.parse(this.state.album[route.key][2])*100)/100).toLocaleString('en-'+this.state.my_currency.slice(0,2),{ minimumFractionDigits: 0}):0;      
        var causeAmountFinalvalue = (cause.amount != null && this.state.my_rate != null)?(Math.round(JSON.parse(cause.amount)/this.state.my_rate*100)/100).toLocaleString('en-'+this.state.my_currency.slice(0,2),{ minimumFractionDigits: 0}):0;
          
        if (cause.is_completed != true) {
        return (
          <View  style={{width:deviceWidth,backgroundColor:'transparent',height:responsiveHeight(51),justifyContent: 'center',alignItems: 'center',}}>
          <View onLayout={(event) => this.measureView(event)} style={styles.page}  >        
           <TouchableWithoutFeedback  accessible={false} onPress={()=>this.navigateToCauseDetail(cause,this.state.album[route.key][9])} >
            <View  style={styles.album}>
              {this.showImage(cause)}
              <View style={{flex:-1,top:-responsiveHeight(3),backgroundColor:"transparent",paddingLeft:responsiveWidth(3),paddingRight:responsiveWidth(3)}}>
              <View style={{marginTop:responsiveHeight(1.2),height:responsiveHeight(7.4),backgroundColor:'transparent'}}>
                <View style={{flex:1}}>
                  <Text numberOfLines={1} style={styles.causeTitle}>{route.key}</Text>
                  <Text numberOfLines={1} style={{marginTop:responsiveHeight(1),color:styleConfig.black,opacity:.64,fontFamily:styleConfig.LatoRegular,fontSize:styleConfig.ngoText,fontWeight:'400'}}>With {cause.partners[0].partner_ngo} & {cause.sponsors[0].sponsor_company}</Text>      
                </View>
              </View>
              <View style={{backgroundColor:'transparent'}}>
                  {this.functionForIphone4Brief(cause)}
              </View>
              <View style={styles.barWrap}>
                  <View>
                    <View style = {styles.wraptext}>
                      <Text style = {styles.textMoneyraisedlableRemainingpercentage}>{parseFloat((cause.amount_raised/cause.amount)*100).toFixed(0)}%</Text>
                    </View>
                    <ProgressBar style={{top:responsiveHeight(0.7)}} unfilledColor={'black'} height={responsiveHeight(0.9375)} width={responsiveWidth(65)} progress={cause.amount_raised/cause.amount}/>
                    <View style = {styles.TextWaperforCuaseRaisedAmount}>
                      <View style = {styles.wraptext2}>
                        <Text style = {styles.textMoneyraisedlabel}> WALK & RUNS </Text>
                        <Text style = {styles.textMoneyraised}> {runFinalvalue} </Text>
                      </View>
                      <View style = {styles.wraptext2}>
                        <Text style = {styles.textMoneyraised2Label}> GOAL </Text>
                        <Text style = {styles.textMoneyraised2}><Icon style={{fontSize:styleConfig.causeTotalrun-2,color:'#000', fontWeight:'600',textAlign:'right',fontFamily:styleConfig.LatoBlack,opacity:.80}}name={this.state.my_currency.toLowerCase()}></Icon>{causeAmountFinalvalue}</Text>
                      </View>
                    </View>
                  </View>
              </View>
              </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
          </View>
        );
       }else{
        return(
        <View style={{width:deviceWidth,backgroundColor:'transparent',height:responsiveHeight(50),justifyContent: 'center',alignItems: 'center',}}>
          <View style={styles.page} ref={(instance) => this.rows.push(instance)}>        
            <TouchableWithoutFeedback  accessible={false} onPress={()=>this.navigateToCauseDetail(cause)} >
            <View style={styles.album} >
              <Image source={{uri:cause.cause_completed_image}} style={{height:this.state.height,width:this.state.width,borderRadius:5, resizeMode: "contain",}}>
              </Image>
            </View>
            </TouchableWithoutFeedback>
          </View>
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
         <TouchableOpacity  style={styles.btnbegin2}  onPress={()=> this.snapshot()}>
            <Text style={{fontSize:responsiveFontSize(2.4),color:'white',fontWeight:'800',fontFamily:styleConfig.LatoBlack}} >TELL YOUR FRIENDS</Text>
          </TouchableOpacity>
      )
    }else{
      return(
        <TouchableOpacity  style={styles.btnbegin2}  onPress={()=>this.navigateToRunScreen(cause)}>
          <Text style={{fontSize:responsiveFontSize(2.4),color:'white',fontWeight:'900',fontFamily:'Lato-Bold'}} >{'LET\'S GO'}</Text>
        </TouchableOpacity>
      )
    }
    
   }



    // RENDER_FUNCTION
    render(route) { 
       var cause;
        if (!!this.state.causes.length && this.state.navigation.index+1) {
          cause = this.state.causes[this.state.navigation.index]
        } else {
          cause = {}
        }
       var Overallimpact = this.state.overall_impact/this.state.my_rate;
       var Impact = parseFloat(Overallimpact).toFixed(0);
      if (!this.state.loadingImpact && this.props.myCauseNum != null) {
      return (
          <View style={{backgroundColor:'white',height:deviceheight,width:deviceWidth}}>
          <View style={{backgroundColor:'white',height:deviceheight}}>
          <View style={styles.TotalRaisedTextWrap}>
           <View style={{flexDirection:'column'}}>           
            <Text style={styles.TotalRaisedText}>

            <Icon style={[styles.TotalRaisedText,{fontSize:styleConfig.fontTotalRaised-5}]}name={this.state.my_currency.toLowerCase()}></Icon>
            <Text>{' '}</Text>
              <AnimateNumber myRate = {this.state.my_rate} TotalRaisedimpact = {Impact} currencyString = {this.state.my_currency.slice(0,2)} value={Impact} formatter={(val) => {
                  return ' ' + parseFloat(val).toFixed(0)
                }} ></AnimateNumber>  

           </Text>
           <Text style={styles.totaltextlable}>Impact so far</Text>     
          </View>
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
              </View>
             
                {this.modelViewdeniedLocationRequest()}
          </View>
      );
    }else{
      return(
        <View style={{height:deviceheight,width:deviceWidth}}>
        <Lodingscreen/>
        </View>
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
      backgroundColor:'white',
      height:responsiveHeight(11.3125),
      width:deviceWidth,
      justifyContent: 'center',
      alignItems: 'center',
      top:responsiveHeight(24)-responsiveHeight(7.8125),
    },
    TotalRaisedTextWrap:{
       top:responsiveHeight(10.2),
       width:deviceWidth,
       backgroundColor:'white',
       alignItems: 'center',
       height:responsiveHeight(7.8125),
    },
    totaltextlable:{
       justifyContent:'center',
       textAlign:'center',
       fontSize:styleConfig.labelTotalRaised,
       color:'black',
       fontWeight:'400',
       fontFamily:styleConfig.LatoRegular,
       top:0,
       opacity:0.6,
    },
    TotalRaisedText:{
       fontSize:styleConfig.fontTotalRaised,
       color:styleConfig.new_green,
       fontWeight:'900',
       fontFamily:styleConfig.LatoBlack,
    },
    btnWrap:{
      
      width:responsiveWidth(71.1111111111),
      height:responsiveHeight(6.75)
    },

    container: {
      backgroundColor:'white',
      paddingLeft:0,
      height:responsiveHeight(52),
      justifyContent: 'center',
      top:responsiveHeight(24)-responsiveHeight(7.8125),
    },

    page:{
      height:responsiveHeight(50),
      width:responsiveWidth(71),
      backgroundColor:'white',
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {
        height: 0,
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
      height:responsiveHeight(25),
      width:responsiveWidth(71),
      borderRadius:5,
      justifyContent:'flex-end',
     },

     cardTexwrap:{
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
      color:styleConfig.black,
      fontSize:styleConfig.causeTitle,
      fontWeight:'900',
      fontFamily:styleConfig.LatoBlack,
      height:responsiveHeight(3.4375),
      backgroundColor:'transparent',
      opacity:.85,
    },

    causeBrief:{
      width:responsiveWidth(71)-20,
      color:styleConfig.black,
      fontSize:styleConfig.causeDisc,
      fontWeight:'400',
      fontFamily:styleConfig.LatoRegular,
      opacity:.80,
      height:responsiveHeight(5),
    },
  
    barWrap:{
      justifyContent: 'flex-end',
      backgroundColor:'transparent',
    },

    wraptext:{
      justifyContent: 'flex-end',
      flexDirection:'row',
      top:responsiveHeight(0.3),
    },

    TextWaperforCuaseRaisedAmount:{
      justifyContent: 'space-between',
      flexDirection:'row',
      backgroundColor:'white',
      alignItems:'center',
      top:responsiveHeight(1.5),
    },

    wraptext2:{
      paddingTop:styleConfig.functionPadding,
      justifyContent: 'space-between',
      flexDirection:'column',
    },
    textMoneyraisedlableRemainingpercentage:{
      left:0,
      color:'grey',
      fontSize:styleConfig.textRaisedPersent,
      fontWeight:'800',
      fontFamily:styleConfig.LatoBlack,
    },
    textMoneyraisedlabel:{
      left:0,
      color:styleConfig.black,
      fontSize:styleConfig.lableCause,
      fontWeight:'900',
      fontFamily:styleConfig.LatoBold,
      opacity:.60,
    },
    textMoneyraised:{
      left:-2,
      color:'#000',
      fontSize:styleConfig.causeTotalrun,
      fontWeight:'800',
      fontFamily:styleConfig.LatoBlack,
      opacity:.80,
    },
    textMoneyraised2:{
      left:0,
      color:'#000',
      fontSize:styleConfig.causeTotalrun,
      fontWeight:'800',
      textAlign:'right',
      fontFamily:styleConfig.LatoBlack,
      opacity:.80,
    },
    textMoneyraised2Label:{
      left:0,
      color:styleConfig.black,
      fontSize:styleConfig.lableCause,
      fontWeight:'900',
      textAlign:'right',
      fontFamily:styleConfig.LatoBold,
      opacity:.60,
    },
    btnbegin2:{
      flex:1,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:styleConfig.light_sky_blue,
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {
        height: 2,
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
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor:"white",
      height:responsiveHeight(25),
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
    top:0,
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

 
