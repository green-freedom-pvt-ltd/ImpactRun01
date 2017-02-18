
'use strict';

import React,{Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
  Platform,
  Navigator,
  Animated,
  Image,
  AlertIOS,
  LayoutAnimation,
  TouchableOpacity,
  AsyncStorage,
  NetInfo,
  PanResponder,
  TouchableWithoutFeedback
} from 'react-native';
import apis from '../../components/apis';
import styleConfig from '../../components/styleConfig';
import Lodingscreen from '../../components/LodingScreen';
import commonStyles from '../../components/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TabViewAnimated, TabViewPage } from 'react-native-tab-view';
var REQUEST_URL = 'http://Dev.impactrun.com/api/causes';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;


class Homescreen extends Component {
      constructor(props) {
        super(props);
        this.state = {
          dataSource : null,
          album : {},
          causes : [],
          navigation: {
            index: 1,
            routes: [],
          },
        };
      }
      locationManager: undefined
      static propTypes = {
        style: View.propTypes.style,
      };
      
      componentWillMount() {
      // var keys = ['RID0','RID1','RID2','RID3','RID4','RID5','SaveRunCount'];
      //  AsyncStorage.multiRemove(keys, (err) => {
      //     console.log('removedkey');
      // });
        AsyncStorage.getItem('RID0', (err, result) => {
          this.setState({
          Rundata:JSON.parse(result),  
          loaded:true,             
           })
          this.PostSavedRundataIfInternetisOn();
           console.log('this.rundata.user',this.state.Rundata);
        
        })  
         AsyncStorage.getItem('SaveRunCount', (err, result) => {
          this.setState({
          RunCount:JSON.parse(result),  
          loaded:true,             
           })
          
           console.log('this.rundata.user',this.state.RunCount);
        
        })  
        console.log('this.props.user',this.props.user);
        
      }
       
      componentWillUnmount() {
        console.log('component unmonted');
      }

      PostSavedRundataIfInternetisOn(){
           if(this.props.user) {
           NetInfo.isConnected.fetch().done(
            (isConnected) => {
              console.log('isConnected',isConnected);
              console.log('isConnected',this.state.Rundata);
              if (isConnected && this.state.Rundata != null) {
                console.log('this.rundata.user',this.state.Rundata);
                  this.postPastRun();
               }
            }
           );  
         }
      }

      componentDidMount() {
        var provider = this.props.provider;
        var causeNum = this.props.myCauseNum;
          try {
            AsyncStorage.multiGet(causeNum, (err, stores) => {
                var _this = this
                stores.map((item) => {
                    let key = item[0];
                    let val = JSON.parse(item[1]);
                    let causesArr = _this.state.causes.slice()
                    causesArr.push(val)
                    _this.setState({causes: causesArr})
                    _this.setState({album : Object.assign({}, _this.state.album, {[val.cause_title]: [val.cause_image,val.cause_brief,val.cause_category,val.partners[0].partner_ngo,val.is_active]})})
                    _this.setState({brief : Object.assign({}, _this.state.brief, {[val.cause_brief]: val.cause_image})})
                });
              this.setState({navigation: Object.assign({}, this.state.navigation, {
                index: 1,
                routes: Object.keys(this.state.album).map(key => ({ key })),
              })})
          });
          } catch (err) {
            console.log(err)
          } 
      }
     postPastRun(){
      var userdata = this.props.user;
      var user_id =JSON.stringify(userdata.user_id);
      var token = JSON.stringify(userdata.auth_token);
      var tokenparse = JSON.parse(token);
      var runNumber=[];
      var i;
      var runcount = this.state.RunCount;
      for (i = 0; i < runcount+1; i++) {
          runNumber.push("RID" + i )  ;
      }
      
      console.log('runNo',runNumber);
      AsyncStorage.multiGet(runNumber, (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let val = store[i][1];
          this.setState({
          MyRunVal:JSON.parse(val),  
          loaded:true,             
          }) 
         var RunData = this.state.MyRunVal;
         fetch(apis.runApi, {
          method: "POST",
          headers: {  
            'Authorization':"Bearer "+ tokenparse,
            'Accept': 'application/json',
            'Content-Type': 'application/json',    
          },
          body:JSON.stringify({
          cause_run_title:RunData.cause_run_title,
          user_id:RunData.user_id,
          start_time:RunData.start_time,
          distance:RunData.distance,
          peak_speed: 1,
          avg_speed:RunData.avg_speed,
          run_amount:RunData.run_amount,
          run_duration:RunData.run_duration,
          start_location_lat:RunData.start_location_lat,
          start_location_long:RunData.start_location_long,
          end_location_lat:RunData.end_location_lat,
          end_location_long:RunData.end_location_long,
          no_of_steps:RunData.no_of_steps,
          is_ios:RunData.is_ios,
        })
       })

      .then((response) => response.json())
      .then((userRunData) => { 
        console.log('userRunData',userRunData);
        this.RemoveStoredRun(runNumber);
       })
      });
      })
    }
    RemoveStoredRun(runNumber){

      let keys = runNumber;
      keys.push("SaveRunCount");
        AsyncStorage.multiRemove(keys, (err) => {
          console.log('removedkey');
      });

    }
     // SLIDER_COVERFLOW_STYLE
    _buildCoverFlowStyle = ({ layout, position, route, navigationState,data }) => {
      var data = data;
      const { width } = layout;
      const { routes,SecondRoute } = navigationState;
      const currentIndex = routes.indexOf(route);
      const inputRange = routes.map((x, i) => i);
      const translateOutputRange = inputRange.map(i => {
        return width * (currentIndex - i) - ((width-deviceWidth+70) * (currentIndex - i));
      });
      const scaleOutputRange = inputRange.map(i => {
        if (currentIndex === i) {
          return 1;
        } else {
          return 0.9;
        }
      });
      const opacityOutputRange = inputRange.map(i => {
        if (currentIndex === i) {
          return 1;
        } else {
          return 0.7;
        }
      });

      const translateX = position.interpolate({
        inputRange,
        outputRange: translateOutputRange,
      });
      const scale = position.interpolate({
        inputRange,
        outputRange: scaleOutputRange,
      });
      const opacity = position.interpolate({
        inputRange,
        outputRange: opacityOutputRange,
      });

      return {
        width,
        transform: [
          { translateX },
          { scale },
        ],
        opacity,
      };
    };
     

    // ONCHANGE_SLIDER_FUNCTION
    _handleChangeTab = (index) => {
      this.setState({
        navigation: { ...this.state.navigation, index },
      });
     };

    // NAVIGATION
    navigateToRunScreen(cause) {
      var cause;
      if (!!this.state.causes.length && this.state.navigation.index+1) {
        cause = this.state.causes[this.state.navigation.index]
      } else {
        cause = {}
      }
      this.props.navigator.replace({
      title: 'Gps',
      id:'runlodingscreen',
      index: 0,
      passProps:{data:cause,user:this.props.user,getUserData:this.props.getUserData},
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      navigator: this.props.navigator,
      });
    };

    navigateToCauseDetail() {
      var cause;
      if (!!this.state.causes.length && this.state.navigation.index+1) {
        cause = this.state.causes[this.state.navigation.index]
      } else {
        cause = {}
      }
      this.props.navigator.push({
      title: 'Gps',
      id:'causedetail',
      index: 0,
      passProps:{data:cause,user:this.props.user,getUserData:this.props.getUserData},
      navigator: this.props.navigator,
      });
    };

    functionForIphone4Brief(route){
      if (deviceheight <= 480) {
      return(
        <Text  numberOfLines={3} style={styles.causeBrief}>{this.state.album[route.key][1]}</Text>
        )
      }else{
        return(
          <Text  numberOfLines={4} style={styles.causeBrief}>{this.state.album[route.key][1]}</Text>
          )
      }
    };
    // RENDER_SCREEN
    _renderScene = ({ route }) => {
      var cause;
      if (!!this.state.causes.length && this.state.navigation.index+1) {
        cause = this.state.causes[this.state.navigation.index]
      } else {
        cause = {}
      }
        return (
          <View style={styles.page}>
            <TouchableWithoutFeedback accessible={false} onPress={()=>this.navigateToCauseDetail()} >
            <View style={styles.album}>
              <Image source={{uri:this.state.album[route.key][0]}} style={styles.cover}>
              <View style={{position:'absolute',bottom:10,backgroundColor:'rgba(255, 255, 255, 0.75)',width:deviceWidth,padding:5}}>
               <Text style={{fontWeight:'400',color:styleConfig.greyish_brown_two, fontFamily:styleConfig.FontFamily,}}>
                {this.state.album[route.key][2]}
               </Text>
              </View>
              </Image>
              <View style={styles.borderhide}></View>
              <Text numberOfLines={1} style={styles.causeTitle}>{route.key}</Text>
              <Text numberOfLines={1} style={{color:styleConfig.greyish_brown_two,fontFamily:styleConfig.FontFamily,fontSize:styleConfig.FontSize3,fontWeight:'400',left:10,top:-5,width:200,}}>By {this.state.album[route.key][3]}</Text>
              <View  onPress={()=>this.navigateToCauseDetail()}>
                {this.functionForIphone4Brief(route)}
              </View>
             </View>
             </TouchableWithoutFeedback>
             <TouchableOpacity  style={styles.btnbegin} text={'BEGIN RUN'} onPress={()=>this.navigateToRunScreen()}>
               <Image style={{height:40,width:60}} source={ require('../../images/RunImage.png')}></Image>
             </TouchableOpacity>
          </View>
        );
      
    };
   

     // RENDER_PAGE
    _renderPage = (props,data,route) => {
      return (
        <TabViewPage
          {...props}
          style={this._buildCoverFlowStyle(props)}
          renderScene={this._renderScene}/>
      );
    
    };
    

    // RENDER_FUNCTION
    render(route) { 
      if (this.props.myCauseNum != null ) {
      return (
        <View style={{height:deviceheight,width:deviceWidth,backgroundColor:'white'}}>
        <View>
          <View style={commonStyles.Navbar}>
            <Text style={commonStyles.menuTitle}>Impactrun</Text>
          </View>
           <TabViewAnimated
             style={[ styles.container, this.props.style ]}
             navigationState={this.state.navigation}
             renderScene={this._renderPage}
             onRequestChangeTab={this._handleChangeTab}/>
             </View>
          </View>
      );
    }else{
      return(
        <Lodingscreen/>
        )
    }
    }
  
  

  }

  var styles = StyleSheet.create({
   container: {
      height: deviceheight-70,
      backgroundColor: 'white',
      top:styleConfig.CardTop,
      width:deviceWidth,
    },
    page: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
     homebgoverlay:{
      height:deviceheight,
      width:deviceWidth,
      opacity:1,
     },
     homebg:{    
      flexDirection: 'row',
      position:'absolute',
      height:deviceheight,
      width:deviceWidth,
     },
     album: {
      backgroundColor: '#fff',
      width: deviceWidth-65,
      height: styleConfig.CardHeight,
      elevation: 12,
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {
        height: 4,
      },
      borderRadius:5,
     },
     cover: {
      width: deviceWidth-65,
      height:deviceheight/2-90,
      borderRadius:5,
      resizeMode: 'cover',
     },
     borderhide:{
      width: deviceWidth-65,
      height:10,
      top:-10,
      backgroundColor:'white',
     },
     label: {
      margin: 16,
      color: '#fff',
      left:deviceWidth/2-60,
     },
     btnbegin:{
      width:styleConfig.beginRunBtnWidth,
      height:styleConfig.beginRunBtnHeight,
      backgroundColor:'#ffcd4d',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:80,
      top:-styleConfig.beginRunBtnHeight-10,
      shadowColor: '#000000',
      shadowOpacity: 0.4,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
      },
    },
    causeTitle:{
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSizeTitle,
      fontWeight:'400',
      paddingLeft:10,
      top:-10,
      fontFamily:styleConfig.FontFamily,
    },
     causeBrief:{
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSizeDisc,
      fontWeight:'400',
      padding:10,
      paddingTop:0,
      width:deviceWidth-70,
      fontFamily:styleConfig.FontFamily3,
    },
  });
  export default Homescreen;