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
    ActivityIndicator,
    AsyncStorage,
  } from 'react-native';
var {FBLoginManager} = require('react-native-facebook-login');
import apis from '../apis';
import ImageLoad from 'react-native-image-placeholder';
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
var heightInpersentage = (deviceHeight-114)/100;
var customFlexHeight1 = heightInpersentage*100;
var customFlexHeight2 = heightInpersentage*50;
var customFlexHeight3 = heightInpersentage*33.33333333;
var customFlexHeight4 = heightInpersentage*25;
const dataP = [];
const dataRupees = [];
const my_currency = "INR";
const my_rate = 1.0;

class Profile extends Component {
      constructor(props) {
        super(props);
         this.fetchRunDataLocally();
      //  AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
      //   console.log("fetchRunhistoryDataerr",err);
      // });
      

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
          my_rate:1.0,
          my_currency:"INR",
          RunFetchedData:null,
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
        this.getUserData = this.getUserData.bind(this);
      }


     componentWillMount() { 
        this.setState({
          user:this.props.user,
        })   
         
          AsyncStorage.getItem('my_currency', (err, result) => {
            this.setState({
              my_currency:JSON.parse(result),
          })
            my_currency=this.state.my_currency;
            // console.log('my_rate',this.state.my_currency);
          })     
          
          AsyncStorage.getItem('my_rate', (err, result) => {
            this.setState({
              my_rate:JSON.parse(result),
          })
            my_rate=this.state.my_rate;
                  // console.log('my_rate',this.state.my_rate);
          }) 

          AsyncStorage.getItem('my_distance', (err, result) => {
            this.setState({
              my_distance:JSON.parse(result),
          })
            // my_distance=this.state.my_distance;
            console.log('my_distance',this.state.my_distance);
          })     

      //  AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
      // });
     
     }


      fetchRunDataLocally(){
         AsyncStorage.getItem('RunFetchedData', (err, result) => {
            this.setState({
              RunFetchedData:JSON.parse(result),
          })
            if (this.state.RunFetchedData === null) {
              this.fetchRunhistoryData();
            }
          })           
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
        if (this.props.user != null || this.state.user != null) {
        var token = (this.props.user != null)?this.props.user.auth_token:this.state.user.auth_token;
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

            AsyncStorage.setItem('RunFetchedData', JSON.stringify(1));
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
        var data3 = [];
        for (i = 0; i < RunData.length; i++) {
          var flag = RunData[i].is_flag;
          if (flag != true) {

          data3.push(RunData[i].run_amount);
          // console.log('data3',data3);
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
          dataRupees.push(dataI[counterDate.toLocaleDateString()]/my_rate);
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
        var data2 = [];
        for (i = 0; i < RunData.length; i++) {
          var flag = RunData[i].is_flag;
          if (flag != true) {
            data2.push(RunData[i].distance);
            // console.log('data',data2);
            sum += RunData[i].distance;

            // console.log('data2',sum);
            };
        }
        this.setState({
          RunTotalDistance:sum,
          level:this.userLevelFunction(this.state.RunTotalAmount2),
        })      
         AsyncStorage.setItem('totalkm',JSON.stringify(this.state.RunTotalDistance), () => {
         })
        }else{
        return;
         }
       })
    }



  userLevelFunction(totalkm){
  // console.log('totalkm' , totalkm);
   if (totalkm != null) {
      if (totalkm == 0 ) { 
      this.setState({
        prevKm:0,
        levelKm:1,
        progressVal:totalkm/1,

      })
      return 0;
    }
    else if (totalkm <= 10 ) { 
      this.setState({
        prevKm:1,
        levelKm:10,
        progressVal:totalkm/10,

      })
      return 1;
    }else if (totalkm <= 50){
      
      this.setState({
        prevKm:10,
        levelKm:50,
        progressVal:(totalkm-10)/50,
        
      })
      return 2;
    }else if (totalkm <= 100){
      
      this.setState({
        prevKm:50,
        levelKm:100,
        progressVal:(totalkm-50)/100,
        
      })
      return 3;
    }else if (totalkm <= 500){
      
      this.setState({
        prevKm:100,
        levelKm:500,
        progressVal:(totalkm-100)/250,
        
      })
      return 4;
    }else if (totalkm <= 1000){
      
      this.setState({
        prevKm:500,
        levelKm:1000,
        progressVal:(totalkm-500)/500,
        
      })
      return 5;
    }else if (totalkm <= 2000) {
      this.setState({
        prevKm:1000,
        levelKm:2000,
        progressVal:(totalkm-1000)/1000,
      })
      return 6;
    }else if (totalkm <= 5000){
      // console.log('level 7');
      this.setState({
        prevKm:2000,
        levelKm:5000,
        progressVal:(totalkm-2000)/2500,
      })
      return 7;
      
    }else if (totalkm <= 10000) {
      this.setState({
        prevKm:5000,
        levelKm:10000,
        progressVal:(totalkm-5000)/5000,
      })
      return 8;
    }else if (totalkm <= 20000){
      this.setState({
        prevKm:10000,
        levelKm:20000,
        progressVal:(totalkm-10000)/10000,
      })
      return 9;
      
    }else if (totalkm <= 50000) {
      this.setState({
        prevKm:20000,
        levelKm:50000,
        progressVal:(totalkm-20000)/25000,
      })
      return 10;
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
      this.props.navigator.push({
      title: 'RunHistory',
      component:RunHistory,
      passProps:{rawData:this.state.rawData,user:this.props.user,getUserData:this.props.getUserData},
      })
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
     
     getUserData(){
      AsyncStorage.getItem('USERDATA', (err, result) => {
           let user = JSON.parse(result);
            this.setState({
              user:user,
            })
            console.log('datauseer',user);
            this.fetchRunhistoryData();
            this.props.getUserData();
        }) 
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
      
    measureView(event) {
        this.setState({
            x: event.nativeEvent.layout.x,
            y: event.nativeEvent.layout.y,
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height
        })
        console.log('height',this.state.height);
    }
    
    getXRows(item,index) {
        var days = item[0];
        var rupees = item[1];
        var maxvalue = Math.max.apply(Math, dataRupees);

        if (my_currency != 'INR' && typeof rupees != 'undefined'){
          rupees= parseFloat(rupees/my_rate).toFixed(2);

        } 
        if(my_currency == 'INR'){
          var hunderdPercentageHeightBar = Math.ceil(maxvalue / 10) * 10;
        }
        else
        {
          var hunderdPercentageHeightBar = Math.ceil(maxvalue*100)/100;
        }

        var MaxBarHeight = ((((heightInpersentage*54)/100)*75)/100)*80 ;
        var barHeightRatio = ((((heightInpersentage*54)/100)*75)/100)*80/hunderdPercentageHeightBar;
        var barHeight = (barHeightRatio*rupees)-5;
        // console.log('barHeight',barHeight);
        // console.log('rupees',rupees);
        
        var chartWidth = (deviceWidth/100)*80;
        var barWidth = chartWidth/15;
        if (typeof rupees == 'undefined') {
           var iconrupees;
        }else{
          
            var iconrupees = <Icon2 style={{fontSize:styleConfig.fontSizerlabel-2,}}name={my_currency.toLowerCase()}></Icon2>; 
        }
       
        return (
            <View key={index} style={{flex:1,justifyContent: 'flex-end',alignItems: 'center',borderBottomWidth:1,borderBottomColor:'#CACACA'}}>
                 <Text style={{ top:-10,fontSize:styleConfig.fontSizerlabel-2,fontFamily:styleConfig.FontFamily, color:'grey',backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}}>{iconrupees}{rupees}</Text>
                <View style={{flexDirection:'column',width:barWidth,height:barHeight,backgroundColor:styleConfig.light_sky_blue,borderRadius:3,bottom:3,alignItems: 'center',}}>
 
                </View>

            </View>
        )    
    }

    getYRows(item,index) {
        var days = item[0];
        if (item[1] === undefined) {
            var rupees = 0;
        }else{
            var rupees = item[1];
        }
        
        return (
            <View key={index}style={{justifyContent: 'flex-end',flex:1,backgroundColor:'white',alignItems: 'center',}}>
               <View style={{flexDirection:'column'}}> 
                    <Text style={{fontSize:styleConfig.fontSizerlabel-2,fontFamily:styleConfig.FontFamily, color:'grey',fontWeight:'400'}}>{days}</Text>
               </View>
            </View>
          
        )    
    }

    render() {
        var Yaxis = dataP.map(this.getYRows);
        var Xaxis = dataP.map(this.getXRows);

        var maxvalue = Math.max.apply(Math, dataRupees);
        // console.log('dataRupees',maxvalue);
        if(this.state.my_currency == 'INR'){
          var hunderdPercentageHeightBar = Math.ceil(maxvalue / 10) * 10;
        }
        else
        {
          var hunderdPercentageHeightBar =  Math.ceil(maxvalue*100)/100; //parseFloat(maxvalue).toFixed(2);
        }
        // console.log('dataRupees23',hunderdPercentageHeightBar);
        if ( this.state.user != null ) {
          // console.log('my_currencylower',this.state.my_currency.toLowerCase());
        return (
          <View style={styles.container}>
            <View style ={styles.profileWraper}>
                <View style={{height:(heightInpersentage*45/100)*40,width:deviceWidth,backgroundColor:'white',justifyContent: 'center',}}>
                    <UserProfile height={(heightInpersentage*40/100)*35} progressVal={this.state.progressVal} level={this.state.level} prevKm = {this.state.prevKm} fetchTotalDistance={this.fetchTotalDistance} fetchAmount ={this.fetchAmount} getRunCount = {this.getRunCount} fetch7DayData={this.fetch7DayData} levelKm={this.state.levelKm}fetchUserData={this.fetchUserdata} totalKm={this.state.RunTotalDistance} style={styles.scrollTabWrapper} getUserData={this.props.getUserData} user={this.state.user} navigator={this.props.navigator}></UserProfile>
                </View>
                <View onLayout={(event) => this.measureView(event)} style={{height:(heightInpersentage*45/100)*60,width:deviceWidth,backgroundColor:'white'}}>
                    <View style={{height:(this.state.height/100)*20,width:this.state.width,justifyContent: 'center',alignItems: 'center',padding:(((this.state.height/100)*20)/100)*10}}>
                        <Text style={{fontFamily:styleConfig.FontFamily,fontWeight:'400'}}>All Time</Text>
                    </View>
                    <View style={{height:(this.state.height/100)*37,width:this.state.width,backgroundColor:'white',justifyContent: 'center',alignItems: 'center',}}>
                        <Text style={{fontSize:styleConfig.fontSizerImpact, color:'#33f373',fontWeight:'500',fontFamily:styleConfig.FontFamily}} ><Icon2 style={{color:'#33f373',fontSize:styleConfig.fontSizerImpact-7,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}></Icon2><AnimateNumber value={this.state.RunTotalAmount2/this.state.my_rate} formatter={(val) => {return ' ' + (this.state.my_currency == 'INR' ? parseFloat(val).toFixed(0) : parseFloat(val).toFixed(2))}} ></AnimateNumber>
                        </Text>
                        <Text style={{fontSize:styleConfig.fontSizerlabel, fontFamily: styleConfig.FontFamily, color:'grey'}}> Impact </Text>
                    </View>
                    <View style={{height:(this.state.height/100)*30,width:this.state.width,backgroundColor:'yellow',flexDirection:'row'}}>
                        <View style={{flex:1,backgroundColor:'white',justifyContent: 'center'}}>
                            <Text style={{left:20,fontSize:styleConfig.FontSizeTitle+3, color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily, textAlign:'left',}} > 
                                <AnimateNumber value={this.state.RunCountTotal} formatter={(val) => {
                                    return ' ' + parseFloat(val).toFixed(0)
                                  }} ></AnimateNumber>
                            </Text>
                            <Text style={{left:20,fontSize:styleConfig.fontSizerlabel, fontFamily: styleConfig.FontFamily, color:'grey'}}> Walks & Runs </Text>                       
                        </View>
                       <View style={{flex:1,backgroundColor:'white',justifyContent: 'center'}}>
                            <Text style={{right:20,fontSize:styleConfig.FontSizeTitle+3, color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily, textAlign:'right'}} >
                                <AnimateNumber value={(this.state.my_distance == 'miles' ? this.state.RunTotalDistance*0.621 : this.state.RunTotalDistance)} formatter={(val) => {
                                    return ' ' + parseFloat(val).toFixed(0)
                                }} ></AnimateNumber>
                                <Text style={{fontSize:styleConfig.FontSizeTitle-5,color:'grey'}}> {(this.state.my_distance == 'miles' ? 'mi' : 'km')}</Text>
                             </Text>
                            <Text style={{right:20,fontSize:styleConfig.fontSizerlabel, fontFamily: styleConfig.FontFamily, color:'grey',textAlign:'right'}}> Distance covered </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style ={styles.profileWraper2}>                          
              <View style={{flex:-1,height:((heightInpersentage*55)/100)*75,width:deviceWidth,backgroundColor:'white',justifyContent: 'flex-end',alignItems: 'center',}}>
                <View style={styles.container2}>
                 
                   <View style={{flex:-1,flexDirection:'row',height:((((heightInpersentage*55)/100)*75)/100)*80,width:(deviceWidth/100)*80,backgroundColor:'white'}}>                
                    <View style={{flexDirection:'column',flex:1,}}>
                       <View style={{alignItems: 'flex-start', flex:1,borderTopWidth:1,borderTopColor:'#CACACA'}}>
                        <View style ={{height:30,width:100,justifyContent: 'center',alignItems:'center',top:-15,left:-65}}>
                          <Text style={{textAlign:'center', fontSize:styleConfig.fontSizerlabel-2,fontFamily:styleConfig.FontFamily, color:'grey',backgroundColor:'transparent',}}>
                             <Icon2 style={{color:styleConfig.orange,fontSize:styleConfig.fontSizerlabel-2,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}>
                             </Icon2> {(this.state.my_currency == 'INR' ? parseFloat(hunderdPercentageHeightBar).toFixed(0) : parseFloat(hunderdPercentageHeightBar).toFixed(2))}
                          </Text>
                         </View>
                      </View>
                       <View style={{flex:1,}}></View>
                       <View style={{alignItems: 'flex-start', flex:1,borderTopWidth:1,borderTopColor:'#CACACA'}}>
                        <View style = {{height:30,width:100,justifyContent: 'center',alignItems: 'center',top:-15,left:-65}}>
                          <Text style={{textAlign:'center',fontSize:styleConfig.fontSizerlabel-2,fontFamily:styleConfig.FontFamily, color:'grey',backgroundColor:'transparent',}}>
                             <Icon2 style={{color:styleConfig.orange,fontSize:styleConfig.fontSizerlabel-2,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}>
                             </Icon2> {(this.state.my_currency == 'INR' ? parseFloat(hunderdPercentageHeightBar/2).toFixed(0) : parseFloat(hunderdPercentageHeightBar/2).toFixed(2))}
                          </Text>
                        </View>  
                       </View>
                       <View style={{flex:1,}}></View>
                    </View>
                    <View style={{flex:-1,position:'absolute',left:0,bottom:0,flexDirection:'row',width:(deviceWidth/100)*80,height:((((heightInpersentage*55)/100)*75)/100)*80}} >
                    {Xaxis}
                    </View>
                  
                  </View>
                   <View style={{flexDirection:'row',borderTopWidth:1,borderTopColor:'#CACACA',justifyContent: 'center',width:(deviceWidth/100)*80,height:((((heightInpersentage*55)/100)*75)/100)*10}}>
                  {Yaxis}
                  </View>
                 </View>
              </View>
              <View style={{height:((heightInpersentage*55)/100)*25,width:deviceWidth,backgroundColor:'white'}}>
                <View style={{flex:1,backgroundColor:'white',padding:(deviceWidth/100)*3,paddingLeft:(deviceWidth/100)*10,paddingRight:(deviceWidth/100)*10}}>
                  <TouchableOpacity onPress={()=>this.navigateToRunHistory()} style={styles.btnviewRun2}>
                    <Text style={{fontFamily:styleConfig.FontFamily, color:'grey',fontWeight:'400'}}>See Workouts</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
             {this.isloading()}
          </View>
        );
      }else{
        return(
          <View>
           <View style={{width:deviceWidth,height:deviceHeight,paddingTop:(deviceHeight/2)-200}}>
           <LoginBtn getUserData={this.getUserData}/>
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
      flex:1,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:"white",
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: {
        height: 7,
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
    flex:-1,
    height:heightInpersentage*100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    flexDirection:'column',
  },
   container2: {
    flex:-1,
    width:deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection:'column',
  },
  chart: {
    width: deviceWidth-30,
    height:styleConfig.barChatHight,
  },
  profileWraper:{
    height:heightInpersentage*45,
    width:deviceWidth,
    backgroundColor:'white',
  },
  profileWraper2:{
    height:heightInpersentage*55,
    width:deviceWidth,
    backgroundColor:'white',
  }

})
 export default Profile;