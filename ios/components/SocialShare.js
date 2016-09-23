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
import Icon from 'react-native-vector-icons/Ionicons';

class SocialShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }
  onCancel() {
    this.setState({visible:false});
  }
  onOpen() {
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
        <TouchableOpacity style={{marginLeft:3,height:40,flexDirection:'row',alignItems: 'center',}} onPress={()=>{
          Share.open(shareOptions);
        }}>
        <Icon style={{color:'black',fontSize:17,margin:10}}name={'md-share'}></Icon>
          <View style={styles.instructions}>
            <Text style={{color:'#4a4a4a'}}>Share Impactrun</Text>
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