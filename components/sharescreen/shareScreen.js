
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
    TextInput,
    NetInfo,
    ActivityIndicatorIOS,
  } from 'react-native';
  
  import ImageLoad from 'react-native-image-placeholder';
  import apis from '../apis';
  import TimerMixin from 'react-timer-mixin';
  import Icon from 'react-native-vector-icons/Ionicons';
  import Icon2 from 'react-native-vector-icons/MaterialIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import styleConfig from '../styleConfig';
  const WHATSAPP_ICON = "data:image/png;base64,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";
  const REACT_ICON = 'data:image/png;base64,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';
  var deviceWidth = Dimensions.get('window').width;
  var deviceHeight = Dimensions.get('window').height;
  import Modal from '../downloadsharemeal/CampaignModal'
  import LoginBtns from '../login/LoginBtns';
  import { takeSnapshot } from "react-native-view-shot";
  import Share, {ShareSheet, Button} from 'react-native-share';
  import ImpactLeague from '../ImpactLeague/ImpactLeagueHome';
  import Profile from '../profile/profile.index';
  import Tab from '../homescreen/tab';
  const FBSDK = require('react-native-fbsdk');
   var moment = require('moment');

  const {
    ShareDialog,
  } = FBSDK;


  class ShareScreen extends Component {

    mixins: [TimerMixin]
    constructor(props) {
      super(props);

           
      // var cause = this.props.data;
      // var distance = this.props.distance;
      // var impact =this.props.impact;
      // var time = this.props.time;
      // const shareLinkContent = {
      //     contentType: 'link',
      //     contentUrl: cause.cause_image,
      //     contentDescription: "I ran "+distance+" kms and raised " +impact+ " rupees for "+cause.partners[0].partner_ngo+" on #Impactrun. Kudos "+cause.sponsors[0].sponsor_company+" for sponsoring my run.",
      //     contentTitle:cause.cause_title,
      //     imageUrl:cause.cause_image,
      // };

      this.state = {
        loaded:false,
        visible: false,
        user:null,
        sadView:false,
        happyView:false,
        firstModel:true,
        postingRun:false,
        thankYouimageIndex:0,
        userLoaded:false,
        Duration:'00:00:00',
        openlikeUnlike:false,
        previewSource: '',
        error: null,
        res: null,
        my_rate:1.0,
        my_currency:"INR",
        value: {
          format: "png",
          quality: 0.9,
          result: "base64",
          snapshotContentContainer: false,
        },

        sadFeedbackText:'enter your feedback'
       };
      this.viewData = this.viewData.bind(this);
      this.isloading = this.isloading.bind(this);
      this.getUserData = this.getUserData.bind(this);
    }


    snapshot(captureScreenShot){

    takeSnapshot(this.refs[captureScreenShot], this.state.value)
    .then(res =>
      this.state.value.result !== "file"
      ? res
      : new Promise((success, failure) =>
      // just a test to ensure res can be used in Image.getSize
      Image.getSize(
        res,
        (width, height) => (console.log(res,width,height), success(res)),
        failure
      )
      )
        
    )
    .then((res) => {
      this.setState({
        error: null,
        res,
        previewSource: { uri:
          this.state.value.result === "base64"
          ? "data:image/"+this.state.value.format+";base64,"+res
          : res }
      })

      var shareOptions = {
        // title: "ImpactRun",
        // message:"I ran "+distance+" kms and raised " +impact+ " rupees for "+cause.partners[0].partner_ngo+" on #Impactrun. Kudos "+cause.sponsors[0].sponsor_company+" for sponsoring my run.",
        url:"data:image/"+this.state.value.format+";base64,"+res,
        // subject: "Download ImpactRun Now " //  for email
      }
      Share.open(shareOptions)
    })
    .catch(error => (console.warn(error), this.setState({ error, res: null, previewSource: null })));
    }

    getUserData(){
      var me = this;
      AsyncStorage.getItem('USERDATA', (err, result) => {
        let user = JSON.parse(result);
        this.setState({
          user:user,
          userLoaded:true,
        })
       
        if (this.state.user) {
        this.ifConnectTonetPost();
        }else{
          this.SaveRunLocally();
          AlertIOS.alert('Login', 'please login to create impact');
        }
      },1000);
        
    }
    
    shareLinkWithShareDialog() {
      var tmp = this;
      ShareDialog.canShow(this.state.shareLinkContent).then(
        function(canShow) {
          if (canShow) {
            return ShareDialog.show(tmp.state.shareLinkContent);
          }
        }
      )
      .then((result)=>{
       if (result.isCancelled) {
            this.navigateTOhome();
            AlertIOS.alert('Canceled','Post canceled.');
          } else {
            this.navigateTOhome();
            AlertIOS.alert('Success','Thankyou for sharing');
          }
       
        // function(result) {
        //   if (result.isCancelled) {
            
        //   } else {
        //     this.navigateTOhome();
        //     alert('Success','Thankyou for sharing');
        //   }
        // },
        // function(error) {
        //   alert('Share fail with error: ' + error);
        // }
        
 
      })
      
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
      this.getUserData();  
      this.getILdata();   
      var cause = this.props.data;
      this.setState({
        thankYouimageIndex:Math.floor(Math.random() * cause.cause_thank_you_image_v2.length)
      })
      // var data = this.props.data;
      // setTimeout(function(){
      //   AlertIOS.alert('Thankyou','Impact created on cause '+ '"'+data.cause_title+'"');
      //  console.log('after 2 sec');
      // },2000)
       var time2 = this.props.time;
      if (time2.length <= 2) {
       var time = '00:'+'00:'+time2;
      }else if (time2.length == 5) {
       var time = '00:'+time2;
      }else if (time2.length > 5 ) {
       var time = time2;
      };
      this.setState({
        Duration:time,
      })
      this.getSavedRunCount();
      this.AddruntoRunHistory(time);

    } 

    getSavedRunCount(){
      AsyncStorage.getItem("SaveRunCount").then((value) => {
        if (value != null) {
          this.setState({saveRunCountData : value});
        }else{
          this.setState({saveRunCountData : '-1'});
        }
      }).done();
    }
    
    getSavedRun(){
      AsyncStorage.multiGet(['RID0'], (err, stores) => {
      stores.map((result, i, store) => {
        let key = store[i][0];
        let val = store[i][1];
        this.setState({
        rundata:JSON.parse(val),  
        loaded:true,             
        })  
        });
      });
    }

    ifConnectTonetPost(){
      NetInfo.isConnected.fetch().done(
      (isConnected) => { 
        if (isConnected) {
          console.log("openVersion");
           this.PostRun();
          }else{
           this.SaveRunLocally();
          }
        }
      );
    }

    handleNetworkErrors(response){
       if(response.ok){
        return response.json();
       }else{
        this.setState({
          postingRun:false,
        })
        this.SaveRunLocally();
        AlertIOS.alert("Network error","There is some problem connecting to internet");
        return ;
       }
       
    }
  
    SaveRunLocally(){
      if (this.props.user) {
     var saveRuns = parseInt(this.state.saveRunCountData)+ 1 ;
     var startPosition = this.props.StartLocation;
     var endPosition = this.props.EndLocation;
     AsyncStorage.setItem("SaveRunCount",JSON.stringify(saveRuns));
     var cause = this.props.data;
     var CauseShareMessage = cause.cause_share_message_template;
     var speed = this.props.speed;
     var distance = this.props.distance;
     var impact =this.props.impact;
     var steps = this.props.noOfsteps;
     var time = this.props.time;
     var date = this.props.StartRunTime;
     var endtime = this.props.EndRunTime;
     var RunNumber = this.state.RunNumber;
     var userdata = this.props.user;
     var user_id =JSON.stringify(userdata.user_id);
     var token = JSON.stringify(userdata.auth_token);
     var tokenparse = JSON.parse(token);
     var Runid = this.state.runid;
     var calories_burnt = this.props.calories_burnt;
       let RID1  = {
        cause_run_title:cause.cause_title,
        user_id:user_id,
        start_time: date,
        end_time: endtime,
        distance: parseFloat(distance).toFixed(1),
        peak_speed: 1,
        avg_speed:speed,
        run_amount:impact,
        run_duration: time,
        is_flag:false,
        calories_burnt:calories_burnt,
        team_id:this.state.impactleague_team_id,
        start_location_lat:startPosition.latitude,
        start_location_long:startPosition.longitude,
        end_location_lat:endPosition.latitude,
        end_location_long:endPosition.longitude,
        no_of_steps:steps,
        is_ios:true,
       
      };
      
     var RunNO = "RID"+saveRuns;
      let multi_set_pairs = [
          [RunNO, JSON.stringify(RID1)],
      ]
       let multi_merge_pairs = [
          [RunNO, JSON.stringify(RID1)],
      ]

     AsyncStorage.setItem(RunNO,JSON.stringify(RID1));
      AsyncStorage.multiSet(multi_set_pairs, (err) => {
          AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
              AsyncStorage.multiGet([RunNO], (err, stores) => {
                  stores.map((result, i, store) => {
                      let key = store[i][0];
                      let val = store[i][1];
                      this.setState({
                       userRunData:val,
                      })
                  });                 
              })
            .then((userRunData) => { 
              // AlertIOS.alert('userndata',JSON.stringify(userRunData));
            })
            .done();
          })
          
       });
     }else{
      return;
     }
  
    }
    
    componentWillMount() {
    AsyncStorage.getItem('my_currency', (err, result) => {
        this.setState({
          my_currency:JSON.parse(result),
      })
      })     
      
    AsyncStorage.getItem('my_rate', (err, result) => {
        this.setState({
          my_rate:JSON.parse(result),
      })
      }) 
 
    }
 

    async PostRun(){
      if (this.props.user) {
        this.setState({
          postingRun:true
        })
      }else{
        this.setState({
          postingRun:false,
        })
      }
      if (this.props.user) {       
      var distance = this.props.distance;
      var speed = this.props.speed;
      var impact = this.props.impact;
      var steps = this.props.noOfsteps;
      var time = this.props.time;
      var date = this.props.StartRunTime;
      var endtime = this.props.EndRunTime;
      var userdata = this.props.user;
      var user_id =JSON.stringify(userdata.user_id);
      var token = JSON.stringify(userdata.auth_token);
      var tokenparse = JSON.parse(token);
      var calories_burnt = this.props.calories_burnt;
      var startPosition = this.props.StartLocation;
      var endPosition = this.props.EndLocation;
      var cause = this.props.data;
      // try{
      //   let response = await fetch('https://mywebsite.com/endpoint/');
      //   let responseJson = await response.json();

      // }
      // catch{

      // }
      var _this = this;
      setTimeout( function(){
      try{
      fetch(apis.runApi, {
         method: "POST",
         headers: {  
            'Authorization':"Bearer "+ tokenparse,
            'Accept': 'application/json',
            'Content-Type': 'application/json',           
          },
          body:JSON.stringify({
          cause_run_title:cause.cause_title,
          cause_id:cause.pk,
          user_id:user_id,
          start_time:date,
          end_time:endtime,
          distance: distance,
          peak_speed: 1,
          avg_speed:speed,
          run_amount:impact,
          run_duration: time,
          is_flag:false,
          calories_burnt:calories_burnt,
          team_id:_this.state.impactleague_team_id,
          start_location_lat:startPosition.latitude,
          start_location_long:startPosition.longitude,
          end_location_lat:endPosition.latitude,
          end_location_long:endPosition.longitude,
          no_of_steps:steps,
          is_ios:true,     
          })
       })
      .then(_this.handleNetworkErrors.bind(_this))
      .then((userRunData) => { 
         _this.setState({
          postingRun:false,
         })
        AsyncStorage.removeItem('runversion',(err) => {
           console.log("runversionremoved");
        });
        var epochtime = userRunData.version;
        let responceversion = {
         runversion:epochtime
        }
        AsyncStorage.mergeItem("runversion",JSON.stringify(responceversion),(data)=>{
          console.log("removed version share ",responceversion);
        })
        .catch((error)=>{
         console.log("err",error);
        })
       })
      .catch((error)=>{
        console.log("errorPostrunShare ",error);
        _this.SaveRunLocally();
        _this.setState({
          postingRun:false,
        })

      })
    }
    catch (error) {
       _this.SaveRunLocally();
    }
    }, 3000);
    }else{
      this.setState({
          postingRun:false,
        })
     }
  }

    DiscardRunfunction(){
      return this.navigateTOhome();
    }

    AddruntoRunHistory(time){

      var distance = this.props.distance;
      var speed = this.props.speed;
      var impact = this.props.impact;
      var steps = this.props.noOfsteps;

      var date = this.props.StartRunTime;
      var endtime = this.props.EndRunTime;
      var cause = this.props.data;
      var calories_burnt = this.props.calories_burnt;
      var startPosition = this.props.StartLocation;
      var endPosition = this.props.EndLocation;
      var me = this;
      
      setTimeout( function(){ AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
             var rundata = JSON.parse(result);
             if (rundata != null) {
             var newRun = {
               cause_run_title:cause.cause_title,
               start_time:date,
               end_time: endtime,
               cause_id:cause.pk,
               distance: Number(distance),
               peak_speed: 1,
               avg_speed:speed,
               run_amount:impact,
               run_duration: time,
               is_flag:false,
               calories_burnt:calories_burnt,
               team_id:me.state.impactleague_team_id,
               start_location_lat:startPosition.latitude,
               start_location_long:startPosition.longitude,
               end_location_lat:endPosition.latitude,
               end_location_long:endPosition.longitude,
               no_of_steps:steps,
               is_ios:true,  
             }
             var newRunArray = [];
             var runSavedata = newRunArray.push(newRun);
             var newtoprun =newRunArray.concat(rundata);
             AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
             });
             let fetchRunhistoryData = newtoprun;
             AsyncStorage.setItem('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData), (data) => {
             })
            }else{
             var newRun = {
               cause_run_title:cause.cause_title,
               start_time:date,
               end_time: endtime,
               distance:  Number(distance),
               cause_id:cause.pk,
               peak_speed: 1,
               avg_speed:speed,
               run_amount:impact,
               run_duration: time,
               is_flag:false,
               calories_burnt:calories_burnt,
               team_id:me.state.impactleague_team_id,
               start_location_lat:startPosition.latitude,
               start_location_long:startPosition.longitude,
               end_location_lat:endPosition.latitude,
               end_location_long:endPosition.longitude,
               no_of_steps:steps,
               is_ios:true,  
             }
             var newRunArray = [];
             var runSavedata = newRunArray.push(newRun);
             var newtoprun = newRunArray;
             AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
             });
             let fetchRunhistoryData = newtoprun;
             AsyncStorage.setItem('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData), (data) => {
             })
            
            }
           })
           },3000);    
    }
    
    getILdata(){
      AsyncStorage.getItem('teamleaderBoardData', (err, result) => {
        if (result != null || undefined) {
        var boardData = JSON.parse(result);
        if (this.state.user) {
          this.setState({
            impactleague_team_id:this.state.user.team_code,

          })
        }
        if (boardData.impactleague_is_active) {   
          this.setState({
            title:'ImpactLeague',
            navigatetopage:ImpactLeague,
          }) 
        }else{
          this.setState({
            title:'Profile',
            navigatetopage:Profile,
          })
        }
        }else{
          this.setState({
            title:'ImpactRun',
            navigatetopage:Tab,
            impactleague_team_id:'',
          })
        }       
      }); 
    }

    navigatetotab(){
      this.props.navigator.push({
        navigationBarHidden:true,
        title:'ImpactRun',
        showTabBar: true,
        component:Tab,
      })
    }

    navigateTOhome(){
      this.props.navigator.push({
      title: 'Gps',
      id:'tab',
      passProps:{profileTab:'profile', user:this.props.user},
      navigator: this.props.navigator,
      })

      // this.props.navigator.replace({
      // navigationBarHidden:false,
      // title:this.state.title,
      // showTabBar: false,
      // component:Tab,
      // passProps:{profileTab:'profile'},
      // })
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

    SadIconClick(){
     this.setState({
      sadView:true,
      happyView:false,
      firstModel:false,
     })
    }

    HappyIconClick(){
      this.setState({
      sadView:false,
      happyView:true,
      firstModel:false,
     })
    }

    viewData(){
      if (this.state.happyView) {
        return(
          <View  style={styles.contentWrap}>
            <Text style={{textAlign:'center',margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:20}}>TELL US ABOUT IT!</Text>
            <View style={styles.modelBtnWrapsad}>
              <Text style={{textAlign:'center',color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,bottom:10}}>Thank You ! Rate us on  App store, tell others about your experience.</Text>
              <TouchableOpacity style={styles.modelbtnsadFeedback} onPress ={()=>this.HappyIconClick()}><Text style={{textAlign:'center',color:'white',fontWeight:'400',fontFamily: styleConfig.FontFamily}}>RATE US</Text></TouchableOpacity>
            </View>
          </View>
          )
      }else if(this.state.sadView){
        return(
          <View  style={styles.contentWrap}>
            <Text style={{textAlign:'center',margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:20}}>TELL US ABOUT IT!</Text>
            <View style={styles.modelBtnWrapsad}>
            <TextInput  
               style={{height:100,borderWidth:1,width:deviceWidth-150}}
               multiline = {true}
               numberOfLines = {10}
               onChangeText={(text) => this.setState({sadFeedbackText:text})}
               value={this.state.sadFeedbackText}>
             </TextInput>
              <TouchableOpacity style={styles.modelbtnsadFeedback}onPress ={()=>this.HappyIconClick()}><Text style={{textAlign:'center',color:'white',fontWeight:'400',fontFamily: styleConfig.FontFamily}}>SUBMIT</Text></TouchableOpacity>
            </View>
          </View>
        )
      }else if(this.state.firstModel){
        return(
          <View  style={styles.contentWrap}>
            <Text style={{textAlign:'center',margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:20}}>How was you run ?</Text>
            <View style={styles.modelBtnWrap}>
              <TouchableOpacity style={styles.modelbtnSad} onPress ={()=>this.SadIconClick()}><Icon style={{color:styleConfig.bright_blue,fontSize:((deviceHeight/3)/100)*40,}} name={'md-sad'}></Icon><Text style={{textAlign:'center',color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily}}>NOT GOOD!</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modelbtnHappy}onPress ={()=>this.HappyIconClick()}><Icon style={{color:styleConfig.bright_blue,fontSize:((deviceHeight/3)/100)*40,}} name={'md-happy'}></Icon><Text style={{textAlign:'center',color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily}}>I LOVED IT!</Text></TouchableOpacity>
            </View>
          </View>
        )
      }
    }

    openModelLikeUnlikeView(){
        return(
          <Modal
          onPress={()=>this.closemodel()}
          style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
             isOpen={this.state.openlikeUnlike}
               >
                  <View style={styles.modelWrap}>
                    {this.viewData()}
                  </View>
            </Modal>
          )

    }

    openModelLikeUnlike(){
      this.setState({
        openlikeUnlike:true,
      })
    }
    closemodel(){
      this.setState({
        openlikeUnlike:false,
      })
    }


    render() {

      var data = this.props.data;
      var cause = this.props.data;
      var CauseShareMessage = cause.cause_share_message_template;
      var distance = this.props.distance;
      var impact =this.props.impact;
      var time = this.props.time;
     
      let shareOptions = {
        // title: "ImpactRun",
        // message:"I ran "+distance+" kms and raised " +impact+ " rupees for "+cause.partners[0].partner_ngo+" on #Impactrun. Kudos "+cause.sponsors[0].sponsor_company+" for sponsoring my run.",
        url:REACT_ICON,
        // subject: "Download ImpactRun Now " //  for email
      };
     if (this.state.userLoaded === true) {
      if (this.state.user === null ) {
       
        return(
       <View style={styles.container}>
          <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
            <View style={{flexDirection:'column',flex:-1,backgroundColor:'white', height:deviceHeight/3+20,paddingTop:styleConfig.navBarHeight-20}}>
              <View style={styles.wrapperRunContentImpact}>
                <Text style={{marginBottom:10,fontWeight:'800',color:'#4a4a4a',fontSize:styleConfig.fontSizerImpact-10}}>Thank you {username}</Text>
                <Text style={{fontSize:styleConfig.fontSizerImpact, color:'orange',fontWeight:'500',fontFamily:styleConfig.FontFamily}}><Icon3 style={{color:styleConfig.orange,fontSize:styleConfig.fontSizerImpact-5,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}/>{(this.state.my_currency == 'INR' ? impact : parseFloat(impact/this.state.my_rate).toFixed(2))}</Text>
                <Text style={styles.lableText}>Impact</Text>
              </View>
              <View style={{width:deviceWidth,flexDirection:"row",top:20,}}>              
               <View style={styles.wrapperRunContent}>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',fontSize:styleConfig.fontSizerImpact-10}}>{parseFloat(this.props.calories_burnt).toFixed(1)}<Text style={[styles.lableText,{fontSize:styleConfig.fontSizerlabel+5}]}> cal</Text> </Text>
                  <Text style={styles.lableText}>Calories burned</Text>
                </View>
              <View style={styles.wrapperRunContent2}>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular' ,fontSize:styleConfig.fontSizerImpact-10,}}>{this.state.Duration}</Text>
                <Text style={styles.lableText}>Duration</Text>
              </View>
              </View>
            </View>
            <View style={{height:deviceHeight/3+30,width:deviceWidth,backgroundColor:'white',}}>
             <ImageLoad placeholderSource={require('../../images/cause_image_placeholder.jpg')} isShowActivity={true} placeholderStyle={{height:deviceHeight/3+30,width:deviceWidth}} loadingStyle={{size: 'small', color: 'grey'}}  style={{height:deviceHeight/3+30,width:deviceWidth}} resizeMode ={'stretch'} source={{uri:cause.cause_thank_you_image_v2[this.state.thankYouimageIndex].cause_thank_you_image}} ></ImageLoad> 
            </View>
            <View style={{flex:1 ,alignItems: 'center',justifyContent: 'center', flexDirection:'column',backgroundColor:'white'}}>
             <View style={{height:styleConfig.navBarHeight-30,width:deviceWidth,flex:-1,flexDirection:'row',width:deviceWidth,justifyContent: 'center',alignItems: 'center',position:'absolute',top:0}}>            
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={styles.lableText}>How was it?</Text>
                </View>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={styles.lableText}>Tell your friends!</Text>                 
                </View>
              </View>
              <View style={{flex:-1,width:deviceWidth, flexDirection:'row'}}>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <TouchableOpacity onPress={() => this.shareLinkWithShareDialog()} style={{height:styleConfig.navBarHeight-10,width:styleConfig.navBarHeight-10,borderRadius:(styleConfig.navBarHeight-10)/2,backgroundColor:'white',justifyContent: 'center',alignItems: 'center',shadowColor: '#000000',shadowOpacity: 0.4,shadowRadius: 4,shadowOffset: {height: 2,},}}>
                   <Icon2 style={{color:styleConfig.greyish_brown_two,fontSize:28,backgroundColor:'transparent'}} name="thumbs-up-down"></Icon2>
                  </TouchableOpacity>
                </View>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <TouchableOpacity onPress={()=>Share.open(shareOptions)} style={{height:styleConfig.navBarHeight-10,width:styleConfig.navBarHeight-10,borderRadius:(styleConfig.navBarHeight-10)/2,backgroundColor:styleConfig.bright_blue,justifyContent: 'center',alignItems: 'center',shadowColor: '#000000',shadowOpacity: 0.4,shadowRadius: 4,shadowOffset: {height: 2,},}}>
                    <Icon style={{color:'white',fontSize:styleConfig.fontSizerlabel+20}}name={'md-share'}></Icon>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{bottom:10,height:40,width:deviceWidth,justifyContent: 'center',alignItems: 'center',position:'absolute'}}>            
                <TouchableOpacity  onPress={() => this.navigateTOhome()}>
                  <Text style={{color:styleConfig.bright_blue,fontFamily: 'Montserrat-Regular',}}>Skip ></Text>
                </TouchableOpacity>
              </View>
            </View>
          </Image>
        </View>  
       )
      }else{
      var username = (this.state.user != null)?this.state.user.first_name:'Awesome man'
      return(
        <View style={styles.container}>
          <Image source={require('../../images/backgroundLodingscreen.png')} style={styles.shadow}>
           <View ref='captureScreenShot'>
            <View style={{flexDirection:'column',flex:-1,backgroundColor:'white', height:deviceHeight/3+20,paddingTop:styleConfig.navBarHeight-20}}>
              <View style={styles.wrapperRunContentImpact}>
                <Text style={{marginBottom:10,fontWeight:'800',color:'#4a4a4a',fontSize:styleConfig.fontSizerImpact-10}}>Thankyou {username}</Text>
                <Text style={{fontSize:styleConfig.fontSizerImpact, color:'orange',fontWeight:'500',fontFamily:styleConfig.FontFamily}}><Icon3 style={{color:styleConfig.orange,fontSize:styleConfig.fontSizerImpact-5,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}/>{(this.state.my_currency == 'INR' ? impact : parseFloat(impact/this.state.my_rate).toFixed(2))}</Text>
                <Text style={styles.lableText}>Impact</Text>
              </View>
              <View style={{width:deviceWidth,flexDirection:"row",top:20,}}>              
               <View style={styles.wrapperRunContent}>
                  <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular',fontSize:styleConfig.fontSizerImpact-10}}>{parseFloat(this.props.calories_burnt).toFixed(1)}<Text style={[styles.lableText,{fontSize:styleConfig.fontSizerlabel+5}]}> cal</Text> </Text>
                  <Text style={styles.lableText}>Calories burned</Text>
                </View>
              <View style={styles.wrapperRunContent2}>
                <Text style={{color:'#4a4a4a',fontFamily: 'Montserrat-Regular' ,fontSize:styleConfig.fontSizerImpact-10,}}>{this.state.Duration}</Text>
                <Text style={styles.lableText}>Duration</Text>
              </View>
              </View>
            </View>
            <View style={{height:deviceHeight/3+30,width:deviceWidth,backgroundColor:'white',}}>
             <ImageLoad placeholderSource={require('../../images/cause_image_placeholder.jpg')} isShowActivity={true} placeholderStyle={{height:deviceHeight/3+30,width:deviceWidth}} loadingStyle={{size: 'small', color: 'grey'}}  style={{height:deviceHeight/3+30,width:deviceWidth}} resizeMode ={'stretch'} source={{uri:cause.cause_thank_you_image_v2[this.state.thankYouimageIndex].cause_thank_you_image}} ></ImageLoad> 
            </View>
            </View>
            <View style={{flex:1 ,alignItems: 'center',justifyContent: 'center', flexDirection:'column',backgroundColor:'white'}}>
             <View style={{height:styleConfig.navBarHeight-30,width:deviceWidth,flex:-1,flexDirection:'row',width:deviceWidth,justifyContent: 'center',alignItems: 'center',position:'absolute',top:0}}>            
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={styles.lableText}>How was it?</Text>
                </View>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={styles.lableText}>Tell your friends!</Text>                 
                </View>
              </View>
              <View style={{flex:-1,width:deviceWidth, flexDirection:'row'}}>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <TouchableOpacity onPress={() => this.openModelLikeUnlike()} style={{height:styleConfig.navBarHeight-10,width:styleConfig.navBarHeight-10,borderRadius:(styleConfig.navBarHeight-10)/2,backgroundColor:'white',justifyContent: 'center',alignItems: 'center',shadowColor: '#000000',shadowOpacity: 0.4,shadowRadius: 4,shadowOffset: {height: 2,},}}>
                   <Icon2 style={{color:styleConfig.greyish_brown_two,fontSize:28,backgroundColor:'transparent'}} name="thumbs-up-down"></Icon2>
                  </TouchableOpacity>
                </View>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <TouchableOpacity onPress={()=> this.snapshot('captureScreenShot')} style={{height:styleConfig.navBarHeight-10,width:styleConfig.navBarHeight-10,borderRadius:(styleConfig.navBarHeight-10)/2,backgroundColor:styleConfig.bright_blue,justifyContent: 'center',alignItems: 'center',shadowColor: '#000000',shadowOpacity: 0.4,shadowRadius: 4,shadowOffset: {height: 2,},}}>
                    <Icon style={{color:'white',fontSize:styleConfig.fontSizerlabel+20}}name={'md-share'}></Icon>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{bottom:10,height:40,width:deviceWidth,justifyContent: 'center',alignItems: 'center',position:'absolute'}}>            
                <TouchableOpacity  onPress={() => this.navigateTOhome()}>
                  <Text style={{color:styleConfig.bright_blue,fontFamily: 'Montserrat-Regular',}}>Skip ></Text>
                </TouchableOpacity>
              </View>
            </View>
          </Image>
          {this.openModelLikeUnlikeView()}
        </View>  
      )
     }
   }else{
    return (<View>
      {this.isloading()}
      </View>
      )
   }
   }

    isloading(){
      if (this.state.postingRun) {
        return(
          <View style={{position:'absolute',top:0,backgroundColor:'rgba(4, 4, 4, 0.56)',height:deviceHeight,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
            <ActivityIndicatorIOS
             style={{height: 80}}
              size="large"
            >
            </ActivityIndicatorIOS>
          </View>
          )
      }else{
        return;
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
      alignItems: 'flex-start',
      paddingLeft:40,
      width:deviceWidth/2,
    },
    wrapperRunContent2:{
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight:40,
      width:deviceWidth/2,
    },
    wrapperRunContentImpact:{
      justifyContent: 'center',
      alignItems: 'center',
      width:deviceWidth,
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
    lableText:{
      fontSize:styleConfig.fontSizerlabel, 
      fontFamily: styleConfig.FontFamily,
      color:'grey'
    },
     modelStyle:{
    justifyContent: 'center',
    alignItems: 'center',
   },
   modelWrap:{
    padding:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    borderRadius:5,
   },
   iconWrapmodel:{
     justifyContent: 'center',
     alignItems: 'center',
     height:70,
     width:70,
     marginTop:-55,
     borderRadius:35,
     backgroundColor:styleConfig.bright_blue,
     shadowColor: '#000000',
     shadowOpacity: 0.4,
     shadowRadius: 4,
     shadowOffset: {
      height: 2,
     },
   },
   contentWrap:{
    height:deviceHeight/3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    width:deviceWidth-100,
   },
   modelBtnWrap:{
    marginTop:10,
    width:deviceWidth-100,
    flexDirection:'row',
    justifyContent: 'space-between',
   },

   modelBtnWrapsad:{
    marginTop:10,
    width:deviceWidth-100,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
   },

   modelbtnSad:{
    flexDirection:'column',
    height:((deviceHeight/3)/100)*50,
    width:((deviceHeight/3)/100)*50,
    margin:5,
    borderRadius:(((deviceHeight/3)/100)*50)/2,
    backgroundColor:'white',
    justifyContent: 'center',
    alignItems: 'center',
   },
  modelbtnHappy:{
    flexDirection:'column',
    height:((deviceHeight/3)/100)*50,
    width:((deviceHeight/3)/100)*50,
    margin:5,
    borderRadius:(((deviceHeight/3)/100)*50)/2,
    backgroundColor:'white',
    justifyContent: 'center',
    alignItems: 'center',
   },
   modelbtnsadFeedback:{
    flexDirection:'column',
    height:40,
    width:deviceWidth-150,
    margin:5,
    borderRadius:5,
    backgroundColor:styleConfig.bright_blue,
    justifyContent: 'center',
    alignItems: 'center',
   },
   btntext:{
    color:"white",
    textAlign:'center',
    margin:5,
    fontWeight:'600',
    fontFamily: styleConfig.FontFamily,
   },
  })

 export default ShareScreen;