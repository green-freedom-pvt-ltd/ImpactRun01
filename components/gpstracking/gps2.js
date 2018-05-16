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
const CleverTap = require('clevertap-react-native');
import ActivityRecognition from 'react-native-activity-recognition';
import UUIDGenerator from 'react-native-uuid-generator';
var Pedometer = require('react-native-pedometer');
import getLocalData from '../getLocalData.js';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;
import usainBoltCheck from './checkUsainBolt.js';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import matValue from "./getmatvalue.js";
var distancePriv = 0;
var timepriv = 0;
var calories = 0;
var previousDistanceToRemove = 0;


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
        isRunning:false,
        mainTimer:0,
        mainTimerpriv:0,
        speed:0,
        prevLatLng: {},
        distanceTravelled: 0,
        prevDistance:0,
        textState:'PAUSE',
        Enbtn:'END RUN',
        enabled: true,
        isMoving: true,
        paceButtonIcon: 'md-pause',
        navigateButtonIcon: 'md-locate',
        MetsValue:0,
        weight:null,
        calorieBurned:0.0,
        timeBetweenTwoPoint:0,
        permissions:null,
        gpsNotAccepatableStepvalue:0,
        mapHeight: 280,
        mapWidth: 300,
        zoom: 18,
        open:false,
        metval:0,
        sourceCount:true,
        GpsAccuracyCheck:true,
        openGpsModel:false,
        annotations: [],
        ussainBoltCount:0,
        StillDecteting:true,
        location:{},
        pointsCollected:0,
        currentSpeed:0,
        isStillCheck:0,
        pressAction: new Animated.Value(0,{ useNativeDriver: true }),
        center: {
          latitude: 40.72052634,
          longitude: -73.97686958312988
        },
        previousDurationforSpeedCheck:0,
        previousDistanceforSpeedCheck:0,
        onCarDetectedEndRunModel:false,
        weakGPSPoints: 0,
        componentISmounted:true,
        my_rate:1.0,
        my_currency:"INR",
        num_spikes:0,
        activityType:{
          'type':'STATIONARY',
          'confidence':1,
        },
        StartLocation:null,
        client_run_id:null,
        speedBetweenTwoPoint:0,
        locationArray:[],
        locationObjectsArray:[],
        newlatlong:null,
        checkedForGpsPoint:0,
      };
    }

  

  
  componentDidMount(){ 
    Location.setAllowsBackgroundLocationUpdates(true);
    this.getLocationUpdate();
    this.state.componentISmounted = true;
    const detectionIntervalMillis = 1000
    ActivityRecognition.start(detectionIntervalMillis)
    this.unsubscribe = ActivityRecognition.subscribe(detectedActivities => {
      const mostProbableActivity = detectedActivities.sorted[0];
      this.setState({
        activityType:mostProbableActivity,
      })
     }) 
    if (this.state.componentISmounted) {
    this.appKillDuringData();
    this.refs.circularProgress.performLinearAnimation(parseFloat(this.state.distanceTravelled).toFixed(0), 1000)
    this.getWeight();
    this.saveDataperiodcally(); 
    this._startStepCounterUpdates()
   
    this.updatePaceButtonStyle(); 
       var d = moment().format('YYYY-MM-DD HH:mm:ss');
      this.setState({
        myrundate:d,
      });
    }
  }



  appKillDuringData(){   
      if (this.props.killRundata != null) {
      let runData = this.props.killRundata;
      this.setState ({
        distanceTravelled:Number(runData.distance) + Number(this.state.distanceTravelled),
        calorieBurned:Number(runData.calories_burnt)+Number(this.state.calorieBurned),
        locationArray:(runData.locationArray === 1)?[]:runData.locationArray,
        mainTimer:runData.time,
        newlatlong2:runData.EndLocation,
        StartLocation2:runData.StartLocation,
      })
       this._handleStartStop(runData.time);
     } else{
      this._handleStartStop(this.state.mainTimer);
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


    saveDataperiodcally(){    
      this.IntervelSaveRun = setInterval(()=>{
        if (distancePriv != 0) { 
          var distance = parseFloat(Number(parseFloat(this.state.distanceTravelled).toFixed(1)) + distancePriv).toFixed(1);
          let Rundata = {
            data:this.props.data,
            distance:parseFloat(this.state.distanceTravelled).toFixed(1),
            impact:parseFloat(this.state.distance * this.props.data.conversion_rate).toFixed(0)/this.state.my_rate,
            speed:this.state.currentSpeed,
            time:this.state.mainTimer,
            StartLocation:this.state.StartLocation,
            EndLocation:this.state.newlatlong,
            calories_burnt:this.state.calorieBurned,
            StartRunTime:this.state.myrundate,
            noOfsteps:this.state.numberOfSteps,
            ocationArray:this.state.locationArray,
           }
          AsyncStorage.setItem('runDataAppKill',JSON.stringify(Rundata));
          AsyncStorage.getItem('runDataAppKill', (err, result) => {
          }); 
        }else{
          let Rundata = {
              data:this.props.data,
              distance:parseFloat(this.state.distanceTravelled).toFixed(1),
              impact:parseFloat(this.state.distanceTravelled).toFixed(1) * this.props.data.conversion_rate/this.state.my_rate,
              speed:this.state.currentSpeed,
              time:this.state.mainTimer,
              calories_burnt:this.state.calorieBurned,
              StartLocation:this.state.StartLocation,
              EndLocation:this.state.newlatlong,
              StartRunTime:this.state.myrundate,
              noOfsteps:this.state.numberOfSteps,
              locationArray:this.state.locationArray,
          }
          AsyncStorage.setItem('runDataAppKill',JSON.stringify(Rundata)); 
          AsyncStorage.getItem('runDataAppKill', (err, result) => {
          }); 
        }   
      },30000)
    }


  _startStepCounterUpdates() {
    const today = new Date();
    Pedometer.startPedometerUpdatesFromDate(today.getTime(), (motionData) => {
      this.setState(motionData);
    });
  }


  _handleStartStop(mainTimer){
    let {isRunning,FirstTime,lapTimer} = this.state;
    if(this.state.isRunning){
      this.state.locationArray.push(this.state.locationObjectsArray);
      clearInterval(this.interval);
      this.setState({
        isRunning:false,
      });
      return;
    }else{ 
      if (!this.state.isRunning) {
        this.setState({
          mainTimerStart:new Date(),
          isRunning:true,
          locationObjectsArray:[],
        })
        this.interval = setInterval(()=>{
        this.setState({
            mainTimer:new Date() - this.state.mainTimerStart + mainTimer,
        })
        },30);
      }; 
    }
  }


  updatePaceButtonStyle() {
      var style = (this.state.enabled) ? commonStyles.redButton : commonStyles.greenButton;
      this.setState({
        paceButtonStyle: style,
        paceButtonIcon: (this.state.enabled) ? 'md-pause' : 'md-play',
        textState:(this.state.enabled) ? 'PAUSE':'RESUME', 
        EndRun:(this.state.enabled) ? 'END RUN':'END RUN', 
      });
  }


  componentWillMount() { 

    UUIDGenerator.getRandomUUID((uuid) => {
      this.setState({
        client_run_id:uuid
      })
    });
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

   

    AsyncStorage.getItem('USERDATA', (err, result) => {
        var user = JSON.parse(result);
       this.setState({
        Storeduserdata:user,
      })
    })


  }

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

  // Add Marker if check clear
  addMarker (location) {
    if (this.state.enabled === true) {
      console.log('this.state.enabled',this.state.enabled);
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


      if (this.state.checkedForGpsPoint > 3){
        this.setState({
          currentSpeed:location.coords.speed, // speed in meter/second
          checkedForGpsPoint:0
        })

      }else{
        this.setState({
          checkedForGpsPoint:this.state.checkedForGpsPoint+1,
        })
      }

      var locationObject =  {
        "acc": location.coords.accuracy,
        "stc": this.state.numberOfSteps,
        "lon": location.coords.longitude,
        "ts":  location.timestamp,
        "ber": 199,
        "lat": location.coords.latitude,
        "alt": location.coords.altitude,
        "spd": location.coords.speed,
        "nspk": this.state.num_spikes,
        "dis": this.state.distanceTravelled,
      };

     this.state.locationObjectsArray.push(locationObject) ;
      this.setState({
        sourceCount:false,
      })

      if(this.state.currentSpeed != 0 && this.state.currentSpeed != null ){
        this.checkForTooFast(location);
      }else{
        this.addDistance(location);
      }
    }else{
        var Prevdistance = this.state.prevDistance*1000;
        var locationAccuracy=location.coords.accuracy;
        var thresholdAccuracy = 16;
        var offset = 1;
        var thresholdFactor = 5; 
        var currentDistance = Prevdistance;
        if(Prevdistance/(locationAccuracy - (thresholdAccuracy-offset)) > thresholdFactor){       
          if(this.state.currentSpeed != 0 && this.state.currentSpeed != null ){
            this.checkForTooFast(location);
          }else{
            this.addDistance(location);
          }
        }else{
          if (locationAccuracy > 100){
            CleverTap.recordEvent('DETECTED_GPS_SPIKE');
            this.setState({
              num_spikes:this.state.num_spikes+1, 
            })
          }
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
     
    }
  }else{
  }
      
  }


  checkForTooFast(location){

      usainBoltCheck.checkForTooFast(location,this.state.enabled,this.state.activityType)
      .then((isUsainBolt )=>{
        if (isUsainBolt === true) {
          alert("this is in");
           if (this.state.currentSpeed > 9){ 
             CleverTap.recordEvent('ON_USAIN_BOLT_ALERT',{
                'detected_by':'activity_recognition ',
                'distance':this.state.distanceTravelled,
                'time_elapsed':TimeFormatter(this.state.mainTimer),
                'num_steps':this.state.numberOfSteps,
                'client_run_id':this.state.client_run_id,
                'speed':JSON.stringify(this.state.currentSpeed) + ' m/s',
                'activity_type':this.state.activityType.type,
                'activity_confidence':this.state.activityType.confidence,
              
              });
               return this.usainBoltPopup();
             }else{
               return this.addDistance(location);
             }
        }else{
              return this.addDistance(location);
        }
      }).then(()=>{
        
        if (this.state.enabled === true) {  
           
          if (this.state.currentSpeed != NaN && this.state.currentSpeed != 0) {
          if (this.state.currentSpeed < 9 ) { 
              alert("this is in2 "+JSON.stringify(this.state.currentSpeed));
            return this.addDistance(location);
          }else{
             
            if (this.state.activityType.type != "WALKING" || this.state.activityType.type != "RUNNING" || this.state.activityType.type != "STATIONARY") {
               alert("this is in3 "+JSON.stringify(this.state.currentSpeed));

              CleverTap.recordEvent('ON_USAIN_BOLT_ALERT',{
              'detected_by':'speed_logic',
              'distance':this.state.distanceTravelled,
              'time_elapsed':TimeFormatter(this.state.mainTimer),
              'num_steps':this.state.numberOfSteps,
              'client_run_id':this.state.client_run_id,
              'speed':JSON.stringify(this.state.currentSpeed) + ' m/s',
              'activity_type':(this.state.activityType.type != null )?this.state.activityType.type:"",
              'activity_confidence':(this.state.activityType.confidence != null && this.state.activityType.confidence != undefined)?this.state.activityType.confidence:"" ,
            
             });

              
            this.usainBoltPopup();
            }else{
              alert("this is in4",this.state.currentSpeed);
              if (this.state.activityType.type === null) {
                  alert("this is in5,",this.state.currentSpeed);
                  if (this.state.currentSpeed < 9 ) {
                     alert("this is in6");
                  return this.addDistance(location);
                  }else{
                   alert("this is in7");
                  CleverTap.recordEvent('ON_USAIN_BOLT_ALERT',{
                  'detected_by':'speed_logic',
                  'distance':this.state.distanceTravelled,
                  'time_elapsed':TimeFormatter(this.state.mainTimer),
                  'num_steps':this.state.numberOfSteps,
                  'client_run_id':this.state.client_run_id,
                  'speed':JSON.stringify(this.state.currentSpeed) + ' m/s',
                  'activity_type':this.state.activityType.type,
                  'activity_confidence':this.state.activityType.confidence,
                 
                   });
                 
                  this.usainBoltPopup();
                  }
              }
             
           }
          }
          }
          }else{
      
          }
      })
      // AlertIOS.alert('mostProbableActivity',JSON.stringify(mostProbableActivity));
   
    
  }
 

 addDistance(location){
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
    }
    return;
 }







   
   StillDetictiion(notification){ 
      PushNotification.localNotification({
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        message: "It seems you aren't moving.", // (required)
        playSound: true, // (optional) default: true
      });
    }



    



    clearLocationUpdate(){
      Location.stopUpdatingLocation();
      clearInterval(this.IntervelSaveRun);  
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
      message: "Seems you are in a vehicle or cycling. We have paused your workout.", // (required)
      playSound: true, // (optional) default: true
    });
  }


 _ongpsWeakNotification(notification) {

     PushNotification.localNotification({
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      message: "Weak GPS try to be in open areas and enable data.", // (required)
      playSound: true, // (optional) default: true
    });
  }




  componentWillUnmount() {
    this.setState({
      componentISmounted:false,
    })
    // Location.stopUpdatingLocation();
    clearInterval(this.IntervelSaveRun);
    // clearInterval(this.getSpeedEvery30Sec);
    clearInterval(this.interval);
    ActivityRecognition.stop()
    // this.clearLocationUpdate();
    DeviceEventEmitter.removeListener('locationUpdated');
    
    this.unsubscribe()

  }






  
 CleverTapOnpauseEvent(reason,distance,time_elapsed,num_steps){
    CleverTap.recordEvent('ON_CLICK_PAUSE_RUN',{
      'reason':reason,
      'distance':distance,
      'time_elapsed':time_elapsed,
      'num_steps':num_steps,
      'client_run_id':this.state.client_run_id,
    })
 }

  startPause(){
    var priv = Number(this.state.distanceTravelledsec);
    var isMoving = !this.state.isMoving;
    var me = this;
    if (this.state.enabled) {
      this.CleverTapOnpauseEvent('user_clicked',this.state.distanceTravelled,TimeFormatter(this.state.mainTimer),this.state.numberOfSteps);
      this.setState({
        prevLatLng:null,
      });  

      this.setEnabled(false);
       setTimeout(()=>{ 
        this.updatePaceButtonStyle();
        this._handleStartStop(this.state.mainTimer); 
        // this.clearCurrentSpeed();    
       },30) ;
      
      
    }else{   

      CleverTap.recordEvent('ON_CLICK_RESUME_RUN',{
        'distance':this.state.distanceTravelled,
        'time_elapsed':TimeFormatter(this.state.mainTimer),
        'num_steps':this.state.numberOfSteps,
        'client_run_id':this.state.client_run_id,
      });
      
      this.setState({
        isMoving:isMoving,
        prevLatLng:null,
      });  
      this.setEnabled(true);
       setTimeout(()=>{ 
        me.updatePaceButtonStyle();
        me._handleStartStop(this.state.mainTimer);
        
       },30) ;
    } 
    
  }




  onClickEnable(location) {
     var _this = this;
     this.setState({
      onCarDetectedEndRunModel:false,
      open:false,
     })
     if (location === 'modelEnd') {
      if (Number(parseFloat(_this.state.distanceTravelled).toFixed(1))>= 0.1) {
         this.ConfirmRunEnd()
       }else{
         this.popRoute()
       }
      }else{
      if (Number(parseFloat(_this.state.distanceTravelled).toFixed(1))>= 0.1) {
        
    
        _this.EndRunConfimationForlongRun();  
       }else{
        _this.EndRunConfimation();
        PushNotification.cancelAllLocalNotifications();
      }       
    } 
  }



  ConfirmRunEnd(){

     var d = moment().format('YYYY-MM-DD HH:mm:ss');
     this.setState({
        endDate:d,
      });
     this.setEnabled(false);
      this.setState({
        onCarDetectedEndRunModel:false,
      });
      this.updatePaceButtonStyle();
      this.clearLocationUpdate();
      this._handleStartStop(this.state.mainTimer);
      Location.stopUpdatingLocation();
      clearInterval(this.IntervelSaveRun);
      AsyncStorage.removeItem('runDataAppKill');
      PushNotification.cancelAllLocalNotifications();
      this.navigateTOShareScreen();

     
  }


  

  usainBoltPopup(){
     if (this.state.ussainBoltCount === 3) {
          
          this.setState({
            currentSpeed:0,
          })
          this.setEnabled(false);
          setTimeout(()=>{ 
            this.setState({
              onCarDetectedEndRunModel:true,
            })
           },1000) ;
          // this.clearCurrentSpeed();
          this.updatePaceButtonStyle();
          this._handleStartStop(this.state.mainTimer); 
        }else{
         

          this.setState({
            currentSpeed:0,
            ussainBoltCount:this.state.ussainBoltCount+1,   
          })
          this.setEnabled(false);
          // this.clearCurrentSpeed();
          this.updatePaceButtonStyle();
          this._handleStartStop(this.state.mainTimer);
           setTimeout(()=>{ 
            this.setState({
              open:true,
            })
            this._onNotification();
           },1000) ;
          VibrationIOS.vibrate();                 
        }
       
      }


    setEnabled(value){
      this.setState({
        enabled:value,
      })
    }


  

      
  caloriCounterStart(){
    
    var time =(this.state.timeBetweenTwoPoint/1000)/3600;
    var Calories =  this.state.metval*this.state.weight*time;
    var totalCaloriesBurned = Number(this.state.calorieBurned);
    totalCaloriesBurned += Calories
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
    var speed = prevDistance/(timeBetweenTwoPoint/1000);
    this.setState({
      speedBetweenTwoPoint:speed,
    })
    if (speed != NaN) {
      matValue.getMetsValue(speed)
      .then((metVal)=>{
          this.setState({
            metval:metVal
          })
      })
    }else{
      return;
    }
  }


 
   // function for calculating new and previous latlag
   calcDistance(newLatLng) {
    if (this.state.prevLatLng != null && this.state.prevDistance < 0.150) {
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
      var data = this.props.data;
      var user = this.state.Storeduserdata;
      CleverTap.recordEvent('ON_WORKOUT_COMPLETE',{
        'cause_id':data.pk,
        'distance':this.state.distanceTravelled,
        'time_elapsed':TimeFormatter(this.state.mainTimer),
        'num_steps':this.state.numberOfSteps,
        'bolt_count':this.state.ussainBoltCount,
        'client_run_id':this.state.client_run_id,
      });
      this.props.navigator.replace({
        id:'sharescreen',
        passProps:{
          data:data,
          getUserData:this.props.getUserData,
          user:this.props.user,
          distance:parseFloat(this.state.distanceTravelled).toFixed(1),
          impact:parseFloat(this.state.distanceTravelled).toFixed(1)*data.conversion_rate,
          speed:this.state.currentSpeed,
          isUserlogin:user,
          calories_burnt:this.state.calorieBurned,
          time:TimeFormatter(this.state.mainTimer),
          StartLocation:(this.state.StartLocation != null)?this.state.StartLocation:this.state.StartLocation2,
          EndLocation:(this.state.newlatlong != null)?this.state.newlatlong:this.state.newlatlong2,
          StartRunTime:this.state.myrundate,
          EndRunTime:this.state.endDate,
          noOfsteps:this.state.numberOfSteps,
          num_spikes:this.state.num_spikes,
          client_run_id:this.state.client_run_id,
          locationArray:this.state.locationArray,
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
     CleverTap.recordEvent('ON_LOAD_TOO_SHORT_POPUP',{
        'distance':this.state.distanceTravelled,
        'time_elapsed':TimeFormatter(this.state.mainTimer),
        'num_steps':this.state.numberOfSteps,
        'client_run_id':this.state.client_run_id,
     });
      AlertIOS.alert(
         'That’s too short!',
         'You need to run a minimum of 100m to convert the distance into impact.',
        [
          {text: 'Continue',},
          {text: 'End', onPress: () => this.popRoute()},
        ],
      ); 
    }

    EndRunConfimationForlongRun() {
     VibrationIOS.vibrate();
     CleverTap.recordEvent('ON_LOAD_FINISH_RUN_POPUP');
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
        this.setEnabled(false);
        this.updatePaceButtonStyle();  
        clearInterval(this.IntervelSaveRun);
        // clearInterval(this.getSpeedEvery30Sec);
        clearInterval(this.interval);
        ActivityRecognition.stop()
        // this.clearLocationUpdate();
        DeviceEventEmitter.removeListener('locationUpdated');
        
        this.unsubscribe()  
      }else{
        AsyncStorage.removeItem('runDataAppKill');
        this.navigateTOHomeScreen();
      }
    }





    
 





   
        render(location) {
            if (this.state.componentISmounted) {
                var circularprogress =  ((parseFloat(this.state.distanceTravelled).toFixed(1)*100)/2 === 100)?(parseFloat(this.state.distanceTravelled).toFixed(1)*100)/5:(parseFloat(this.state.distanceTravelled).toFixed(1)*100)/2;
                var data = this.props.data;
                return (
                    <View style={commonStyles.container}>
                        <Image source={require('../../images/backgroundLodingscreen.png')} style={{flex:1,position:'absolute'}}>
                        </Image>
                        <View ref="workspace" style={styles.workspace}>           
                            <View style={styles.WrapCompany}>
                                <Image style={{resizeMode: 'contain',height:styleConfig.LogoHeight,width:styleConfig.LogoWidth,}}source={{uri:data.sponsors[0].sponsor_logo}}></Image>
                                <Text style={{color:styleConfig.greyish_brown_two,fontSize:16,fontFamily:styleConfig.FontFamily,}}>is proud to sponsor your workout.</Text>
                            </View>
                            <View style={{justifyContent: 'center',alignItems: 'center', flex:1}}>
                                <AnimatedCircularProgress
                                    style={{justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}
                                    ref='circularProgress'
                                    size={180}
                                    width={5}
                                    fill={circularprogress}
                                    prefill={100}
                                    tintColor={styleConfig.light_sky_blue}
                                    rotation={0}
                                    backgroundColor="#fafafa">                   
                                </AnimatedCircularProgress>
                                <View style={{marginTop:-160,backgroundColor:'transparent',width:180,height:180,justifyContent:'center',alignItems:'center',position:'absolute'}}>
                                    <Text style={styles.Impact}><Icon2 style={[styles.Impact,{fontSize:35}]}name={this.state.my_currency.toLowerCase()}></Icon2>{(this.state.my_currency == 'INR')?parseFloat((this.state.distanceTravelled*data.conversion_rate)/this.state.my_rate).toFixed(0):parseFloat((this.state.distanceTravelled*data.conversion_rate)/this.state.my_rate).toFixed(2)}</Text>    
                                    <Text style={{fontFamily:styleConfig.FontFamily,fontSize:19,color:styleConfig.greyish_brown_two,opacity:0.7,}}>IMPACT</Text>
                                </View>
                            </View>
                            <View style={{flex:1,flexDirection:'row',backgroundColor:'transparent'}}>
                                <View style={styles.timeDistanceWrap}>
                                    <Icon style={{color:styleConfig.greyish_brown_two,fontSize:30,}} name={'ios-walk-outline'}></Icon>
                                    <Text style={styles.distance}>{(this.state.my_distance == 'miles' ? parseFloat(this.state.distanceTravelled*0.621).toFixed(1) : parseFloat(this.state.distanceTravelled).toFixed(2))}</Text>
                                    <Text style={{fontFamily:styleConfig.FontFamily,color:styleConfig.greyish_brown_two,opacity:0.7,}}>{(this.state.my_distance == 'miles' ? 'MI' : 'KMS')}</Text>
                                </View>
                                <View style={styles.timeDistanceWrap2}>
                                    <CaloriCounter weight = {this.state.weight} calories = {this.state.calorieBurned } />
                                </View>
                                <View style={styles.timeDistanceWrap}>
                                    <Icon style={{color:styleConfig.greyish_brown_two,fontSize:30,backgroundColor:'transparent'}} name={'md-stopwatch'}></Icon>
                                    <Text style={styles.distance}>{TimeFormatter(this.state.mainTimer)}</Text>
                                    <Text style={{fontFamily:styleConfig.FontFamily,color:styleConfig.greyish_brown_two,opacity:0.7,}}>TIME</Text>
                                </View>
                            </View>
                        </View>
                        <View style={commonStyles.bottomToolbar}>
                            <TouchableOpacity   onPress={()=>this.startPause(this)} style={this.state.paceButtonStyle}>
                                <View style={{flexDirection:'row'}}>
                                    <Icon name={this.state.paceButtonIcon} style={{color:styleConfig.greyish_brown_two,fontSize:18,marginTop:2,marginRight:5}}></Icon>
                                    <Text style={{fontFamily:styleConfig.FontFamily,fontSize:18,fontWeight:'800',letterSpacing:1,color:styleConfig.greyish_brown_two,}}>{this.state.textState}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity   
                                 onPress={()=>this.onClickEnable(location)} iconStyle={commonStyles.iconButton} style={styles.EndRun}>
                                <Text style={{fontFamily:styleConfig.FontFamily,fontSize:18,fontWeight:'800',letterSpacing:1,color:'white',}}>STOP</Text>
                            </TouchableOpacity>    
                        </View>
                        {this.modelViewDrivingEndRun()}
                        {this.modelViewDriving()}
                        {this.modelViewGpsWeek()}
                        
                    </View>
                );
            }
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
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:responsiveFontSize(3)}}>Too Fast</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:responsiveFontSize(2)}}>Seems you are in a vehicle. We have paused your workout.</Text>
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
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:responsiveFontSize(3)}}>In a Vehicle !</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:responsiveFontSize(2)}}>you are in a moving vehicle. So we are ending your workout.</Text>
                   <View style={styles.modelBtnWrap}>
                    <TouchableOpacity style={styles.modelbtnEndRun}onPress ={()=>this.onClickEnable('modelEnd')}><Text style={styles.btntext}>Okay</Text></TouchableOpacity>
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
                     <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:responsiveFontSize(3)}}>Weak GPS</Text>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                     <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:responsiveFontSize(2)}}>Try to be in open areas and enable data.</Text>
                   <View style={styles.modelBtnWrap}>
                    <TouchableOpacity style={styles.modelbtnEndRun}onPress ={()=>this.closemodel()}><Text style={styles.btntext}>Okay</Text></TouchableOpacity>
                  </View>
                   </View>
                   </View>
                  </View>
            </Modal>
          )
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
    shadowColor: '#ccc',
     shadowOpacity: 0.1,
     shadowRadius: 10,
     shadowOffset: {
      height: 2,
     },
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
    fontWeight:'800',
    color:styleConfig.light_sky_blue,
    backgroundColor:'transparent',   
    fontFamily:styleConfig.LatoBlack,
  },
  distance:{
    fontSize:25,
    fontWeight:'800',
    color:styleConfig.greyish_brown_two,
    backgroundColor:'transparent',   
    fontFamily:styleConfig.LatoBlack,
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
    height:responsiveHeight(30),
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