'use strict';
var React = require('react');
var ReactNative = require('react-native');

var {
  StyleSheet,
  Image,
  Text,
  View,
  AsyncStorage,
   VibrationIOS,
   TouchableHighlight
} = ReactNative;


var FB_PHOTO_WIDTH = 200;

var UserProfile = React.createClass({
  getInitialState: function(){
    return {
    };
  },

  
  componentDidMount: function(){
    
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
          stores.map((result, i, store) => {
              let key = store[i][0];
              let val = store[i][1];
              this.setState({
                user:JSON.parse(val),

              })
              
              console.log("UserDataProfile :" + key, val);
          });
          if (this.state.user != null) { this.setState({
            first_name:this.state.user.first_name,
            gender_user:this.state.user.gender_user,
            last_name:this.state.user.last_name,
            email:this.state.user.email,
            social_thumb:this.state.user.social_thumb,
            user_id:this.state.user.user_id,
          })}
      });
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


  render: function() {
    var _this = this;
    var user = this.state.user;
    // var a = JSON.stringify(user);
   console.log('UserDataProfile2',user);
    return (
      <View style={styles.loginContainer}>
      <View style={styles.userimagwrap}>
      <View style={styles.UserImage}>{this.social_thumb()}</View>
      </View>
      <View style={styles.NameWraper}>
      <Text style={styles.profilename}>{this.state.first_name}</Text>
      <Text style={styles.profilename}>{this.state.last_name}</Text>
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
   height:80,
   width:80,
   borderRadius:40,

  },
  userimagwrap:{
   height:80,
   width:80,
   borderRadius:40,
    shadowColor: '#000000',
      shadowOpacity: 1,
      shadowRadius: 4,
      shadowOffset: {
        height:1,
      },
      top:10,
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
});

module.exports = UserProfile;