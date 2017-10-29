'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions
 } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
import styleConfig from './styleConfig';
var styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'    
  },
  topToolbar: {
    //paddingLeft: 10,
    backgroundColor: styleConfig.bright_blue,  //ff d7 00
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
  },
  backButtonIcon: {
  	//marginRight: 
  },
  backButtonText: {
  	fontSize: 18,
  	color: 'white'
  },
  redButton: {
    height:50,
    backgroundColor:styleConfig.bright_blue,
    width:width/2-10, 
    justifyContent:'center',
    alignItems: 'center',
    borderRadius:30,

  },
  greenButton: {
    height:50,
    backgroundColor:styleConfig.bright_blue,
    width: 100,
    width:width/2-10,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius:30,
  },
  menuTitle:{
    backgroundColor:'transparent',
    flex:1,
    textAlign:'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight:'400',
    color:'white',
    fontSize:styleConfig.TitleFontSize,
    fontFamily:styleConfig.FontFamily,
  },
   menuTitle2:{
    fontWeight:'400',
    color:'white',
    fontSize:17,
    fontFamily:styleConfig.FontFamily,
  },

  Navbar:{
    paddingTop:20,
    position:'relative',
    height:styleConfig.navBarHeight,
    width:width,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#00c1f2',
    shadowColor: '#000000',
      shadowOpacity: 0.8,
      shadowRadius: 1,
      shadowOffset: {
        height: 0,
      },
  },
  
  
});

module.exports = styles;
