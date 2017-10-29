
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
    AlertIOS,
    AsyncStorage,
  } from 'react-native';
  import styleConfig from '../../components/styleConfig';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import commonStyles from '../styles';
  var deviceWidth = Dimensions.get('window').width;
  var deviceHeight = Dimensions.get('window').height;
  class caloriCounter extends Component {
     

      constructor(props) {
        super(props);
        
        this.state = {
          weight:null,
          calorieBurned:0,
        };
      }

     componentDidMount() {
      this.setState({
        weight:this.props.weight,

      })
       
      }
      
      
    
     componentWillUnmount() {
       // Stop activity detection and remove the listener
       
     }
      render() {
        if (this.props.weight != null ) {
        return (
          <View style={{justifyContent: 'center',alignItems: 'center',}}>
           <Icon style={{color:styleConfig.greyish_brown_two,fontSize:28,backgroundColor:'transparent'}} name="whatshot"></Icon>
             <Text style={{fontSize:25,fontWeight:'500',color:styleConfig.greyish_brown_two,backgroundColor:'transparent',}}>{parseFloat(this.props.calories).toFixed(1)}</Text>
           <Text style={{fontFamily:styleConfig.FontFamily,color:styleConfig.greyish_brown_two,opacity:0.7,}}>CAL</Text>
          </View>
        );
      }else{
        return(
          <View></View>
          )
      }
      }
  }


  var styles = StyleSheet.create({
 
  })

  export default caloriCounter;