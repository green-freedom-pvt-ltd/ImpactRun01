'use strict';
var ReactNative = require('react-native');
import React, { Component } from 'react';


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
  Keyboard,
  AlertIOS,
  Animated
} = ReactNative;
import styleConfig from '../styleConfig';
import Login from '../login/LoginBtns';
import LodingView from '../LodingScreen';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import commonStyles from '../styles';
import Icon3 from 'react-native-vector-icons/Ionicons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NavBar from '../navBarComponent';
import apis from '../apis';
var dismissKeyboard = require('dismissKeyboard');
var moment = require('moment');
var heightInpersentage = (deviceHeight-114)/100;
class ProfileForm extends Component {

    constructor(props) {
      super(props);
      this.state = {
        loaded:false,
        user:this.props.user,
        checkedfemale:false,
        checkedmale:false,
        showDatePicker:false,
        SuccessfullySaved:false,
         fadeAnim: new Animated.Value(1),
      };
    }
    _refresh() {
      return new Promise((resolve) => {
        setTimeout(()=>{resolve()}, 2000)
      });
    }
    onDateChange(date) {
      this.setState({date: date});
    }
    
    goBack(){
        this.props.navigator.pop({});
    }

    componentDidMount() {
    //  var route = this.props.navigator.navigationContext.currentRoute;
    // // update onRightButtonPress func
    // route.onRightButtonPress =  () => {
    //     this._onRightButtonClicked();
    // };
    // this.props.navigator.replace(route);

     // this.props.events.addListener('saveButtonPressed', this._onRightButtonClicked.bind(this));
      var user = this.props.user;
      if (user.Birth_day != null) {
        var date = moment(user.Birth_day).format('MM/DD/YYYY');
      }else{
        var date = moment(new Date()).format('MM/DD/YYYY');
      }
      if (user.phone_number != null) { 
        var phoneno = JSON.stringify(user.phone_number)
      }else{
        var phoneno = " ";
      }
      if (user.email != null ) {
       var emailuser = user.email
      }else{
        var emailuser = " ";
      }
      if (user.body_weight != null) {
        var weight = JSON.stringify(user.body_weight);
      }else{
        var weight = " ";
      }
     console.log("newDate",date);
     this.setState({
      name:user.first_name +" "+ user.last_name,
      first_name:"",
      last_name:"",
      email:emailuser,
      birthday:date,
      number:phoneno,
      body_weight:weight,
      gender:user.gender_user,
      date:date,
     }) 
     if (user.gender_user === "male") {
      this.setState({
        checkedmale:true,
        gender:'male',
      })
     }else if (user.gender_user === "female") {
      this.setState({
        checkedfemale:true,
        gender:'female',
      })
     }else if (user.gender_user === "other") {
        this.setState({
        checkedfemale:false,
        gender:'other',
        checkedmale:false
      })
     }
    }

  handleNetworkErrors(response){
        console.log("response",response);
       if(response.ok){
        console.log("response",response);
        return response.json()
       }else{
        AlertIOS.alert("Please fill the empty field");
        console.log("responce",response.json());
        return;
       }
       return response.json()
      }



    faddingAnimation(){
       Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 0,                   // Animate to opacity: 1 (opaque)
        duration: 1000,              // Make it take a while
      }
    ).start();  
    }

    faddingAnimationDispaly(){
        Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 300,              // Make it take a while
      }
    ).start(); 
    }
    

  _onRightButtonClicked() {
    this.putRequestUser();
  }

    putRequestUser(){
      if(this.state.email != " "  ){
        if(this.state.number != " " && (this.state.number.length > 9)){
          if (this.state.birthday != " " ){
          if (this.state.body_weight != " " ) {
        var user_id = this.props.user.user_id;
        var auth_token = this.props.user.auth_token;
        console.log("auth_token",auth_token);
        var nameArr = this.state.name.split(/\s+/);
        this.state.first_name = nameArr.slice(0, -1).join(" ");
        this.state.last_name = nameArr.pop();
        var date = moment(this.state.date).format('MM/DD/YYYY');
        var number = parseInt(this.state.number);
        console.log('number',number);
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
            "first_name":this.state.first_name,
            "last_name":this.state.last_name,
            "body_weight":weight,
            "gender_user":this.state.gender,
            })
          })
          .then(this.handleNetworkErrors.bind(this))
          .then((response) => {
          this.faddingAnimationDispaly(); 
            this.setState({
              SuccessfullySaved:true,
            })
            console.log('submited',response);
            let keys = ['UID234', 'UID345','USERDATA',];
              AsyncStorage.multiRemove(keys, (err) => {
            });

              console.log("responce",response);
              var userdata = response;
                    // first user, delta values
              let userData = {
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

              AsyncStorage.setItem('USERDATA',JSON.stringify(userData), () => {
                  AsyncStorage.getItem('USERDATA', (err, result) => {
                    this.props.getUserData();
                    var _this = this;
                    setTimeout(function(){
                    _this.faddingAnimation();
                    },1000)
                    setTimeout(function(){  
                    _this.setState({
                      SuccessfullySaved:false,
                    });
                  },2000);
                    console.log("userresult ",result);
                  })
               })
          })    
          .catch((err) => {
            console.log('err',err);
          })
        }else{
           AlertIOS.alert("Please enter body weight", "Field required* ");
        }
        }else{
          AlertIOS.alert("Please enter birthday","Field required* ");
        }
        }else{
         if (this.state.number.length <= 9) {
          AlertIOS.alert("Please enter 10 digit mobile number");
         }else{
          AlertIOS.alert("Please enter phone number","Field required* ");
        }
      }
        }else{
          AlertIOS.alert("Please enter email","Field required* ");
        }
    }
    
    LoginView(){
      if(this.props.user && Object.keys(this.props.user).length > 0 ){
        this.setState({loaded:true});
      }else{
        return (
          <View style={{height:deviceHeight,width:deviceWidth,backgroundColor:"red"}}>
          <View style={commonStyles.Navbar}>
            <TouchableOpacity style={{left:0,position:'absolute',height:styleConfig.navBarHeight,width:styleConfig.navBarHeight,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon3 style={{color:'white',fontSize:30,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon3>
            </TouchableOpacity>
              <Text numberOfLines={1} style={commonStyles.menuTitle}>PROFILE</Text>
            <TouchableOpacity style={{right:10,position:'absolute',height:styleConfig.navBarHeight,width:styleConfig.navBarHeight,backgroundColor:'red',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Text>SAVE</Text>
            </TouchableOpacity>
          </View>
          <View style={{height:deviceHeight/2,width:deviceWidth,top:(deviceHeight/2)-200,}}>
            <Login getUserData={this.props.getUserData}/>
          </View>
          </View>
        ) 
      }
    }

    LodingView(){
      return(
        <LodingView/>
      )
    }

    NavigatetoLoginScreen(){
      this.props.navigator.push({
        title: 'Gps',
        id:'login',
        navigator: this.props.navigator,
      });
    }
    onBirthDateChange(){
      dismissKeyboard()
      this.setState({showDatePicker:true})
    }
    
    leftIconRender(){
     return(
      <TouchableOpacity style={{paddingLeft:10,backgroundColor:'transparent', height:styleConfig.navBarHeight,width:50,justifyContent: 'center',alignItems: 'flex-start',}} onPress={()=>this.goBack()} >
        <Icon3 style={{color:'white',fontSize:35,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon3>
      </TouchableOpacity>
      )
    }

    rightIconRender(){
      return(
        <TouchableOpacity style={{height:styleConfig.navBarHeight,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.putRequestUser()} >
          <Text style={{color:'white'}}>SAVE</Text>
        </TouchableOpacity>
      )
    }

    radioButtonMale(){
      var colorBackground = (this.state.checkedmale)?styleConfig.pale_magenta:'grey';
      var colorBackgroundinner = (this.state.checkedmale)?styleConfig.pale_magenta:'#f4f4f4';
      return(
        <TouchableOpacity style ={{paddingRight:10,}} onPress={()=>this.setState({checkedfemale:false,gender:'male', checkedmale:true})}>
         <View style={{justifyContent: 'center',alignItems: 'center', height:20,width:20,borderRadius:10,backgroundColor:colorBackground}}>
         <View style={{justifyContent: 'center',alignItems: 'center', height:15,width:15,borderRadius:7.5,backgroundColor:"white"}} >
         <View style={{height:10,width:10,borderRadius:5,backgroundColor:colorBackgroundinner}}>
         </View>
          </View>
        </View>
         </TouchableOpacity>
        )
    }
    radioButtonFemale(){
      var colorBackground = (this.state.checkedfemale)?styleConfig.pale_magenta:'grey';
      var colorBackgroundinner = (this.state.checkedfemale)?styleConfig.pale_magenta:'#f4f4f4';
      return(
        <TouchableOpacity style ={{paddingRight:10,}}onPress={()=>this.setState({checkedfemale:true,gender:'female', checkedmale:false})}>
             <View style={{justifyContent: 'center',alignItems: 'center', height:20,width:20,borderRadius:10,backgroundColor:colorBackground}}>
             <View style={{justifyContent: 'center',alignItems: 'center', height:15,width:15,borderRadius:7.5,backgroundColor:"white"}} >
             <View style={{height:10,width:10,borderRadius:5,backgroundColor:colorBackgroundinner}}>
             </View>
          </View>
        </View>
         </TouchableOpacity>
        )
    }
    onSavesuccessView(){
      let { fadeAnim } = this.state;
      if (this.state.SuccessfullySaved) {
      return(
         <Animated.View                 
            style={{
              ...this.props.style,
              opacity: fadeAnim, 
              position:'absolute',
              top:styleConfig.navBarHeight-12,
            }}
          >
        <View style={{backgroundColor:styleConfig.pale_magenta,width:deviceWidth,height:40,justifyContent: 'center',alignItems: 'center',}}>
          <Text style={{fontSize:15,color:'white'}}>Successfully saved</Text>
        </View>
         </Animated.View>
        )
      }else{
        return;
      }
    }

    render() {
      var user = this.props.user;
      if (this.props.user != null) {
         var showDatePicker = this.state.showDatePicker ?
            <DatePickerIOS
                style={{position:"absolute",width:deviceWidth,right:0,bottom:0,backgroundColor:"white"}}
                date={this.props.user.birthday} onEndEditing={()=> this.setState({showDatePicker:false})} onDateChange={(date)=>this.setState({date:date.toLocaleDateString()})}
                mode="date"/> : <View />
         return (
          <View>
            <ScrollView onPress={()=> this.setState({showDatePicker:false})} style={styles.container}>
          
            <View style={styles.FromWrap}>
             
              <View style={styles.ProfileTextInput}>
              
                <Text style={styles.ProfileTitle}>Name</Text> 
                <TextInput ref="name" onFocus={() => this.setState({showDatePicker:false})} onChangeText={(name) => this.setState({name})} value={this.state.name}style={styles.userProfileText}></TextInput>         
              </View>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Email</Text>
                <TextInput  ref="email" onFocus={() => this.setState({showDatePicker:false})}onChangeText={(email) => this.setState({email:email})}  keyboardType="email-address" value={this.state.email} style={styles.userProfileText}></TextInput>        
              </View>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Phone Number</Text> 
                <TextInput ref="number" onFocus={() => this.setState({showDatePicker:false})} onChangeText={(number) => this.setState({number})}  minLength={10} maxLength= {11} keyboardType= 'numeric' value={this.state.number} style={styles.userProfileText}></TextInput> 
              </View>    
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Birthday</Text>
                <TextInput onFocus={() => this.onBirthDateChange()}  ref="date" value={this.state.date} style={styles.userProfileText}></TextInput>
              </View>    
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Body weight in KGs</Text>
                <TextInput onFocus={() => this.setState({showDatePicker:false})} onChangeText={(body_weight) => this.setState({body_weight})} keyboardType= 'numeric' value={this.state.body_weight} style={styles.userProfileText}></TextInput>
              </View>
              <View style={styles.ProfileTextInput}>
                <Text style={styles.ProfileTitle}>Gender</Text>
                <View style={{flexDirection:'row',alignItems: 'center',padding:5,}}>
                   {this.radioButtonMale()}<Text style = {{color:'#4a4a4a',paddingRight:15,fontFamily:styleConfig.FontFamily,}}> Male</Text>
                   {this.radioButtonFemale()}<Text style = {{color:'#4a4a4a',fontFamily:styleConfig.FontFamily,}}> Female</Text>
                </View>
              </View>
              <View style={styles.ProfileTextInput2}>
              
               {showDatePicker}
              </View>

            </View> 
             
            
          </ScrollView>
           {this.onSavesuccessView()}
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

}


var styles = StyleSheet.create({
  container:{
    height:heightInpersentage*100,
    backgroundColor:'#f4f4f4',
  },
  ProfileTextInput2:{
    width:deviceWidth,
    position:"absolute",
    bottom:0,
  },
  FromWrap:{
    borderRadius:5,
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

export default ProfileForm;