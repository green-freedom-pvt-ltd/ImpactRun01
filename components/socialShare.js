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

import Icon from 'react-native-vector-icons/Ionicons';
import styleConfig from './styleConfig';

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
        <TouchableOpacity style={{flexDirection:'row',alignItems: 'center',}} onPress={()=>{
          Share.open(shareOptions);
        }}>
        <Icon style={{color:'black',fontSize:styleConfig.fontSizerlabel+4,margin:10,paddingRight:11,}}name={'md-share'}></Icon>
          <View style={styles.instructions}>
            <Text style={{color:'#4a4a4a',fontSize:styleConfig.fontSizerlabel+2,fontFamily:styleConfig.FontFamily}}>SHARE IMPACTRUN</Text>
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