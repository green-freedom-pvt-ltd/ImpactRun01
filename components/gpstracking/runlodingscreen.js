
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
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import styleConfig from '../../components/styleConfig';
import Home from './home.ios.js'
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
        seconds: 5
      };
    }

    componentDidMount() {
        this.animate(); 
      this.timeout = setTimeout(() => { 
        this.navigateToRunScreen();
      },5000);
      this.refs.circularProgress.performLinearAnimation(100, 5000);
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
    }

    tick() {
      this.setState({
        seconds: this.state.seconds - 1
      });
    }

    navigateToRunScreen(cause) {
      var cause = this.props.data;
      console.log('props data' + this.props.data.sponsors);
      this.props.navigator.replace({
        title: 'Gps',
        id:'runscreen',
        index: 0,
        passProps:{data:cause,user:this.props.user,getUserData:this.props.getUserData},
        navigator: this.props.navigator,
      });
      clearTimeout(this.timeout);
      
      // this.props.navigator.replace({
      //   title: 'Gps',
      //   component:Home,
      //   navigationBarHidden: true,
      //   showTabBar: false,
      //   passProps:{data:cause,user:this.props.user,getUserData:this.props.getUserData},
      // });
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
            <TouchableOpacity style={[styles.overlay,{transform:[{scale:scaleText}]}]} onPress={()=> this.navigateToRunScreen()}>
              <View style={styles.LoadingWrap}>
              <View style={styles.loadingFlex}>
                 <Image style={styles.sponsorLogo} source={{uri:data.sponsors[0].sponsor_logo}}></Image>
                 <View style={styles.sponsorText}>
                  <Text style={{color:styleConfig.greyish_brown_two,fontSize:16,fontFamily:styleConfig.FontFamily,}}>is proud to sponsor your run.</Text>
                 </View>
                </View>
                  <View style={styles.loadingFlex}>
                  <View style={styles.circleWrap}>
                  <AnimatedCircularProgress
                    ref='circularProgress'
                    size={150}
                    width={5}
                    fill={100}
                    prefill={0}
                    tintColor={styleConfig.bright_blue}
                    rotation={0}
                    backgroundColor="#fafafa">
                    {
                      (fill) => (
                        <View style={styles.secondWrap}>
                        <Text style={styles.second}>{second}</Text>
                        </View>
                      )
                    }
                  </AnimatedCircularProgress>
                  </View>
                  </View>
                  <View style={styles.loadingFlex}>
                  <Text style={styles.navigateToRunScreen} onPress={()=> this.navigateToRunScreen()}>TAP TO START NOW</Text>
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