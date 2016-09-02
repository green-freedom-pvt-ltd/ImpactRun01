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
  TouchableOpacity
} = ReactNative;
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Login from '../../components/LoginBtns';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var ProfileForm = React.createClass({
  getInitialState: function(){
    return {
    };
  },

   componentWillMount: function(){
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
          stores.map((result, i, store) => {
              let key = store[i][0];
              let val = store[i][1];
              this.setState({
                user:JSON.parse(val),
               
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
      <Login/>
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
        if (!this.state.user) {
           return this.LoginView();
        }
       return (
          <View style={styles.ProfileContainer}>
          <View>
          <Text>Name</Text>
         <TextInput
          ref={component => this._textInput = component} 
          style={styles.textEdit}
          onChangeText={(moreText) => this.setState({moreText})}
          />
          <Text>Email</Text>
          <TextInput
          ref={component => this._textInput = component} 
          style={styles.textEdit}
          onChangeText={(moreText) => this.setState({moreText})}
          />
          <Text>Phone_Number</Text>
          <TextInput
          ref={component => this._textInput = component} 
          style={styles.textEdit}
          onChangeText={(moreText) => this.setState({moreText})}
          />
          <Text>Birthdate</Text>
          <TextInput
          ref={component => this._textInput = component} 
          style={styles.textEdit}
          onChangeText={(moreText) => this.setState({moreText})}
          />
          <Text>Gender</Text>
          <TextInput
          ref={component => this._textInput = component} 
          style={styles.textEdit}
          onChangeText={(moreText) => this.setState({moreText})}
          />
          </View>
            <KeyboardSpacer style={{backgroundColor:'#673AB7'}}/>
          </View>

        );
      }
});


var styles = StyleSheet.create({
   container:{
        height:deviceHeight,
        width:deviceWidth,
        top:200,
        alignItems:'center',

       },
  ProfileContainer: {
    marginTop: 150,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white',
  },
  bottomBump: {
    marginBottom: 15,
  },
   textEdit: {
    marginLeft:-5,
    height:48, 
    borderColor: '#673AB7', 
    backgroundColor: 'white',
    borderWidth:2 ,
    borderRadius:8,
    width:deviceWidth-100,
    color:'black',
    padding:10,
    top:4,
    marginBottom:5,
  },
 
});

module.exports = ProfileForm;