/**
 * @author wkh237
 * @version 0.1.1
 */

// @flow

import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import Timer from 'react-timer-mixin';

const HALF_RAD = Math.PI/2



var deviceWidth = Dimensions.get('window').width;

export default class AnimateNumber extends Component {

  props : {
    countBy? : ?number,
    interval? : ?number,
    steps? : ?number,
    value : number,
    timing : 'linear' | 'easeOut' | 'easeIn' | () => number,
    formatter : () => {},
    onProgress : () => {},
    onFinish : () => {}
  };

  static defaultProps = {
    interval :10,
    timing : 'linear',
    steps : 45,
    formatter : (val) => val,
    onFinish : () => {}
  };

  static TimingFunctions = {

    linear : (interval:number, progress:number):number => {
      return interval
    },

    easeOut : (interval:number, progress:number):number => {
      return interval * Math.sin(HALF_RAD*progress) * 5
    },

    easeIn : (interval:number, progress:number):number => {
      return interval * Math.sin((HALF_RAD - HALF_RAD*progress)) * 5
    },

  };

  state : {
    value? : ?number,
    displayValue? : ?number
  };

  /**
   * Animation direction, true means positive, false means negative.
   * @type {bool}
   */
  direction : bool;
  /**
   * Start value of last animation.
   * @type {number}
   */
  startFrom : number;
  /**
  * End value of last animation.
  * @type {number}
   */
  endWith : number;

  constructor(props:any) {
    super(props);
     this.state = {
      value : 0,
      displayValue : 0,
     }
    // default values of state and non-state variables
   
    this.dirty = false;
    this.startFrom = 0;
    this.endWith = 0;
  }

  componentDidMount() {
    var data = [];
    AsyncStorage.getItem('my_rate', (err, result) => {
      var my_rate = (JSON.parse(result) != null)?JSON.parse(result):1.0;
      AsyncStorage.getItem('oldoverall_impact', (err, result) => {
      if (result != null) {
        data.push(parseFloat(JSON.parse(result)/my_rate).toFixed(0));
        this.setState({
          value:JSON.parse(data),
          displayValue:this.props.value,
        })
        this.startFrom = JSON.parse(data);
        this.endWith = this.props.value
        this.dirty = true
        this.startAnimate()
      }else{
        data.push(JSON.parse(this.props.value));
        this.setState({
          value:JSON.parse(this.props.value),
          displayValue:JSON.parse(this.props.value),
         })
        this.startFrom = JSON.parse(this.props.value);
        this.endWith = this.state.value
        this.dirty = true
        this.startAnimate(this.props.value-this.state.value)
      }
      })
    })
   

  }
  comonentWillUnmount(){
    // AsyncStorage.setItem('oldoverall_impact',JSON.stringify(this.props.value));
  }

  componentWillUpdate(nextProps, nextState) {
   
    // check if start an animation
    if(this.props.value !== nextProps.value) {
      this.startFrom = this.state.value
      this.endWith = nextProps.value
      this.dirty = true
      this.startAnimate(nextProps.value-this.state.value)
      return
    }
    // Check if iterate animation frame
    if(!this.dirty) {
      return
    }
    if (this.direction === true) {
      if(parseFloat(this.state.value) <= parseFloat(this.props.value)) {
        this.startAnimate(nextProps.value);
      }
    }
    else if(this.direction === false){
      if (parseFloat(this.state.value) >= parseFloat(this.props.value)) {
        this.startAnimate(nextProps.value-this.state.value);
      }
    }

  }

  render() {
    return (
      <Text {...this.props} style={{paddingLeft:5,width:deviceWidth,letterSpacing:1}}  >
        {(Math.round(this.state.displayValue*100)/100).toLocaleString('en-'+this.props.currencyString,{ minimumFractionDigits: 0}) }
      </Text>)
   
  }

  startAnimate(valueCount) {
    var countByvalue = valueCount/10 
    let progress = this.getAnimationProgress();
    Timer.setTimeout(() => {
      let value = (this.endWith - this.startFrom)/this.props.steps
      value = Math.sign(value)*Math.abs(1)
      let total = parseFloat(this.state.value) + parseFloat(value)

      this.direction = (value > 0)
      // animation terminate conditions
      if (((this.direction) ^ (total <= this.endWith)) === this.props.countBy) {
        this.dirty = false
        total = this.endWith
        this.props.onFinish(total, this.props.formatter(total))
      }

      if(this.props.onProgress)
        this.props.onProgress(this.state.value, total)

      this.setState({
        value : total,
        displayValue : this.props.formatter(total)
      })

    }, this.getTimingFunction(this.props.interval, progress))
  }

  getAnimationProgress():number {
    return (this.state.value - this.startFrom) / (this.endWith - this.startFrom)
  }

  getTimingFunction(interval:number, progress:number) {
    if(typeof this.props.timing === 'string') {
      let fn = AnimateNumber.TimingFunctions[this.props.timing]
      return fn(interval, progress)
    } else if(typeof this.props.timing === 'function')
      return this.props.timing(interval, progress)
    else
      return AnimateNumber.TimingFunctions['linear'](interval, progress)
    }
  }

