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

import Login from '../../components/loginBtns';
import LodingView from '../../components/lodingScreen';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import PTRView from 'react-native-pull-to-refresh';
var ProfileForm = React.createClass({

    getInitialState: function(){
      return {
        loaded:false,
        user:this.props.user,
      };
    },
    _refresh: function() {
      return new Promise((resolve) => {
        setTimeout(()=>{resolve()}, 2000)
      });
    },
    onDateChange:function(date) {
      this.setState({date: date});
    },

    LoginView:function(){
      if(this.props.user && Object.keys(this.props.user).length > 0 ){
        this.setState({loaded:true});
      }else{
        return (
          <View style={{height:deviceHeight/2,width:deviceWidth,top:(deviceHeight/2)-200,}}>
            <Login getUserData={this.props.getUserData}/>
          </View>
        ) 
      }
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
      var user = this.props.user;
      if (this.props.user != null) {
        return (
          <ScrollView style={styles.container}>
            <View style={styles.FromWrap}>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Name</Text> 
                <Text style={styles.userProfileText}>{user.first_name} {user.last_name}</Text>         
              </View>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Email</Text>
                <Text style={styles.userProfileText}>{user.email}</Text>        
              </View>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Phone Number</Text> 
                <Text style={styles.userProfileText}>{user.phone}</Text> 
              </View>    
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Birthday</Text>
                <Text style={styles.userProfileText}>{user.BirthDate}</Text>
              </View>    
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Gender</Text>
                <Text style={styles.userProfileText}>{user.gender_user}</Text>
              </View>
            </View> 
          </ScrollView>
        );
      }else{
        if (this.state.loaded) {
          return this.LodingView();
        }else{
          return this.LoginView();
        }
      }
    }

});


var styles = StyleSheet.create({
  container:{
    top:10,
    backgroundColor:'#f4f4f4',
  },
  FromWrap:{
    left:5,
    borderRadius:5,
    flex:1,
    marginBottom:70,
    backgroundColor:'#f4f4f4',
  },
  ProfileTextInput:{
    width:deviceWidth-30,
    borderBottomWidth:1,
    padding:5,
    borderBottomColor:'rgba(29, 29, 38, 0.10)',
  },
  ProfileTitle:{
    padding:10,
    paddingLeft:0,
    paddingBottom:0,
    color:'rgba(29, 29, 38, 0.52)',
    fontWeight:'400',
    fontSize:12,
    fontFamily: 'Montserrat-Regular',
  },
  userdata:{
    fontSize:15,
    padding:10,
    paddingLeft:0,
  },
  userProfileText:{
    padding:5,
    paddingLeft:0,
    fontSize:13,
    fontWeight:'400',
    color:'#4a4a4a',
    fontFamily: 'Montserrat-Regular',
  },

});

module.exports = ProfileForm;