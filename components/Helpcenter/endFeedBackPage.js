import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  AlertIOS,
} from 'react-native';
import apis from '../apis';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styleConfig from '../styleConfig';
import Modal from '../downloadsharemeal/CampaignModal'
import LoginBtns from '../login/LoginBtns'
import Icon from 'react-native-vector-icons/Ionicons';
var dismissKeyboard = require('dismissKeyboard');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import commonStyles from '../../components/styles';
var flex1 = ((deviceHeight-114)/100)*100;
var flex2 = ((deviceHeight-114)/100)*50;
class EndFeedBack extends Component {
    constructor(props) {
      super(props);
      this.state = {
        moreText:''
      };
    }

    componentDidMount() {
      // AlertIOS.alert('Successfully Submited', 'Thank you for giving your feedback');
     
    }
    onsubmitFeedback(){

    }


    modelView(){
      return(
        <Modal
        style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
           isOpen={this.state.open}
             >
            <View style={styles.modelWrap}>
             <LoginBtns getUserData={this.props.getUserData} />
            </View>
            <KeyboardSpacer/>
          </Modal>
        )
      }
    
     
    goBack(){
        this.props.navigator.pop({});
    }

      navigateToHome(rowData){

        this.props.navigator.push({
          title:'Select issue',         
          // component:QuestionLists,
          // navigationBarHidden: false,
          // showTabBar: true,
          id:'tab',
          passProps:{
           getUserData:this.props.getUserData,
           user:this.props.user,
          }
        })
      }

    postFeedback(){
      if (this.props.user){
        console.log("userdata", this.props.data.labelname);
       var user_id = this.props.user.user_id;
       var mybody;
       var date = new Date();
       console.log('this.props.rowData',this.props.rowData,this.props.data);
       var convertepoch = parseInt(date.getTime()/1000);
       if(this.props.subtag){
       mybody = JSON.stringify({
          "feedback":this.state.moreText,
          "feedback_app_version":'1.0.7',
          "user_id":user_id,
          "tag":this.props.tag,
          "sub_tag":this.props.subtag,
          "run_id":(this.props.runData)?this.props.runData.run_id:0,
          "phone_number":this.props.user.phone_number,
          "email":this.props.user.email,
          "is_ios":true,
          "is_chat":false,
          "client_time_stamp":convertepoch,
          })
 
       }
       else{
       mybody = JSON.stringify({
          "feedback":this.state.moreText,
          "feedback_app_version":'1.0.7',
          "user_id":user_id,
          "tag":this.props.data.labelname,
          "run_id":(this.props.runData)?this.props.runData.run_id:0,
          "phone_number":this.props.user.phone_number,
          "email":this.props.user.email,
          "is_ios":true,
          "is_chat":false,
          "client_time_stamp":convertepoch,
          })

       }
       
       fetch(apis.UserFeedBack, {
          method: "post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body:mybody
        })
        .then((response) => response.json())
        .then((response) => {
          console.log('responce',response);
          dismissKeyboard()
          AlertIOS.alert('Successfully Submited', 'Thank you for giving your feedback');
          this.navigateToHome();

        })
        .catch((err) => {
          console.log('err',err);
        })
      }else{
        this.setState({
          open:true,
        })
      }

    }
  
 

    render() {
      var data = this.props.data;
      console.log("Title ", this.props.title);
      return (
        <View style={styles.container}>
        <View style={{height:deviceHeight,width:deviceWidth}} >

        <View style={{marginTop:30,marginLeft:10,}}>
          <Text style={{color:'black'}}>{data.header}</Text>
        </View>
        <View style={{marginTop:15,marginLeft:10,}}>
          <Text style={{color:'black', fontFamily:styleConfig.FontFamily,}}>{data.discription}</Text>
        </View>
            <View style={styles.FaqSubmitWrap}>
               <View>
                <TextInput
                ref={component => this._textInput = component} 
                style={styles.textEdit}
                onChangeText={(moreText) => this.setState({moreText})}
                placeholder={data.inputLebel}
                />
              </View>
               
                
              </View>
              <TouchableOpacity onPress={() => this.postFeedback()} style={styles.submitFaqbtn}>
                  <Text style={{color:'white'}}>Submit</Text>

                </TouchableOpacity>
                
                <KeyboardSpacer/>
            </View>
            </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    height:deviceHeight,
    backgroundColor: '#e2e5e6',
  },
  FaqSubmitWrap:{
    height:styleConfig.navBarHeight,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'flex-start',
    backgroundColor:'#e1e1e8',
    borderBottomWidth:2,
    borderBottomColor:'#e1e1e8',
    marginTop:1,
  },
  textEdit: {
    height:40, 
    borderColor: '#e1e1e8', 
    backgroundColor: 'white',
    borderRadius:8,
    width:deviceWidth-10,
    marginLeft:5,
    color:'#4a4a4a',
    padding:10,
    marginRight:5,
  },
  submitFaqbtn:{
    height:40, 
    width:deviceWidth-40,
    marginLeft:20,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:styleConfig.light_sky_blue, 
  }
});

export default EndFeedBack;