'use strict';
var React = require('react');
var ReactNative = require('react-native');

var {
  StyleSheet,
  Image,
  Text,
  View,
  AsyncStorage,
  TextInput,
  Dimensions,
  ScrollView,
  DatePickerIOS,
  TouchableOpacity
} = ReactNative;

import Login from '../../components/LoginBtns';
import LodingView from '../../components/LodingScreen';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var ProfileForm = React.createClass({
 
  
  getInitialState: function(){
    return {
      loaded:false,
    };
  },
   onDateChange:function(date) {
    this.setState({date: date});
  },

   componentWillMount: function(){
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
          stores.map((result, i, store) => {
              let key = store[i][0];
              let val = store[i][1];
              this.setState({
                user:JSON.parse(val),
                loaded:true,
               
              })
              
              console.log("UserDataProfile :" + key, val);
          });
         if(this.state.user) {
          this.setState({
            first_name:this.state.user.first_name,
            gender_user:this.state.user.gender_user,
            last_name:this.state.user.last_name,
            email:this.state.user.email,
            social_thumb:this.state.user.social_thumb,
            user_id:this.state.user.user_id,
            BirthDate:this.state.user.Birth_day,
            phone:this.state.user.phone,
          })
        }else{
          AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
          stores.map((result, i, store) => {
              let key = store[i][0];
              let val = store[i][1];
              this.setState({
                user:JSON.parse(val),
              })
              console.log("UserDataProfile :" + key, val);
          });
        })
        }
      });
     },
     LoginView:function(){
     return (
      <View style={{height:deviceHeight/2,width:deviceWidth,top:deviceHeight/2-50}}>
      <Login/>
      </View>
      )
     },
     LodingView:function(){
      return(
        <LodingView/>
        )
     },
       NavigatetoLoginScreen:function(){
       this.props.navigator.push({
        title: 'Gps',
        id:'login',
        navigator: this.props.navigator,
       });
      },
      render: function() {
        var _this = this;
        var user = this.state.user;
        var a = JSON.stringify(user);
        console.log('UserDataProfile2',a);
        if (this.state.user != null) {
          return (

        <View style={styles.container}>
        <View style={styles.FromWrap}>
          <View style={styles.ProfileTextInput}>
           <Text style={styles.ProfileTitle}>NAME</Text> 
           <Text style={styles.userPoofileText}>{this.state.first_name} {this.state.last_name}</Text>         
          </View>
          <View style={styles.ProfileTextInput}>
           <Text style={styles.ProfileTitle}>EMAIL</Text>
           <Text style={styles.userPoofileText}>{this.state.email}</Text>        
          </View>
           <View style={styles.ProfileTextInput}>
           <Text style={styles.ProfileTitle}>BIRTH DATE</Text>
           <Text style={styles.userPoofileText}>{this.state.BirthDate}</Text>
          </View>
          <View style={styles.ProfileTextInput}>
           <Text style={styles.ProfileTitle}>PHONE NUMBER</Text> 
           <Text style={styles.userPoofileText}>{this.state.phone}</Text> 
          </View>        
          <View style={styles.ProfileTextInput}>
           <Text style={styles.ProfileTitle}>GENDER</Text>
           <Text style={styles.userPoofileText}>{this.state.gender_user}</Text>
          </View>
        </View> 
        </View>

        );
         
        }else{
          if (!this.state.loaded) {
             return this.LodingView();
          }else{
             return this.LoginView();
          }
          

        }
      }
});


var styles = StyleSheet.create({
  container:{
    position:'absolute',
    height:deviceHeight-75,
    width:deviceWidth,
    top:65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FromWrap:{
   position:'absolute',
   top:70,
   left:5,
   borderRadius:5,
   justifyContent: 'center',
   alignItems: 'center',
   width:deviceWidth-10,
   height:deviceHeight-260,
   backgroundColor:'white',
  },
  ProfileTextInput:{
    width:deviceWidth-30,
    borderBottomWidth:2,
    borderBottomColor:'#673ab7',
  },
  ProfileTitle:{
   padding:10,
   paddingLeft:0,
   paddingBottom:0,
   color:'#673ab7',
   fontWeight:'600',
   fontSize:16,
  },
  userdata:{
  fontSize:15,
  padding:10,
  paddingLeft:0,
  },
  userPoofileText:{
   padding:5,
   paddingLeft:0,
   fontSize:16,
   fontWeight:'400',
   color:'black'
  },

});

module.exports = ProfileForm;