'use strict';

import React, { Component } from 'react';
import {
  StyleSheet
 } from 'react-native';

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
  	paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
    borderTopColor: 'white',
    borderTopWidth: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    height: 46
  },
  toolbarTitle: {
  	fontWeight: 'bold', 
  	fontSize: 18, 
  	flex: 1, 
    color:'white',
  	textAlign: 'center'
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  iconButton: {
    marginRight:10,
    marginTop:2,
    fontSize:35,
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
    backgroundColor: '#D9534F',
    width: 100
  },
  greenButton: {
    backgroundColor: '#5CB85C',
    width: 100
  }
  
});

module.exports = styles;
