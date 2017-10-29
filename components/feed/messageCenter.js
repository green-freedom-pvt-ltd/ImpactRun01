import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import commonStyles from '../../components/styles';
import MessageCenterData from './messageCenterData';
  

class MessageCenter extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    
    NavigateToDetail(rowData){
      this.props.navigator.push({
        title: 'Gps',
        id:'messagedetail',
        index:0,
        navigator: this.props.navigator,
        passProps:{data:rowData},
       
      })
    }
    goBack(){
       this.props.navigator.pop({})
    }

  render() {
    return (
    <View>
      <MessageCenterData getfeedCount={this.props.getfeedCount} navigator={this.props.navigator} />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
  },
  thumb: {
    backgroundColor: '#ffffff',
    marginBottom: 5,
    elevation: 1
  },
  img: {
    height: 300
  },
  txt: {
    margin: 10,
    fontSize: 16,
    textAlign: 'left'
  },
});

export default MessageCenter;