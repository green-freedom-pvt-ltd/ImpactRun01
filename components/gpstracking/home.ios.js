'use strict';
import React, { Component } from 'react';
var ReactNative = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SwitchIOS,
  TouchableHighlight,
  AlertIOS,
  AsyncStorage,
  TouchableOpacity,
  Image,
  Animated,
  VibrationIOS,
  DeviceEventEmitter,
  PushNotificationIOS,
 } = ReactNative;
 var PushNotification = require('react-native-push-notification');
 var { RNLocation: Location } = require('NativeModules');
 var moment = require('moment');
import TimeFormatter from '../counterRuntime.js';
const { SampleView } = require('react-native').NativeModules;
import Modal from '../downloadsharemeal/CampaignModal'
import TimerMixin from 'react-timer-mixin';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
// import Mapbox from 'react-native-mapbox-gl';
import ShareScreen from '../sharescreen/shareScreen.js';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles from '../../components/styles';
import styleConfig from '../../components/styleConfig';
import haversine from 'haversine';
import CaloriCounter from './caloriCounter';
import Tabs from '../homescreen/tab';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

var Pedometer = require('react-native-pedometer');
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;
var distancePriv = 0;
var timepriv = 0;
var calories = 0;




class Home extends Component {
    mixins: [TimerMixin]
   
   constructor(props) {
        super(props);
        
        this.state = {
          startDate: null,
        // endDate: null,
        numberOfSteps: 0,
        distance: 0,
        floorsAscended: 0,
        floorsDescended: 0,
        currentPace: 0,
        currentCadence: 0,
        isRunning:true,
        mainTimer:0,
        speed:0,
        prevLatLng: {},
        distanceTravelled: 0,
        prevDistance:0,
        textState:'PAUSE',
        Enbtn:'END RUN',
        enabled: true,
        isMoving: true,
        distanceTravelledsec:0,
        paceButtonIcon: 'md-pause',
        navigateButtonIcon: 'md-locate',
        MetsValue:0,
        weight:null,
        calorieBurned:0.0,
        storedRunduration:0,
        timeBetweenTwoPoint:0,
        permissions:null,
        gpsNotAccepatableStepvalue:0,
        mapHeight: 280,
        mapWidth: 300,
        zoom: 18,
        open:false,
        sourceCount:true,
        GpsAccuracyCheck:true,
        openGpsModel:false,
        annotations: [],
        HussainBoltCount:0,
        StillDecteting:true,
        location:{},
        pressAction: new Animated.Value(0,{ useNativeDriver: true }),
        center: {
          latitude: 40.72052634,
          longitude: -73.97686958312988
        },
        onCarDetectedEndRunModel:false,
        weakGPSPoints: 0,
        componentISmounted:true,
        my_rate:1.0,
        my_currency:"INR",
      };
    }

  

  
  componentDidMount(){  
    if (this.state.componentISmounted) {
    this.refs.circularProgress.performLinearAnimation(parseFloat(this.state.distanceTravelled).toFixed(0), 1000)
    this.getWeight();
    this.saveDataperiodcally(); 
    this._startStepCounterUpdates()
    var date = this.state.myrundate;
    this._handleStartStop();
    this.updatePaceButtonStyle(); 
     var d = moment().format('YYYY-MM-DD HH:mm:ss');
    
      this.setState({
        myrundate:d,
      });
    }
  }
 


  componentWillMount() { 
    // MusicFiles.get(
    //   (success) => {
    //      console.log('success',success);
    //   },
    //   (error) => {
    //        console.log(error)
    //   }
    // );
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
    AsyncStorage.getItem('my_distance', (err, result) => {
        this.setState({
          my_distance:JSON.parse(result),
      })
    })     


    AsyncStorage.getItem('runDataAppKill', (err, result) => {
    var datarun =JSON.parse(result);
      if (datarun != null) { 
        this.setState({
          result:result,
          distanceTravelledsec:datarun.distance,
          storedRunduration:datarun.time,
        })
        distancePriv = this.state.distanceTravelledsec;
        timepriv = this.state.storedRunduration;
        calories = datarun.calories_burnt;
        console.log("distanceTravelledsec12 ",this.state.distanceTravelledsec);
      }else{
       
      }   
    });    

    AsyncStorage.getItem('USERDATA', (err, result) => {
      console.log("userresult ",result);
        var user = JSON.parse(result);
       this.setState({
        Storeduserdata:user,
      })
    })

    Location.setAllowsBackgroundLocationUpdates(true);
    this.getLocationUpdate();
  }



   
   // StillDetictiion(Location,me){ 
   //  if (Location.coords.speed < 0 ) {  
   //    var priveSteps = this.state.numberOfSteps+10;
   //    var distance = this.state.distanceTravelled+0.01;
   //    this.StillDetictiioninterval = setInterval(()=>{      
   //      this.setState({
   //        StillDecteting:false,
   //      })
   //      var priveSteps = this.state.numberOfSteps+10;
   //      var distance = this.state.distanceTravelled+0.01;
   //      setTimeout(function(){    
   //        clearInterval(me.StillDetictiioninterval); 
   //        if (distance > me.state.distanceTravelled) {
   //          if (me.state.numberOfSteps < priveSteps) {
   //          AlertIOS.alert("Still","It seems you are still.");
   //          me.setState({
   //            StillDecteting:true,
   //          })
   //        }else{

   //        }
           
   //        };
   //      }, 10000)
   //      },1000)
   //     }else{
   //      return;
   //     }   
   //  }

    getLocationUpdate(){
      var me = this;
        Location.startUpdatingLocation();
        var subscription = DeviceEventEmitter.addListener(
          'locationUpdated',
          (location) => {
          this.addMarker(location);
        }
      );
    }




    clearLocationUpdate(){
      Location.stopUpdatingLocation();
      clearInterval(this.IntervelSaveRun);  
    }




    modelViewDriving(){
        return(
          <Modal
          onPress={()=>this.closemodel()}
          style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
             isOpen={this.state.open}
               >
                  <View style={styles.modelWrap}>
                    <View  style={styles.contentWrap}>
                    <View style={styles.iconWrapmodel}>
                      <Icon style={{color:"white",fontSize:30,}} name={'ios-car'}></Icon>
                    </View>
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:25}}>Too Fast</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:15}}>It seems you are in a vehicle. Pausing workout</Text>
                   <View style={styles.modelBtnWrap}>
                    <TouchableOpacity style={styles.modelbtnResumeRun} onPress ={()=>this.closemodel()}><Text style={styles.btntext}>Okay</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.modelbtnEndRun}onPress ={()=>this.ResumeRunFromPopup()}><Text style={styles.btntext}>Resume</Text></TouchableOpacity>
                  </View>
                   </View>
                   </View>
                  </View>
            </Modal>
          )
    }

     modelViewDrivingEndRun(){
        return(
          <Modal
          onPress={()=>this.closemodel()}
          style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
             isOpen={this.state.onCarDetectedEndRunModel}
               >
                  <View style={styles.modelWrap}>
                    <View  style={styles.contentWrap}>
                    <View style={styles.iconWrapmodel}>
                      <Icon style={{color:"white",fontSize:30,}} name={'ios-car'}></Icon>
                    </View>
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:25}}>On-vehicle detected</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:15}}>It seems you are in a moving vehicle. So we are ending your workout.</Text>
                   <View style={styles.modelBtnWrap}>
                    <TouchableOpacity style={styles.modelbtnEndRun}onPress ={()=>this.ConfirmRunEnd()}><Text style={styles.btntext}>Okay</Text></TouchableOpacity>
                  </View>
                   </View>
                   </View>
                  </View>
            </Modal>
          )
    }

    modelViewGpsWeek(){
        return(
          <Modal

          style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
             isOpen={this.state.openGpsModel}
               >
                  <View style={styles.modelWrap}onPress={()=>this.closemodel()}>
                    <View  style={styles.contentWrap}>
                    <View style={styles.iconWrapmodel}>
                      <View style={styles.weaksignalWrap}>
                        <View style={[styles.signalline,{backgroundColor:"red",height:4}]}></View>
                        <View style={[styles.signalline,{backgroundColor:"red",height:8}]}></View>
                        <View style={[styles.signalline,{backgroundColor:"white",height:11}]}></View>
                        <View style={[styles.signalline,{backgroundColor:"white",height:14}]}></View>
                        <View style={[styles.signalline,{backgroundColor:"white",height:17}]}></View>
                      </View>
                    </View>
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:25}}>Weak GPS Signal</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:15}}>GPS signal is weak on your phone. So tracking may be inaccurate. </Text>
                   <View style={styles.modelBtnWrap}>
                    <TouchableOpacity style={styles.modelbtnEndRun}onPress ={()=>this.closemodel()}><Text style={styles.btntext}>Okay</Text></TouchableOpacity>
                  </View>
                   </View>
                   </View>
                  </View>
            </Modal>
          )
    }
    
    closemodel(){
      this.setState({
        open:false,
        openGpsModel:false,
      })
    }

    ResumeRunFromPopup(){
      this.setState({
        open:false,
      })
      this.startPause();
    }






  _onNotification(notification) {
      PushNotification.localNotification({
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      message: "Seems you are in a vehicle. Pausing workout", // (required)
      playSound: true, // (optional) default: true
    });
  }


 _ongpsWeakNotification(notification) {
     PushNotification.localNotification({
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      message: "Seems your GPS signals are weak", // (required)
      playSound: true, // (optional) default: true
    });
  }




  componentWillUnmount() {
    this.setState({
      componentISmounted:false,
    })
    console.log('componentUnmount',this.state.componentISmounted);
    // Location.stopUpdatingLocation();
    // clearInterval(this.IntervelSaveRun);
    // this.clearLocationUpdate();
    //  DeviceEventEmitter.removeListener('locationUpdated');

  }





  _handleStartStop(){
    let {isRunning,FirstTime,mainTimer,lapTimer} = this.state;
    if(!this.state.isRunning){
      clearInterval(this.interval);
      this.setState({
        isRunning:false
      });
      return;
    }else{ 
      if (this.state.isRunning) {
        this.setState({
          mainTimerStart:new Date(),
          lapTimerStart:new Date(),
          isRunning:true,
        })
        this.interval = setInterval(()=>{
        this.setState({
            mainTimer:new Date() - this.state.mainTimerStart + mainTimer,
            lapTimer:new Date() - this.state.lapTimerStart + lapTimer,
        })
        },30);
      }; 
    }
  }
  




  startPause(){
    var me = this;
    console.log("Enabled", this.state.enabled);
    if (this.state.enabled) {
      
      this.setState({
        enabled:false,
        isRunning:!this.state.isRunning,
        prevLatLng:null,
      });  
       setTimeout(()=>{ 
        console.log('Enabled2', this.state.enabled);
        this.updatePaceButtonStyle();
        this._handleStartStop();     
       },100) ;
          
      
    }else{
      var isMoving = !this.state.isMoving;

      this.setState({
        isMoving:isMoving,
        enabled:true,
        isRunning:!this.state.isRunning,
        prevLatLng:null,
      });  
       setTimeout(()=>{ 
        console.log('Enabled2', this.state.enabled);
        this.updatePaceButtonStyle();
        this._handleStartStop();     
       },100) ;
    } 
    
  }




  onClickEnable(location) {
     var _this = this;
    if (Number(parseFloat(_this.state.distanceTravelled).toFixed(1))>= 0.1) {
      Location.stopUpdatingLocation();
      clearInterval(this.IntervelSaveRun);
      _this.EndRunConfimationForlongRun();  
     }else{
      _this.EndRunConfimation();
      PushNotification.cancelAllLocalNotifications();
    }        
  }



  ConfirmRunEnd(){
     var d = moment().format('YYYY-MM-DD HH:mm:ss');
     this.setState({
        endDate:d,
      });
      this.setState({
        onCarDetectedEndRunModel:false,
        enabled: !this.state.enabled,   
        isRunning:!this.state.isRunning,  
      });
      this.updatePaceButtonStyle();
      this.clearLocationUpdate();
      this._handleStartStop();
      AsyncStorage.removeItem('runDataAppKill');
      PushNotification.cancelAllLocalNotifications();
      this.navigateTOShareScreen();
     
  }



  // Add Marker if check clear
  addMarker (location) {
    if (this.state.enabled) {
    const {distanceTravelled,prevDistance } = this.state
    const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
    const newDistance = distanceTravelled + this.calcDistance(newLatLngs)
    this.setState({
      prevDistance: newDistance-distanceTravelled,
    })
    if (location.coords.accuracy >= 100 && this.state.GpsAccuracyCheck){
      this.setState({
        weakGPSPoints: this.state.weakGPSPoints + 1,
      })
    }
    var sourceAccuracy = (this.state.sourceCount)?40:25;
    if (location.coords.accuracy <= sourceAccuracy){
      if(this.state.weakGPSPoints > 0){
        this.setState({
        weakGPSPoints: this.state.weakGPSPoints - 1,
        })
      } 
      if (this.state.sourceCount) {
        this.setState({
          StartLocation:location.coords, 
        })
      }
      this.setState({
        sourceCount:false,
      })
      if (location.coords.speed <= 7.5) {
        var me = this;
        // this.addAnnotations(mapRef, [this.createMarker(location)]);
        // if ( this.polyline) {
        //   this.polyline.coordinates.push([location.coords.latitude, location.coords.longitude]);
        //   this.updateAnnotation(mapRef, this.polyline);
        // }
        const {distanceTravelled,prevDistance } = this.state
        const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
        const newTimeStamp = location.timestamp;
        this.setState({
          distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
          prevLatLng: newLatLngs,
          gpsNotAccepatableStepvalue:0,
          newTimeStamp:location.timestamp,
          prevTimeStamp:this.state.newTimeStamp,
          speed:location.coords.speed,
          newlatlong:newLatLngs,
        })
        var oldtime = new Date(this.state.prevTimeStamp).getTime();
        var newTime = new Date(this.state.newTimeStamp).getTime();
        var timeBetweenTwoPoint = newTime - oldtime;
        if (timeBetweenTwoPoint) {
          this.previousLocationTime(newTimeStamp);
          this.caloriCounterStart(newTimeStamp);
        }else{
          console.log("Nanvalue")
        }         
      }else{
        console.log("this.state.UssainBoltCount",this.state.HussainBoltCount);

        if (this.state.HussainBoltCount >= 3 && !(this.state.onCarDetectedEndRunModel)) {
          // Location.stopUpdatingLocation();
          this.setState({
            enabled:false,
            isRunning:false      
          })
          this.updatePaceButtonStyle();
          this._handleStartStop(); 
          setTimeout(()=>{ 
            this.setState({
              onCarDetectedEndRunModel:true,
            })
           },1000) ;
          
        }else{
          this.setState({
            HussainBoltCount:this.state.HussainBoltCount+1,
            enabled:false,
            isRunning:false
          })   
          this.updatePaceButtonStyle();
          this._handleStartStop(); 
          setTimeout(()=>{ 
            this.setState({
              open:true,
            })
            this._onNotification();
          },1000) ;
          VibrationIOS.vibrate();  
        }
      }
    }else{
      if (location.coords.speed <= 7.5) {
        var Prevdistance = this.state.prevDistance*1000;
        var locationAccuracy=location.coords.accuracy;
        var thresholdAccuracy = 16;
        var offset = 1;
        var thresholdFactor = 5; 
        var currentDistance = Prevdistance;
        if(Prevdistance/(locationAccuracy - (thresholdAccuracy-offset)) > thresholdFactor){
          console.log("true");
          const {distanceTravelled,prevDistance } = this.state
          const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
          const newTimeStamp = location.timestamp;
          this.setState({
            distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
            prevLatLng: newLatLngs,
            newTimeStamp:location.timestamp,
            prevTimeStamp:this.state.newTimeStamp,
            gpsNotAccepatableStepvalue:0,      
            speed:location.coords.speed,
            newlatlong:newLatLngs,
          })
          // this.addAnnotations(mapRef, [this.createMarker(location)]);
          // if ( this.polyline) {
          //   this.polyline.coordinates.push([location.coords.latitude, location.coords.longitude]);
          //   this.updateAnnotation(mapRef, this.polyline);
          // }
          var oldtime = new Date(this.state.prevTimeStamp).getTime();
          var newTime = new Date(this.state.newTimeStamp).getTime();
          var timeBetweenTwoPoint = newTime - oldtime;
          if (timeBetweenTwoPoint) {
            this.previousLocationTime(newTimeStamp);
            this.caloriCounterStart(newTimeStamp);
          }else{

          }     
        }else{
          if (this.state.GpsAccuracyCheck) {
            if(this.state.weakGPSPoints >= 10){
              this._ongpsWeakNotification();
              this.setState({
                openGpsModel:true,
                GpsAccuracyCheck:false,
              })
            }
          }else{
            return;
          }
        }
      }else{
        if (this.state.UssainBoltCount > 3) {
          console.log("location hussain");
          this.setState({
            enabled:false,
            isRunning:false,
          })
          setTimeout(()=>{ 
            this.setState({
              onCarDetectedEndRunModel:true,
            })
           },1000) ;
          this.updatePaceButtonStyle();
          this._handleStartStop(); 
        }else{
          this.setState({
            HussainBoltCount:this.state.HussainBoltCount+1,   
            enabled:false,
            isRunning:false,
          })
          this.updatePaceButtonStyle();
          this._handleStartStop();
           setTimeout(()=>{ 
            this.setState({
              open:true,
            })
            this._onNotification();
           },1000) ;
          VibrationIOS.vibrate();                 
        }
      }
    }
  }
      
  }







  getMetsValue(speed){
     // deltaSpeed is in m/s
     if (speed != NaN) {
     var speed = speed*1000;
     var mph = 2.2369 * speed;

       if (mph <= 0.625) {
            this.setState({
              metval:0
            })
        }else if (mph <= 1){
          this.setState({
              metval:1.3
            })
           
        }else if (mph <= 2){
          this.setState({
              metval:(1.3 + 1.5*(mph - 1))
            })
           
          // 2.8 at 2 mph
        }else if (mph <= 2.5){
          this.setState({
              metval:2.8 + 0.4*(mph - 2)
            })
           
           // 3.0 at 2.5 mph
        }else if (mph <= 3.5){
          this.setState({
              metval:1.3
            })
           
            // 4.3 at 3.5 mph
        }else if (mph <= 4){  
          this.setState({
              metval:3.0 + 1.3*(mph - 2.5)
            })
           
          // 6.0 at 4 mph
        }
        else if (mph <= 5){
          this.setState({
              metval:6 + 2.3*(mph - 4)
            })
           
          // 8.3 at 5 mph
           
        }else if (mph <= 6){
          this.setState({
              metval:8.3 + 1.5*(mph - 5)
            })
           
             // 9.8 at 6 mph
        }else if (mph <= 7){
          this.setState({
              metval:9.8 + 1.2*(mph - 6)
            })
           
           // 11.0 at 7mph
        }else if (mph <= 7.7){
          this.setState({
              metval:11 + 1.143*(mph - 7)
            })
           
             // 11.8 at 7.7 mph
        }else if (mph <= 9){
          this.setState({
              metval:11.8 + 0.77*(mph - 7.7)
            })
           
           // 12.8 at 9 mph
        }else if (mph <= 10){
          this.setState({
              metval:12.8 + 1.7*(mph - 9)
            })
           
           // 14.5 at 10 mph
        }else if (mph <= 11){
          this.setState({
              metval:14.5 + 1.5*(mph - 10)
            })
         // 16 at 11 mph
        }else if (mph <= 12){
          this.setState({
              metval:16 + 3*(mph - 11)
            })
           
          // 19 at 12 mph
        }else if (mph <= 14){
          this.setState({
              metval:19 + 2*(mph - 12)
            })
          // 23 at 14 mph
        }else if (mph <= 15){
          this.setState({
              metval:23 + 1*(mph - 14)
            })
           
          // 24 at 15 mph
        }else {
          this.setState({
              metval:1.3
            })         
            // For speeds greater than 15 mph (23 kmph) we assume that the person is driving so we don't add calories
        }
    }
  }








 
  getWeight(){
    AsyncStorage.getItem('USERDATA',(err,result)=>{
      if (result != null) {
      var userData = JSON.parse(result);
      if (userData.body_weight != null) {
        this.setState({
          weight:userData.body_weight,
        })
      }else{
        this.setState({
          enterWeightmodel:true,
        })
      }
     }else{
      return;
     }
    })
  } 









      
  caloriCounterStart(){
        // Start activity detection
    var totalCaloriesBurned = this.state.calorieBurned;
    var timeinHr = ((this.state.mainTimer + this.state.storedRunduration)/1000)/3600;
    var time =(this.state.timeBetweenTwoPoint/1000)/3600;
    var Calories =  this.state.metval*this.state.weight*time;
    var totalCalories = this.state.calorieBurned ;
   
    
    totalCaloriesBurned += Calories;
    this.setState({
      calorieBurned:totalCaloriesBurned,
    })     
  }







  previousLocationTime(){
    var oldtime = new Date(this.state.prevTimeStamp).getTime();
    var newTime = new Date(this.state.newTimeStamp).getTime();
    var timeBetweenTwoPoint = newTime - oldtime;
    this.setState({
      timeBetweenTwoPoint:timeBetweenTwoPoint,
    })
    var prevDistance = this.state.prevDistance*1000;
    var speed = prevDistance/timeBetweenTwoPoint;
    if (speed != NaN) {
    this.getMetsValue(speed);
    }else{
      console.log("speednana");
    }
  }








 _startStepCounterUpdates() {
    const today = new Date();
    Pedometer.startPedometerUpdatesFromDate(today.getTime(), (motionData) => {
      this.setState(motionData);
    });
  }




  saveDataperiodcally(){    
    this.IntervelSaveRun = setInterval(()=>{
      if (distancePriv != 0) { 

      console.log("somedata",distancePriv,timepriv,calories);

      var distance = parseFloat(Number(parseFloat(this.state.distanceTravelled).toFixed(1)) + distancePriv).toFixed(1);
      let Rundata = {
        data:this.props.data,
        distance:Number(parseFloat(this.state.distanceTravelled).toFixed(1))+Number(distancePriv),
        impact:parseFloat(this.state.distance * this.props.data.conversion_rate).toFixed(0),
        speed:this.state.speed,
        time:this.state.mainTimer + timepriv,
        StartLocation:this.state.StartLocation,
        EndLocation:this.state.newlatlong,
        calories_burnt:this.state.calorieBurned + calories,
        StartRunTime:this.state.myrundate,
        noOfsteps:this.state.numberOfSteps,
       }
      AsyncStorage.setItem('runDataAppKill',JSON.stringify(Rundata));
      AsyncStorage.getItem('runDataAppKill', (err, result) => {
        console.log('myresult',result);
      }); 
        console.log("distanceTravelledsec ",this.state.distanceTravelledsec);
     }else{
    let Rundata = {
      data:this.props.data,
      distance:parseFloat(this.state.distanceTravelled).toFixed(1),
      impact:parseFloat(this.state.distanceTravelled).toFixed(1) * this.props.data.conversion_rate,
      speed:this.state.speed,
      time:this.state.mainTimer,
      calories_burnt:this.state.calorieBurned,
      StartLocation:this.state.StartLocation,
      EndLocation:this.state.newlatlong,
      StartRunTime:this.state.myrundate,
      noOfsteps:this.state.numberOfSteps,
     }
    AsyncStorage.setItem('runDataAppKill',JSON.stringify(Rundata)); 
    AsyncStorage.getItem('runDataAppKill', (err, result) => {
      console.log('myresult',result);
    }); 

    
     }
     
   
    
  },30000)

  }






  
   // function for calculating new and previous latlag
   calcDistance(newLatLng) {
    if (this.state.prevLatLng != null) {
      const { prevLatLng } = this.state
      return (haversine(prevLatLng, newLatLng) || 0)
    } else{
      return 0;
    }
   }


    navigateTOHomeScreen(){
      this.props.navigator.push({
      title:'Impactrun',
      id:'tab',
      navigator: this.props.navigator,
     })
    }



     navigateTOShareScreen(){
      var caloridata = (this.state.result != null)?JSON.parse(this.state.result).calories_burnt:0;
      var data = this.props.data;
      var priv = Number(parseFloat(this.state.distanceTravelledsec).toFixed(1));
      var user = this.state.Storeduserdata;
      var timetotal = (this.state.result != null)?Number(this.state.mainTimer )+ Number(this.state.storedRunduration):this.state.mainTimer;
      this.props.navigator.replace({
        id:'sharescreen',
        passProps:{
          data:data,
          getUserData:this.props.getUserData,
          user:this.props.user,
          distance:parseFloat(Number(parseFloat(this.state.distanceTravelled).toFixed(1))+ priv).toFixed(1),
          impact:parseFloat(Number(parseFloat(this.state.distanceTravelled).toFixed(1))+ priv).toFixed(1) * data.conversion_rate,
          speed:this.state.speed,
          isUserlogin:user,
          calories_burnt:this.state.calorieBurned + caloridata,
          time:TimeFormatter(timetotal),
          StartLocation:this.state.StartLocation,
          EndLocation:this.state.newlatlong,
          StartRunTime:this.state.myrundate,
          EndRunTime:this.state.endDate,
          noOfsteps:this.state.numberOfSteps,
          },
        navigator: this.props.navigator,

       })
      // alert(JSON.stringify(this.state.newlatlong));
     }



    
    Confimation() {
      VibrationIOS.vibrate();
      AlertIOS.alert(
          'Go Back',

         'Are you sure you want to go back ?',
         [
        {text: 'CONFIRM', onPress: () => this.popRoute() },
        {text: 'CANCLE',},
       ],
      ); 
    }


    EndRunConfimation() {
     VibrationIOS.vibrate();
      AlertIOS.alert(
         'Too short',
         'You need to run a minimum of 100m to convert the distance into impact.',
        [
          {text: 'Continue',},
          {text: 'End', onPress: () => this.popRoute()},
        ],
      ); 
    }

    EndRunConfimationForlongRun() {
     VibrationIOS.vibrate();
      AlertIOS.alert(
         ' End workout ',
         'Are you sure you want to end your workout.',
        [
          {text: 'Continue',},
          {text: 'End', onPress: () => this.ConfirmRunEnd()},
        ],
      ); 
    }



    popRoute() {
      if (this.state.enabled) { 
      AsyncStorage.removeItem('runDataAppKill');
      this.clearLocationUpdate();
      this.navigateTOHomeScreen();
      this.state.distanceTravelled = 0;
      this.state.prevDistance = 0;
      this.setState({
        enabled: !this.state.enabled, 
      });
      this.updatePaceButtonStyle();    
      }else{
        this.navigateTOHomeScreen();
      }
    }


    updatePaceButtonStyle() {
      console.log('isRunning',this.state.enabled)
      var style = (this.state.enabled) ? commonStyles.redButton : commonStyles.greenButton;
      this.setState({
        paceButtonStyle: style,
        paceButtonIcon: (this.state.enabled) ? 'md-pause' : 'md-play',
        textState:(this.state.enabled) ? 'PAUSE':'RESUME', 
        EndRun:(this.state.enabled) ? 'END RUN':'END RUN', 
      });
    }
 

    caloriesTextView(data,priv){
      if (this.state.result) {
        return(
            <CaloriCounter weight = {this.state.weight} calories = {this.state.calorieBurned + JSON.parse(this.state.result).calories_burnt} />
          )
      }else{
        return(
              <CaloriCounter weight = {this.state.weight} calories = {this.state.calorieBurned } />
          )
      }
    }


   impactTextView(data,priv){
    if (this.state.result) {
      return(
          <Text style={styles.Impact}><Icon2 style={styles.Impact}name={this.state.my_currency.toLowerCase()}></Icon2> {(this.state.my_currency == 'INR' ? parseFloat(parseFloat(Number(parseFloat(this.state.distanceTravelled).toFixed(1))+ priv).toFixed(1) * data.conversion_rate).toFixed(0): parseFloat((parseFloat(Number(parseFloat(this.state.distanceTravelled).toFixed(1))+ priv).toFixed(1) * data.conversion_rate)/this.state.my_rate).toFixed(2))}</Text>
        )
    }else{
      return(
           <Text style={styles.Impact}><Icon2 style={styles.Impact}name={this.state.my_currency.toLowerCase()}></Icon2> {(this.state.my_currency == 'INR' ? parseFloat(this.state.distanceTravelled).toFixed(1)* data.conversion_rate : parseFloat(parseFloat(this.state.distanceTravelled).toFixed(2)* data.conversion_rate/this.state.my_rate).toFixed(2))}</Text>
        )
    }
   }

   KmTextView(priv){
    if (this.state.result) {
      return(
          <Text style={styles.distance}>{(this.state.my_distance == 'miles' ? parseFloat((Number(parseFloat(this.state.distanceTravelled).toFixed(1))+ Number(priv))*0.621).toFixed(1) : parseFloat(Number(parseFloat(this.state.distanceTravelled).toFixed(1))+ Number(priv)).toFixed(1))}</Text>
        )
    }else{
      return(
           <Text style={styles.distance}>{(this.state.my_distance == 'miles' ? parseFloat(this.state.distanceTravelled*0.621).toFixed(1) : parseFloat(this.state.distanceTravelled).toFixed(1))}</Text>
        )
    }
   }

   TimeTextView(intime){
    if (this.state.result) {
      return(
         <Text style={styles.distance}>{intime}</Text>
        )
    }else{
      return(
          <Text style={styles.distance}>{TimeFormatter(this.state.mainTimer)}</Text>
        )
    }
   }
   
    render(location) {
      if (this.state.componentISmounted) {
      var intime = TimeFormatter( this.state.mainTimer + this.state.storedRunduration );
      var data = this.props.data;
      var priv = Number(parseFloat(this.state.distanceTravelledsec).toFixed(1));
      var circularprogress =  ((parseFloat(this.state.distanceTravelled).toFixed(1)*100)/2 === 100)?(parseFloat(this.state.distanceTravelled).toFixed(1)*100)/5:(parseFloat(this.state.distanceTravelled).toFixed(1)*100)/2;

      return (
        <View style={commonStyles.container}>
           <View ref="workspace" style={styles.workspace}>           
                        
          
            <View style={styles.WrapCompany}>
              <Image style={{resizeMode: 'contain',height:styleConfig.LogoHeight,width:styleConfig.LogoWidth,}}source={{uri:data.sponsors[0].sponsor_logo}}></Image>
              <Text style={{color:styleConfig.greyish_brown_two,fontSize:16,fontFamily:styleConfig.FontFamily,}}>is proud to sponsor your run.</Text>
            </View>
            <View style={{justifyContent: 'center',alignItems: 'center', flex:1}}>
             <AnimatedCircularProgress
                style={{justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}
                ref='circularProgress'
                size={180}
                width={5}
                fill={circularprogress}
                prefill={100}
                tintColor={styleConfig.bright_blue}
                rotation={0}
                backgroundColor="#fafafa">                   
              </AnimatedCircularProgress>
               <View style={{marginTop:-165,backgroundColor:'transparent',width:130,height:130,justifyContent:'center',alignItems:'center'}}>
                {this.impactTextView(data,priv)}
                
                <Text style={{fontFamily:styleConfig.FontFamily,fontSize:19,color:styleConfig.greyish_brown_two,opacity:0.7,}}>IMPACT</Text>
              </View>
              </View>
              <View style={{flex:1,flexDirection:'row',backgroundColor:'transparent'}}>
                <View style={styles.timeDistanceWrap}>
                  <Icon style={{color:styleConfig.greyish_brown_two,fontSize:30,}} name={'ios-walk-outline'}></Icon>
                   {this.KmTextView(priv)}
                  <Text style={{fontFamily:styleConfig.FontFamily,color:styleConfig.greyish_brown_two,opacity:0.7,}}>{(this.state.my_distance == 'miles' ? 'MI' : 'KMS')}</Text>
                </View>
                 <View style={styles.timeDistanceWrap2}>
                 {this.caloriesTextView()}
                </View>
                <View style={styles.timeDistanceWrap}>
                  <Icon style={{color:styleConfig.greyish_brown_two,fontSize:30,backgroundColor:'transparent'}} name={'md-stopwatch'}></Icon>
                   {this.TimeTextView(intime)}
                  <Text style={{fontFamily:styleConfig.FontFamily,color:styleConfig.greyish_brown_two,opacity:0.7,}}>TIME</Text>

                </View>
            
                
              </View>
            </View>

          <View style={commonStyles.bottomToolbar}>

          <TouchableOpacity   onPress={()=>this.startPause(this)} style={[this.state.paceButtonStyle,styles.stationaryButton]}>
           <View style={{flexDirection:'row'}}>
            <Icon name={this.state.paceButtonIcon} style={{color:'white',fontSize:18,marginTop:2,marginRight:5}}></Icon>
            <Text style={{fontFamily:styleConfig.FontFamily,fontSize:18,fontWeight:'800',letterSpacing:1,color:'white',}}>{this.state.textState}</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity   
                 onPress={()=>this.onClickEnable(location)} iconStyle={commonStyles.iconButton} style={styles.EndRun}>
                <Text style={{fontFamily:styleConfig.FontFamily,fontSize:18,fontWeight:'800',letterSpacing:1,color:'white',}}>{this.state.EndRun}</Text>
            </TouchableOpacity>
               
          </View>
          {this.modelViewDrivingEndRun()}
          {this.modelViewDriving()}
          {this.modelViewGpsWeek()}
        </View>
      );
     }

    }

    
};








var styles = StyleSheet.create({
  StartStopbtn:{
    left:-3,
    paddingLeft:10,
    bottom:0,
    height:40,
    width:deviceWidth/2-10,
    backgroundColor:'#673ab7',
    marginRight:-10,
    fontSize:30,
    color:'white',
    borderRadius:30,

  },
  DistanceFill:{
    backgroundColor:'transparent',
  }, 
  distanceWrap:{
    flexDirection: 'row',
    justifyContent:'center',
    width:deviceWidth,
    height:50,
  },
  EndRun:{
    justifyContent: 'center',      
    alignItems: 'center',
    height:50,
    width:deviceWidth/2-20,
    borderRadius:30,
    backgroundColor:styleConfig.light_sky_blue,
    marginLeft:10,
  },
  ResumePause:{
    justifyContent: 'center',      
    alignItems: 'center',
    height:50,
    width:deviceWidth/2-20,
    borderRadius:30,
    backgroundColor:'#e03ed2',
    margin:10,
  },
  workspace: {
    flex: 1,
    justifyContent: 'center',      
    alignItems: 'center',
    top:-20,

  },
  map: {
    top:20,
    position:'absolute',
    height:deviceheight,
    width:deviceWidth,
    opacity:1,
  },
  bottomBarContent:{
    paddingLeft:10, 
    width:deviceWidth/4,
    justifyContent: 'center',      
    alignItems: 'center',
  },
  Impact:{
    fontSize:40,
    fontWeight:'500',
    color:styleConfig.greyish_brown_two,
    backgroundColor:'transparent',   
  },
  distance:{
    fontSize:25,
    fontWeight:'500',
    color:styleConfig.greyish_brown_two,
    backgroundColor:'transparent',   
  },
  WrapCompany:{
    flex:1,
    justifyContent: 'center',      
    alignItems: 'center',
    backgroundColor:'transparent',   
   },
   timeDistanceWrap:{
    justifyContent: 'center',      
    alignItems: 'center',
    width:deviceWidth/3, 
   },
   timeDistanceWrap2:{
    justifyContent: 'center',      
    alignItems: 'center',
    width:deviceWidth/4, 
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
    paddingBottom:5,
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
    height:deviceheight/3,
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
   modelbtnResumeRun:{
    flex:1,
    height:40,
    margin:5,
    borderRadius:5,
    backgroundColor:styleConfig.bright_blue,
    justifyContent: 'center',
    alignItems: 'center',
   },
  modelbtnEndRun:{
    flex:1,
    height:40,
    margin:5,
    borderRadius:5,
    backgroundColor:styleConfig.light_sky_blue,
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
   signalline:{
    width:4,
    marginLeft:2,
    bottom:0,
   },
   weaksignalWrap:{
    alignItems:'flex-end',
    flexDirection:"row",
   },
   button:{
    position: 'absolute',
    top: 0,
    left: 0,
   },
   bgFill: {
    position: 'absolute',
    height:60,
    width:200,
    top: 0,
    left: 0,
  }
});




export default Home;













// <Text style={styles.bottomBarContent}>Distance two points {"\n"}{parseFloat(this.state.prevDistance*1000).toFixed(1)}m</Text>