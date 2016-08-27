
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
              seconds: 5
          };
      }
      componentDidMount() {
        setTimeout(
         () => { 
          this.navigateToRunScreen();
          console.log('I'); 
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
          this.props.navigator.push({
          title: 'Gps',
          id:'runscreen',
          index: 0,
          passProps:{data:cause},
          navigator: this.props.navigator,
          });
        }


    	 render() {
        var data = this.props.data;


        var second = this.state.seconds;
             var _this = this;
    		     return (    
                 <View style={styles.lodingWrap}>
                 <Image source={{uri:data.sponsors[0].sponsor_logo}}></Image>
                  <Image style={{height:70,width:70}} source={{uri:data.sponsors[0].sponsor_logo}}/>
                 <Text>{data.sponsors[0].sponsor_company}</Text>
                  <AnimatedCircularProgress
                  style={{ justifyContent:'center',
                         alignItems:'center',}}
                    ref='circularProgress'
                    size={200}
                    width={10}
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
                <Text onPress={()=> this.navigateToRunScreen()} >TAP TO START</Text>
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
            fontSize:100,
          },
          secondWrap:{
           top:-155,
           left:-25,
          },

        })



 export default LodingRunScreen;