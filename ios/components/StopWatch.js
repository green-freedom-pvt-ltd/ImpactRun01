
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
  } from 'react-native';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import TimeFormatter from 'minutes-seconds-milliseconds';
class StopClock extends Component {
    constructor(props) {
            super(props);
            this.state = {
              isRunning:false,
              mainTimer:null,
              lapTimer:null,
            };
      }
    componentWillMount() {
        this._handleStartStop();  
    }
    
    _rendetTimer(){
        return(
            <View style={{flex:1}}>
             <Text>{TimeFormatter(this.state.lapTimer)}</Text>
             <Text>{TimeFormatter(this.state.mainTimer)}</Text>
            </View>
            );

    }
        _renderBtn(){
              
            return(
                <View style={{flex:1}}>
                   <Text>lap</Text>
                   <TouchableOpacity onPress={() => this._handleStartStop()}>
                   <Text>start</Text>
                   </TouchableOpacity>
                </View>
                );
            }

       _handleStartStop(){
          let {isRunning,FirstTime,mainTimer,lapTimer} = this.state;
          if(isRunning){
            clearInterval(this.interval);
            this.setState({
                isRunning:false
            });
            return;
            
          }
          this.setState({
                mainTimerStart:new Date(),
                lapTimerStart:new Date(),
                 isRunning:true,
            })
          this.interval = setInterval(()=>{
            this.setState({
                mainTimer:new Date() - this.state.mainTimerStart + mainTimer,
                lapTimer:new Date() - this.state.lapTimerStart + lapTimer,
            })
          },30);

          }
     

        render() {
        return (
            <View style={{flex:1}}>
               <View>{this._rendetTimer()}
               {this._renderBtn()}
               </View>
               
            </View>
                   
                    );
        }
}

var styles = StyleSheet.create({


})
 export default StopClock;