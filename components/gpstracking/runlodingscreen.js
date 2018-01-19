
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
    WebView,
    Animated,
    Easing,
  } from 'react-native';
import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/Ionicons';
import styleConfig from '../../components/styleConfig';
import Home from './home.ios.js'
  const CleverTap = require('clevertap-react-native');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class LodingRunScreen extends Component {
    mixins: [TimerMixin]
    constructor(props) {
      super(props);

      this.animatedValue1 = new Animated.Value(0)
      this.animatedValue2 = new Animated.Value(0)
      this.animatedValue3 = new Animated.Value(0)
      this.state = {
        seconds: 3
      };
    }

    componentDidMount() {
      CleverTap.recordEvent('ON_LOAD_COUNTDOWN_SCREEN',{
        'cause_id':this.props.data.pk,
      });
      this.animate(); 
      this.timeout = setTimeout(() => { 
        this.navigateToRunScreen();
      },3000);
     
      this.interval = setInterval(this.tick.bind(this), 1000);
    } 


  animate () {
  this.animatedValue1.setValue(0)
  this.animatedValue2.setValue(0)
  this.animatedValue3.setValue(0)
  const createAnimation = function (value, duration, easing, delay = 0) {
    return Animated.timing(
      value,
      {
        toValue: 1,
        duration,
        easing,
        delay,
        useNativeDriver: true,
      }
    )
  }



  Animated.parallel([
    createAnimation(this.animatedValue1, 1000, Easing.ease),
    createAnimation(this.animatedValue2, 1000, Easing.ease, 1000),
    createAnimation(this.animatedValue3, 1000, Easing.ease, 2000)        
  ]).start()
}

    componentWillUnmount() {
      clearInterval(this.interval);
      clearTimeout(this.timeout);  
    }

    tick() {
      this.setState({
        seconds: this.state.seconds - 1
      });
    }

    navigateToRunScreen() {

      var cause = this.props.data;
      console.log('props data' + this.props.data.sponsors);
      this.props.navigator.replace({
        title: 'Gps',
        id:'runscreen',
        passProps:{data:cause,user:this.props.user,getUserData:this.props.getUserData,killRundata:this.props.killRundata},
        navigator: this.props.navigator,
      });
      clearTimeout(this.timeout);
      clearInterval(this.interval);
    }

    onSkip(){
      CleverTap.recordEvent('ON_SKIP_COUNTDOWN');
      this.navigateToRunScreen();
    }

    render() {
      const scaleText = this.animatedValue1.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1]
      })
      var data = this.props.data;
      var second = this.state.seconds;
      var _this = this;
        return (    
          <View class={styles.container}>
            <TouchableOpacity style={[styles.overlay,{transform:[{scale:scaleText}]}]}>
              <View style={styles.LoadingWrap}>
              <View style={styles.loadingFlex}>
                 <Image style={styles.sponsorLogo} source={{uri:data.sponsors[0].sponsor_logo}}></Image>
                 <View style={styles.sponsorText}>
                  <Text style={{color:styleConfig.greyish_brown_two,fontSize:16,fontFamily:styleConfig.FontFamily,}}>is proud to sponsor your workout.</Text>
                 </View>
                </View>
                  <View style={styles.loadingFlex}>
                  <View style={styles.circleWrap}>
                    <View style={styles.secondWrap}>
                      <Text style={styles.second}>{second}</Text>
                    </View> 
                  </View>
                  </View>
                  <View style={styles.loadingFlex}>
                  </View>
              </View>
            </TouchableOpacity>
          </View>
        );
    }

  }


  var styles = StyleSheet.create({
   container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
   },
   LoadingWrap:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
   },
    sponsorLogo:{
      resizeMode: 'contain',
      height:styleConfig.LogoHeight,
      width:styleConfig.LogoWidth,
    },
    sponsorText:{
      height:20,
      width:deviceWidth,
      alignItems: 'center',
      justifyContent: 'center',
     
    },
    second:{
      color:'#ccc',
      fontSize:70,
    },
    secondWrap:{
      position:'absolute',
      top:0,
      height:150,
      width:150,
      backgroundColor:'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    CompnyWrap:{
      bottom:70,

    },
    circleWrap:{
      height:150,
      width:150,
      justifyContent:'center',
      alignItems:'center',
    },
    navigateToRunScreen:{
      fontSize:20,
    },
    shadow: {
      flex:1,
      backgroundColor: 'transparent',
      justifyContent: 'center',      
    },
    overlay:{
      height:deviceHeight,
      width: deviceWidth,
      backgroundColor: 'transparent',
      justifyContent: 'center', 

    },
    shadow: {
      height:deviceHeight,
      width: deviceWidth,
      backgroundColor: 'white',
      justifyContent: 'center',      
    },
    loadingFlex:{
      justifyContent: 'center',
      alignItems: 'center', 
      flex:1,
    },
  })

 export default LodingRunScreen;