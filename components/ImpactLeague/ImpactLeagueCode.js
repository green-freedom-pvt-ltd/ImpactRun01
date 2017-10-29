
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Text,
    AlertIOS,
    Platform,
    ActivityIndicator,
    AsyncStorage
  } from 'react-native';
import commonStyles from '../styles';
import apis from '../apis';
import NavBar from '../navBarComponent'
import styleConfig from '../styleConfig';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import Icon from 'react-native-vector-icons/Ionicons';
import ImpactLeagueForm2 from './ImpactLeagueForm2'
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var ApiUtils = {  
  checkStatus: function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.status);
      error.response = response;
      return response;
    }
  }
};

class ImpactLeagueCode extends Component {
    
    constructor() {
      super();
      this.state = {
        moreText:'',
        codenotextist:'',
        loading:false,
        FormScreen:false,
        city:null,
        department:null,
        data:null,
      };
      this.codeDoesnotExistCheck = this.codeDoesnotExistCheck.bind(this);
    }

    SubmitCode(){

      this.setState({
        loading:true,
      })

      var http = new XMLHttpRequest();
      var user_id = this.props.user.user_id;
      var token = this.props.user.auth_token;
      var auth_token = (token);
      let formData = new FormData();
      formData.append('user', user_id);
      formData.append('team', this.state.moreText);
      http.open("POST", apis.ImpactLeagueCodeApi, true);
      fetch(apis.ImpactLeagueCodeApi, {
        method: "POST",
        datatype:'json',
        headers: {  
          'Authorization':'Bearer '+token,
          'Accept':'application/json',
          'Content-Type':'application/x-www-form-urlencoded',
        },       
        body: formData
      })

      .then((response) => {          
        return response.json();
      })

      .then((responseJson) => {
        this.setState({
          loading:false,
        })
        console.log('responseJson',responseJson);
        this.codeDoesnotExistCheck(responseJson);
      })  
      .catch((err) => {
        console.log('error',err);
        this.setState({
          codenotextist:'Sorry, this team is full.',
          loading:false,

        })
      })
      .done(); 
      dismissKeyboard();
      this._textInput.setNativeProps({text: ''});
    }



    checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }


    goBack(){
      this.props.navigator.pop();
    }


      navigateTOhome(responseJson){
        this.props.navigator.replace({
          title: 'impactleaguehome',
          id:'impactleaguehome',
          navigator: this.props.navigator,
          passProps:{
            backTo:'learderboad',
            user:this.props.user,
            data:responseJson,
            getUserData:this.props.getUserData,
          }
        })
      }
      
    RouteChangeField(responseJson){
        var userdata = this.props.user;
        console.log("userdata",userdata);
        let userData = {
          team_code:responseJson.team_code
        }
        // first user, delta values
        AsyncStorage.mergeItem('USERDATA', JSON.stringify(userData), () => {
         AsyncStorage.getItem('USERDATA', (err, result) => {
                this.props.getUserData();

        })
        })    
      }


		Navigate_To_nextpage(responseJson){
      this.RouteChangeField(responseJson);
      var team_code = responseJson.team_code;
      console.log(responseJson.company_attribute);
      var cities = responseJson.company_attribute;
      var departments = responseJson.company_attribute;
      console.log('cities',cities);
      var department = [];
      var city = [];
      if(cities.length == 0 && departments.length == 0)
      {
        this.navigateTOhome();
      }
      else{
        var i;
        for (i = 0; i < cities.length; i++) {
          if (cities[i].city != null ) {
            city.push(cities[i].city);
          }

        }
        console.log('text',city);
        var i;
        for (i = 0; i < departments.length; i++) {
          if (departments[i].department != null) {
            department.push(departments[i].department);
          }

        }
       this.props.navigator.replace({
        id:'impactleagueform2',
          passProps:{
            cities:city,
            departments:department,
            user:this.props.user,
            data:responseJson,
            getUserData:this.props.getUserData,
          },
        navigator: this.props.navigator,
        })
      }
     // this.setState({
     //  city:city,
     //  department:department,
     //  data:responseJson,
     //  FormScreen:true,
     // })
    }
     

    codeDoesnotExistCheck(responseJson){
      var valueReturn = "Object with team_code="+this.state.moreText+" does not exist.";
      var valueReturn2 = "The fields user, team must make a unique set.";
      // console.log('responcedatacode',JSON.stringify(responseJson.non_field_errors[0])==valueReturn2);
      if (responseJson) {
        if (responseJson.non_field_errors) {
        if (JSON.stringify(responseJson.non_field_errors[0]) != null) {
          console.log('react2');
          this.setState({
            codenotextist:JSON.stringify(responseJson.non_field_errors[0]),
          })
        }else{
          console.log('react3');
          this.Navigate_To_nextpage(responseJson);
        }
      }else{
        this.Navigate_To_nextpage(responseJson);
      }
      }
    }
     
    isloading(){
      if (this.state.loading) {
        return(
          <View style={{position:'absolute',top:0,backgroundColor:'rgba(4, 4, 4, 0.56)',height:deviceHeight,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
            <ActivityIndicator
              style={{height: 80}}
              size="large"
            >
            </ActivityIndicator>
          </View>
          )
      }else{
        return;
      }
    }

    goBack(){
      this.props.navigator.pop();
    }

    leftIconRender(){
      return(
        <TouchableOpacity style={{paddingLeft:10,height:styleConfig.navBarHeight,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'flex-start',}} onPress={()=>this.goBack()} >
           <Icon style={{color:'white',fontSize:30,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon>
        </TouchableOpacity>
        )
    }
    
    render() {
      if (this.state.FormScreen!= true) {
  		  return (
          <View style={{height:deviceHeight,width:deviceWidth,backgroundColor:'white'}}>
          <View style={commonStyles.Navbar}>
          <TouchableOpacity style={{top:10,left:0,position:'absolute',height:70,width:70,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
           <Icon style={{color:'white',fontSize:30,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon>
          </TouchableOpacity>
          <Text style={commonStyles.menuTitle}>Impact League</Text>
        </View>
          <View style={styles.container}>
          <View style={styles.ContentWrap}>
          <Text style={{marginTop:10,color:styleConfig.purplish_brown,fontSize:styleConfig.FontSizeDisc,fontFamily:styleConfig.FontFamily,}}>Enter the secret code here.</Text>
          <View style ={ styles.InputUnderLine}>
           <TextInput
            ref={component => this._textInput = component} 
            style={styles.textEdit}
            onChangeText={(moreText) => this.setState({moreText})}
            placeholder="DFG3456"
            />
            </View>
            <View style={{marginBottom:20}}><Text style={styles.Errtext}>{this.state.codenotextist}</Text></View>
            <View style={styles.BtnWrap}>
            <TouchableOpacity onPress={() => this.SubmitCode()} style={styles.submitbtn}>
              <Text style={{color:'white'}}>SUBMIT</Text>
            </TouchableOpacity>
            </View>
            <View>
            <Text style={{marginTop:50,color:styleConfig.purplish_brown,fontSize:styleConfig.FontSizeDisc,fontFamily:styleConfig.FontFamily,}}>What's This?</Text>
            <Text style={{marginTop:10,color:styleConfig.purplish_brown,fontSize:styleConfig.FontSize4,fontFamily:styleConfig.FontFamily,}}>{'Here, secret code is for Impact League. Impact League is a Walkathon oraganised by us where you and your colleagues compete with each other to raise charity.\nWalk. Help. Win! \n\nGreat idea right ? \nTo know more shoot us a mail at\ncontact@impactrun.com \n\nSee you soon.'}</Text>
            </View>
          </View>
          </View>
          {this.isloading()}
          </View>
  			);
      }else{
        return(
          <ImpactLeagueForm2 cities={this.state.city} departments={this.state.department} data={this.state.data} user={this.props.user} getUserData = {this.props.getUserData} />
        )
      }
	  }
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      padding:10,
    },

    ContentWrap:{
     flex:1,

    },

    BtnWrap:{
      justifyContent: 'center',
      alignItems: 'center',
    },

    InputUnderLine:{
      height:50,
      borderBottomColor: '#e1e1e8', 
      backgroundColor: 'white',
      borderBottomWidth:1 ,
      width:deviceWidth-50,
      marginTop:20,
      marginBottom:20,
    },

    textEdit: {
      height:48,
      borderBottomColor: '#e1e1e8', 
      backgroundColor: 'white',
      borderBottomWidth:1 ,
      borderRadius:8,
      width:deviceWidth-50,
      color:'#4a4a4a',
    },

    submitbtn:{
      justifyContent: 'center',
      alignItems: 'center',
      width:deviceWidth-70,
      height:45,
      borderRadius:2,
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {
          height: 2,
        },
      backgroundColor:styleConfig.light_gold,
    },

    Errtext:{
      color:'red',
      fontFamily:styleConfig.FontFamily3,
      fontSize:styleConfig.FontSize3,
    }

  });

 export default ImpactLeagueCode;