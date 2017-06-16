
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Navigator,
    Dimensions,
    TouchableOpacity,
    Text,
    NetInfo,
    AsyncStorage,
  } from 'react-native';
var {FBLoginManager} = require('react-native-facebook-login');
import Chart from 'react-native-chart';
import apis from '../apis';
import ProfileForm from './profileForm';
import RunHistory from './runhistory/runHistory';
import LodingView from '../LodingScreen';
import styleConfig from '../../components/styleConfig';
import UserProfile from './profileHeader';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import AnimateNumber from 'react-native-animate-number';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
const dataP = [];

class Profile extends Component {
      constructor(props) {
        super(props);
        this.fetch7DayData();

        this.fetchRunDataLocally();

        this.state = {
          rowData:[],
          user:null ,
          loadingFirst:true,
          navigation: {
            index: 1,
            routes: [],
            loadingimage:true,
          },
          counterDate:new Date(),
        };
        this.getUserData = this.getUserData.bind(this);

      }



      fetchRunDataLocally(){
           AsyncStorage.getItem('nextpage', (err, result) => {
            this.setState({
              nextPage:JSON.parse(result),
            })

            })
          AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
            var RunData = JSON.parse(result);
            if (result != null || undefined) {
              this.setState({
                rawData: RunData,
              })
              this.getRunCount();
              this.fetchAmount();
              this.fetchTotalDistance();
            }else{
               this.fetchRunhistoryData();
            }
          });
      }



      fetchRunhistoryData() {
        if (this.props.user != null) {
        var token = this.props.user.auth_token;
        var url = apis.runListapi;
        fetch(url,{
          method: "GET",
          headers: {
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
          }
        })
        .then( response => response.json() )
        .then( jsonData => {
          this.setState({
            rawData:jsonData.results,
            RunCount:jsonData.count,
            nextPage:jsonData.next,
          });
          if (this.state.nextPage != null) {
          fetch(this.state.nextPage,{
          method: "GET",
          headers: {
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
            }
          })

          .then( response => response.json())
          .then( jsonDataobj => {
            this.setState({
              rawData: this.state.rawData.concat(jsonDataobj.results),
              nextPage:jsonDataobj.next,
              RunCount:jsonDataobj.count,
            })
            let RunCount = this.state.RunCount;
            AsyncStorage.setItem('RunCount', JSON.stringify(RunCount));
               if (jsonData.results != null || undefined) {
                 AsyncStorage.removeItem('runversion',(err) => {
                });
                var newDate = new Date();
                var convertepoch = newDate.getTime()/1000
                var epochtime = parseFloat(convertepoch).toFixed(0);
                let responceversion = epochtime;
                AsyncStorage.setItem("runversion",JSON.stringify(responceversion),()=>{
                 AsyncStorage.getItem('runversion', (err, result) => {
                  this.setState({
                    runversion:JSON.parse(result),
                  })
                })
                });
              }else{
                return;
              }
              let nextpage = this.state.nextPage;
              AsyncStorage.setItem('nextpage',JSON.stringify(nextpage));
              var storepage =  this.state.rawData;
              let fetchRunhistoryData = this.state.rawData;
              AsyncStorage.setItem('fetchRunhistoryData',JSON.stringify(storepage));
              this.LoadmoreView();
          })
          }else{
            return;
          }
        })
         .catch( error => console.log('Error fetching: ' + error) );
         };
      }


      LoadmoreView(){
        this.nextPage();
      }



      nextPage(){
        if (this.state.nextPage != null) {
        var token = this.props.user.auth_token;
        var url = this.state.nextPage;
        fetch(url,{
          method: "GET",
          headers: {
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
          }
        })
        .then( response => response.json() )
        .then( jsonData => {
          this.setState({
            rawData: this.state.rawData.concat(jsonData.results),
            loaded: true,
            refreshing:false,
            nextPage:jsonData.next,
            loadingFirst:true,
            RunCount:jsonData.count,
          });
          AsyncStorage.removeItem('runversion',(err) => {
          });
          var newDate = new Date();
          var convertepoch = newDate.getTime()/1000
          var epochtime = parseFloat(convertepoch).toFixed(0);
          let responceversion = epochtime;
          AsyncStorage.setItem("runversion",JSON.stringify(responceversion),()=>{
           this.setState({
             runversion:responceversion
           })
          });
          let RunCount = this.state.RunCount;
          AsyncStorage.setItem('RunCount', JSON.stringify(RunCount));
          AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
         });
          AsyncStorage.removeItem('nextpage',(err) => {
         });
          let nextpage = this.state.nextPage;
          AsyncStorage.setItem('nextpage', JSON.stringify(nextpage));
          let fetchRunhistoryData = this.state.rawData.concat();
          AsyncStorage.setItem('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData), () => {

           })
          this.LoadmoreView();
        })
        .catch( error => console.log('Error fetching: ' + error) );

       }else{
        this.setState({
          loadingFirst:false,
        })
        this.getRunCount();
        this.fetchAmount();
        this.fetchTotalDistance();
        this.fetch7DayData();
       }
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


      fetch7DayData(){
        AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
        if (result != null || undefined) {
        var RunData = JSON.parse(result)
        var sum = 0;
        var nowdate = new Date();
        var sdate = new Date();
        sdate.setDate(nowdate.getDate() - 7);
        var i;
        var dataI = [];
        dataP = [];
        var counterDate = nowdate;
        for (i = 0; i < RunData.length; i++) {
          var currDate = new Date(RunData[i].start_time);
          var flag = RunData[i].is_flag;
          if(currDate <= nowdate && currDate > sdate)
          {

            if(!(currDate.toLocaleDateString() in dataI))
            {
              if (flag != true) {
                dataI[currDate.toLocaleDateString()] = parseInt(RunData[i].run_amount);
              }

            }
            else{
              if (flag != true) {
                dataI[currDate.toLocaleDateString()] += parseInt(RunData[i].run_amount);
              }
            }
          }
          // counterDate.setDate(counterDate.getDate() - 1);
        }

        for (i = 0 ;  i <= 6; i++ ) {
        if(!( counterDate.toLocaleDateString() in dataI)) {
          var tempA = [];
          tempA.push(counterDate.getDate(),dataI[counterDate.toLocaleDateString()]);
          dataP.push(tempA);
          counterDate.setDate(counterDate.getDate() - 1);
        }
        else{
          var tempA = [];
          tempA.push(counterDate.getDate(), dataI[counterDate.toLocaleDateString()]);
          dataP.push(tempA);

          //  this.setState({

          //   counterDate:setDate(counterDate.getDate() - 1),
          // })
          counterDate.setDate(counterDate.getDate() - 1);
        }

        }


        // console.log('dataI', dataI);
        // console.log('dataP: ', dataP);


        this.setState({
          RunTotalAmount7:dataI,
        })
        }else{
        return;
         }
       })
      }

      fetchTotalDistance(){
        AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
        if (result != null || undefined) {
        var RunData = JSON.parse(result)
        var sum = 0;
        var i;
        for (i = 0; i < RunData.length; i++) {
          var flag = RunData[i].is_flag;
          if (flag != true) {
           sum += parseFloat(RunData[i].distance);
            };
        }
        this.setState({
          RunTotalDistance:sum,
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

    navigateToRunHistory() {
      this.props.navigator.push({
      title: 'Gps',
      id:'runhistory',
      index: 0,
      passProps:{rawData:this.state.rawData,user:this.props.user,getUserData:this.props.getUserData},
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      navigator: this.props.navigator,
      });
    };

      LodingView(){
        return(
          <LodingView/>
        )
      }

  	  render() {

    		return (
          <View style={{width:deviceWidth}}>
          <View style={styles.container}>
          <UserProfile style={styles.scrollTabWrapper} getUserData={this.props.getUserData} user={this.props.user} navigator={this.props.navigator}></UserProfile>
          </View>
          <View style={{flex: 1, justifyContent:'center' ,alignItems:'center', top:13}}>
            <Text style={{fontSize:36, color:'orange',fontWeight:'500',fontFamily:styleConfig.FontFamily}} ><Icon2 style={{color:styleConfig.orange,fontSize:32,fontWeight:'400'}}name="inr"></Icon2>
            <AnimateNumber value={this.state.RunTotalAmount2} formatter={(val) => {
                return ' ' + parseFloat(val).toFixed(0)
              }} ></AnimateNumber>
            </Text>
            <Text style={{fontFamily: styleConfig.FontFamily, color:'grey'}}> Impact </Text>

          </View>

          <View style={{flex: 1, marginTop:15, flexDirection:'row'}}>
            <View style={{flex:1, justifyContent:'center',paddingLeft:20,}}>
            <Text style={{fontSize:24, color:'black',fontWeight:'400',fontFamily:styleConfig.FontFamily, textAlign:'left'}} >{' ' + this.state.RunCountTotal + ' '}</Text>
            <Text style={{fontFamily: styleConfig.FontFamily, color:'grey'}}> ImpactRuns </Text>
            </View>
            <View style={{flex:1, justifyContent:'center',paddingRight:20,}}>
            <Text style={{fontSize:24, color:'black',fontWeight:'400',fontFamily:styleConfig.FontFamily, textAlign:'right'}} >{parseFloat(this.state.RunTotalDistance).toFixed(0)}<Text style={{fontSize:18}}> km</Text></Text>
            <Text style={{fontFamily: styleConfig.FontFamily, color:'grey',textAlign:'right'}}> Distance covered </Text>
            </View>
            </View>

            <View>
            <View style={styles.container}>
            <Chart
              style={styles.chart}
              data={dataP}
              type='bar'
              hideVerticalGridLines={true}
              showYAxisLabels={false}
              cornerRadius = {2}
               />
            </View>
            <TouchableOpacity  style={styles.btnviewRun2} text={'BEGIN RUN'} onPress={()=>this.navigateToRunHistory()}>
              <Text style={{fontSize:14,color:'black',fontWeight:'400',fontFamily:styleConfig.FontFamily}} >See Runs</Text>
             </TouchableOpacity>
             </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    height:200,
    top:-250,
  },
  menuTitle:{
    left:20,
    color:'#fafafa',
    fontSize:20,
  },
  btnviewRun2:{
      top: 50,
      width:deviceWidth-65,
      height:50,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:styleConfig.pale_magenta,
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOpacity: 0.4,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
    },
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
  container: {
    width:deviceWidth-65,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  chart: {
    width: deviceWidth-65,
    height: 250,
  },

})
 export default Profile;