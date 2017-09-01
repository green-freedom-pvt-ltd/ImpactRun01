import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import apis from '../apis';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styleConfig from '../styleConfig';
import Modal from '../downloadsharemeal/CampaignModal'
import LoginBtns from '../login/LoginBtns'
import Icon from 'react-native-vector-icons/Ionicons';
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
    


    postFeedback(){

      if (this.props.user){
       var user_id = this.props.user.user_id;
       var date = new Date();
       console.log('this.props.rowData',this.props.rowData,this.props.data);
       var convertepoch = parseInt(date.getTime()/1000);
       fetch(apis.UserFeedBack, {
          method: "post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
          "feedback":this.state.moreText,
          "feedback_app_version":'1.0.7',
          "user_id":user_id,
          "tag":this.props.rowData.labelname,
          "sub_tag":this.props.data.labelname,
          "run_id":(this.props.runData)?this.props.runData.run_id:0,
          "phone_number":this.props.user.phone_number,
          "email":this.props.user.email,
          "is_ios":true,
          "is_chat":false,
          "client_time_stamp":convertepoch,
          })
        })
        .then((response) => response.json())
        .then((response) => {
          console.log('responce',response);
          alert('Thank you for giving your feedback');
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
      return (
        <View style={styles.container}>
        <View style={{height:deviceHeight-114,width:deviceWidth}} >
         <ScrollView style={{width:deviceWidth}}>
          <View style={{width:deviceWidth,justifyContent: 'center',alignItems: 'flex-start',padding:25}}>
          <Text style = {{textAlign:'left', color:'#4a4a4a',fontSize:styleConfig.fontSizer1+2,fontWeight:'400',fontFamily:styleConfig.FontFamily,marginBottom:20,}}>{data.header}</Text>
          <Text style = {{textAlign:'left', color:'#4a4a4a',fontSize:styleConfig.fontSizer1,fontWeight:'400',fontFamily:styleConfig.FontFamily}}>{data.discription}</Text>   
          </View>
          </ScrollView>
            <View style={styles.FaqSubmitWrap}>

              <View>
               <Text>{data.inputLebel}</Text>
                <TextInput
                ref={component => this._textInput = component} 
                style={styles.textEdit}
                onChangeText={(moreText) => this.setState({moreText})}
                placeholder="If you have any question ask us!"
                />
                </View>
               
                <TouchableOpacity onPress={() => this.postFeedback()} style={styles.submitFaqbtn}>
                  <Text style={{color:'white'}}>Submit</Text>

                </TouchableOpacity>
                
              </View>
                <KeyboardSpacer/>
                 </View>
                 {this.modelView()}
            </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    height:deviceHeight-114,
    backgroundColor: '#e2e5e6',
  },
  FaqSubmitWrap:{
    paddingTop:7,
    height:styleConfig.navBarHeight,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'flex-start',
    backgroundColor:'#e1e1e8',
    borderBottomWidth:2,
    borderBottomColor:'#e1e1e8',
  },
  textEdit: {
    height:40, 
    borderColor: '#e1e1e8', 
    backgroundColor: 'white',
    borderRadius:8,
    width:deviceWidth-100,
    color:'#4a4a4a',
    padding:10,
    marginRight:5,
  },
  submitFaqbtn:{
    height:40, 
    width:85,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:styleConfig.bright_blue, 
  }
});

export default EndFeedBack;