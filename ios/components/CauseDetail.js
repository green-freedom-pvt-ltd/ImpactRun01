
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
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var RunScreen = require('./Home.ios');

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
          id:'runscreen',
          navigator: this.props.navigator,
          passProps: {data: data}
       })
    }

    // Render_Screen
    render() {
      var data = this.props.data
        return (
            <View style={{backgroundColor: '#fff'}}>
               <View style={styles.Navbar}>
                  <TouchableOpacity onPress={this.popRoute.bind(this)} ><Icon style={{color:'white',fontSize:30,}}name={'md-arrow-back'}></Icon></TouchableOpacity>
                  <Text style={styles.menuTitle}>RunScreen</Text>
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
                          <Text style={styles.slidesponser}>by {data.pk} </Text>
                          <Text  style={styles.Disctext} >{data.cause_description}</Text>
                          <Text>{data.pk}</Text>
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
   backbtn:{
    paddingLeft:10,
    paddingTop:10,
    height:50,
    width:50,
    fontSize:30,
    backgroundColor:'transparent',
   },
  image:{
    height:deviceWidth-100,
  },
  colortext:{
    height:25,
    fontSize:20,
    fontWeight:'500',
    letterSpacing:1,
  },
  Disctext:{
   fontSize:15,
   letterSpacing:1,
   marginBottom:100,
     },
  bytext:{
    paddingBottom:10,
  },
  btnBeginRun:{
    position: 'absolute', 
    left: 0, 
    right: 0, 
    top:deviceHeight-50,
    width:deviceWidth,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#d667cd'
  },
  Btntext:{
     backgroundColor:'transparent',
     color:'white',
     fontWeight:'500',
     fontSize:20,
  },
  categorytext:{
    position:'absolute',
    bottom:-3,
    padding:10,
    backgroundColor:'transparent',
    color:'white',
    fontSize:16,
    left:5,
    fontWeight:'500',
  },
  textwraper:{
    padding:10,
  },
  Navbar:{
    paddingLeft:10,
    position:'relative',
    top:0,
    height:55,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
    backgroundColor:'#d667cd',
    borderBottomWidth:2,
    borderBottomColor:'#00b9ff',
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
});
export default CauseDetail;

