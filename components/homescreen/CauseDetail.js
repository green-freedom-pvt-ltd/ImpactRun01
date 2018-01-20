
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
    Linking,
  } from 'react-native';
import commonStyles from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import styleConfig from '../styleConfig';
import Modal from '../downloadsharemeal/CampaignModal';
import Icon3 from 'react-native-vector-icons/Ionicons';
import NavBar from '../navBarComponent';
import LodingRunScreen from '../gpstracking/runlodingscreen'
var { RNLocation: Location } = require('NativeModules');
import ImageLoad from 'react-native-image-placeholder';
const CleverTap = require('clevertap-react-native');
 import { takeSnapshot } from "react-native-view-shot";
  import Share, {ShareSheet, Button} from 'react-native-share';
  import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

class CauseDetail extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
         isDenied:false,
         value: {
          format: "png",
          quality: 0.9,
          result: "base64",
          snapshotContentContainer: false,
        },
        }
        this.NavigateToRunScreen = this.NavigateToRunScreen.bind(this);
    }
    // Go_Back
    popRoute() {
         this.props.navigator.pop();
    }

    // Navigate to Run Screen
    NavigateToRunScreen(){
      console.log('cause',this.props.data);
      CleverTap.recordEvent('ON_CLICK_BEGIN_RUN',{
        'cause_index':this.props.cause_index,
        'cause_id':this.props.data.pk,

      });
      var me = this;
      var data = this.props.data;
      Location.getAuthorizationStatus(function(authorization) {
      if (authorization === "authorizedWhenInUse") {
      me.props.navigator.push({
         id:'runlodingscreen',
         passProps: {data: data,killRundata:null},
           navigationOptions: {
              gesturesEnabled: false,
            },
       })
      }else{
        if (authorization === "denied") {
          me.setState({
            isDenied:true,
          })                 
        }else{
          Location.requestWhenInUseAuthorization();
        }
      }
     })
    }



    snapshot(captureScreenShot){
    CleverTap.recordEvent('ON_CLICK_TELL_YOUR_FRIENDS');
    takeSnapshot(this.refs[captureScreenShot], this.state.value)
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
        CleverTap.recordEvent('ON_CLICK_WORKOUT_SHARE',{
          'distance': this.props.distance,
          'time_elapsed':this.props.time,
          'num_steps':this.props.noOfsteps,
          'client_run_id':this.props.client_run_id,
        })
      })
      .catch(error => (console.warn(error), this.setState({ error, res: null, previewSource: null })));
    }



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
    
    leftIconRender(){
      return(
         <TouchableOpacity style={{height:styleConfig.navBarHeight,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={this.popRoute.bind(this)} >
           <Icon style={{color:'black',fontSize:40,fontWeight:'600'}}name={'ios-close'}></Icon>
          </TouchableOpacity>
      )
     }

     DiscriptionImage(data){
      if(data.is_completed){
        return(
           <ImageLoad placeholderSource={require('../../images/cause_image_placeholder.jpg')} isShowActivity={true} placeholderStyle={styles.image} loadingStyle={{size: 'large', color: 'grey'}} source={{uri:data.cause_completed_description_image}} style={styles.image}>
          </ImageLoad>
        )
      }else{
        return(
          <ImageLoad placeholderSource={require('../../images/cause_image_placeholder.jpg')} isShowActivity={true} placeholderStyle={styles.image} loadingStyle={{size: 'large', color: 'grey'}} source={{uri:data.cause_image}} style={styles.image}>
            <View style={styles.overlaytext}>
              <Text style={styles.categorytext}>{data.cause_category}</Text>
            </View>
          </ImageLoad>
          
          )
      }
     }

     CauseDetailpageBtn(data){
      if (data.is_completed) {
        return(
          <TouchableOpacity style={styles.btnBeginRun}  onPress = {()=> this.snapshot('captureScreenShot')}>
              <Text style={styles.Btntext}>TELL YOUR FRIENDS</Text>
          </TouchableOpacity>
        )
      }else{
        return(
          <TouchableOpacity style={styles.btnBeginRun} onPress={() => this.NavigateToRunScreen()}>
            <Text style={styles.Btntext}>{'LET\'S GO'}</Text>
          </TouchableOpacity>
        )
      }
      
     }
    // Render_Screen
    render() {
      var data = this.props.data
        return (
              <View style={{position:'absolute',height:deviceHeight-114,width:deviceWidth,backgroundColor: '#fff'}}> 
                <NavBar title = {'Overview'} leftIcon = {this.leftIconRender()}/>
                  <View style={{height:deviceHeight-styleConfig.navBarHeight-20,width:deviceWidth}} >
                    <ScrollView ref='captureScreenShot'>
                      <View style={styles.container}>
                     {this.DiscriptionImage(data)}
                      <View style={styles.textwraper}>
                        <Text style={styles.causeTitle}>{data.cause_title}</Text>
                        <Text style={styles.slidesponser}>By {data.sponsors[0].sponsor_company} </Text>
                        <Text  style={styles.Disctext} >{data.cause_description}</Text>
                      </View>
                  </View>
                  </ScrollView>
                  {this.CauseDetailpageBtn(data)}
                </View>
                {this.modelViewdeniedLocationRequest()}
              </View>
        )
    }
}



/* ==============================
  Styles
  =============================== */
  var styles = StyleSheet.create({
  container:{
    top:1,
    backgroundColor:'white',
  },

  overlaytext:{
    position:"absolute",
    width:deviceWidth,
    height:30,
    backgroundColor:'transparent',
    bottom:0,
  },
  slidesponser:{
    paddingTop:5,
    paddingBottom:5,
    fontSize:styleConfig.ngoText+2,
    color:styleConfig.black_two,
    fontFamily:styleConfig.LatoLight,
  },
   backbtn:{
    paddingLeft:10,
    paddingTop:10,
    height:70,
    width:70,
    fontSize:30,
    backgroundColor:'transparent',
   },
  image:{
    height:deviceHeight/2-50,
  },
  causeTitle:{
    fontSize:styleConfig.causeTitle+2,
    fontWeight:'900',
    color:'black',
    fontFamily:styleConfig.LatoBlack,
    opacity:.80,
    backgroundColor:'white',
  },
  Disctext:{
    fontSize:styleConfig.causeDisc+2,
    marginBottom:100,
    color:styleConfig.black_two,
    top:10,
    fontFamily:styleConfig.LatoRegular,
    lineHeight:20,
  },
  bytext:{
    paddingBottom:10,
  },
  btnBeginRun:{
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom:0,
    width:deviceWidth,
    height:responsiveHeight(7.1875),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#00c1f2'
  },
  Btntext:{
     backgroundColor:'transparent',
     color:'white',
     fontSize:20,
     fontWeight:'600',
     fontFamily:styleConfig.LatoRegular,
  },
  closebtn:{
    left:10,
    height:100,
    width:100,
    shadowColor: '#000000',
      shadowOpacity: 0.6,
      shadowRadius: 3,
      shadowOffset: {
        height: 4,
      },
  },
  categorytext:{
    position:'absolute',
    padding:10,
    paddingBottom:20,
    backgroundColor:'transparent',
    fontWeight:'300',
    fontFamily:styleConfig.LatoLight,
    left:5,
    color:"white",
    fontWeight:'400',
    fontSize:styleConfig.causeDisc,
  },
  textwraper:{
    padding:10,
    paddingBottom:40,
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
export default CauseDetail;

