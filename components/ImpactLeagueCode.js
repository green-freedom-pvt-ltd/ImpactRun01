
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
  } from 'react-native';
import commonStyles from './styles';
import apis from './apis';
import styleConfig from './styleConfig';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class ImpactLeagueCode extends Component {
    
    SubmitCode(){
        if (this.state.isConnected === true) {
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
          })
        }else{
          AlertIOS.alert('No Internet Connection');
        }
        dismissKeyboard();
        this._textInput.setNativeProps({text: ''});
      }
  		render() {
  		  return (
          <View style={styles.container}>
              <View>
               <TextInput
                ref={component => this._textInput = component} 
                style={styles.textEdit}
                onChangeText={(moreText) => this.setState({moreText})}
                placeholder="Enter your team code"
                />
                </View>
                <TouchableOpacity onPress={() => this.SubmitCode()} style={styles.submitbtn}>
                  <Text style={{color:'white'}}>Submit</Text>
                </TouchableOpacity>
          </View>
  			);
  	  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEdit: {
    height:48, 
    borderColor: '#e1e1e8', 
    backgroundColor: 'white',
    borderWidth:5 ,
    borderRadius:8,
    width:deviceWidth-100,
    color:'#4a4a4a',
    marginTop:50,
    marginBottom:50,
  },
  submitbtn:{
    justifyContent: 'center',
    alignItems: 'center',
    width:deviceWidth-100,
    height:50,
    backgroundColor:styleConfig.light_gold,
  }
});
 export default ImpactLeagueCode;