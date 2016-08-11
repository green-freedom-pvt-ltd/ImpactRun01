'use strict'

var React = require('react')
var React_native = require('react-native')
var {
  Animation,
  PanResponder,
  StyleSheet,
  View,
} = React_native

var Dimensions = require('Dimensions')
var screenWidth = Dimensions.get('window').width

var Navbar = React.createClass({
  componentWillMount: function() {
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}></View>
      </View>
    )
  },
})

var styles = StyleSheet.create({
  container: {
    position:'absolute',
    flexDirection: 'row',

  },
  navbar:{
   flexDirection: 'row',
   height:50,
   width:screenWidth,
   backgroundColor:'#00b9ff',
  },
})

module.exports = Navbar