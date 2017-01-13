
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
    VibrationIOS,
    NetInfo
  } from 'react-native';
  import apis from '../../components/apis';
  import TimerMixin from 'react-timer-mixin';
  import Icon from 'react-native-vector-icons/Ionicons';
  import styleConfig from '../../components/styleConfig';
  var deviceWidth = Dimensions.get('window').width;
  var deviceHeight = Dimensions.get('window').height;
  import LoginBtns from '../../components/LoginBtns';
  import Share, {ShareSheet, Button} from 'react-native-share';
  const FBSDK = require('react-native-fbsdk');
  const {
    ShareDialog,
  } = FBSDK;


  class ShareScreen extends Component {

    mixins: [TimerMixin]
    constructor(props) {
      super(props);
      var cause = this.props.data;
      var distance = this.props.distance;
      var impact =this.props.impact;
      var time = this.props.time;
      const shareLinkContent = {
          contentType: 'link',
          contentUrl: "http://impactrun.com/#/",
          contentDescription: "I ran "+distance+" kms and raised " +impact+ " rupees for "+cause.partners[0].partner_ngo+" on #Impactrun. Kudos "+cause.sponsors[0].sponsor_company+" for sponsoring my run.",
          contentTitle:cause.cause_title,
          imageUrl:cause.cause_image,
      };

      this.state = {
        shareLinkContent: shareLinkContent,
        loaded:false,
        visible: false,
        user:null,
       };

      this.getUserData = this.getUserData.bind(this);
    }

    getUserData(){
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let val = store[i][1];
          let user = JSON.parse(val);
            this.setState({
              user:user,
            })
          })
        })
    }

    shareLinkWithShareDialog() {
      var tmp = this;
      ShareDialog.canShow(this.state.shareLinkContent).then(
        function(canShow) {
          if (canShow) {
            return ShareDialog.show(tmp.state.shareLinkContent);
          }
        }
      ).then(
        function(result) {
          if (result.isCancelled) {
            alert('Share cancelled');
          } else {
            alert('Share success with postId: '
              + result.postId);
          }
        },
        function(error) {
          alert('Share fail with error: ' + error);
        }
      );
    }

    onCancel() {
      console.log("CANCEL")
      this.setState({visible:false});
    }
    onOpen() {
      console.log("OPEN")
      this.setState({visible:true});
    }

    componentDidMount(){
      var StartLocation = this.props.StartLocation;
      console.log('Sharestart',StartLocation);
       AsyncStorage.multiGet(['RID1'], (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let val = store[i][1];
          this.setState({
          rundata:JSON.parse(val),
          loaded:true,
          })
          if (this.state.rundata != null) {};

         });
      });
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let val = store[i][1];
          this.setState({
          user:JSON.parse(val),
          loaded:true,
          })
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


        }
      });
    }
    ifConnectTonetPost(){
      NetInfo.isConnected.fetch().done(
      (isConnected) => {
        if (isConnected) {
           this.navigateToThankyou();
           this.PostRun();
         }else{
           console.log('isConnected'+this.state.isConnected)
           this.navigateToThankyou();
           this.SaveRunLocally();
         }
      }
     );
    }

    SaveRunLocally(){

     var cause = this.props.data;
     var CauseShareMessage = cause.cause_share_message_template;
     console.log('causeMessage'+CauseShareMessage);
     var speed = this.props.speed;
     var distance = this.props.distance;
     var impact =this.props.impact;
     var time = this.props.time;
     var date = this.props.StartRunTime
     var RunNumber = this.state.RunNumber;
     var userdata = this.state.user;
     var user_id =JSON.stringify(userdata.user_id);
     var token = JSON.stringify(userdata.auth_token);
     var tokenparse = JSON.parse(token);
     var Runid = this.state.runid;
    if (this.state.rundata === null||undefined) {
       let RID1  = {
        cause_run_title:cause.cause_title,
        user_id:user_id,
        start_time: date,
        distance: distance,
        peak_speed: 1,
        avg_speed:speed,
        run_amount:impact,
        run_duration: time,

      };

      let multi_set_pairs = [
          ['RID1', JSON.stringify(RID1)],
      ]
       let multi_merge_pairs = [
          ['RID1', JSON.stringify(RID1)],
      ]


      AsyncStorage.multiSet(multi_set_pairs, (err) => {
          AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
              AsyncStorage.multiGet(['RID1'], (err, stores) => {
                  stores.map((result, i, store) => {
                      let key = store[i][0];
                      let val = store[i][1];
                      this.setState({
                       userRunData:val,
                      })
                  });

                  console.log('myRunSomeData',this.state.userRunData);
              })
            .then((userRunData) => {

            })
            .done();
          })

       });
     }else{
      if (this.state.rundata != null) {
      var TotalRunLegth = this.state.rundata;
      console.log()
      var Runno = 2;
      var RunID = 'RID'+Runno;
      var RunID = {
        cause_run_title:cause.cause_title,
        user_id:user_id,
        start_time: StartTime,
        distance: distance,
        peak_speed: speed,
        avg_speed:speed,
        run_amount:impact,
        run_duration: time,
        start_location_lat:StartLocationLat,
        start_location_long:StartLocationLong,
        end_location_lat:EndLocationLat,
        end_location_long:EndLocationLong,
      };

      let multi_set_pairs = [
          ['RID'+Runno, JSON.stringify(RunID)],
      ]
       let multi_merge_pairs = [
          ['RID'+Runno, JSON.stringify(RunID)],
      ]


      AsyncStorage.multiSet(multi_set_pairs, (err) => {
          AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
              AsyncStorage.multiGet(['RID'+Runno], (err, stores) => {
                  stores.map((result, i, store) => {
                      let key = store[i][0];
                      let val = store[i][1];
                      this.setState({
                       userRunData:val,
                      })
                  });

                  console.log('myRunSomeData',this.state.userRunData);
              })
             .then((userRunData) => {
              this.navigateToThankyou();
              })
             .done();
          })

       });
      };
     }
    }
    PostRun(){
      if (this.props.distance >= 0.1) {
      var distance = this.props.distance;
      var speed = this.props.speed;
      var impact = this.props.impact;
      var time = this.props.time;
      var date = this.props.StartRunTime;
      var userdata = this.state.user;
      var user_id =JSON.stringify(userdata.user_id);
      var token = JSON.stringify(userdata.auth_token);
      var tokenparse = JSON.parse(token);
      var cause = this.props.data;
      fetch(apis.runApi, {
         method: "POST",
         headers: {
            'Authorization':"Bearer "+ tokenparse,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
          cause_run_title:cause.cause_title,
          user_id:user_id,
          start_time:date,
          distance: distance,
          peak_speed: 1,
          avg_speed:speed,
          run_amount:impact,
          run_duration: time,

          })
       })
      .then((response) => response.json())
      .then((userRunData) => {
      })
    }else{
     AlertIOS.alert('rundata','not more than 100');
    }
  }

    DiscardRunfunction(){
      return this.navigateTOhome();
    }

    navigateTOhome(){
      this.props.navigator.push({
      title: 'Gps',
      id:'tab',
      navigator: this.props.navigator,
      })
     }

    navigateToThankyou(){
      return this.ThankyouScreen();
    }

    ThankyouScreen() {
      var data = this.props.data;
      this.props.navigator.push({
      id:'thankyouscreen',
      navigator: this.props.navigator,
      passProps:{data:data}
      })
    }

    PopForRunNOtSubmit(){
      AlertIOS.alert(
      'Skip',
      'Are you sure you want to skip. your run will not be counted',
      [
      {text: 'Confirm', onPress: () => this.DiscardRunfunction() },
      {text: 'Cancel',},
      ],
     );
    }


    render() {
      var data = this.props.data;
      var cause = this.props.data;
      var CauseShareMessage = cause.cause_share_message_template;

      console.log('causeMessage'+CauseShareMessage.split("")[1]);
      var distance = this.props.distance;
      var impact =this.props.impact;
      var time = this.props.time;
      let shareOptions = {
        title: "ImpactRun",
        message:"I ran "+distance+" kms and raised " +impact+ " rupees for "+cause.partners[0].partner_ngo+" on #Impactrun. Kudos "+cause.sponsors[0].sponsor_company+" for sponsoring my run.",
        url: "http://www.impactrun.com/#",
        subject: "Download ImpactRun Now " //  for email
      };
      if (!this.state.loaded) {
        return(
         <Text>loding sharescreen</Text>
        )
      }
      if (this.state.user === null) {

        return(
        <View style={{height:deviceHeight,width:deviceWidth,}}>
          <View style={styles.container}>
            <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
              <View style={{flexDirection:'row',flex:1}}>
                <View style={styles.wrapperRunContent}>
                  <Icon style={{color:'black',fontSize:35,}} name={'ios-walk-outline'}></Icon>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>{distance}</Text>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}> Kms</Text>
                </View>
                <View style={styles.wrapperRunContentImpact}>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>IMPACT</Text>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>{impact} RS</Text>
                </View>
                <View style={styles.wrapperRunContent}>
                  <Icon style={{color:'black',fontSize:30,}} name={'md-stopwatch'}></Icon>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>{time}</Text>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>Min</Text>
                </View>
              </View>
              <View style={{top:-30, flexDirection:'column',flex:1,alignItems: 'center',}}>
                <View style={{justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}> Please login to </Text>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>unlease your impact</Text>
                </View>
                <View style={{top:10}}>
                  <LoginBtns getUserData={this.getUserData}/>
                </View>
                <View style={styles.skip}>
                  <Text style={{color:styleConfig.grey_70,fontFamily:styleConfig.FontFamily,}}>DON’T WANT TO LOGIN?</Text>
                  <TouchableOpacity onPress={()=> this.PopForRunNOtSubmit()}>
                    <Text style={{left:5,color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>SKIP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Image>
          </View>
        </View>
       )
      }else{

      return(
        <View style={styles.container}>
          <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
            <View style={{flexDirection:'row',flex:1}}>
              <View style={styles.wrapperRunContent}>
                <Icon style={{color:'#4a4a4a',fontSize:35,}} name={'ios-walk-outline'}></Icon>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>{distance}</Text>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}> Kms</Text>
              </View>
              <View style={styles.wrapperRunContentImpact}>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>IMPACT</Text>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>{impact} RS</Text>
              </View>
              <View style={styles.wrapperRunContent}>
                <Icon style={{color:'#4a4a4a',fontSize:30,}} name={'md-stopwatch'}></Icon>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>{time}</Text>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>Min</Text>
              </View>
            </View>
            <View style={{flex:1}}>
              <View style={{bottom:20, justifyContent: 'center',alignItems: 'center',}}>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',fontSize:18,}}> Tell your friends about it.</Text>
              </View>
              <View style={{width:deviceWidth,justifyContent: 'center',alignItems: 'center',flexDirection:'column'}}>
              <View style={{width:110,height:50,flexDirection:'row'}}>
                <TouchableOpacity onPress={() => this.shareLinkWithShareDialog()} style={{height:50,width:50,marginRight:5,}}>
                 <Image style={{height:50,width:50}} source={require('../../images/facebook.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Share.open(shareOptions)} style={{flex:1,marginLeft:5,justifyContent: 'center',alignItems: 'center',borderRadius:10,borderWidth:1,}}>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>More</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row',top:50,flex:1,justifyContent: 'center',alignItems: 'center',}}>
                <Text style={{color:'#4a4a4a',opacity:0.5,fontFamily: 'Montserrat-Regular',}}>DON’T WANT TO SHARE?</Text>
                <TouchableOpacity  onPress={() => this.ifConnectTonetPost()}>
                  <Text style={{left:6,color:'#4a4a4a',fontFamily: 'Montserrat-Regular',}}>SKIP</Text>
                </TouchableOpacity>
              </View>
              </View>
            </View>
          </Image>
        </View>
      )
     }
    }

  }
  const styles = StyleSheet.create({
    container: {
      height:deviceHeight,
      width:deviceWidth,
      justifyContent: 'center',
      alignItems: 'center',

    },
    wrapperRunContent:{
      justifyContent: 'center',
      alignItems: 'center',
      width:deviceWidth/3,
    },
    wrapperRunContentImpact:{
      justifyContent: 'center',
      alignItems: 'center',
      width:deviceWidth/4,
      top:-70,
    },
    shadow: {
      flex:1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
     alignItems: 'center',
    },
    skip:{
      top:20,
      flexDirection:'row',
      justifyContent: 'center',
    },
    shareButton:{
      flexDirection:'row',
      justifyContent: 'center',
      alignItems: 'center',
      height:50,
      width:deviceWidth-150,
      backgroundColor:'#ffcd4d',
      borderRadius:30,
    },
  })

 export default ShareScreen;