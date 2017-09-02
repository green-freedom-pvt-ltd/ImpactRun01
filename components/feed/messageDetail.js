
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
import Share, {ShareSheet, Button} from 'react-native-share';
 import { takeSnapshot } from "react-native-view-shot";

class FeedDetail extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
         isDenied:false,
          previewSource: '',
          error: null,
          res: null,
          value: {
            format: "png",
            quality: 0.9,
            result: "base64",
            snapshotContentContainer: false,
          },
        }
    }


    snapshot(captureScreenShot){
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
      })
      .catch(error => (console.warn(error), this.setState({ error, res: null, previewSource: null })));
    }
   

    // Render_Screen
    render() {
      var data = this.props.data
        return (
              <View style={{position:'absolute',height:deviceHeight,width:deviceWidth,backgroundColor: '#fff'}}> 
                  <View style={{height:deviceHeight,width:deviceWidth}}>
                    <ScrollView ref={'captureScreenShot'}>
                      <View style={styles.container}>
                     <Image source={{uri:data.message_image}} style={styles.image}>
                     </Image>
                      <View style={styles.textwraper}>
                      <View style={{borderLeftWidth:7,borderColor:'#4a4a4a',paddingLeft:10,}}>
                        <Text style={styles.causeTitle}>{data.message_title}</Text>
                      </View>
                        <Text  style={styles.Disctext} >{data.message_description}</Text>
                      </View>
                  </View>
                  </ScrollView>
                  <TouchableOpacity onPress={()=> this.snapshot('captureScreenShot')}style={styles.btnBeginRun} >
                      <Text style={styles.Btntext}>SHARE WITH FRIENDS</Text>
                  </TouchableOpacity>
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
    color:'#4a4a4a',
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
    bottom:64,
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
export default FeedDetail;

