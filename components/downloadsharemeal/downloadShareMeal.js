import React, { Component } from 'react';
import Modal from './CampaignModal.js';
import Share, {ShareSheet, Button} from 'react-native-share';
import {
   Text,
   StyleSheet,
   TouchableOpacity,
   View,
   Image,
   AlertIOS,
   Dimensions,
   AsyncStorage
} from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import styleConfig from '../styleConfig';
import apis from '../apis'
class Model extends Component {
    constructor() {
      super();
      this.state = {
        offset:10,
      };
      this.saveSignup = this.saveSignup.bind(this)
    }


    componentDidMount() {
     this.setState({
      open:this.props.open
     })

    }

    saveSignup(){ 
      this.setState({
            open:false,
            isOpen:false,
      })
      this.props.changePosition();
      var userdata = this.props.user;
      let UID234_object = {
          first_name:userdata.first_name,
          user_id:userdata.user_id,
          last_name:userdata.last_name,
          gender_user:userdata.gender_user,
          email:userdata.email,
          phone_number:userdata.phone_number,
          Birth_day:userdata.birthday,
          social_thumb:userdata.social_thumb,
          auth_token:userdata.auth_token,
          total_amount:userdata.total_amount,
          is_signup:userdata.sign_up,
          total_distance:userdata.total_distance,
          team_code:userdata.team_code,
      };
       let UID345_object = {
          first_name:userdata.first_name,
          user_id:userdata.user_id,
          last_name:userdata.last_name,
          gender_user:userdata.gender_user,
          email:userdata.email,
          phone_number:userdata.phone_number,
          Birth_day:userdata.birthday,
          social_thumb:userdata.social_thumb,
          auth_token:userdata.auth_token,
          total_amount:userdata.total_amount,
          is_signup:userdata.sign_up,
          total_distance:userdata.total_distance,
          team_code:userdata.team_code,
      };

       // second user, delta values
       let UID234_delta = {
          is_signup:false,
      };
       let UID345_delta = {
          is_signup:false,
      };


      let multi_set_pairs = [
          ['UID234', JSON.stringify(UID234_object)],
          ['UID345', JSON.stringify(UID345_object)]
      ]
      let multi_merge_pairs = [
          ['UID234', JSON.stringify(UID234_delta)],
          ['UID345', JSON.stringify(UID345_delta)]
      ]
      AsyncStorage.multiSet(multi_set_pairs, (err) => {
        AsyncStorage.multiMerge(multi_merge_pairs, (err) => {

          this.props.getUserData();
          this.props.ChangeCampaignCount();

        });
      });

    }


    modelRender(openmodel){
      var ModelData = this.props.ModelData;

      var open = this.state.open;
      // AlertIOS.alert('mydata',this.props.open);
      if (ModelData) {
        let shareOptions = {
          title: "ImpactRun",
          message:ModelData.campaign_share_template,
          subject: "Download ImpactRun Now " //  for email
        };
      return (
        <View style={{height:height,width:width, justifyContent: 'center', alignItems: 'center'}}>
          <Modal
            saveSignup = {this.saveSignup}
             isOpen={this.props.open}
               style={{height:height-160,width:width-60, alignItems: 'center',}}>
                  <View>
                    <View>
                      <Image style={styles.ModelImage} source={{uri:ModelData.campaign_image}}>
                      </Image>
                    </View>
                    <View>
                      <Text style={styles.campaignTitle}>{ModelData.campaign_title}</Text>
                      <Text style={styles.campaignDisc}>{ModelData.campaign_description}</Text>
                      <TouchableOpacity
                        style={styles.shareBtn}
                        onPress={()=>{Share.open(shareOptions)}}>
                        <Text style={{color:'white'}}>{ModelData.button_text}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{flex:1,justifyContent: 'center',alignItems: 'center',marginLeft:10,marginBottom:10,marginRight:10,}}
                        onPress={() => this.saveSignup()}>
                        <Text style={{textDecorationLine: 'underline', textDecorationStyle: 'solid'}}>Skip</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
            </Modal>
        </View>
      );
}else{
  return;
}
  }
  render(openmodel) {
    return (
       <View>
         {this.modelRender(openmodel)}
       </View>
    );
  }
}

const styles = StyleSheet.create({
  ModelImage:{
    borderRadius:1,
    height:height-380,
    resizeMode: 'stretch',
  },
  shareBtn:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:15,
    margin:20,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
        height: 3,
      },
    backgroundColor:styleConfig.light_gold,
  },
  campaignTitle:{
    fontSize:styleConfig.FontSize3,
    color:styleConfig.greyish_brown_two,
    margin:10,

  },
  campaignDisc:{
    fontSize:styleConfig.FontSize4,
    color:styleConfig.greyish_brown_two,
    marginLeft:20,
    marginRight:20,
  }
});
export default Model;