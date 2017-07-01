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
  TouchableOpacity,
  Keyboard
} = ReactNative;
import styleConfig from '../styleConfig';
import Login from '../login/LoginBtns';
import LodingView from '../LodingScreen';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import commonStyles from '../styles';
import Icon3 from 'react-native-vector-icons/Ionicons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import apis from '../apis';
var dismissKeyboard = require('dismissKeyboard');
 var moment = require('moment');
var ProfileForm = React.createClass({

    getInitialState: function(){
      return {
        loaded:false,
        user:this.props.user,
        showDatePicker:false,
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
    
    goBack:function(){
        this.props.navigator.pop({});
    },

    componentDidMount:function() {
      var user = this.props.user;
      var date = moment(user.Birth_day).format('MM/DD/YYYY');
     this.setState({
      name:user.first_name +" "+ user.last_name,
      first_name:"",
      last_name:"",
      email:user.email,
      number:JSON.stringify(user.phone_number),
      bday:"990",
      myweight:JSON.stringify(user.body_weight)+" "+"kg",
      body_weight:JSON.stringify(user.body_weight),
      gender:user.gender_user,
      date:date,
     }) 
    },

  

    putRequestUser:function(){
        var user_id = this.props.user.user_id;
        var auth_token = this.props.user.auth_token;
        var nameArr = this.state.name.split(/\s+/);
        this.state.first_name = nameArr.slice(0, -1).join(" ");
        this.state.last_name = nameArr.pop();
        var date = moment(this.state.date).format('MM/DD/YYYY');
        var number = parseInt(this.state.number);
        var weight = parseInt(this.state.body_weight);
        fetch(apis.userDataapi + user_id + "/", {
            method: "put",
            headers: {  
              'Authorization':"Bearer "+ auth_token,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
            "email":this.state.email,
            "phone_number":number,
            "birthday":date,
            "gender":this.state.gender,
            "first_name":this.state.first_name,
            "last_name":this.state.last_name,
            "body_weight":weight,
            })
          })
          .then((response) => response.json())
          .then((response) => { 
            console.log('submited',response);
            // let keys = ['UID234', 'UID345'];
            //   AsyncStorage.multiRemove(keys, (err) => {
            //   });
              var userdata = response;
              console.log("response")
              let UID234_object = {
                  body_weight:userdata.body_weight,
                  first_name: userdata.first_name,
                  user_id: userdata.user_id,
                  last_name: userdata.last_name,
                  gender_user: userdata.gender_user,
                  email: userdata.email,
                  phone_number: userdata.phone_number,
                  Birth_day: userdata.birthday,
                  social_thumb: userdata.social_thumb,
                  auth_token: userdata.auth_token,
                  total_amount: userdata.total_amount,
                  is_signup: userdata.sign_up,
                  total_distance: userdata.total_distance,
                  team_code: userdata.team_code,
              };
                    // first user, delta values
              let UID234_delta = {
                  body_weight:userdata.body_weight,
                  first_name: userdata.first_name,
                  user_id: userdata.user_id,
                  last_name: userdata.last_name,
                  gender_user: userdata.gender_user,
                  email: userdata.email,
                  phone_number: userdata.phone_number,
                  Birth_day: userdata.birthday,
                  social_thumb: userdata.social_thumb,
                  auth_token: userdata.auth_token,
                  total_amount: userdata.total_amount,
                  is_signup: userdata.sign_up,
                  total_distance: userdata.total_distance,
                  team_code: userdata.team_code,
              };


              let multi_set_pairs = [
                  ['UID234', JSON.stringify(UID234_object)],

              ]
              let multi_merge_pairs = [
                  ['UID234', JSON.stringify(UID234_delta)],

              ]

              AsyncStorage.multiSet(multi_set_pairs, (err) => {
                  AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
                      AsyncStorage.multiGet(['UID234'], (err, stores) => {
                          stores.map((result, i, store) => {
                              let key = store[i][0];
                              let val = store[i][1];
                              this.props.getUserData();
                              this.goBack();                                    
                          });
                      });
                  });
              });
          })    
          .catch((err) => {
            console.log('err',err);
          })
    },
    
    LoginView:function(){
      if(this.props.user && Object.keys(this.props.user).length > 0 ){
        this.setState({loaded:true});
      }else{
        return (
          <View style={{height:deviceHeight,width:deviceWidth,backgroundColor:"red"}}>
          <View style={commonStyles.Navbar}>
            <TouchableOpacity style={{left:0,position:'absolute',height:60,width:60,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon3 style={{color:'white',fontSize:30,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon3>
            </TouchableOpacity>
              <Text numberOfLines={1} style={commonStyles.menuTitle}>{'Run History'}</Text>
            <TouchableOpacity style={{right:10,position:'absolute',height:160,width:160,backgroundColor:'red',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Text>SAVE</Text>
            </TouchableOpacity>
          </View>
          <View style={{height:deviceHeight/2,width:deviceWidth,top:(deviceHeight/2)-200,}}>
            <Login getUserData={this.props.getUserData}/>
          </View>
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
    onBirthDateChange:function(){
      dismissKeyboard()
      this.setState({showDatePicker:true})
    },

    render: function() {
      var user = this.props.user;
      if (this.props.user != null) {
         var showDatePicker = this.state.showDatePicker ?
            <DatePickerIOS
                style={{position:"absolute",width:deviceWidth,right:0,bottom:0,backgroundColor:"white"}}
                date={new Date(this.props.user.birthday)} onChangeText={() => this.setState({showDatePicker:false})} onEndEditing={()=> this.setState({showDatePicker:false})} onDateChange={(date)=>this.setState({date:date.toLocaleDateString()})}
                mode="date"/> : <View />
        return (
          <View>
          <View style={commonStyles.Navbar}>
            <TouchableOpacity style={{left:0,position:'absolute',height:60,width:60,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon3 style={{color:'white',fontSize:30,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon3>
            </TouchableOpacity>
              <Text numberOfLines={1} style={commonStyles.menuTitle}>{'Run History'}</Text>
            <TouchableOpacity style={{right:0,position:'absolute',height:60,width:60,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.putRequestUser()} >
              <Text style={{color:'white'}}>SAVE</Text>
            </TouchableOpacity>
            </View>
          <ScrollView onPress={()=> this.setState({showDatePicker:false})} style={styles.container}>

            <View style={styles.FromWrap}>
             
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Name</Text> 
                <TextInput onFocus={() => this.setState({showDatePicker:false})} onChangeText={(name) => this.setState({name})} value={this.state.name}style={styles.userProfileText}></TextInput>         
              </View>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Email</Text>
                <TextInput  onFocus={() => this.setState({showDatePicker:false})}onChangeText={(email) => this.setState({email})}  keyboardType="email-address" value={this.state.email} style={styles.userProfileText}></TextInput>        
              </View>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Phone Number</Text> 
                <TextInput onFocus={() => this.setState({showDatePicker:false})} onChangeText={(number) => this.setState({number})}  maxLength= {10} keyboardType= 'numeric' value={this.state.number} style={styles.userProfileText}></TextInput> 
              </View>    
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Birthday</Text>
                <TextInput  onChangeText={() => this.setState({showDatePicker:false})}   onFocus={() => this.onBirthDateChange()} value={this.state.date} style={styles.userProfileText}></TextInput>
              </View>    
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Body weight</Text>
                <TextInput onFocus={() => this.setState({showDatePicker:false})} onChangeText={(body_weight) => this.setState({body_weight})} keyboardType= 'numeric' value={this.state.body_weight} style={styles.userProfileText}></TextInput>
              </View>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Gender</Text>
                <TextInput onFocus={() => this.setState({showDatePicker:false})}onChangeText={(gender) => this.setState({gender})} value={this.state.gender} style={styles.userProfileText}></TextInput>
                
              </View>
              <View style={styles.ProfileTextInput2}>
               {showDatePicker}
              </View>
            </View> 
             
          </ScrollView>
             <KeyboardSpacer/>
        </View>
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
    backgroundColor:'#f4f4f4',
    height:deviceHeight,
  },
  ProfileTextInput2:{
    width:deviceWidth,
    position:"absolute",
    bottom:0,
  },
  FromWrap:{
    borderRadius:5,
    height:deviceHeight-70,
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
    fontFamily:styleConfig.FontFamily,
  },
  userdata:{
    fontSize:15,
    padding:10,
    paddingLeft:0,
  },
  userProfileText:{
    padding:5,
    paddingLeft:0,
    height:40,
    fontWeight:'400',
    color:'#4a4a4a',
    fontFamily:styleConfig.FontFamily,
  },

});

module.exports = ProfileForm;