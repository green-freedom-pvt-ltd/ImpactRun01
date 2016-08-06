'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions
 } from 'react-native';
const width = Dimensions.get('window').width

const height = Dimensions.get('window').height

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'    
  },
  topToolbar: {
    //paddingLeft: 10,
    backgroundColor: '#00b9ff',  //ff d7 00
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    paddingRight: 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    height: 46
  },
  iosStatusBar: {
    height: 20,
    backgroundColor: '#00b9ff'
  },
  bottomToolbar: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 50
  },
  toolbarTitle: {
  	fontWeight: 'bold', 
  	fontSize: 18, 
  	flex: 1, 
    color:'white',
  	textAlign: 'center'
  },
  disabledButton: {
    width:width/2,
    height:50,
    backgroundColor: '#ccc',
   paddingTop:10,
   paddingLeft:10,
  },
  iconButton: {
    marginRight:10,
    marginTop:2,
    fontSize:10,
    backgroundColor:'red',
  },
  backButtonIcon: {
  	//marginRight: 
  },
  backButtonText: {
  	fontSize: 18,
  	color: 'white'
  },
  redButton: {
    padding:0,
    height:50,
    backgroundColor: '#d667cd',
    width:width/2, 
    justifyContent:'center',
  },
  greenButton: {
    padding:0,
    height:50,
    backgroundColor: '#d667cd',
    width: 100,
    width:width/2,
    alignItems: 'center',
    justifyContent:'center',
  }
  
});

module.exports = styles;
