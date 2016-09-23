
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
    WebView,
    NetInfo,
    AlertIOS,
    ListView,
    AsyncStorage,
  } from 'react-native';
import messageCenter from './messageCenter';
import LodingScreen from '../../components/lodingScreen';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Feed extends Component {

      constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          FeedData: ds.cloneWithRows([]),
          loaded: false,
        };
      }

      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
       })
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

      componentDidMount() {
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
               this.fetchFeedData();
            };  
          }
        );
      }
      componentWillUnmount() {
        console.log('myFucckingComponent')    
      }
      fetchFeedData() {
        var url = 'http://139.59.243.245/api/messageCenter/';
        fetch(url)
        .then( response => response.json() )
        .then( jsonData => {
          this.setState({
            FeedData: this.state.FeedData.cloneWithRows(jsonData.results),
            loaded: true,
          });
          let feedCount =  {
          count:jsonData.count,
        };
        AsyncStorage.setItem('Feedcount', JSON.stringify(feedCount), () => {
        });
          AlertIOS.alert('feeds',JSON.stringify(jsonData));
        })
        .catch( error => console.log('Error fetching: ' + error) );
      }

      navigateTomessageDetail(){
        return this.NavigateToDetail();
      }

      renderRow(rowData){
        var me = this;
        return (
          <View style={{justifyContent: 'center',alignItems: 'center',}}>
            <TouchableOpacity onPress={() => this.navigateTomessageDetail.bind(this,rowData)} style={{borderRadius:4,width:deviceWidth-10,backgroundColor:'white',padding:5,marginBottom:5,marginTop:5,}}>
              <View style={styles.thumb}>
                <Image  style={styles.thumb} source={{uri:rowData.message_image}}></Image>
                <Text style={styles.txt}>{rowData.message_center_id}</Text>
              </View>
              <Text style={styles.txtSec}>{rowData.message_brief}</Text>
            </TouchableOpacity>
          </View>
        );
      }
      renderLoadingView() {
        return (
          <View style={{height:deviceHeight}}>
            <LodingScreen style={{height:deviceHeight-50}}/>
          </View>
        );
      }

      render() {
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }
        console.log(this.state.isConnected);
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
            <View style={{height:deviceHeight-105,width:deviceWidth,paddingBottom:45,}}>
               <ListView
               navigator={this.props.navigator}
                dataSource={this.state.FeedData}
                renderRow={this.renderRow}
                style={styles.container}>
              </ListView>
            </View> 
         </View>
        );
      }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    height:deviceHeight,
    width:deviceWidth,
    bottom:-45,
    marginTop:-45,
  },
  txt:{
    fontSize:15,
    fontFamily: 'Montserrat-Regular',
  },
  thumb:{
    width:deviceWidth-20,
    height:deviceHeight/2-100,
    resizeMode: 'stretch',
  },
  txtSec:{
    paddingTop:10,
    paddingBottom:10,
    fontSize:15,
    fontWeight:'600',
    fontFamily: 'Montserrat-Regular',
  },
 

});
 export default Feed;