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
  ActivityIndicator,
  NetInfo,
  Keyboard,
} from 'react-native';
import apis from '../apis';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styleConfig from '../styleConfig';
import Modal from '../downloadsharemeal/CampaignModal'
import LoginBtns from '../login/LoginBtns'
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from '../navBarComponent';

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
        moreText:'',
      };
    }

    componentDidMount() {
     
      console.log('this.props.sub_tag',this.props.sub_tag,this.props.tag,this.props.data);
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
          id:'tab',
          passProps:{
           getUserData:this.props.getUserData,
           user:this.props.user,
          }
        })
      }

    postFeedback(){
      NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.setState({
          isPostingFeedBack:true,
        })

        if (this.props.user){
          console.log("userdata", this.props.data.labelname);
         var user_id = this.props.user.user_id;
         var mybody;
         var date = new Date();
          var convertepoch = parseInt(date.getTime()/1000);
         console.log('this.props.rowData',this.props.rowData,this.props.data,this.props.sub_tag,convertepoch);
        
       
          mybody = JSON.stringify({
            "feedback":this.state.moreText,
            "feedback_app_version":'1.0.7',
            "user_id":user_id,
            "tag":this.props.tag,
            "sub_tag":(this.props.sub_tag)?this.props.sub_tag:'',
            "run_id":(this.props.runData)?this.props.runData.run_id:0,
            "phone_number":this.props.user.phone_number,
            "email":this.props.user.email,
            "is_ios":true,
            "is_chat":false,
            "client_time_stamp":convertepoch,
          })

         
         
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
            this.setState({
              isPostingFeedBack:false,
            })
            console.log('responce',response);
            
            AlertIOS.alert('Successfully Submited', 'Thank you for giving your feedback');
             Keyboard.dismiss();
             this.navigateToHome();
          })
          .catch((err) => {
            this.setState({
              isPostingFeedBack:false,
            })
            console.log('err',err);
          })
        }else{
          this.setState({
            open:true,
          })
        }
      }else{
        AlertIOS.alert('No internet connection', 'Please check the internet connection and try again');
      }
      })
    }

    onhideKEy(){
      Keyboard.dismiss();
    }
    onPostsuccessView(){
      if (this.state.isPostingFeedBack) {
        return(
          <View style={{position:'absolute',top:0,backgroundColor:'rgba(4, 4, 4, 0.80)',height:deviceHeight-114,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
          <Text style={{color:'white',fontWeight:'600'}}>Posting feedback...</Text>
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



    leftIconRender(){
          return(
            <TouchableOpacity style={{paddingLeft:10,height:styleConfig.navBarHeight,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'flex-start',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'black',fontSize:35,fontWeight:'bold',opacity:.80}}name={(this.props.data === 'fromshare')?'md-home':'ios-arrow-back'}></Icon>
            </TouchableOpacity>
          )
        }
  
 

    render() {
      var data = this.props.data;
      console.log("Title ", this.props.title);
      return (
        <View style={styles.container}>
        <NavBar title = {'Feedback'} leftIcon={this.leftIconRender()}/>
        <View>

        <View style={{marginTop:30,marginLeft:10,marginBottom:10}}>
          <Text style={{color:'#595c5d',fontFamily:styleConfig.LatoBlack,}}>{data.header}</Text>
        </View>
        <View style={{marginLeft:10,marginBottom:20,width:deviceWidth-20}}>
          <Text style={{color:'#595c5d', fontFamily:styleConfig.LatoRegular,}}>{data.discription}</Text>
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
                  <Text style={{color:'white',fontFamily:styleConfig.FontFamily}}>SUBMIT</Text>

                </TouchableOpacity>
                
                <KeyboardSpacer/>
            </View>
            {this.onPostsuccessView()}
            </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    height:deviceHeight,
    backgroundColor: 'white',
  },
  FaqSubmitWrap:{
    height:styleConfig.navBarHeight,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'flex-start',
    backgroundColor:'white',
    borderBottomWidth:2,
    borderBottomColor:'white',
    marginTop:1,
  },
  textEdit: {
    height:40, 
    borderColor: '#e1e1e8', 
    backgroundColor: '#ccc',
    borderRadius:8,
    width:deviceWidth-10,
    marginLeft:5,
    color:'black',
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