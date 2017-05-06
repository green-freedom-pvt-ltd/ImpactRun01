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
      message: "I use ImpactRun to track my daily runs and 'do good' for society with every step. Check it out. It's amazing!",
      url: "http://www.impactrun.com/#",
      subject: "Download ImpactRun Now " //  for email
    };
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{height:40,flexDirection:'row',alignItems: 'center',}} onPress={()=>{
          Share.open(shareOptions);
        }}>
        <Icon style={{color:'black',fontSize:20,margin:10}}name={'md-share'}></Icon>
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
    flex:1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

});



export default SocialShare;