
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

class CauseCard extends Component {
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
              <View style={{paddingLeft:15,flex:-1,backgroundColor:'rgba(255, 255, 255, 0.75)',top:-30,height:30,justifyContent:'center'}}>
                  <Text style={{fontWeight:'400', fontSize:styleConfig.causeDisc-2,  color:styleConfig.greyish_brown_two, fontFamily:styleConfig.FontFamily,}}>
                    {cause.cause_category}
                  </Text>
              </View>
            </View>
            )
        }
      }


      functionForIphone4Brief(cause){
      if (Dimensions.get('window').height === 667) {
      return(
        <Text  numberOfLines={3} style={styles.causeBrief}>{cause.cause_brief}</Text>
        )
      }else if(Dimensions.get('window').height === 568){
      
          return(
          <Text  numberOfLines={3} style={styles.causeBrief}>{cause.cause_brief}</Text>
          )
    
      }else if(Dimensions.get('window').height > 667){
          return(
          <Text  numberOfLines={3} style={styles.causeBrief}>{cause.cause_brief}</Text>
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





    // RENDER_SCREEN
    render (){

        
        var cause = this.props.item
        // var money = JSON.stringify(parseFloat(parseFloat(this.state.album[route.key][0]).toFixed(0)/parseFloat(this.state.my_rate).toFixed(0)).toFixed(0));
        
        // var Moneyfinalvalue = (Math.round(JSON.parse(money)* 100)/100).toLocaleString(); 
       
        //This was length copied pasted @Akash avoid such copy pastes dude
      
        
           
        if (cause.is_completed != true) {
        return (
          
          <View onLayout={(event) => this.measureView(event)} style={styles.page}  >        
           <TouchableWithoutFeedback  accessible={false} onPress={()=>this.navigateToCauseDetail(cause,this.state.album[route.key][9])} >
            <View  style={styles.album}>
              {this.showImage(cause)}
              <View style={{flex:1,top:-30,justifyContent:'center',backgroundColor:"transparent", paddingTop:30}}>
              <View style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'transparent',paddingBottom:styleConfig.PaddingCard}}>
                <View style={{width:deviceWidth-125}}>
                  <Text numberOfLines={1} style={{color:styleConfig.warm_grey_three,fontFamily:styleConfig.FontFamily,fontSize:styleConfig.ngoText,fontWeight:'400'}}>With {cause.partners[0].partner_ngo} & {cause.sponsors[0].sponsor_company}</Text>      
                </View>
              </View>
              <View style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'transparent',paddingBottom:styleConfig.PaddingCard}}>
                  {this.functionForIphone4Brief(cause)}
              </View>
              <View style={styles.barWrap}>
                  <View style={{width:deviceWidth-125}}>
                    <View style = {styles.wraptext}>
                      <Text style = {styles.textMoneyraisedlableRemainingpercentage}>{parseFloat((cause.amount_raised/cause.amount)*100).toFixed(0)}%</Text>
                    </View>
                    <ProgressBar unfilledColor={'black'} height={styleConfig.barHeight} width={deviceWidth-125} progress={cause.amount_raised/cause.amount}/>
                    <View style = {styles.TextWaperforCuaseRaisedAmount}>
                      <View style = {styles.wraptext2}>
                        <Text style = {styles.textMoneyraisedlabel}> WALK & RUNS </Text>
                      </View>
                      <View style = {styles.wraptext2}>
                        <Text style = {styles.textMoneyraised2Label}> GOAL </Text>
                      </View>
                    </View>
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
       
    };
   

     // RENDER_PAGE

    




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
      height:((deviceheight-120)/100)*13,
      width:deviceWidth,
      justifyContent: 'center',
      alignItems: 'center',
    },
    TotalRaisedTextWrap:{
       height:((deviceheight-120)/100)*15,
       width:deviceWidth,
       backgroundColor:'transparent',
       justifyContent:'center',
       alignItems:'center'
    },
    totaltextlable:{
       flex:1,
       justifyContent:'center',
       textAlign:'center',
       fontSize:styleConfig.FontSize4,
       color:'grey',
       fontWeight:'600',


    },
    TotalRaisedText:{
       fontSize:styleConfig.fontTotalRaised,
       color:styleConfig.new_green,
       fontWeight:'800',
       fontFamily:styleConfig.FontFamily,
    },
    btnWrap:{
      flex:1,
      width:deviceWidth-100,
      paddingBottom:((deviceheight-120)/100)*5,
    },

    container: {
      backgroundColor:'white',
      padding:((deviceheight-120)/100)*3,
      paddingLeft:0,
      height:((deviceheight-120)/100)*77,
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
      fontSize:styleConfig.causeTitle,
      fontWeight:'600',
      fontFamily:styleConfig.FontFamily,
      paddingBottom:styleConfig.PaddingCard,
    },

    causeBrief:{
      width:deviceWidth-125,
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.causeDisc,
      fontWeight:'400',
      fontFamily:styleConfig.FontFamily3,
    },
  
    barWrap:{
      justifyContent: 'flex-start',
      backgroundColor:'white',
      alignItems: 'center',
    },

    wraptext:{
      justifyContent: 'flex-end',
      flexDirection:'row',
    },

    TextWaperforCuaseRaisedAmount:{
      justifyContent: 'space-between',
      flexDirection:'row',
      backgroundColor:'white',
      alignItems:'center',
      paddingTop:styleConfig.PaddingCard,
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
      fontWeight:'400',
      fontFamily:styleConfig.FontFamily,
      paddingBottom:styleConfig.PaddingCard,
    },
    textMoneyraisedlabel:{
      left:0,
      color:'grey',
      fontSize:styleConfig.lableCause,
      fontWeight:'400',
      fontFamily:styleConfig.FontFamily,
    },
    textMoneyraised:{
      left:-2,
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.causeTotalrun,
      fontWeight:'400',
      fontFamily:styleConfig.FontFamily,
    },
    textMoneyraised2:{
      left:0,
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.causeTotalrun,
      fontWeight:'400',
      textAlign:'right',
      fontFamily:styleConfig.FontFamily,
    },
    textMoneyraised2Label:{
      left:0,
      color:'grey',
      fontSize:styleConfig.lableCause,
      fontWeight:'600',
      textAlign:'right',
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


  export default CauseCard;


