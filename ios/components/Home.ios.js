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
  AsyncStorage
 } from 'react-native';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

import Mapbox from 'react-native-mapbox-gl';
import BackgroundGeolocation from 'react-native-background-geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsService from '../../components/SettingsService';
import commonStyles from '../../components/styles';
import haversine from 'haversine'
var mapRef = 'mapRef';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height-100;

var styles = StyleSheet.create({
  StartStopbtn:{
    left:-3,
    paddingLeft:10,
    bottom:0,
    borderRadius:0,
    flex:1,
    height:40,
    width:deviceWidth/2,
    backgroundColor:'#d667cd',
    marginRight:-10,
    fontSize:30,
    color:'white',

  
  },
  distanceWrap:{
      flexDirection: 'row',
      justifyContent:'center',
      width:deviceWidth,
      height:50,
  },
  playpause:{
    justifyContent:'center',
    fontSize:25,
    color:'white',

  },
  EndRun:{
  justifyContent: 'center',      
  alignItems: 'center',
  height:50,
  width:deviceWidth/2,
  backgroundColor:'#00b9ff'
  },
  workspace: {
    flex: 1
  },
  map: {
    flex: 1
  },
  bottomBarContent:{
  paddingLeft:10, 
  width:deviceWidth/3,
  justifyContent: 'center',      
  alignItems: 'center',
  },
});

SettingsService.init('iOS');

var Home = React.createClass({

  mixins: [Mapbox.Mixin],
  annotations: [],
  locationIcon: 'green-circle.png',
  currentLocation: undefined,
  locationManager: undefined,

  // InitilialStates

  getInitialState: function() {
    return {
      speed:0,
      prevLatLng: {},
      distanceTravelled: 0,
      prevDistance:0,
      textState:'',
      Enbtn:'',
      enabled: true,
      isMoving: true,
      paceButtonStyle: commonStyles.disabledButton,
      paceButtonIcon: 'md-play',
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


  componentDidMount: function() {
       GoogleSignin.configure({
       iosClientId:"437150569320-362l4gc7qou0r2u8gpple6lkfo3jjjre.apps.googleusercontent.com", // only for iOS
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
        enabled: state.enabled
      });
      if (state.enabled) {
        me.initializePolyline();
        me.updatePaceButtonStyle()
      }

    });
    });
    

    this.setState({
      enabled: true,
      isMoving: true,
      textState:'PLAY',
      EndRun:'BEGIN RUN'
    });
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
              id:'home',
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
                           this.PostRun();
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
    // IF Speed More than 25km/hr
    if (location.coords.speed <= 25) {
    const {distanceTravelled,prevDistance } = this.state
    const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
    const newDistance = distanceTravelled + this.calcDistance(newLatLngs)
      this.setState({
            prevDistance: newDistance-distanceTravelled,
          })
    // If Location accuracy is less than 15
      if (location.coords.accuracy <= 15){
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
   }else{
         AlertIOS.alert('Your speed is more than running speed it seems you are travelling in vehicle');
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
        if (this.state.Storeduserdata != null) {
         this.PostRun();
         this.navigateTOHomeScreen();
        // var auth_token = JSON.stringify(this.state.userData.auth_token);
        // var user_id = this.state.userData.user_id
        // console.log('authTokrn:'+ auth_token);
        // if (parseFloat(this.state.distanceTravelled).toFixed(1) >= 0.1) {
         
       }else{
         AlertIOS.alert(
           'Login',
             'Please Login to post run',
            [
            {text: 'Google Login', onPress: () => this._signIn() }
             ],
             );

     }

  
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
    this.props.navigator.push({
            title: 'Gps',
            id:'home',
            navigator: this.props.navigator,
           })
    },

    PostRun:function(){
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
        this.state.distanceTravelled = 0;
        this.state.prevDistance = 0;
      })
    },
  onClickPace: function() {
    if (!this.state.enabled)  { return; }
    var isMoving = !this.state.isMoving;
    this.locationManager.changePace(isMoving);

    this.setState({
      isMoving: isMoving,
      textState:'START'
    });
    this.updatePaceButtonStyle();
    

  },
  navigate:function(){
    
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
      textState:(this.state.enabled && this.state.isMoving) ? 'PAUSE':'PLAY', 
      EndRun:(this.state.enabled && this.state.isMoving) ? 'END RUN':'BEGIN RUN', 

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
    console.log('data'+ JSON.stringify(data));
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.iosStatusBar} />
        <View style={commonStyles.topToolbar}>
          <Text style={commonStyles.toolbarTitle}>ImpactRun</Text>
        </View>
        <View ref="workspace" style={styles.workspace}>
          <Text>{data.cause_title}</Text>
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
            onUpdateUserLocation={this.onUpdateUserLocation} />
        <View style={styles.distanceWrap}>
            <Text style={styles.bottomBarContent}>Distance {"\n"}{parseFloat(this.state.distanceTravelled).toFixed(1)}km</Text>
            <Text style={styles.bottomBarContent}>Rupees{"\n"}{parseFloat(this.state.distanceTravelled*10).toFixed(0)}rs</Text>
            <Text style={styles.bottomBarContent}>Distance two points {"\n"}{parseFloat(this.state.prevDistance*1000).toFixed(1)}m</Text>

         </View>
        </View>

        <View style={commonStyles.bottomToolbar}>
          <Icon name={this.state.paceButtonIcon} onPress={this.onClickPace} iconStyle={commonStyles.iconButton} style={[this.state.paceButtonStyle,styles.stationaryButton]}><Text style={styles.playpause}>{this.state.textState}</Text></Icon>
          <TouchableHighlight onPress={this.onClickEnable} iconStyle={commonStyles.iconButton} style={styles.EndRun}><Text style={{fontSize:20,fontWeight:'800',letterSpacing:1,color:'white',}}>{this.state.EndRun}</Text></TouchableHighlight>

        </View>
      </View>
    );
  }
});
          // <Icon.Button name={this.state.navigateButtonIcon} onPress={this.onClickLocate} size={30} color="#00b9ff" underlayColor="#ccc" backgroundColor="white" style={styles.btnNavigate} />


module.exports = Home;

