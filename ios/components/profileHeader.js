'use strict';
var React = require('react');
var ReactNative = require('react-native');

var {
  StyleSheet,
  Image,
  Text,
  View,
  AsyncStorage,
  Dimensions,
   VibrationIOS,
   TouchableHighlight
} = ReactNative;


var FB_PHOTO_WIDTH = 200;
import styleConfig from '../../components/styleConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
var RupeeImage = 'data:image/png;base64,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';
var UserProfile = React.createClass({
    getInitialState: function(){
      return {
        user:null,
        Circlefill:0,
       
      };
    },
    componentWillMount:function() {
   
    },
    componentDidMount:function() {
      console.log('imarendered');
    },
 
    social_thumb:function(){
      if (this.props.user.first_name != '') {
        return( 
          <Image  onPress={() => VibrationIOS.vibrate()} style={styles.UserImage} source={{uri:this.props.user.social_thumb}}></Image>
        ) 
      };
      return(
        <View>
          <Image style={styles.UserImage} source={require('../../images/profile_placeholder.jpg')}></Image>
        </View>
      )
    },
    
    fullname:function(){
      if (this.props.user != null) {
        return( 
        <View>
          <Text style={styles.profilename}>{this.props.user.first_name} {this.props.user.last_name}</Text>
        </View>    
        ) 
      };
      return(
        <Text></Text>
      )
    },
    TotalAmount:function(){
      if (this.props.userTotalAmount != null) {
        console.log('myrupees',this.props.userTotalAmount);
        return(
           <Text style={styles.totalcontentText}>{parseFloat(this.props.userTotalAmount).toFixed(0)}</Text>
          )
      }else{
        console.log('myrupees',this.props.userTotalAmount);
        return(
            <Text style={styles.totalcontentText}>0</Text>
          )
      }
    },

    TotalRuns:function(){
      if (this.props.RunCount != null) {
        return(
          <Text style={styles.totalcontentText}>{this.props.RunCount}</Text>
        )
      }else{
        console.log('myruns',this.props.RunCount);
        return(
            <Text style={styles.totalcontentText}>0</Text>
        )
      }
    },

    render: function() {
      if (this.props.user != null) {
        return (
          <View style={styles.loginContainer}>
            <View style={styles.userContentwrap}>
              <View style={{width:deviceWidth/3-20}}> 
              <View style={{top:20,right:20,height:50,width:deviceWidth/3-20,position:'absolute',justifyContent: 'center',alignItems: 'center',}}>
                <Text style={styles.totalcontentTextSec}>Runs</Text>
                <Text style={styles.totalcontentText}>{this.TotalRuns()}</Text>
              </View>
              <AnimatedCircularProgress
                style={{top:10,right:20,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}
                ref='circularProgress1'
                size={70}
                width={2}
                fill={100}
                prefill={0}
                tintColor="#00b9ff"
                backgroundColor="#fafafa"
              >                   
              </AnimatedCircularProgress>
              </View>
              <View style={styles.userimagwrap}>
                <View style={styles.UserImage}>{this.social_thumb()}</View>
              </View>
              <View style={{width:deviceWidth/3-20}}> 
                <View style={{top:20,left:20,height:50,width:deviceWidth/3-20,position:'absolute',justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={styles.totalcontentTextSec}>Rupees</Text>
                  <Text style={styles.totalcontentText}>{this.TotalAmount()}</Text>
                </View>
                <AnimatedCircularProgress
                  style={{top:10,left:20,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}
                  ref='circularProgress2'
                  size={70}
                  width={2}
                  fill={100}
                  prefill={0}
                  tintColor="#00b9ff"
                  backgroundColor="#fafafa">                   
                </AnimatedCircularProgress>
              </View>
            </View>
            <View style={styles.NameWraper}>
            {this.fullname()}
            </View>
          </View>
        );
      };   
    }
});


var styles = StyleSheet.create({
  loginContainer: {
    marginTop: 150,
    paddingTop:10,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBump: {
    marginBottom: 15,
  },
  UserImage:{
    height:80,
    width:80,
    borderRadius:40,
  },
  userimagwrap:{
    justifyContent: 'center',
    alignItems: 'center',
    height:80,
    width:80,
    borderColor:'rgba(247, 243, 243, 0.48)',
    borderRadius:40,
    shadowColor: '#000000',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      shadowOffset: {
        height:1,
      },
    top:10,
  },
  userContentwrap:{
    width:deviceWidth,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  NameWraper:{
    top:20,
    flexDirection: 'row',
    justifyContent:'center',
  },
  profilename:{
    marginRight:5,
    color:styleConfig.greyish_brown_two,
    fontSize:18,
    fontWeight:'600',
    fontFamily:styleConfig.FontFamily,
  },
  totalcontentText:{
    left:0,
    fontSize:16,
    fontWeight:'500',
    color:styleConfig.greyish_brown_two,
    fontFamily:styleConfig.FontFamily,
  },
  totalcontentTextSec:{
    fontSize:12,
    fontWeight:'500',
    color:styleConfig.greyish_brown_two,
    fontFamily:styleConfig.FontFamily,
  },
});

module.exports = UserProfile;