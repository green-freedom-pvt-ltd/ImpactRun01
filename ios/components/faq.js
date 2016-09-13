
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
  import FaqData from './faqData';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Faq extends Component {

		render() {
		return (
          <View>
            <View style={styles.Navbar}>
              <Text style={styles.menuTitle}>Faqs</Text>
            </View>
			      <FaqData/>
          </View>
					);
	    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    height:deviceHeight,
    width:deviceWidth,
    bottom:-45,
    marginTop:-45,
  },
  thumb: {
    backgroundColor: '#5bb75b',
    marginBottom: 5,
    elevation: 1
  },
  img: {
    height: 300
  },
  txt: {
    color:'white',
    margin: 10,
    fontSize: 16,
    textAlign: 'left'
  },
  txtSec:{
   padding:10,
   fontSize:15
  },
  FaqSubmitWrap:{
  paddingLeft:10,
  height:55,
  width:deviceWidth,
  flexDirection: 'row',
  justifyContent:'flex-start',
  alignItems:'center',
  backgroundColor:'#673ab7',
  borderBottomWidth:2,
  borderBottomColor:'#673ab7',
},
 Navbar:{
  position:'relative',
  height:55,
  width:deviceWidth,
  flexDirection: 'row',
  justifyContent:'flex-start',
  alignItems:'center',
  backgroundColor:'#e03ed2',
  borderBottomWidth:2,
  borderBottomColor:'#00b9ff',
},
 Navbar2:{
  position:'relative',
  height:55,
  width:deviceWidth,
  flexDirection: 'row',
  justifyContent:'flex-start',
  alignItems:'center',
  backgroundColor:'#e03ed2',
  borderBottomWidth:2,
  borderBottomColor:'#00b9ff',
},
  menuTitle:{
    marginLeft:30,
    color:'white',
    fontSize:20,
  },
  textEdit: {
    marginLeft:-5,
    height:48, 
    borderColor: '#673ab7', 
    backgroundColor: 'white',
    borderWidth:5 ,
    borderRadius:8,
    width:deviceWidth-100,
    color:'black',
    padding:10,
    top:4,
  },
  submitFaqbtn:{
   height:42, 
   width:85,
   right:-4,
   borderRadius:8,
   justifyContent:'center',
   alignItems:'center',
   backgroundColor:'#e03ed2', 
  }
});
 export default Faq;