import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  ToastAndroid,
  AlertIOS,
  Platform
} from 'react-native';
import Share, {ShareSheet, Button} from 'react-native-share';

class SocialShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }
  onCancel() {
    console.log("CANCEL")
    this.setState({visible:false});
  }
  onOpen() {
    console.log("OPEN")
    this.setState({visible:true});
  }
  render() {

    let shareOptions = {
      title: "ImpactRun",
      message: "Download ImpactRun it helps you get fit and help ngo to feed and educate poor childeren",
      url: "http://www.impactrun.com/#",
      subject: "Download ImpactRun Now " //  for email
    };
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>{
          Share.open(shareOptions);
        }}>
          <View style={styles.instructions}>
            <Text>SHARE IMPACTRUN</Text>
          </View>
        </TouchableOpacity>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

});



export default SocialShare;