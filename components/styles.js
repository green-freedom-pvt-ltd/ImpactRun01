'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions
 } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
export default {
    navColor:'#00b9ff' 
  }

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
    backgroundColor:'transparent',   
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 50,
    bottom:20,
    justifyContent:'center',
    alignItems:'center',
    
  },
  toolbarTitle: {
  	fontWeight: 'bold', 
  	fontSize: 18, 
  	flex: 1, 
    color:'transparent',
  	textAlign: 'center'
  },
  disabledButton: {
    width:width/2-10,
    height:50,
    backgroundColor: '#ccc',
    borderRadius:30,
    justifyContent:'center',
    alignItems: 'center',
  },
  iconButton: {
    marginRight:10,
    marginTop:2,
    fontSize:10,
    color:'white',
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
    padding:10,
    height:50,
    backgroundColor: '#ffcd4d',
    width:width/2-10, 
    justifyContent:'center',
    alignItems: 'center',
    borderRadius:30,

  },
  greenButton: {
    padding:10,
    height:50,
    backgroundColor: '#ffcd4d',
    width: 100,
    width:width/2-10,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius:30,
  },
  menuTitle:{
    fontWeight:'400',
    color:'white',
    fontSize:20,
    fontFamily: 'Montserrat-Regular',
  },
   Navbar:{
    position:'relative',
    height:55,
    paddingTop:10,
    width:width,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#00b9ff',
 },
  
});

module.exports = styles;
