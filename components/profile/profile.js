
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
    NetInfo,
    AsyncStorage,
  } from 'react-native';
var {FBLoginManager} = require('react-native-facebook-login');
import ProfileForm from './profileForm';
import RunHistory from './runhistory/runHistory';
import LodingView from '../LodingScreen';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class Profile extends Component {
      constructor(props) {
        super(props);
        this.getRunCount();
        this.fetchAmount();
        this.state = {
        loaded:false,
          user:null,
        };
        this.getUserData = this.getUserData.bind(this);
        this.getRunCount = this.getRunCount.bind(this);
        this.fetchAmount = this.fetchAmount.bind(this);
      }
      
      getUserData(){ 
        NetInfo.isConnected.fetch().done(
          (isConnected) => {  
          if (isConnected) {
            this.fetchAmount();
            }else{
              AsyncStorage.getItem('RunTotalAmount', (err, result) => {  
                var TotalAmount = JSON.parse(result);
                this.setState({
                  RunTotalAmount2:TotalAmount.TotalRupeesCount,
                })
             })
            }
          }
        );     
      }

      fetchAmount(){
        AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
        if (result != null || undefined) {
        var RunData = JSON.parse(result)
        var sum = 0;
        var i;
        for (i = 0; i < RunData.length; i++) {
          var flag = RunData[i].is_flag;
          if (flag != true) {
           sum += parseInt(RunData[i].run_amount);
            };
        }
        this.setState({
          RunTotalAmount2:sum,
        })
        }else{
        return;
         }     
       })
      }

     

      getAmountCount(){
        AsyncStorage.getItem('RunTotalAmount', (err, result) => {  
          var TotalAmount = JSON.parse(result);
            this.setState({
              RunTotalAmount2:TotalAmount.TotalRupeesCount,
            })
        })
      }

      getRunCount(){
        AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
        if (result != null || undefined) {
        var RunData = JSON.parse(result)
        var nonflagedRun = [];
        var i;
        for (i = 0; i < RunData.length; i++) {
          var flag = RunData[i].is_flag;
          if (flag != true) {
            nonflagedRun.push(RunData[i].is_flag);
            };
        }
        this.setState({
          RunCountTotal:nonflagedRun.length,
        })
        }else{
        return;
      }     
        })

      }

      LodingView(){
        return(
          <LodingView/>
        )
      }

  	  render() {

    		return (
          <View>
          	<ScrollableTabView
              style={styles.scrollTabWrapper}
              initialPage={1}
              vertical={false}
              renderTabBar={() => <ScrollableTabBar userTotalAmount={this.state.RunTotalAmount2} RunCount={this.state.RunCountTotal} getUserData={this.props.getUserData} user={this.props.user} />}>
              <View style={styles.tabContent1} tabLabel='Profile'><ProfileForm getUserData={this.props.getUserData} user={this.props.user}/></View>
              <View style={styles.tabContent} tabLabel='History'>
                  <RunHistory fetchRunData={this.onFetch} getUserData={this.props.getUserData} getRunCount={this.getRunCount} fetchAmount = {this.fetchAmount} user={this.props.user}/>
              </View>
            </ScrollableTabView>
          </View>
    		);
  	  }

   }
// userTotalAmount={this.state.RunTotalAmount.TotalRupeesCount}

 
var styles = StyleSheet.create({
  scrollTabWrapper:{
    position:'relative',
    width:deviceWidth,
    backgroundColor:'white',
    height:deviceHeight,
    top:0,
  },
  menuTitle:{
    left:20,
    color:'#fafafa',
    fontSize:20,
  },
  tabContent1:{
    position:'relative',
    width:deviceWidth,
    height:deviceHeight-200,
    backgroundColor:'#f4f4f4',
  },
  tabContent:{
    position:'relative',
    backgroundColor:'#f4f4f4',
    height:deviceHeight-200,
  },
 
})
 export default Profile;