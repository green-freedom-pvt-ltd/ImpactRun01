'use strict';
var React = require('react-native');
var {StyleSheet, PixelRatio,Dimensions} = React;
const Devicewidth = Dimensions.get('window').width
const Deviceheight = Dimensions.get('window').height

import { Platform } from 'react-native';
var FONT_LABEL1   = 18;
var FONT_LABEL2  =16;

if (PixelRatio.get() === 1) {
  FONT_LABEL1 = 16;
  FONT_LABEL2 = 13;
}
if (PixelRatio.get() === 2) {
  FONT_LABEL1 = 18;
  FONT_LABEL2 = 14;
}
if (PixelRatio.get() === 3) {
  FONT_LABEL1 = 20;
  FONT_LABEL2 = 25;
}

function BtnHight () {
  if(Devicewidth > 320){
    return 70;
  }else {
  if(Devicewidth <= 320){
    return 55;
  }else { 
    return 50;
  }
}
}

function BtnWidth () {
  if(Devicewidth > 320){
    return 70;
  }else {
  if(Devicewidth <= 320){
    return 55;
  }else { 
    return 50;
  }
}
}
function fontSizer1 () {
  if(Devicewidth > 320){
    return 22;
  }else {
  if(Devicewidth <= 320){
    return 20;
  }else { 
    return 14;
  }
}
}
function fontSizer2 () {
  if(Devicewidth > 320){
    return 18;
  }else {
  if(Devicewidth <= 320){
    return 15;
  }else { 
    return 10;
  }
}
}
function fontSizer3 () {
  if(Devicewidth > 320){
    return 16;
  }else {
  if(Devicewidth <= 320){
    return 14;
  }else { 
    return 10;
  }
}
}
function LogoHeight () {
  if(Devicewidth > 320){
    return 100;
  }else {
  if(Devicewidth <= 320){
    return 70;
  }else { 
    return 70;
  }
}
}
function LogoWidth () {
  if(Devicewidth > 320){
    return 200;
  }else {
  if(Devicewidth <= 320){
    return 100;
  }else { 
    return 100;
  }
}
}
function CardHeight () {
  if(Deviceheight > 568){
    return Deviceheight-180;
  }else {
  if(Deviceheight <= 480){
    return Deviceheight-150;
  }else { 
    if (Deviceheight >= 480) {
    return Deviceheight-170;
  }
  }
}
}
function CardTop () {
  if(Deviceheight > 568){
    return 7;
  }else {
  if(Deviceheight <= 480){
    return 3;
  }else { 
    return 2;
  }
}
}

function FontSizeLogin(){
   if(Devicewidth > 320){
    return 16;
  }else {
  if(Devicewidth <= 320){
    return 12;
  }else { 
    return 8;
  }
}
}


export default {
  FontSizeTitle:fontSizer1(),
  FontSizeDisc:fontSizer2(),
  FontSize3:fontSizer3(),
  FontSizeLogin:FontSizeLogin(),
  beginRunBtnHeight:BtnHight(),
  beginRunBtnWidth:BtnWidth(),
  LogoHeight:LogoHeight(),
  LogoWidth:LogoWidth(),
  CardHeight:CardHeight(),
  CardTop:CardTop(),
  // navHight
  navBarHeight:70,
  // fontColors
  white_three:'#d8d8d8',
  bright_sky_blue:'#00b9ff',
  warm_grey:'#979797',
  greyish_brown:'#454545',
  black_50:'rgba(0,0,0,0.50)',
  grey_70:'#9e9c9c',
  brownish_grey:'#6a6a6a',
  warm_grey_two:'#777777',
  black_three:'#212121',
  greyish_brown_two:'#4a4a4a',
  white_two:'#f5f5f5',
  light_gold:'#ffcd4d',
  fade_White:'#eeeeee',
  purplish_brown:'#453640',
  //FontFamily
  FontFamily:'Montserrat-Regular',
  FontFamily2:'Montserrat-Thin',
  FontFamily3:'Montserrat-Light',


}