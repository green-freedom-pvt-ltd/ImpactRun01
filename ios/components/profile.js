
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
import LodingView from '../../components/LodingScreen';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import API from '../../components/RunPaginationApi';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import PTRView from 'react-native-pull-to-refresh';

class Profile extends Component {
    constructor(props) {
      super(props);
      this.state = {
      loaded:false,
        user:null,
      };
      this.onFetch = this.onFetch.bind(this);
      this.getUserData = this.getUserData.bind(this);
      this.getRunCount = this.getRunCount.bind(this);
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
        if (this.props.user != null) {
            fetch("http://dev.impactrun.com/api/users/", {
            method: "GET",
             headers: {  
                'Authorization':"Bearer " + this.props.user.auth_token,
              }
            })
            .then((response) => response.json())
            .then((userdata) => {
              this.setState({
                userTotalAmount:userdata[0].total_amount.total_amount,
              })
              let TotalRupees = {
                TotalRupeesCount:this.state.userTotalAmount,               
              }      

              AsyncStorage.setItem('RunTotalAmount', JSON.stringify(TotalRupees), () => {
                AsyncStorage.getItem('RunTotalAmount', (err, result) => {  
                  var TotalAmount = JSON.parse(result);
                  this.setState({
                    RunTotalAmount2:TotalAmount.TotalRupeesCount,
                  })
                })
              })
          })
        
        };

      }

      onFetch(page = 1, callback, options) {     
        let rowArray = [];
         this.setState({
          myHistoryData:rowArray
         })
          Promise.resolve(API.getAllRuns(page,this.props.user))
          .then((response) => {
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
            this.setState({
              runCount: response.count
            });
            let TotalRun = {
              TotalRunCount:this.state.runCount,  
            }
          AsyncStorage.setItem('RunCount', JSON.stringify(TotalRun), () => {
            this.getRunCount();
          })
          response.results.map((object) => {
            rowArray.push(object);
          });
        })
        .catch((error) => {this.getRunCount();})
        .then(() => {
          if (page === Math.round((this.state.runCount+2)/5)) {
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
          var TotalAmount = JSON.parse(result);
            this.setState({
              RunTotalAmount2:TotalAmount.TotalRupeesCount,
            })
        })
      }
      getRunCount(){
        AsyncStorage.getItem('RunCount', (err, result) => { 
          var TotalRun = JSON.parse(result);
          this.setState({
            RunCountTotal:TotalRun.TotalRunCount,
          })
          console.log('RUNCOUNT12',this.state.RunCountTotal);
        })
      }
      componentWillMount(){ 
        
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
                <RunHistory fetchRunData={this.onFetch} getUserData={this.props.getUserData} user={this.props.user}/>
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