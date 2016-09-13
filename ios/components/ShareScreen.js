
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
  import TimerMixin from 'react-timer-mixin';
  import Icon from 'react-native-vector-icons/Ionicons';
  var deviceWidth = Dimensions.get('window').width;
  var deviceHeight = Dimensions.get('window').height;
  import LoginBtns from '../../components/LoginBtns';
  import Share, {ShareSheet, Button} from 'react-native-share';
  class ShareScreen extends Component {
    mixins: [TimerMixin]
    constructor(props) {
    super(props);
    this.state = {
      loaded:false,
      visible: false,
     };
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
           NetInfo.isConnected.fetch().done(
            (isConnected) => { 
              if (isConnected) {
                 this.PostRun();
               }else{
                 console.log('isConnected'+this.state.isConnected)
                 this.SaveRunLocally();
               }
            }
           );
          
        }
      });
    } 
    
  
    SaveRunLocally(){
     var StartLocationLat = this.props.StartLocation.coords.latitude;
     var StartLocationLong = this.props.StartLocation.coords.longitude;
     var EndLocationLat = this.props.EndLocation.coords.latitude;
     var EndLocationLong = this.props.EndLocation.coords.longitude;
     var cause = this.props.data;
     var CauseShareMessage = cause.cause_share_message_template;
     console.log('causeMessage'+CauseShareMessage);
     var speed = this.props.speed;
     var distance = this.props.distance;
     var impact =this.props.impact;
     var time = this.props.time;
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
        start_time: "2016-05-27 16:50:00",
        distance: distance,
        peak_speed: 1,
        avg_speed:speed,
        run_amount:impact,
        run_duration: time,
        start_location_lat:StartLocationLat,
        start_location_long:StartLocationLong,
        end_location_lat:EndLocationLat,
        end_location_long:EndLocationLong,
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
              AlertIOS.alert('yourDataStored'+JSON.stringify(this.state.userRunData))
              })
             .done();
          })
          
       });
     }else{
      if (this.state.rundata != null) {
      var TotalRunLegth = this.state.rundata;
      AlertIOS.alert('mytitle'+TotalRunLegth);
      console.log()
      var Runno = 2;
     
      var RID2 = {
        cause_run_title:cause.cause_title,
        user_id:user_id,
        start_time: "2016-05-27 16:50:00",
        distance: distance,
        peak_speed: 1,
        avg_speed:speed,
        run_amount:impact,
        run_duration: time,
        start_location_lat:StartLocationLat,
        start_location_long:StartLocationLong,
        end_location_lat:EndLocationLat,
        end_location_long:EndLocationLong,
      };

      let multi_set_pairs = [
          ['RID'+Runno, JSON.stringify(RID2)],
      ]
       let multi_merge_pairs = [
          ['RID'+Runno, JSON.stringify(RID2)],
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
              AlertIOS.alert('yourDataStored'+JSON.stringify(this.state.userRunData))
              })
             .done();
          })
          
       });
      };
     }
     
     //  let RID2  = {
     //    cause_run_title:cause.cause_title,
     //    user_id:user_id,
     //    start_time: "2016-05-27 16:50:00",
     //    distance: distance,
     //    peak_speed: 1,
     //    avg_speed:speed,
     //    run_amount:impact,
     //    run_duration: time,
     //    start_location_lat:StartLocationLat,
     //    start_location_long:StartLocationLong,
     //    end_location_lat:EndLocationLat,
     //    end_location_long:EndLocationLong,
     //  };
   
     // let RID3  = {
     //    cause_run_title:cause.cause_title,
     //    user_id:user_id,
     //    start_time: "2016-05-27 16:50:00",
     //    distance: distance,
     //    peak_speed: 1,
     //    avg_speed:speed,
     //    run_amount:impact,
     //    run_duration: time,
     //    start_location_lat:StartLocationLat,
     //    start_location_long:StartLocationLong,
     //    end_location_lat:EndLocationLat,
     //    end_location_long:EndLocationLong,
     //  };
     //  let RID4  = {
     //    cause_run_title:cause.cause_title,
     //    user_id:user_id,
     //    start_time: "2016-05-27 16:50:00",
     //    distance: distance,
     //    peak_speed: 1,
     //    avg_speed:speed,
     //    run_amount:impact,
     //    run_duration: time,
     //    start_location_lat:StartLocationLat,
     //    start_location_long:StartLocationLong,
     //    end_location_lat:EndLocationLat,
     //    end_location_long:EndLocationLong,
     //  };
   
      // let multi_merge_pairs = [
      //     ['RID1', JSON.stringify(RID1)],
      //     ['RID2', JSON.stringify(RID2)],
      // ]

    
      // AsyncStorage.multiSet(multi_set_pairs, (err) => {
      //     AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
      //         AsyncStorage.multiGet(['RID1', 'RID2'], (err, stores) => {
      //             stores.map((result, i, store) => {
      //                 let key = store[i][0];
      //                 let val = store[i][1];
      //                 this.setState({
      //                  userRunData:val,
      //                 })
      //             });
                  
      //             console.log('myRunSomeData',this.state.userRunData);
      //         })
      //        .then((userRunData) => { 
      //         AlertIOS.alert('yourDataStored'+JSON.stringify(this.state.userRunData))
      //         })
      //        .done();
      //     })
          
      //  });
    }
    PostRun(){
      var StartLocationLat = this.props.StartLocation.coords.latitude;
      var StartLocationLong = this.props.StartLocation.coords.longitude;
      var EndLocationLat = this.props.EndLocation.coords.latitude;
      var EndLocationLong = this.props.EndLocation.coords.longitude;
      console.log('somedatalat'+StartLocationLat);
      var distance = this.props.distance;
      var speed = this.props.speed;
      var impact = this.props.impact;
      var time = this.props.time;
      // if (distance >= 0.1) {
      var userdata = this.state.user;
      var user_id =JSON.stringify(userdata.user_id);
      var token = JSON.stringify(userdata.auth_token);
      var tokenparse = JSON.parse(token);
      console.log('Tokenuser:' + token);
      var cause = this.props.data;
      fetch("http://139.59.243.245/api/runs/", {
         method: "POST",
         headers: {  
            'Authorization':"Bearer "+ tokenparse,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            
          },
          body:JSON.stringify({
          cause_run_title:cause.cause_title,
          user_id:user_id,
          start_time: "2016-05-27 16:50:00",
          distance: distance,
          peak_speed: 1,
          avg_speed:speed,
          run_amount:impact,
          run_duration: time,
          start_location_lat:StartLocationLat,
          start_location_long:StartLocationLong,
          end_location_lat:EndLocationLat,
          end_location_long:EndLocationLong,
          })
       })
      .then((response) => response.json())
      .then((userRunData) => { 
        AlertIOS.alert('rundata'+JSON.stringify(userRunData))
      })
      // }else{
      //     VibrationIOS.vibrate(); 
      //     AlertIOS.alert('your run is less than 100 meters you didnt even raised 1 rupee.')
      // }
    }

    DiscardRunfunction(){
      return this.navigateTOhome();
    }

    navigateTOhome(){
      this.props.navigator.replace({
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

    IfnotLogin(){
      var cause = this.props.data;
      var CauseShareMessage = cause.cause_share_message_template;
      console.log('causeMessage'+CauseShareMessage);
      var distance = this.props.distance;
      var impact =this.props.impact;
      var time = this.props.time;
      let shareOptions = {
        title: "ImpactRun",
        message:"I ran"+distance+" kms and raised " +impact+ " rupees for "+cause.partners[0].partner_ngo+" on #Impactrun. Kudos "+cause.sponsors[0].sponsor_company+" for sponsoring my run.",
        url: "http://www.impactrun.com/#",
        subject: "Download ImpactRun Now " //  for email
      };
      if (!this.state.loaded) {
        return(
         <Text>loding sharescreen</Text>
        )
      }
      if (!this.state.user) {
        var distance = this.props.distance;
        var impact= this.props.impact;
        return(
        <View style={{height:deviceHeight,width:deviceWidth,}}>
          <View style={styles.container}>
            <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
              <View style={{flexDirection:'row',flex:1}}>
                <View style={styles.wrapperRunContent}>
                  <Icon style={{color:'black',fontSize:35,}} name={'ios-walk-outline'}></Icon>
                  <Text>{distance}</Text>
                  <Text> DISTANCE</Text>
                </View>
                <View style={styles.wrapperRunContentImpact}>
                  <Text>IMPACT</Text>
                  <Text>{impact}</Text>
                </View>
                <View style={styles.wrapperRunContent}>
                  <Icon style={{color:'black',fontSize:30,}} name={'md-stopwatch'}></Icon>
                  <Text>{time}</Text>
                  <Text>Min</Text>
                </View>
              </View>
              <View style={{ flexDirection:'column',flex:1,justifyContent: 'center',alignItems: 'center',}}>
                <View style={{bottom:20, justifyContent: 'center',alignItems: 'center',}}>
                  <Text> Please login to </Text>
                  <Text>unlease your impact</Text>
                </View>
                <LoginBtns/>
                <TouchableOpacity style={{bottom:50,width:deviceWidth,height:50,justifyContent: 'center',alignItems: 'center',}} onPress={()=> this.PopForRunNOtSubmit()}>
                  <Text>Skip</Text>
                </TouchableOpacity>
              </View>
            </Image>
          </View>
        </View>
       )
      }
      var distance = this.props.distance;
      var impact= this.props.impact;
      return(
        <View style={styles.container}>
          <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
            <View style={{flexDirection:'row',flex:1}}>
              <View style={styles.wrapperRunContent}>
                <Icon style={{color:'black',fontSize:35,}} name={'ios-walk-outline'}></Icon>
                <Text>{distance}</Text>
                <Text> Kms</Text>
              </View>
              <View style={styles.wrapperRunContentImpact}>
                <Text>IMPACT</Text>
                <Text>{impact}</Text>
              </View>
              <View style={styles.wrapperRunContent}>
                <Icon style={{color:'black',fontSize:30,}} name={'md-stopwatch'}></Icon>
                <Text>{time}</Text>
                <Text>Min</Text>
              </View>
            </View>
            <View style={{flex:1}}>
              <View style={{bottom:20, justifyContent: 'center',alignItems: 'center',}}>
                <Text> Share your impact</Text>
                <Text>with your friends</Text>
              </View>
              <View style={{width:deviceWidth,justifyContent: 'center',alignItems: 'center',flexDirection:'column'}}>
                <TouchableOpacity onPress={()=>Share.open(shareOptions)} style={styles.shareButton}>
                 <Icon style={{color:'white',fontSize:20,margin:10,}} name={'md-share'}></Icon>
                 <Text style={{color:'white'}}>SHARE IMPACT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{top:50,width:deviceWidth,height:50,justifyContent: 'center',alignItems: 'center',}} onPress={()=> this.navigateToThankyou()}>
                  <Text>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Image>
        </View>  
      )
    }

    render() {
      var data = this.props.data;
      console.log('dataCause',data);
      return(
         <View style={styles.container}>
          {this.IfnotLogin()}
        </View>
      )  
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
      shareButton:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:50,
        width:deviceWidth-150,
        backgroundColor:'#e03ed2',
        borderRadius:30,
      },
  })

 export default ShareScreen;