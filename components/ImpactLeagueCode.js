
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
  } from 'react-native';
import commonStyles from './styles';
import apis from './apis';
import styleConfig from './styleConfig';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class ImpactLeagueCode extends Component {
    
    constructor() {
      super();
      this.state = {
        moreText:'',
      };
    }

    SubmitCode(){
        // if (this.state.isConnected === true) {
          if (this.state.moreText != '') {
           fetch(apis.ImpactLeagueCode, {
            method: "post",
            headers: {  
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
            "code":this.state.moreText,
            })
          })
          .then((response) => response.json())
          .then((response) => { 
          })    
          .catch((err) => {
            this.codeErrorFunction();
          })
          }else{
           
               AlertIOS.alert('No code Entered');
          }
        
        // }else{
        //   AlertIOS.alert('No Internet Connection');
        // }
        dismissKeyboard();
        this._textInput.setNativeProps({text: ''});
      }

      codeErrorFunction(){
        if (this.state.moreText =! 'DFG1234') {
          <Text style={styles.Errtext}>Sorry, that’s not the code.</Text>
        }
        else{
        if (this.state.moreText === '') {
        return(
           <Text style={styles.Errtext}>Please Enter the Code</Text>
          )
        }
       }
      }
      


  		Navigate_To_nextpage(){
        this.props.navigator.push({
        id:'impactleagueform2',
        passProps:{
          },
        navigator: this.props.navigator,
       })

      }
       navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
        })
      }

      render() {
  		  return (
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
                <View style={{marginBottom:20}}>{this.codeErrorFunction()}</View>
                <View style={styles.BtnWrap}>
                <TouchableOpacity onPress={() => this.Navigate_To_nextpage()} style={styles.submitbtn}>
                  <Text style={{color:'white'}}>SUBMIT</Text>
                </TouchableOpacity>
                </View>
              </View>
          </View>
  			);
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
    flex:1,
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