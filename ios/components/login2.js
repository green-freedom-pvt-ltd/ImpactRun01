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
import { AnimatedCircularProgress } from 'react-native-circular-progress';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;


var UserProfile = React.createClass({
  getInitialState: function(){
    return {
    };
  },



  componentDidMount: function(){
   var provider = this.props.provider;
   console.log('provider',provider);
   this.refs.circularProgress1.performLinearAnimation(0, 1000);
   this.refs.circularProgress2.performLinearAnimation(0, 1000);
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
          stores.map((result, i, store) => {
              let key = store[i][0];
              let val = store[i][1];
              this.setState({
                user:JSON.parse(val),
              })
            if (this.state.user === null) {
            AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
            stores.map((result, i, store) => {
              let key = store[i][0];
              let val = store[i][1];
              this.setState({
                user:JSON.parse(val),
              })
             })
             })
            
             if (this.state.user) {
                 
                 console.log('intervalCleared');
              };
            }else{
             

            }
              console.log("UserDataProfile :" + key, val);
          });
          if (this.state.user != null) { this.setState({
            first_name:this.state.user.first_name,
            gender_user:this.state.user.gender_user,
            last_name:this.state.user.last_name,
            email:this.state.user.email,
            social_thumb:this.state.user.social_thumb,
            user_id:this.state.user.user_id,
            total_amount:this.state.user.total_amount.total_amount,
            total_distance:this.state.user.total_distance.total_distance,
          })}
      });
  },
   
   featchTotalDistanceandRupees:function(){
    
   },
   social_thumb:function(){
    if (this.state.user != null) {
      return( 
      <TouchableHighlight onPress={() => VibrationIOS.vibrate()}>
      <Image  onPress={() => VibrationIOS.vibrate()} style={styles.UserImage} source={{uri:this.state.user.social_thumb}}></Image>
      </TouchableHighlight>
      ) 
    };
    return(
      <View>
      <Image style={styles.UserImage} source={require('../../images/profile_placeholder.jpg')}></Image>

      </View>
      )
   },
   fullname:function(){
    
       if (this.state.user != null) {
      return( 
      <View style={{flexDirection:'row'}}>
        <Text style={styles.profilename}>{this.state.first_name}</Text>
        <Text style={styles.profilename}>{this.state.last_name}</Text>
      </View>
      
      ) 
    };
    return(
      <Text>Your name</Text>
      )
 
   },

  render: function() {
    var _this = this;
    var user = this.state.user;
    // var a = JSON.stringify(user);
    console.log('UserDataProfile2',user);
    return (
      <View style={styles.loginContainer}>
      <View style={styles.userContentwrap}>
       <View style={{width:deviceWidth/3-20}}> 
       <View style={{top:20,right:20,height:50,width:deviceWidth/3-20,position:'absolute',justifyContent: 'center',alignItems: 'center',}}>
       <Text style={styles.totalcontentText}>{parseFloat(this.state.total_distance).toFixed(1)} </Text>
       <Text style={styles.totalcontentTextSec}>Total km</Text>
       </View>
       <AnimatedCircularProgress
              style={{shadowColor: '#000000',shadowOpacity: 1,shadowRadius: 4,shadowOffset: {height:1,},top:10,right:20,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}
              ref='circularProgress1'
              size={70}
              width={3}
              fill={parseFloat(this.state.total_distance).toFixed(1)}
              prefill={100}
              tintColor="#00e0ff"
              backgroundColor="rgba(247, 243, 243, 0.26)">                   
            </AnimatedCircularProgress>
        </View>
        <View style={styles.userimagwrap}>
       <View style={styles.UserImage}>{this.social_thumb()}</View>
       </View>
      <View style={{width:deviceWidth/3-20}}> 
       <View style={{top:20,left:20,height:50,width:deviceWidth/3-20,position:'absolute',justifyContent: 'center',alignItems: 'center',}}>
        <Text style={styles.totalcontentText}>{parseFloat(this.state.total_amount).toFixed(0)}</Text>
        <Text style={styles.totalcontentTextSec}>Total Rs</Text>
       </View>
        <AnimatedCircularProgress
              style={{shadowColor: '#000000',shadowOpacity: 1,shadowRadius: 4,shadowOffset: {height:1,},top:10,left:20,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}
              ref='circularProgress2'
              size={70}
              width={3}
              fill={parseFloat(this.state.total_distance).toFixed(1)}
              prefill={100}
              tintColor="#00e0ff"
              backgroundColor="rgba(247, 243, 243, 0.26)">                   
        </AnimatedCircularProgress>
      </View>
      </View>
      <View style={styles.NameWraper}>
      {this.fullname()}
      </View>
      </View>
    );
  }
});


var styles = StyleSheet.create({
  loginContainer: {
    marginTop: 150,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBump: {
    marginBottom: 15,
  },
  UserImage:{
   height:75,
   width:75,
   borderRadius:35.5,

  },
  userimagwrap:{
   height:85,
   width:85,
   borderWidth:5,
   borderColor:'rgba(247, 243, 243, 0.48)',
   borderRadius:42.5,
    shadowColor: '#000000',
      shadowOpacity: 1,
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
    color:'white',
    fontSize:20,
    fontWeight:'700',
  },
  totalcontentText:{
    left:0,
    fontSize:15,
    fontWeight:'900',
    color:'white',
  },
  totalcontentTextSec:{
    fontSize:8,
    fontWeight:'900',
    color:'white',
  },
});

module.exports = UserProfile;