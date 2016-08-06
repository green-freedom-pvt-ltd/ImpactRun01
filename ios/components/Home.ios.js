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

 } from 'react-native';

import Mapbox from 'react-native-mapbox-gl';
import BackgroundGeolocation from 'react-native-background-geolocation';

var mapRef = 'mapRef';


//var RNGMap                = require('react-native-gmaps');
//var Polyline              = require('react-native-gmaps/Polyline');
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsService from '../../components/SettingsService';
import commonStyles from '../../components/styles';
import haversine from 'haversine'

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
  }
});

SettingsService.init('iOS');

var Home = React.createClass({
  mixins: [Mapbox.Mixin],
  annotations: [],
  locationIcon: 'green-circle.png',
  currentLocation: undefined,
  locationManager: undefined,

  getInitialState: function() {
    return {
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
  

  addMarker :function(location) {
    const {distanceTravelled,prevDistance } = this.state
    const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
    const newDistance = distanceTravelled + this.calcDistance(newLatLngs)
  this.setState({
        prevDistance: newDistance-distanceTravelled,
      })
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
      })
  
  }else{
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
   calcDistance:function(newLatLng) {

    const { prevLatLng } = this.state
    return (haversine(prevLatLng, newLatLng) || 0)
  
  },

  createMarker: function(location) {
    return {
        id: location.timestamp,
        type: 'point',
        title: location.timestamp,
        coordinates: [location.coords.latitude, location.coords.longitude]
      };
  },
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

  onClickMenu: function() {
    this.props.drawer.open();
  },

  onClickEnable: function() {
    var me = this;
    if (!this.state.enabled) {
      this.locationManager.start(function() {
        me.initializePolyline();
      });
    } else {
      this.state.distanceTravelled = 0;
      this.state.prevDistance = 0;
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
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.iosStatusBar} />
        <View style={commonStyles.topToolbar}>
          <Text style={commonStyles.toolbarTitle}>ImpactRun</Text>
          <SwitchIOS onValueChange={this.onClickEnable} value={this.state.enabled} />
        </View>
        <View ref="workspace" style={styles.workspace}>
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

