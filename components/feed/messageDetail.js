
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
    AlertIOS
  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class CauseDetail extends Component {

      // Go_Back
      popRoute() {
           this.props.navigator.pop();
      }

      // Navigate to Run Screen
      

      // Render_Screen
      render() {
        var data = this.props.rowData;
        return (
          <View style={{position:'absolute',height:deviceHeight,width:deviceWidth,backgroundColor: '#fff'}}>  
            <View style={styles.Navbar}>
              <View style={{top:10,left:0,position:'absolute',height:50,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}}> 
                <TouchableOpacity onPress={this.popRoute.bind(this)} style={{justifyContent: 'center',alignItems: 'center', height:70,width:70,}}><Icon style={{color:'white',fontSize:40,fontWeight:'bold'}}name={'ios-close'}></Icon></TouchableOpacity>
              </View>
              <Text style={styles.menuTitle}>Feed</Text>
            </View>
            <View>
            <Image style={{width:deviceWidth, height:deviceHeight/2}} source={{uri:data.message_image}}></Image>
            <Text>{data.message_title}</Text>
            <Text>{data.message_description}</Text>
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


 Navbar:{
  position:'relative',
  height:55,
  paddingTop:10,
  width:deviceWidth,
  flexDirection: 'row',
  justifyContent:'center',
  alignItems:'center',
  backgroundColor:'#00b9ff',

},

  menuTitle:{
    fontWeight:'600',
    color:'white',
    fontSize:20,
  },

});
export default CauseDetail;

