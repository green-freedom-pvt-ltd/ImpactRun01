      
   




'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  NativeModules,
  StyleSheet,
  Dimensions,
  View,
  Text,
  ListView,
  TouchableWithoutFeedback,
  TouchableWithNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import Icon3 from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
const TOUCHABLE_ELEMENTS = ['TouchableHighlight', 'TouchableOpacity', 'TouchableWithoutFeedback', 'TouchableWithNativeFeedback'];
import styleConfig from './styleConfig';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import ModalComponent from './downloadsharemeal/CampaignModal';

export default class Modal extends Component {
   render(){
        return(
          <ModalComponent
             style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
             isOpen={this.props.isDenied}
               >
                  <View style={styles.modelWrap}>
                    <View  style={styles.contentWrap}>
                    <View style={{width:responsiveWidth(88),height:responsiveHeight(10.78125),justifyContent: 'center',alignItems: 'center',top:-(responsiveHeight(10.78125)/2)}}>
                      <View style={styles.iconWrapmodel}>
                        <Icon3 style={{top:-3,justifyContent: 'center',alignItems: 'center',color:"white",fontSize:30,backgroundColor:'transparent'}} name={'md-warning'}></Icon3>
                      </View>
                    </View>
                    <View style={{top:-(responsiveHeight(10.78125)/2),justifyContent: 'center',alignItems: 'center',}}>
                      <View style={styles.titleWrap}>
                          <Text style={{textAlign:'center',color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,fontSize:responsiveFontSize(3.5)}}>Share location access</Text>
                      </View>
                    <View style={{justifyContent: 'center',alignItems: 'center',}}>
                      <View style={styles.discWrap}>
                      <Text style={{textAlign:'center',color:styleConfig.black,fontWeight:'800',fontFamily: styleConfig.FontFamily,fontSize:responsiveFontSize(2.1),opacity:.80}}>We need GPS location to track your walks/jogs. Please go to Location and click on > While Using the App </Text>
                      </View> 
                      <View style={styles.modelBtnWrap}>
                        <TouchableOpacity style={styles.modelbtnEndRun}onPress ={()=>this.navigateToIOSsetting()}><Text style={styles.btntext}>Allow</Text></TouchableOpacity>
                      </View>
                    </View>
                    </View>
                   </View>
                  </View>
            </ModalComponent>
          )
      }

}



const styles = StyleSheet.create({

 modelWrap :{
  width:responsiveWidth(88),
  backgroundColor:'white',
 },
 modelStyle:{
  justifyContent: 'center',
  alignItems: 'center',
 },
 contentWrap:{
   
 },
 iconWrapmodel:{
  height:responsiveHeight(10.78125),
  width:responsiveHeight(10.78125),
  borderRadius:responsiveHeight(10.78125)/2,
  backgroundColor:styleConfig.light_sky_blue,
  justifyContent: 'center',
  alignItems: 'center',
 },
 titleWrap:{
  height:responsiveHeight(5.3125),

 },
 discWrap:{
  height:responsiveHeight(9),
 }

})