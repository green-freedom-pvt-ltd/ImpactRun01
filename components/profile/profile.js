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
    AlertIOS,
    ActivityIndicatorIOS,
    AsyncStorage,
  } from 'react-native';
var {FBLoginManager} = require('react-native-facebook-login');
import apis from '../apis';
import ProfileForm from './profileForm';
import RunHistory from './runhistory/runHistory';
import LodingView from '../LodingScreen';
import LoginBtn from '../login/LoginBtns'
import styleConfig from '../../components/styleConfig';
import UserProfile from './profileHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import AnimateNumber from 'react-native-animate-number';
import commonStyles from '../styles';
import NavBar from '../navBarComponent';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
const dataP = [];

//Index.js is used in profile this is no longer used.


class Profile extends Component {
      constructor(props) {
        super(props);
        
      //  AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
      //   console.log("fetchRunhistoryDataerr",err);
      // });
        this.fetchRunDataLocally();

        this.state = {
          rowData:[],
          runfeatching:false,
          user:null ,
          loadingFirst:true,
          RunTotalAmount2:0,
          RunCountTotal:0,
          RunTotalDistance:0,
          level:0,
          prevKm:0,
          levelKm:0,

          progressVal:0,
          navigation: {
            index: 1,
            routes: [],
            loadingimage:true,
          },
          counterDate:new Date(),
        };
        this.getRunCount = this.getRunCount.bind(this);
        this.fetch7DayData = this.fetch7DayData.bind(this);
        this.fetchAmount =  this.fetchAmount.bind(this);
        this.fetchTotalDistance = this.fetchTotalDistance.bind(this);
      }


     componentWillMount() {
      
    
      //  AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
      // });
     
     }


      fetchRunDataLocally(){
          AsyncStorage.getItem('nextpage', (err, result) => {
            this.setState({
              nextPage:JSON.parse(result),
          })     
          if (this.state.nextPage === null) {
          AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
            var RunData = JSON.parse(result);
            if (result != null || undefined) {
              this.setState({
                rawData: RunData,
              })
              this.fetch7DayData();
              this.getRunCount();
              this.fetchAmount();
              this.fetchTotalDistance();
            }else{
               this.fetchRunhistoryData();
            }
          });
        }else{
           AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
            var RunData = JSON.parse(result);
            if (result != null || undefined) {
              this.setState({
                rawData: RunData,
              })
              this.fetch7DayData();
              this.getRunCount();
              this.fetchAmount();
              this.fetchTotalDistance();
              this.LoadmoreView();
            }
          })
          
        }
        })
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
            runfeatching:true,
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
              runfeatching:true,
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
                let responceversion ={
                  runversion:epochtime
                }
                AsyncStorage.setItem("runversion",JSON.stringify(responceversion),()=>{
                 AsyncStorage.getItem('runversion', (err, result) => {
                  this.setState({
                    runversion:JSON.parse(result).runversion,
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
            var storepage = this.state.rawData;
            AsyncStorage.setItem('fetchRunhistoryData',JSON.stringify(storepage));
              this.fetch7DayData();
              this.getRunCount();
              this.fetchAmount();
              this.fetchTotalDistance();
              this.setState({
               runfeatching:false,
              })
          }
        })
         .catch( error => console.log('Error fetching: ' + error) );
         };
      }


      async LoadmoreView(){
        this.nextPage();
      }



     async nextPage(){
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
            runfeatching:true,
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
          let responceversion = {
            runversion:epochtime
          }
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
           runfeatching:false,
        })
        this.getRunCount();
        this.fetchAmount();
        this.fetchTotalDistance();
        this.fetch7DayData();
       }
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
          this.setState({
             RunTotalAmount2:0,
          })
         }
       })
      }


      fetch7DayData(){
        AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
          console.log('result',JSON.parse(result));
        if (result != null || undefined) {
       
        var RunData = JSON.parse(result);
        var sum = 0;
        var nowdate = new Date();
        var sdate = new Date();
        sdate.setDate(nowdate.getDate() - 7);
        var i;
        var dataI = [];
        dataP = [];
        var counterDate = nowdate.getDate()-7;

        counterDate = new Date();
        for (i = 0; i < RunData.length; i++) {
          var somedate =  RunData[i].start_time.slice(0,10);
          var currDate = new Date(somedate);
          var flag = RunData[i].is_flag;
          if(currDate <= nowdate && currDate > sdate){
            if(!(currDate.toLocaleDateString() in dataI)){
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
          var weekday = new Array(7);
          weekday[0] = "SUN";
          weekday[1] = "MON";
          weekday[2] = "TUE";
          weekday[3] = "WED";
          weekday[4] = "THU";
          weekday[5] = "FRI";
          weekday[6] = "SAT";
        if(!( counterDate.toLocaleDateString() in dataI)) {
         
          var tempA = [];
          tempA.push(weekday[counterDate.getDay()],dataI[counterDate.toLocaleDateString()]);
          dataP.unshift(tempA);
          counterDate.setDate(counterDate.getDate() - 1);
         
        }
        else{
          var tempB=[];
          var tempA = [];

          tempA.push(weekday[counterDate.getDay()],dataI[counterDate.toLocaleDateString()]);
          // tempB.push(tempA)
          dataP.unshift(tempA);
          // tempA.concat(dataP);
         

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
         AsyncStorage.removeItem('totalkm',(err) => {
         });
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
          level:this.userLevelFunction(sum),
        })      
         AsyncStorage.setItem('totalkm',JSON.stringify(this.state.RunTotalDistance), () => {
         })
        }else{
        return;
         }
       })
      }



   userLevelFunction(totalkm){
   if (totalkm != null) {
    if (totalkm <= 50 ) { 
      this.setState({
        prevKm:0,
        levelKm:50,
        progressVal:totalkm/50,

      })
      return 1;
    }else if (totalkm <= 250){
      
      this.setState({
        prevKm:50,
        levelKm:250,
        progressVal:(totalkm-50)/200,
        
      })
      return 2;
    }else if (totalkm <= 500) {
      this.setState({
        prevKm:250,
        levelKm:500,
        progressVal:(totalkm-250)/250,
      })
      return 3;
    }else if (totalkm <= 1000){
      this.setState({
        prevKm:500,
        levelKm:1000,
        progressVal:(totalkm-500)/500,
      })
      return 4;
      
    }else if (totalkm <= 2500) {
      this.setState({
        prevKm:1000,
        levelKm:2500,
        progressVal:(totalkm-1000)/1500,
      })
      return 5;
    }else if (totalkm <= 5000){
      this.setState({
        prevKm:2500,
        levelKm:5000,
        progressVal:(totalkm-2500)/2500,
      })
      return 6;
      
    }else if (totalkm <= 10000) {
      this.setState({
        prevKm:5000,
        levelKm:10000,
        progressVal:(totalkm-5000)/5000,
      })
      return 7;
    }

    }else{
      return
    }
   }



      getAmountCount (){
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
      if (!this.state.runfeatching) {
      this.props.navigator.push({
      title: 'RunHistory',
      component:RunHistory,
      passProps:{rawData:this.state.rawData,user:this.props.user,getUserData:this.props.getUserData},
      });}else{
        return;
      }
    }
     
    

      LodingView(){
        return(
          <LodingView/>
        )
      }

      activityIndicator(){
        if(this.state.runfeatching){
          return(
           <ActivityIndicatorIOS
                style={{height: 20}}
                size="small"
              />
            )
        }else{
          return;
        }
      }



      removeallRun(){
          AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
              console.log("fetchRunhistoryDataerr",err);
         });

      }

      
      ShowRunScreenBtn(){
        if(this.state.runfeatching){
        return(
           <TouchableOpacity  style={styles.btnviewRun1 }>
              <Text style={{fontSize:14,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily:styleConfig.FontFamily}} >LOADING RUNS...</Text>
               <ActivityIndicatorIOS
                style={{height: 20}}
                size="small"
              />
             </TouchableOpacity>
          )
      }else{
        return(
          <View>
            <TouchableOpacity  style={styles.btnviewRun2} text={'BEGIN RUN'} onPress={()=>this.navigateToRunHistory()}>
                <Text style={{fontSize:14,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily:styleConfig.FontFamily}} >SEE RUNS</Text>
            </TouchableOpacity>
          </View>
          )
      }
      }

      render() {
        if (this.props.user.length > 1 ) {
        return (
          <View style={{width:deviceWidth}}>
          <View style={styles.container}>
          <UserProfile progressVal={this.state.progressVal} level={this.state.level} prevKm = {this.state.prevKm} fetchTotalDistance={this.fetchTotalDistance} fetchAmount ={this.fetchAmount} getRunCount = {this.getRunCount} fetch7DayData={this.fetch7DayData} levelKm={this.state.levelKm}fetchUserData={this.fetchUserdata} totalKm={this.state.RunTotalDistance} style={styles.scrollTabWrapper} getUserData={this.props.getUserData} user={this.props.user} navigator={this.props.navigator}></UserProfile>
          </View>
          <View style={{flex: 1, justifyContent:'center' ,alignItems:'center', top:13}}>
            <Text style={{fontSize:styleConfig.FontSizeDisc+2, color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily}}>All Time</Text>
            <Text style={{fontSize:styleConfig.fontSizerImpact, color:'orange',fontWeight:'500',fontFamily:styleConfig.FontFamily}} ><Icon2 style={{color:styleConfig.orange,fontSize:styleConfig.fontSizerImpact-5,fontWeight:'400'}}name="inr"></Icon2>
            <AnimateNumber value={this.state.RunTotalAmount2} formatter={(val) => {
                return ' ' + parseFloat(val).toFixed(0)
              }} ></AnimateNumber>
            </Text>
            <Text style={{fontSize:styleConfig.fontSizerlabel, fontFamily: styleConfig.FontFamily, color:'grey'}}> Impact </Text>

          </View>

          <View style={{flex: 1, marginTop:15, flexDirection:'row'}}>
            <View style={{flex:1, justifyContent:'center',paddingLeft:20,}}>
            <Text style={{fontSize:styleConfig.FontSizeTitle+5, color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily, textAlign:'left'}} > 
            <AnimateNumber value={this.state.RunCountTotal} formatter={(val) => {
                return ' ' + parseFloat(val).toFixed(0)
              }} ></AnimateNumber>
            </Text>
            <Text style={{fontSize:styleConfig.fontSizerlabel, fontFamily: styleConfig.FontFamily, color:'grey'}}> ImpactRuns </Text>
            </View>
            <View style={{flex:1, justifyContent:'center',paddingRight:20,}}>
            <Text style={{fontSize:styleConfig.FontSizeTitle+5, color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily, textAlign:'right'}} >
              <AnimateNumber value={this.state.RunTotalDistance} formatter={(val) => {
                return ' ' + parseFloat(val).toFixed(0)
              }} ></AnimateNumber><Text style={{fontSize:styleConfig.FontSizeTitle}}> km</Text></Text>
            <Text style={{fontSize:styleConfig.fontSizerlabel, fontFamily: styleConfig.FontFamily, color:'grey',textAlign:'right'}}> Distance covered </Text>
            </View>
            </View>

            <View>
             <View style={{height:40,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}> 
                <Text style={{textAlign:"center",fontSize:styleConfig.FontSizeDisc+2, color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily}}>Rupees raised in last 7 days</Text>
             </View>
            <View style={styles.container2}>
           
             <BarChart
              style={styles.chart}
              data={dataP}
              height={styleConfig.barChatHight}
              type='bar'
              hideVerticalGridLines={true}
              showYAxisLabels={false}
              cornerRadius = {2}
              labelFontSize = {styleConfig.barChatFontSize}

              />
               

         
            </View>
            <View style={{width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
            {this.ShowRunScreenBtn()}
             </View>
             </View>
             {this.isloading()}
          </View>
        );
      }else{
        return(
          <View>
          <NavBar title={"PROFILE"}/>
           <View style={{width:deviceWidth,height:deviceHeight,paddingTop:(deviceHeight/2)-200}}>
           <LoginBtn getUserData={this.props.getUserData}/>
           </View>
           </View>

          )
      }
      }


      isloading(){
      if (this.state.runfeatching) {
        return(
          <View style={{position:'absolute',top:0,backgroundColor:'rgba(4, 4, 4, 0.80)',height:deviceHeight,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
            <ActivityIndicator
             style={{height: 80}}
              size="large"
            >
            </ActivityIndicator>
          </View>
          )
      }else{
        return;
      }
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
  btnviewRun1:{
      top: 10,
      width:deviceWidth-65,
      height:styleConfig.SeeRunBtnHeight,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:"grey",
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOpacity: 0.4,
      shadowRadius: 4,
      flexDirection:'row',
      shadowOffset: {
        height: 3,
      }
  },
  btnviewRun2:{
      top: 10,
      width:deviceWidth-65,
      height:styleConfig.SeeRunBtnHeight,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:"white",
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOpacity: 0.4,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
      }
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
   container2: {
    width:deviceWidth,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  chart: {
    width: deviceWidth-30,
    height:styleConfig.barChatHight,
  },

})
 export default Profile;