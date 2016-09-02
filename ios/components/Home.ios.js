'use strict';


import SettingDetail from '../../components/SettingDetail';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SwitchIOS,
  TouchableHighlight,
  AlertIOS,
  AsyncStorage,
  TouchableOpacity,
  VibrationIOS,
  Image,
 } from 'react-native';
import TimeFormatter from 'minutes-seconds-milliseconds';
import TimerMixin from 'react-timer-mixin';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Mapbox from 'react-native-mapbox-gl';
import BackgroundGeolocation from 'react-native-background-geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsService from '../../components/SettingsService';
import commonStyles from '../../components/styles';
import haversine from 'haversine';
var mapRef = 'mapRef';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;

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
    backgroundColor:'#673ab7',
    margin:10,
  },
  ResumePause:{
    justifyContent: 'center',      
    alignItems: 'center',
    height:50,
    width:deviceWidth/2-20,
    borderRadius:30,
    backgroundColor:'#d667cd',
    margin:10,
  },
  workspace: {
    flex: 1,
    justifyContent: 'center',      
    alignItems: 'center',
    top:-20,
  },
  map: {
    position:'absolute',
    height:deviceheight,
    width:deviceWidth,
    opacity:0,
  },
  bottomBarContent:{
    paddingLeft:10, 
    width:deviceWidth/4,
    justifyContent: 'center',      
    alignItems: 'center',
  },
  Navbar:{
    paddingLeft:10,
    position:'relative',
    top:0,
    height:55,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
    backgroundColor:'#00b9ff',
    borderBottomWidth:2,
    borderBottomColor:'#e03ed2',
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
  Impact:{
    fontSize:30,
    fontWeight:'500',
  },
  distance:{
    fontSize:25,
    fontWeight:'500',
  },
  WrapCompany:{
    justifyContent: 'center',      
    alignItems: 'center',
    top:10,
   },
   timeDistanceWrap:{
    justifyContent: 'center',      
    alignItems: 'center',
    width:deviceWidth/2,    
   },
});

SettingsService.init('iOS');

  var Home = React.createClass({
    mixins: [TimerMixin],
    mixins: [Mapbox.Mixin],
    annotations: [],
    locationIcon: 'green-circle.png',
    currentLocation: undefined,
    locationManager: undefined,

  // InitilialStates

  getInitialState: function() {
    return {
      isRunning:false,
      mainTimer:null,
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
      mapHeight: 280,
      mapWidth: 300,
      zoom: 10,
      annotations: [],
      center: {
        latitude: 40.72052634,
        longitude: -73.97686958312988
      },
      zoom: 14
    };
  },

  componentWillUnmount:function() {
     this.setState({
       enabled:true,
       isMoving:true,
     })
   },
  componentWillMount: function() {
   GoogleSignin.configure({
   iosClientId:"437150569320-v8jsqrfnbe07g7omdh4b1h5tn78m0omo.apps.googleusercontent.com", // only for iOS
   })
  .then((user) => {
     console.log('Token:'+user);
   });
    AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
        stores.map((result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
            this.setState({
              Storeduserdata:val
            })
            console.log("UserDatakey1 :" + key, val);
        });
    });

    var me = this,
    gmap = this.refs.gmap;
    this.locationManager = this.props.locationManager;

    // location event
    this.locationManager.on("location", function(location) {
      console.log('- location: ', JSON.stringify(location, null, 2));
      if (location.sample) {
        console.log('<sample location>');
        return;
      }
      me.addMarker(location);
      me.setCenter(location);
    });
    // http event
    this.locationManager.on("http", function(response) {
      console.log('- http ' + response.status);
      console.log(response.responseText);
    });
    // geofence event
    this.locationManager.on("geofence", function(geofence) {
      console.log('- onGeofence: ', JSON.stringify(geofence));
      me.locationManager.removeGeofence(geofence.identifier);
    });
    // error event
    this.locationManager.on("error", function(error) {
      console.log('- ERROR: ', JSON.stringify(error));
    });
    // motionchange event
    this.locationManager.on("motionchange", function(event) {
      console.log("- motionchange", JSON.stringify(event, null, 2));
      me.setState({
        isMoving: event.is_moving
      });
      me.updatePaceButtonStyle()
    });
    // heartbeat event
    this.locationManager.on("heartbeat", function(params) {
      console.log("- heartbeat: ", params.location);
    });
    // schedule event
    this.locationManager.on("schedule", function(state) {
      console.log("- schedule fired: ", state.enabled, state);
      me.setState({
        isMoving: state.isMoving,
        enabled: state.enabled
      });
      me.updatePaceButtonStyle();
    });
    // activitychange event
    this.locationManager.on("activitychange", function(activityName) {
      console.log("- activitychange fired: ", activityName);
    });

    // getGeofences
    this.locationManager.getGeofences(function(rs) {
      console.log('- getGeofences: ', JSON.stringify(rs));
    }, function(error) {
      console.log("- getGeofences ERROR", error);
    });

    // Fetch settings and configure.
     SettingsService.getValues(function(values) {

    //values.schedule = SettingsService.generateSchedule(24, 1, 1, 1);
      
      // Configure BackgroundGeolocaiton!
    me.locationManager.configure(values, function(state) {
      console.log('- configure, current state: ', state);

      me.locationManager.startSchedule(function() {
        console.log('- Schedule start success');
      });

      me.setState({
        enabled: true,
        isMoving:true,
        isRunning:true,
      });
      if (state.enabled) {
        me.initializePolyline();
        me.updatePaceButtonStyle();
      }

    });
    });
  
    this.setState({
        enabled: true,
        isMoving:true,
        isRunning:true,
      });
   
  },
   componentDidMount:function(){
    console.log('mytest'+ this.state.textState);
   
    console.log('myComponentDta'+ this.state.isMoving +' and '+ this.state.enabled);
    this.refs.circularProgress.performLinearAnimation(parseFloat(this.state.distanceTravelled).toFixed(0), 5000)
    this.locationManager.start();    
    this.updatePaceButtonStyle();


      var isMoving = this.state.isMoving;
      this.locationManager.changePace(isMoving);
      this.setState({
        enabled:true,
        isMoving:true,
        textState:'PAUSE',
        isRunning:true,
      });
      this.updatePaceButtonStyle();
            


            return;

      
    },
   _handleStartStop:function(){
          let {isRunning,FirstTime,mainTimer,lapTimer} = this.state;
          if(this.state.textState === 'RESUME'){
            console.log('mytest'+ this.state.textState);
            clearInterval(this.interval);
            this.setState({
                isRunning:false
            });
            return;
            
          }else{ 
            console.log('mytest'+ this.state.textState);
            if (this.state.textState === 'PAUSE') {
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
        
          },
   _signIn:function() {
     GoogleSignin.signIn()
     .then((user) => {
     console.log('usertoken:'+ JSON.stringify(user));
      // var user = JSON.parse(JSON.stringify(user));
      this.setState({user:user});
      var access_token = user.accessToken;
      console.log('MY accessToken:'+ access_token);
      fetch("http://139.59.243.245/api/users/", {
      method: "GET",
       headers: {  
          'Authorization':"Bearer google-oauth2 "+ user.accessToken,
        }
      })
  
      .then((response) => response.json())
      .then((userdata) => { 
      this.props.navigator.push({
              title: 'Gps',
              id:'tab',
              index: 0,
              navigator: this.props.navigator,
             });
          console.log('MY data:'+ JSON.stringify(userdata));
          var userdata = userdata;
          console.log('MY userdata:' + userdata[0].first_name);

          let UID234_object = {
              first_name:userdata[0].first_name,
              user_id:userdata[0].user_id,
              last_name:userdata[0].last_name,
              gender_user:userdata[0].gender_user,
              email:userdata[0].email,
              phone_number:userdata[0].phone_number,
              social_thumb:userdata[0].social_thumb,
              auth_token:userdata[0].auth_token,
          };
          // first user, delta values
          let UID234_delta = {
              first_name:userdata[0].first_name,
              user_id:userdata[0].user_id,
              last_name:userdata[0].last_name,
              gender_user:userdata[0].gender_user,
              email:userdata[0].email,
              phone_number:userdata[0].phone_number,
              social_thumb:userdata[0].social_thumb,
              auth_token:userdata[0].auth_token,
         };
          // // second user, initial values
           let UID345_object = {
              first_name:userdata[0].first_name,
              user_id:userdata[0].user_id,
              last_name:userdata[0].last_name,
              gender_user:userdata[0].gender_user,
              email:userdata[0].email,
              phone_number:userdata[0].phone_number,
              social_thumb:userdata[0].social_thumb,
              auth_token:userdata[0].auth_token,
          };

          // // second user, delta values
           let UID345_delta = {
              first_name:userdata[0].first_name,
              user_id:userdata[0].user_id,
              last_name:userdata[0].last_name,
              gender_user:userdata[0].gender_user,
              email:userdata[0].email,
              phone_number:userdata[0].phone_number,
              social_thumb:userdata[0].social_thumb,
              auth_token:userdata[0].auth_token,
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
                  AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
                      stores.map((result, i, store) => {
                          let key = store[i][0];
                          let val = store[i][1];
                          this.setState({
                            Storeduserdata:val
                          })
                          console.log("UserDatakey145:" + key, val);
                      });
                  });
              });
           });
          
          })
        .done();
       })
   .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  },
  
  // Add Marker if check clear
  addMarker :function(location) {
    

    const {distanceTravelled,prevDistance } = this.state
    const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
    const newDistance = distanceTravelled + this.calcDistance(newLatLngs)
      this.setState({
            prevDistance: newDistance-distanceTravelled,
          })
    // If Location accuracy is less than 15
      if (location.coords.accuracy <=15){

        // IF Speed More than 35km/hr
      if (location.coords.speed <= 35) {
      var me = this;
      this.addAnnotations(mapRef, [this.createMarker(location)]);
      if ( this.polyline) {
        this.polyline.coordinates.push([location.coords.latitude, location.coords.longitude]);
        // this.polyline.lengthof.push(this.polyline.oneOf(this.polyline));
        this.updateAnnotation(mapRef, this.polyline);
      }
      const {distanceTravelled,prevDistance } = this.state
      const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
      this.setState({
          distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
          prevLatLng: newLatLngs,
          speed:location.coords.speed,
        })
        }else{
          this.locationManager.removeGeofences();
          this.locationManager.stop();
             this.setState({
            enabled: !this.state.enabled,    
          });
          this.updatePaceButtonStyle();
          VibrationIOS.vibrate();
          AlertIOS.alert('Your speed is more than running speed it seems you are travelling in vehicle');
         }
      }else{
          // else to our algo part
          var Prevdistance = this.state.prevDistance*1000;
          var locationAccuracy=location.coords.accuracy;
          var thresholdAccuracy = 16;
          var offset = 1;
          var thresholdFactor = 5; 
          var currentDistance = Prevdistance;
            if(Prevdistance/(locationAccuracy - (thresholdAccuracy-offset)) > thresholdFactor){
            var me = this;
            this.addAnnotations(mapRef, [this.createMarker(location)]);
              if ( this.polyline) {
                this.polyline.coordinates.push([location.coords.latitude, location.coords.longitude]);
                // this.polyline.lengthof.push(this.polyline.oneOf(this.polyline));
                this.updateAnnotation(mapRef, this.polyline);
                }
             }
          }
      
  },


   // function for calculating new and previous latlag
   calcDistance:function(newLatLng) {
    const { prevLatLng } = this.state
    return (haversine(prevLatLng, newLatLng) || 0)
   },
 
   //create marker details 
   createMarker: function(location) {
      return {
          id: location.timestamp,
          type: 'point',
          title: location.timestamp,
          coordinates: [location.coords.latitude, location.coords.longitude]
        };
    },

    // initialize polyline
    initializePolyline: function() {
      this.polyline = {
        lengthof:{},
        type: "polyline",
        coordinates: [],
        title: "Route",
        strokeColor: '#2677FF',
        strokeWidth: 5,
        strokeAlpha: 0.5,
        id: "route"
      };
      this.polyline2 = {
        lengthof:{},
        type: "polyline",
        coordinates: [],
        title: "Route",
        strokeColor: 'red',
        strokeWidth: 5,
        strokeAlpha: 0.5,
        id: "route"
      };
      this.addAnnotations(mapRef, [this.polyline,this.polyline2]);
    },

   onClickEnable: function(location) {
    var me = this;
    if (!this.state.enabled) {
      this.locationManager.start(function() {
        me.initializePolyline();
      });
      } else {
      if (this.state.enabled) {
      // if (parseFloat(this.state.distanceTravelled).toFixed(1) >= 0.1 ) {
         this.navigateTOShareScreen()
        // var auth_token = JSON.stringify(this.state.userData.auth_token);
        // var user_id = this.state.userData.user_id
        // console.log('authTokrn:'+ auth_token);
        // if (parseFloat(this.state.distanceTravelled).toFixed(1) >= 0.1) {
      // }else{
      //   AlertIOS.alert('You didnt even run 100m we dont save run less than 100 m.')
      // }
      };
     
      this.locationManager.removeGeofences();
      this.locationManager.stop();
      this.locationManager.resetOdometer();
      this.removeAllAnnotations(mapRef);
      this.polyline = null;
    }
    this.setState({
      enabled: !this.state.enabled,
      
    });
    this.updatePaceButtonStyle();
  },

   navigateTOHomeScreen:function(){
    this.props.navigator.replace({
            title: 'Gps',
            id:'tab',
            navigator: this.props.navigator,
           })
    },
     navigateTOShareScreen:function(){
          var data = this.props.data;
          var user = this.state.Storeduserdata;
          this.props.navigator.push({
            id:'sharescreen',
            passProps:{data:this.state.Storeduserdata,distance:parseFloat(this.state.distanceTravelled).toFixed(1),impact:parseFloat(this.state.distanceTravelled * data.conversion_rate).toFixed(0)},isUserlogin:user,
            navigator: this.props.navigator,
           })
    },
    
    Confimation:function() {
      AlertIOS.alert(
          'Go Back',
         'Are you sure you want to go back ',
         [
        {text: 'Confirm', onPress: () => this.popRoute() },
        {text: 'Cancel',},
       ],
       ); 
      },
    popRoute:function() {
      if (this.state.enabled) {    
      this.locationManager.removeGeofences();
      this.locationManager.stop();
      this.navigateTOHomeScreen();
      this.state.distanceTravelled = 0;
      this.state.prevDistance = 0;
      this.locationManager.resetOdometer();
      this.removeAllAnnotations(mapRef);
      this.polyline = null;
       this.setState({
        enabled: !this.state.enabled, 
       });
      this.updatePaceButtonStyle();
      
      }else{
        this.navigateTOHomeScreen();
      }
    },
    PostRun:function(){

      // if (parseFloat(this.state.distanceTravelled).toFixed(1) >= 0.1) {


      var userdata = this.state.Storeduserdata;
      var UserDataParsed = JSON.parse(userdata);
      var user_id =JSON.stringify(UserDataParsed.user_id);
      var token = JSON.stringify(UserDataParsed.auth_token);
      var tokenparse = JSON.parse(token);
      console.log('Tokenuser:' + token);
      var speed = this.state.speed;
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
          distance: parseFloat(this.state.distanceTravelled).toFixed(1),
          peak_speed: 1,
          avg_speed:speed,
          run_amount: parseFloat(this.state.distanceTravelled*10).toFixed(0),
          run_duration: "00:58:20"
          })
      })
      .then((response) => response.json())
      .then((userRunData) => { 
        AlertIOS.alert('rundata'+JSON.stringify(userRunData))
        this.navigateTOHomeScreen();
        this.state.distanceTravelled = 0;
        this.state.prevDistance = 0;
      })
    // }else{
    //     VibrationIOS.vibrate(); 
    //     AlertIOS.alert('your run is less than 100 meters you didnt even raised 1 rupee.')
    // }
    },
    onClickPace: function() {
      let {isRunning,FirstTime,mainTimer,lapTimer} = this.state;
      if (!this.state.enabled)  {
      VibrationIOS.vibrate()    
        console.log('ismovingdata'+this.state.isMoving);
       return; }else{
         if (isRunning) {
        console.log('mytest'+ this.state.textState);
        clearInterval(this.interval);
        this.setState({
            isRunning:false
        });
      }
     };
     if (!isRunning) {
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
      var isMoving = !this.state.isMoving;
      this.locationManager.changePace(isMoving);

      this.setState({
        isMoving: isMoving,

      });
      VibrationIOS.vibrate()
      this.updatePaceButtonStyle();

    },
 
    onClickLocate: function() {
      var me = this;
      this.locationManager.getState(function(state) {
        console.log('- state: ', state);
      });

      this.locationManager.getCurrentPosition({
        timeout: 10,
        persist: false,
        desiredAccuracy: 10,
        samples: 5,
        maximumAge: 5000
      }, function(location) {
        me.setCenter(location);
        console.log('- current position: ', JSON.stringify(location));
      }, function(error) {
        console.error('ERROR: getCurrentPosition', error);
        me.setState({navigateButtonIcon: 'navigate'});
      });
    },
    onRegionChange: function() {
      console.log('onRegionChange');
    },
    setCenter: function(location) {
      this.setCenterCoordinateAnimated(mapRef, location.coords.latitude, location.coords.longitude)
    },
  updatePaceButtonStyle: function() {
    var style = commonStyles.disabledButton;
    if (this.state.enabled) {
      style = (this.state.isMoving) ? commonStyles.redButton : commonStyles.greenButton;
    }
    this.setState({
      paceButtonStyle: style,
      paceButtonIcon: (this.state.enabled && this.state.isMoving) ? 'md-pause' : 'md-play',
      textState:(this.state.enabled && this.state.isMoving) ? 'PAUSE':'RESUME', 
      EndRun:(this.state.enabled) ? 'END RUN':'BEGIN RUN', 

    });
  },
  // MapBox
  onRegionChange: function(location) {
    this.setState({ currentZoom: location.zoom });
  },
  onRegionWillChange:function(location) {
    console.log('regionChange :'+JSON.stringify(location));
  },
  onUpdateUserLocation:function(location) {
    console.log('UpdateLocation :'+location);
  },
  onOpenAnnotation:function(annotation) {
    console.log('annotation:'+annotation);
  },
  onRightAnnotationTapped:function(e) {
    console.log(e);
  },

  render: function(location) {
    var data = this.props.data;
    return (
      <View style={commonStyles.container}>
       <View style={styles.Navbar}>
          <TouchableOpacity style={{height:50,width:50,justifyContent: 'center',alignItems: 'center',}} onPress={this.Confimation} ><Icon style={{color:'white',fontSize:30,}}name={'md-arrow-back'}></Icon></TouchableOpacity>
            <Text style={styles.menuTitle}>RunScreen</Text>
        </View>
         <View ref="workspace" style={styles.workspace}>
          <View style={styles.WrapCompany} >
            <Image style={{height:40,width:70}}source={{uri:data.sponsors[0].sponsor_logo}}></Image>
            <Text style={{marginTop:20}}>IMPACT</Text> 
          </View>
          <Mapbox
            style={styles.map}
            direction={0}
            rotateEnabled={true}
            scrollEnabled={true}
            zoomEnabled={true}
            showsUserLocation={false}
            ref={mapRef}
            accessToken={'pk.eyJ1IjoiY2hyaXN0b2NyYWN5IiwiYSI6ImVmM2Y2MDA1NzIyMjg1NTdhZGFlYmZiY2QyODVjNzI2In0.htaacx3ZhE5uAWN86-YNAQ'}
            styleURL={this.mapStyles.emerald}
            userTrackingMode={this.userTrackingMode.none}
            centerCoordinate={this.state.center}
            zoomLevel={this.state.zoom}
            onRegionChange={this.onRegionChange}
            onRegionWillChange={this.onRegionWillChange}
            annotations={this.state.annotations}
            onOpenAnnotation={this.onOpenAnnotation}
            onRightAnnotationTapped={this.onRightAnnotationTapped}
            onUpdateUserLocation={this.onUpdateUserLocation}>
           </Mapbox>
           <AnimatedCircularProgress
              style={{ top:50,justifyContent:'center',alignItems:'center',}}
              ref='circularProgress'
              size={130}
              width={5}
              fill={this.state.distanceTravelled*10/2}
              prefill={100}
              tintColor="#00e0ff"
              backgroundColor="#ccc">                   
            </AnimatedCircularProgress>
             <View style={{top:-70,backgroundColor:'transparent',width:100,height:100,justifyContent:'center',alignItems:'center'}}>
              <Text style={styles.Impact}>{parseFloat(this.state.distanceTravelled * data.conversion_rate).toFixed(0)}</Text>
              <Text>RUPEES</Text>
            </View>
            <View style={{width:deviceWidth,flexDirection:'row',}}>
              <View style={styles.timeDistanceWrap}>
                <Icon style={{color:'black',fontSize:30,}} name={'ios-walk-outline'}></Icon>
                  <Text style={styles.distance}>{parseFloat(this.state.distanceTravelled ).toFixed(1)}</Text>
                <Text>km</Text>
              </View>
              <View style={styles.timeDistanceWrap}>
                <Icon style={{color:'black',fontSize:30,}} name={'md-stopwatch'}></Icon>
                 <Text style={styles.distance}>{TimeFormatter(this.state.mainTimer)}</Text>
                <Text>sec</Text>
              </View>
            </View>
          </View>
        <View style={commonStyles.bottomToolbar}>
        <TouchableHighlight  onPress={this.onClickPace} style={styles.ResumePause}>
         <View style={{flexDirection:'row'}}>
          <Icon name={this.state.paceButtonIcon} style={{color:'white',fontSize:20,marginTop:3,marginRight:5}}></Icon>
          <Text style={{fontSize:20,fontWeight:'800',letterSpacing:1,color:'white',}}>{this.state.textState}</Text>
          </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onClickEnable} iconStyle={commonStyles.iconButton} style={styles.EndRun}><Text style={{fontSize:20,fontWeight:'800',letterSpacing:1,color:'white',}}>{this.state.EndRun}</Text></TouchableHighlight>
        </View>
      </View>
    );
  }
});
          // <Icon.Button name={this.state.navigateButtonIcon} onPress={this.onClickLocate} size={30} color="#00b9ff" underlayColor="#ccc" backgroundColor="white" style={styles.btnNavigate} />

        // <View style={styles.distanceWrap}>
        //     <Text style={styles.bottomBarContent}>Distance {"\n"}{parseFloat(this.state.distanceTravelled).toFixed(1)}km</Text>
        //     <Text style={styles.bottomBarContent}>Rupees{"\n"}{parseFloat(this.state.distanceTravelled*10).toFixed(0)}rs</Text>
        //     <Text style={styles.bottomBarContent}>Distance two points {"\n"}{parseFloat(this.state.prevDistance*1000).toFixed(1)}m</Text>
        //     <Text style={styles.bottomBarContent}>Speed {this.state.speed}m/s</Text>
        // </View>

module.exports = Home;

