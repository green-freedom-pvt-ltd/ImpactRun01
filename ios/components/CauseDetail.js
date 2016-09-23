
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
  } from 'react-native';
import commonStyles from '../../components/styles';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var RunScreen = require('./home.ios');

class CauseDetail extends Component {

    // Go_Back
    popRoute() {
         this.props.navigator.pop();
    }

    // Navigate to Run Screen
    NavigateToRunScreen(){
      var data = this.props.data;
       this.props.navigator.push({
          title:'RunScreen',
          id:'runlodingscreen',
          navigator: this.props.navigator,
          passProps: {data: data}
       })
    }

    // Render_Screen
    render() {
      var data = this.props.data
        return (
              <View style={{position:'absolute',height:deviceHeight,width:deviceWidth,backgroundColor: '#fff'}}>  
                  <View style={commonStyles.Navbar}>
                    <TouchableOpacity style={{top:10,left:0,position:'absolute',height:50,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={this.popRoute.bind(this)} >
                     <Icon style={{color:'white',fontSize:40,fontWeight:'bold'}}name={'ios-close'}></Icon>
                    </TouchableOpacity>
                    <Text style={commonStyles.menuTitle}>Causedetail</Text>
                  </View>
                  <View style={{height:deviceHeight,width:deviceWidth}}>
                    <ScrollView>
                      <View style={styles.container}>
                      <Image source={{uri:data.cause_image}} style={styles.image}>
                       <View style={styles.overlaytext}>
                         <Text style={styles.categorytext}>{data.cause_category}</Text>
                       </View>
                      </Image>
                      <View style={styles.textwraper}>
                        <Text style={styles.colortext}>{data.cause_title}</Text>
                        <Text style={styles.slidesponser}>Sponsored By {data.sponsors[0].sponsor_company} </Text>
                        <Text  style={styles.Disctext} >{data.cause_description}</Text>
                      </View>
                  </View>
                  </ScrollView>
                  <TouchableOpacity style={styles.btnBeginRun} text={'BEGIN RUN'}onPress={() => this.NavigateToRunScreen()}>
                  <Text style={styles.Btntext}>BEGIN RUN</Text></TouchableOpacity>
                </View>
              </View>
        )
    }
}



/* ==============================
  Styles
  =============================== */
  var styles = StyleSheet.create({
  container:{
    backgroundColor:'white',
  },

  overlaytext:{
    position:"absolute",
    width:deviceWidth,
    height:30,
    backgroundColor:"rgba(51, 35, 80, 0.64)",
    bottom:0,
  },
  slidesponser:{
    paddingTop:5,
    paddingBottom:5,
    fontSize:15,
    color:'#ffcd4d',
    fontFamily: 'Montserrat-Regular'
  },
   backbtn:{
    paddingLeft:10,
    paddingTop:10,
    height:50,
    width:50,
    fontSize:30,
    backgroundColor:'transparent',
   },
  image:{
    height:deviceHeight/2-50,
  },
  colortext:{
    height:25,
    fontSize:20,
    fontWeight:'300',
    letterSpacing:1,
    fontFamily: 'Montserrat-Regular',
  },
  Disctext:{
    fontSize:15,
    letterSpacing:1,
    marginBottom:100,
    fontFamily: 'Montserrat-Regular',
  },
  bytext:{
    paddingBottom:10,
  },
  btnBeginRun:{
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom:55,
    width:deviceWidth,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ffcd4d'
  },
  Btntext:{
     backgroundColor:'transparent',
     color:'white',
     fontWeight:'500',
     fontSize:20,
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
    bottom:-3,
    padding:10,
    backgroundColor:'transparent',
    color:'white',
    fontSize:16,
    left:5,
    fontWeight:'300',
  },
  textwraper:{
    padding:10,
  },





});
export default CauseDetail;

