
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
var { RNLocation: Location } = require('NativeModules');

class CauseDetail extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
         isDenied:false,
        }
    }
    // Go_Back
    popRoute() {
         this.props.navigator.pop();
    }

    // Navigate to Run Screen
    NavigateToRunScreen(){
      var me = this;
      var data = this.props.data;
      Location.getAuthorizationStatus(function(authorization) {
      if (authorization === "authorizedAlways") {
       me.props.navigator.push({
          title:'RunScreen',
          id:'runlodingscreen',
          navigator: me.props.navigator,
          passProps: {data: data}
       })
      }else{
        if (authorization === "denied") {
          me.setState({
            isDenied:true,
          })                 
        }else{
          Location.requestAlwaysAuthorization();
        }
      }
     })
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
           <Icon style={{color:'white',fontSize:40,fontWeight:'600'}}name={'ios-close'}></Icon>
          </TouchableOpacity>
      )
     }
    // Render_Screen
    render() {
      var data = this.props.data
        return (
              <View style={{position:'absolute',height:deviceHeight,width:deviceWidth,backgroundColor: '#fff'}}> 
                  <NavBar title = {'OVERVIEW'} leftIcon = {this.leftIconRender()}/>
                  <View style={{height:deviceHeight,width:deviceWidth}}>
                    <ScrollView>
                      <View style={styles.container}>
                      <Image source={{uri:data.cause_image}} style={styles.image}>
                       <View style={styles.overlaytext}>
                         <Text style={styles.categorytext}>{data.cause_category}</Text>
                       </View>
                      </Image>
                      <View style={styles.textwraper}>
                        <Text style={styles.causeTitle}>{data.cause_title}</Text>
                        <Text style={styles.slidesponser}>By {data.sponsors[0].sponsor_company} </Text>
                        <Text  style={styles.Disctext} >{data.cause_description}</Text>
                      </View>
                  </View>
                  </ScrollView>
                  <TouchableOpacity style={styles.btnBeginRun} text={'BEGIN RUN'}onPress={() => this.NavigateToRunScreen()}>
                  <Text style={styles.Btntext}>BEGIN RUN</Text></TouchableOpacity>
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
    backgroundColor:'rgba(255, 255, 255, 0.75)',
    bottom:0,
  },
  slidesponser:{
    paddingTop:0,
    paddingBottom:5,
    fontSize:12,
    color:styleConfig.black_two,
    fontFamily:styleConfig.FontFamily,
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
    height:25,
    fontSize:20,
    fontWeight:'400',
    letterSpacing:1,
    color:styleConfig.greyish_brown_two,
    fontFamily:styleConfig.FontFamily,
  },
  Disctext:{
    fontSize:14,
    letterSpacing:0.5,
    marginBottom:100,
    color:styleConfig.black_two,
    top:10,
    fontFamily:styleConfig.FontFamily,
  },
  bytext:{
    paddingBottom:10,
  },
  btnBeginRun:{
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom:styleConfig.navBarHeight,
    width:deviceWidth,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:styleConfig.pale_magenta
  },
  Btntext:{
     backgroundColor:'transparent',
     color:'white',
     fontSize:20,
     fontFamily:styleConfig.FontFamily,
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
    fontFamily:styleConfig.FontFamily,
    left:5,
    color:styleConfig.greyish_brown_two,
    fontWeight:'400',
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

