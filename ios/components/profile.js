
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
import RunHistory from './runHistory';
import LodingView from '../../components/lodingScreen';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import API from '../../components/runPaginationApi';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Profile extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loaded:false,
        user:null,
        RunCountTotal:{},
        RunTotalAmount2:{},

      };
      this.onFetch = this.onFetch.bind(this);
      this.getUserData = this.getUserData.bind(this);
      this.getRunCount = this.getRunCount.bind(this);
    }
    getUserData(){
      AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let val = store[i][1];
          this.setState({
            user:JSON.parse(val),
          })
          this.getRunCount();
          this.getAmountCount();
          NetInfo.isConnected.fetch().done(
            (isConnected) => {  
            console.log('isConnected3'+ this.state.isConnected);
            if (isConnected) {
              this.fetchRunAmount();
              console.log('isConnected'+this.state.isConnected)
              }else{
                AsyncStorage.getItem('RunTotalAmount', (err, result) => {  
                  this.setState({
                    RunTotalAmount2:JSON.parse(result),
                  })
                  console.log('myTotalRupeesCount',this.state.RunTotalAmount2);
               })
              }
             }
            );     
            console.log('mytotalAmountt',this.state.userTotalAmount);
          })
        })
      }

      fetchRunAmount(){
        if (this.state.user != null) {
          console.log('myauthtoke',this.state.user.auth_token);
            fetch("http://dev.impactrun.com/api/users/", {
            method: "GET",
             headers: {  
                'Authorization':"Bearer " + this.state.user.auth_token,
              }
            })
            .then((response) => response.json())
            .then((userdata) => {
              console.log('mydatauser',userdata);
              this.setState({
                userTotalAmount:userdata[0].total_amount.total_amount,
              })
              console.log('myTotalRupeesCount2',this.state.userTotalAmount);
              let TotalRupees = {
                TotalRupeesCount:this.state.userTotalAmount,               
              }      

              AsyncStorage.setItem('RunTotalAmount', JSON.stringify(TotalRupees), () => {
                AsyncStorage.getItem('RunTotalAmount', (err, result) => {  
                  this.setState({
                    RunTotalAmount2:JSON.parse(result),
                  })
                  console.log('myTotalRupeesCount',this.state.RunTotalAmount2);
                })
              })
          })
        
        };

        }

        onFetch(page = 1, callback, options) {     
        let rowArray = [];
          Promise.resolve(API.getAllRuns(page,this.state.user))
          .then((response) => {
            NetInfo.isConnected.fetch().done(
            (isConnected) => {  
            console.log('isConnected3'+ this.state.isConnected);
            if (isConnected) {
              this.fetchRunAmount();
              console.log('isConnected'+this.state.isConnected)
              }else{
                AsyncStorage.getItem('RunTotalAmount', (err, result) => {  
                  this.setState({
                    RunTotalAmount2:JSON.parse(result),
                  })
                  console.log('myTotalRupeesCount',this.state.RunTotalAmount2);
               })
              }
             }
            );
          this.setState({
            runCount: response.count
          });
            let TotalRun = {
              TotalRunCount:this.state.runCount,  
            }
             AsyncStorage.setItem('RunCount', JSON.stringify(TotalRun), () => {
              AsyncStorage.getItem('RunCount', (err, result) => { 
              this.setState({
                RunCountTotal:JSON.parse(result),
              })
             console.log('myuserRuncount',this.state.RunCountTotal);
              })
              })
            response.results.map((object) => {
              rowArray.push(object);
            });
        })
        .then(() => {
          if (page === Math.round((this.state.runCount/5))) {
            callback(rowArray, {
              allLoaded: true,
            });
          } else {
            callback(rowArray);
          }
        });   
      }
      getAmountCount(){
        AsyncStorage.getItem('RunTotalAmount', (err, result) => {  
          this.setState({
            RunTotalAmount2:JSON.parse(result),
          })
          console.log('myTotalRupeesCount',this.state.RunTotalAmount2);
        })
      }
      getRunCount(){
        AsyncStorage.getItem('RunCount', (err, result) => { 
          this.setState({
            RunCountTotal:JSON.parse(result),
          })
          console.log('MyrunCountdata2',this.state.RunCountTotal);
        })
      }
      componentWillMount(){ 
        this.getUserData();
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
            renderTabBar={() => <ScrollableTabBar userTotalAmount={this.state.RunTotalAmount2 || 0} RunCount={this.state.RunCountTotal || 0} getUserData={this.getUserData} user={this.state.user} />}>
            <View style={styles.tabContent1} tabLabel='Profile'><ProfileForm getUserData={this.getUserData} user={this.state.user}/></View>
            <View style={styles.tabContent} tabLabel='RunHistory'><RunHistory fetchRunData={this.onFetch} user={this.state.user}/></View>
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