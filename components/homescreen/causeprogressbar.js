import React, {
  Component,
  
} from 'react';
const PropTypes = require('prop-types');

import {
  Animated,
  Easing,
  View,
  Dimensions,
} from 'react-native';
import styleConfig from '../../components/styleConfig';
var deviceheight = Dimensions.get('window').height;
const INDETERMINATE_WIDTH_FACTOR = 0.3;
const BAR_WIDTH_ZERO_POSITION = INDETERMINATE_WIDTH_FACTOR / (1 + INDETERMINATE_WIDTH_FACTOR);
import LinearGradient from 'react-native-linear-gradient';

export default class ProgressBar extends Component {
  static propTypes = {
    animated: PropTypes.bool,
    borderColor: PropTypes.string,
    borderRadius: PropTypes.number,
    borderWidth: PropTypes.number,
    children: PropTypes.node,
    color: PropTypes.string,
    height: PropTypes.number,
    indeterminate: PropTypes.bool,
    progress: PropTypes.number,
    style: View.propTypes.style,
    unfilledColor: PropTypes.string,
    width: PropTypes.number,
  };

  static defaultProps = {
    animated: true,
    borderRadius: 10,
    borderWidth: 0,
    color: '#33f373',
    height:11,
    indeterminate: false,
    progress: 0,
    width: 150,
  };

  constructor(props) {
    super(props);
    const progress = Math.min(Math.max(props.progress, 0), 1);
    this.state = {
      progress: new Animated.Value(props.indeterminate ? INDETERMINATE_WIDTH_FACTOR : progress),
      animationValue: new Animated.Value(BAR_WIDTH_ZERO_POSITION),
    };
  }

  componentDidMount() {
    if (this.props.indeterminate) {
      this.animate();
    }
  }

  componentWillReceiveProps(props) {
    if (props.indeterminate !== this.props.indeterminate) {
      if (props.indeterminate) {
        this.animate();
      } else {
        Animated.spring(this.state.animationValue, {
          toValue: BAR_WIDTH_ZERO_POSITION,
        }).start();
      }
    }
    if (
      props.indeterminate !== this.props.indeterminate ||
      props.progress !== this.props.progress
    ) {
      const progress = (props.indeterminate
        ? INDETERMINATE_WIDTH_FACTOR
        : Math.min(Math.max(props.progress, 0), 1)
      );

      if (props.animated) {
        Animated.spring(this.state.progress, {
          toValue: progress,
          bounciness: 0,
        }).start();
      } else {
        this.state.progress.setValue(progress);
      }
    }
  }

  animate() {
    this.state.animationValue.setValue(0);
    Animated.timing(this.state.animationValue, {
      toValue: 100,
      duration: 1000,
      easing: Easing.linear,
      isInteraction: false,
    }).start((endState) => {
      if (endState.finished) {
        this.animate();
      }
    });
  }

  render() {
    const {
      borderColor,
      borderRadius,
      borderWidth,
      children,
      color,
      height,
      style,
      unfilledColor,
      width,
      ...restProps
    } = this.props;

    const innerWidth = width - (borderWidth * 2);
    const containerStyle = {
      width,
      borderWidth,
      borderColor: borderColor || 'transparent',
      borderRadius,
      overflow: 'hidden',
      backgroundColor: '#e5e5e5',
    };
    const progressStyle = {
      backgroundColor: color,
      height,
      borderRadius:10,
      width: innerWidth,
      transform: [{
        translateX: this.state.animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [innerWidth * -INDETERMINATE_WIDTH_FACTOR, innerWidth],
        }),
      }, {
        translateX: this.state.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [innerWidth / -2, 0],
        }),
      }, {
        scaleX: this.state.progress,
      }],
    };

    return (
      <View style={[containerStyle, style]} {...restProps}>
      <LinearGradient colors={['#04cbfd', '#33f373']} >
      </LinearGradient>
        <Animated.View   style={progressStyle} />
        
        {children}
      </View>
    );
  }
}