
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
  } from 'react-native';
import TimerMixin from 'react-timer-mixin';
import Icon from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class LodingRunScreen extends Component {
    mixins: [TimerMixin]
    constructor(props) {
      super(props);
      this.state = {
        seconds: 6
      };
    }

    componentDidMount() {
      this.timeout = setTimeout(() => { 
        this.navigateToRunScreen();
      },5000);
      this.refs.circularProgress.performLinearAnimation(100, 5000);
      this.interval = setInterval(this.tick.bind(this), 1000);
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
      this.props.navigator.replace({
        title: 'Gps',
        id:'runscreen',
        index: 0,
        passProps:{data:cause},
        navigator: this.props.navigator,
      });
      clearTimeout(this.timeout);
    }

    render() {
      var data = this.props.data;
      var second = this.state.seconds;
      var _this = this;
  	    return (    
          <View>
            <TouchableOpacity style={styles.overlay} onPress={()=> this.navigateToRunScreen()}>
              <View style={styles.shadow}>
                <View style={styles.lodingWrap}>
                  <View style={styles.CompnyWrap}>
                    <Image style={{resizeMode: 'contain',height:100,width:100,marginBottom:10,backgroundColor:'transparent'}} source={{uri:data.sponsors[0].sponsor_logo}}/>
                  </View>
                  <AnimatedCircularProgress
                    style={{ justifyContent:'center', alignItems:'center',}}
                    ref='circularProgress'
                    size={150}
                    width={5}
                    fill={100}
                    prefill={0}
                    tintColor="#00e0ff"
                    backgroundColor="#ccc">
                    {
                      (fill) => (
                        <View style={styles.secondWrap}>
                        <Text style={styles.second}>{second}</Text>
                        </View>
                      )
                    }
                  </AnimatedCircularProgress>
                  <Text style={styles.navigateToRunScreen} onPress={()=> this.navigateToRunScreen()} >TAP TO START</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
    	  );
    }

  }


  var styles = StyleSheet.create({
    lodingWrap:{
      justifyContent:'center',
      alignItems:'center',
      height:deviceHeight,
      width:deviceWidth,
    },
    second:{
      color:'#ccc',
      position:'absolute',
      fontSize:70,
    },
    secondWrap:{
      top:-120,
      left:-22,
    },
    CompnyWrap:{
      bottom:70,
    },
    navigateToRunScreen:{
      fontSize:20,
      top:70,
    },
    shadow: {
      position:'absolute',
      height:deviceHeight,
      flex: 1,
      width: deviceWidth,
      backgroundColor: 'transparent',
      justifyContent: 'center',      
    },
    overlay:{
      position:'relative',
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
  })

 export default LodingRunScreen;