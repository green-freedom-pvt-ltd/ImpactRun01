
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
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { TabViewAnimated, TabViewPage } from 'react-native-tab-view';
var REQUEST_URL = 'http://Dev.impactrun.com/api/causes';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;


class Profile extends Component {
    constructor(props) {
      super(props);
      this.state = {
         dataSource : null,
         album : {},
         causes : [],
         navigation: {
           index: 0,
           routes: [],

         },
         

      };
    }
 
    locationManager: undefined
        static propTypes = {
      style: View.propTypes.style,
    };


    componentDidMount() {
        // this.fetchData();
        try {
        AsyncStorage.multiGet([ 'cause1','cause2', 'cause3','cause4',], (err, stores) => {
            var _this = this
            stores.map((item) => {
                let key = item[0];
                let val = JSON.parse(item[1]);
                let causesArr = _this.state.causes.slice()
                causesArr.push(val)
                _this.setState({causes: causesArr})
                _this.setState({album : Object.assign({}, _this.state.album, {[val.cause_title]: val.cause_image})})
            });
          this.setState({navigation: Object.assign({}, this.state.navigation, {
            index: 0,
            routes: Object.keys(this.state.album).map(key => ({ key })),
          })})
        });
        } catch (err) {
        console.log(err)
        }
    }
     // SLIDER_COVERFLOW_STYLE
    _buildCoverFlowStyle = ({ layout, position, route, navigationState,data }) => {
      var data = data;
      const { width } = layout;
      const { routes } = navigationState;
      const currentIndex = routes.indexOf(route);
      const inputRange = routes.map((x, i) => i);
      const translateOutputRange = inputRange.map(i => {
        return width * (currentIndex - i) - ((width-deviceWidth+55) * (currentIndex - i));
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
          return 0.4;
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
      passProps:{data:cause},
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      navigator: this.props.navigator,
      });
    };
     NavigateToSetting() {
      this.props.navigator.push({
      title: 'Setting',
      id:'setting',
      index: 0,
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
      passProps:{data:cause},
      navigator: this.props.navigator,
      });
    };

    // GOOGLE_LOGOUT
   _signOut() {
       GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
       this.setState({user: null});
         this.props.navigator.push({
                title: 'Gps',
                id:'login',
                index: 0,
                navigator: this.props.navigator,
               });
         let keys = ['UID234', 'UID345'];
          AsyncStorage.multiRemove(keys, (err) => {
          });
         })
    };

    // RENDER_SCREEN
    _renderScene = ({ route }) => {
      var cause;
      if (!!this.state.causes.length && this.state.navigation.index+1) {
        cause = this.state.causes[this.state.navigation.index]
      } else {
        cause = {}
      }
   // console.log("PaasData:"+data);
      return (
        <View style={styles.page}>
          <TouchableOpacity  onPress={()=>this.navigateToCauseDetail()} style={styles.album}>
            <Image source={{uri:this.state.album[route.key]}} style={styles.cover}/>
            <View style={styles.borderhide}></View>
            <Text>{route.key}</Text>
          </TouchableOpacity >
          <TouchableOpacity  style={styles.btnbegin} text={'BEGIN RUN'} onPress={()=>this.navigateToRunScreen()}>
             <Image style={{height:40,width:60}} source={ require('../../images/RunImage.png')}></Image>
          </TouchableOpacity>
        </View>
      );
    };
   

     // RENDER_PAGE
    _renderPage = (props,data) => {
       // console.log('REnderPage:'+JSON.stringify(this.state.dataSource));
      return (
        <TabViewPage
          {...props}
          style={this._buildCoverFlowStyle(props)}
          renderScene={this._renderScene}/>
      );
    };
    

    // RENDER_FUNCTION
    render() { 
      return (
        <View>
          <View style={styles.Navbar}>
           <TouchableOpacity onPress={()=>this.NavigateToSetting()} ><Icon style={{color:'white',fontSize:30,left:10}}name={'ios-cog'}></Icon></TouchableOpacity>
            <Text style={styles.menuTitle}>ImpactRun</Text>
          </View>
           <TabViewAnimated
             style={[ styles.container, this.props.style ]}
             navigationState={this.state.navigation}
             renderScene={this._renderPage}
             onRequestChangeTab={this._handleChangeTab}/>
          </View>
      );
    }

  }

  var styles = StyleSheet.create({
   container: {
      flex: 1,
      top:245,
      backgroundColor: '#222',
      width:deviceWidth,
    },
    menuTitle:{
      marginLeft:30,
      color:'white',
      fontSize:20,
    },
    page: {
      top:-180,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    Navbar:{
      position:'absolute',
      top:0,
      height:55,
      width:deviceWidth,
      flexDirection: 'row',
      justifyContent:'flex-start',
      alignItems:'center',
      backgroundColor:'#00b9ff',
      borderBottomWidth:2,
      borderBottomColor:'#e03ed2',
    },
    homebgoverlay:{
      height:deviceheight,
      width:deviceWidth,
      backgroundColor:'rgba(103, 58, 183, 0.58)',

    },
    homebg:{    
      flexDirection: 'row',
      position:'absolute',
      height:deviceheight,
      width:deviceWidth,
    },
    album: {
      backgroundColor: '#fff',
      width: deviceWidth-52,
      height: deviceheight-130,
      elevation: 12,
      shadowColor: '#000000',
      shadowOpacity: 0.6,
      shadowRadius: 3,
      shadowOffset: {
        height: 4,
      },
      borderRadius:5,
    },
    cover: {
      width: deviceWidth-52,
      height:deviceheight/2-50,
      borderRadius:5,
    },
    borderhide:{
      width: deviceWidth-52,
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
      width:60,
      height:60,
      backgroundColor:'#e03ed2',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:80,
      top:-70,
      shadowColor: '#000000',
      shadowOpacity: 0.8,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
      },
    }
  });
  export default Profile;








