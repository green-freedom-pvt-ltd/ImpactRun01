
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
    AsyncStorage,
    AlertIOS,
  } from 'react-native';
  import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import LoginBtns from '../../components/LoginBtns';
class ShareScreen extends Component {
    mixins: [TimerMixin]
    constructor(props) {
      super(props);
      this.state = {
        loaded:false,
      };
     }

    componentDidMount(){
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
            this.setState({
            user:JSON.parse(val),  
            loaded:true,             
            })              
            console.log("UserDataProfileShare :" + key, val);
          });


         if(this.state.user) {this.setState({
          first_name:this.state.user.first_name,
          gender_user:this.state.user.gender_user,
          last_name:this.state.user.last_name,
          email:this.state.user.email,
          social_thumb:this.state.user.social_thumb,
          user_id:this.state.user.user_id,
        })}
      });
    }
    

    somefunction(){
      return this.navigateTOhome();
    }
    navigateTOhome(){
      this.props.navigator.push({
      title: 'Gps',
      id:'tab',
      navigator: this.props.navigator,
      })
     }

     PopForRunNOtSubmit(){
        AlertIOS.alert(
          'Skip',
          'Are you sure you want to skip your run will not be counted',
         [
        {text: 'Confirm', onPress: () => this.somefunction() },
        {text: 'Cancel',},
       ],
       ); 
     }

    IfnotLogin(){
    
     if (!this.state.loaded) {
          return(
            <Text>loding sharescreen</Text>
            )
     }
    
     if (!this.state.user) {
        var distance = this.props.distance;
        var impact= this.props.impact;
        return(
             <ScrollView style={{height:deviceHeight,weidth:deviceWidth,}}>
             <View style={styles.container}>
            <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
            <View style={{flexDirection:'row'}}>
            <View >
            <Text> DISTANCE</Text>
            <Text>{distance}</Text>
            </View>
            <View>
            <Text>IMPACT</Text>
            <Text>{impact}</Text>
            </View>
            <View>
            <Text>TIME</Text>
            <Text>{impact}</Text>
            </View>
            </View>
            <View style={{height:300,width:deviceWidth, flexDirection:'column'}}>
             <LoginBtns/>
             <TouchableOpacity onPress={()=> this.PopForRunNOtSubmit()}>
               <Text>Skip</Text>
             </TouchableOpacity>
             </View>
            </Image>
            
          </View>
              
           
            </ScrollView>
          )

     }
      var distance = this.props.distance;
      var impact= this.props.impact;
     
       return(
          <View style={styles.container}>
            <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
            <View style={{flexDirection:'row'}}>
            <View >
            <Text> DISTANCE</Text>
            <Text>{distance}</Text>
            </View>
            <View>
            <Text>IMPACT</Text>
            <Text>{impact}</Text>
            </View>
            <View>
            <Text>TIME</Text>
            <Text>{impact}</Text>
            </View>
            </View>
            </Image>
          </View>
         
          
       
      )
   
      
  }
  // IfnotLogin(){
  //   var isUserlogin = this.props.isUserlogin;
  //   console.log('mysomeShareData'+isUserlogin);
  //    if (this.state.user) {
  //     var distance = this.props.distance;
  //     var impact= this.props.impact;
     
  //      return(
  //           <View style={styles.container}>
  //           <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
  //           <Text>{distance}</Text>
  //           <Text>{impact}</Text>
  //           </Image>
  //         </View>
         
          
       
  //     )
  //  }else{
  //    return(
  //           <LoginBtns/>
         
  //         )
  //  }
  // }

		render() {
      
        return(
           <View style={styles.container}>
            {this.IfnotLogin()}
          </View>
         
          )
    
		      
      
}
}
const styles = StyleSheet.create({
  container: {

  },
    shadow: {
            height:deviceHeight,
            width: deviceWidth,
            backgroundColor: 'transparent',
            justifyContent: 'center',      
         },
})

 export default ShareScreen;