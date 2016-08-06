
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
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { TabViewAnimated, TabViewPage } from 'react-native-tab-view';
var REQUEST_URL = 'http://Dev.impactrun.com/api/causes.json';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;
// var ALBUMS = {
//   'Abbey Road': require('../../images/album-art-1.jpg'),
//   'Bat Out of Hell': require('../../images/album-art-2.jpg'),
//   'Homogenic': require('../../images/album-art-3.jpg'),
//   'Number of the Beast': require('../../images/album-art-4.jpg'),
// };
class Profile extends Component {
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

  componentDidMount () {
    // let causes = []
    try {
      AsyncStorage.multiGet(['cause0', 'cause1', 'cause2', 'cause3'], (err, stores) => {
          var _this = this
          stores.map((item) => {
              let key = item[0];
              let val = JSON.parse(item[1]);
              let causesArr = _this.state.causes.slice()
              causesArr.push(val)
              _this.setState({causes: causesArr})
              console.log('causeArrInne'+JSON.stringify(_this.state.causes))
              _this.setState({album : Object.assign({}, _this.state.album, {[val.pk]: val.cause_image})})
              console.log('album'+JSON.stringify(_this.state.album))
          });
        console.log('album3'+JSON.stringify(this.state.album))
        this.setState({navigation: Object.assign({}, this.state.navigation, {
          index: 1,
          routes: Object.keys(this.state.album).map(key => ({ key })),
        })})
      });
    } catch (err) {
      console.log(err)
    }
  }

    

  componentWillMount() {
      // Fetch Data
      

    fetch("http://dev.impactrun.com/api/causes/", {
      method: "GET",
       headers: {  
        }
      })
    .then((response) => response.json())
    .then((causes) => { 
    var causes = causes;
    console.log('somecausre:'+ causes.results[0].cause_title);
   

       // if (causes.results.length > 0 ) {
       //  var userdata = causes;
       //    var text = "";
       //     var i;
       //      for (i = 0; i < userdata.length; i++) {
       //         text += userdata[i]
       //       }
       //       console.log('itstrue'+ text);
       //       };
            

             // let CID234_object = {
             //        cause_title:userdata.results[0].cause_title,
             //        cause_description:userdata.results[0].cause_description,
             //        conversion_rate: userdata.results[0].conversion_rate,
             //        cause_category:userdata.results[0].cause_category,
             //        cause_brief:userdata.results[0].cause_brief,
             //        cause_image:userdata.results[0].cause_image,
             //        cause_thank_you_image:userdata.results[0].cause_thank_you_image,
             //        is_active:userdata.results[0].is_active,
             //    };
             //    // first user, delta values
             //    let CID234_delta = {
             //        cause_title:userdata.results[0].cause_title,
             //        cause_description:userdata.results[0].cause_description,
             //        conversion_rate: userdata.results[0].conversion_rate,
             //        cause_category:userdata.results[0].cause_category,
             //        cause_brief:userdata.results[0].cause_brief,
             //        cause_image:userdata.results[0].cause_image,
             //        cause_thank_you_image:userdata.results[0].cause_thank_you_image,
             //        is_active:userdata.results[0].is_active,
             //    };

             //    // // second user, initial values
             //     let CID345_object = {
             //        cause_title:userdata.results[0].cause_title,
             //        cause_description:userdata.results[0].cause_description,
             //        conversion_rate: userdata.results[0].conversion_rate,
             //        cause_category:userdata.results[0].cause_category,
             //        cause_brief:userdata.results[0].cause_brief,
             //        cause_image:userdata.results[0].cause_image,
             //        cause_thank_you_image:userdata.results[0].cause_thank_you_image,
             //        is_active:userdata.results[0].is_active,
             //    };

             //    // // second user, delta values
             //     let CID345_delta = {
             //        cause_title:userdata.results[0].cause_title,
             //        cause_description:userdata.results[0].cause_description,
             //        conversion_rate: userdata.results[0].conversion_rate,
             //        cause_category:userdata.results[0].cause_category,
             //        cause_brief:userdata.results[0].cause_brief,
             //        cause_image:userdata.results[0].cause_image,
             //        cause_thank_you_image:userdata.results[0].cause_thank_you_image,
             //        is_active:userdata.results[0].is_active,
             //    };

             //    let multi_set_pairs = [
             //        ['CID234', JSON.stringify(CID234_object)],
             //        ['CID345', JSON.stringify(CID345_object)]
             //    ]
             //    let multi_merge_pairs = [
             //        ['CID234', JSON.stringify(CID234_delta)],
             //        ['CID345', JSON.stringify(CID345_delta)]
             //    ]
                let causesData = []

                causes.results.forEach ((item,i)=> {
                  causesData.push(['cause'+i, JSON.stringify(item)])
                })
                console.log('causesData'+JSON.stringify(causesData))
                AsyncStorage.multiSet(causesData, (err) => {
                  console.log(err)
                })
                // AsyncStorage.multiSet(causes.results, (err) => {
                //     AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
                //         AsyncStorage.multiGet(['CID234', 'CID345'], (err, stores) => {
                //             stores.map((result, i, store) => {
                //                 let key = store[i][0];
                //                 let val = store[i][1];
                //                 console.log("keysss" + key, val);
                //             });
                //         });
                //     });
                // });
                
              })
    .done();
    }





  onClickEnable() {
    var me = this;
    if (!this.state.enabled) {
      this.locationManager.start(function() {
        me.initializePolyline();
      });
    } else {
      if (this.state.enabled) {
        this.props.navigator.push({
              title: 'Gps',
              id:'home',
              index: 0,
              navigator: this.props.navigator,
             })
      }
      this.state.distanceTravelled = 0;
      this.state.prevDistance = 0;
      this.locationManager.removeGeofences();
      this.locationManager.stop();
      this.locationManager.resetOdometer();
      this.removeAllAnnotations(mapRef);
      this.polyline = null;
    }
    this.setState({
      enabled: !this.state.enabled
    });
    this.updatePaceButtonStyle();
  }
    


   fetchData(dataValue){
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
       this.setState({
          dataSource: this.state.dataSource.cloneWithPages(responseData.results),
        });
      })
   .done();
   var dataValue=this.state.dataSource;
   console.log("DtaVAle:"+JSON.stringify(dataValue));
  }

    
    
  _buildCoverFlowStyle = ({ layout, position, route, navigationState,data }) => {
    var data = data;
    const { width } = layout;
    const { routes } = navigationState;
    const currentIndex = routes.indexOf(route);
    const inputRange = routes.map((x, i) => i);
    const translateOutputRange = inputRange.map(i => {
      return width * (currentIndex - i) - ((width /3.7/0.2260-deviceWidth) * (currentIndex - i));
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
        return 0.5;
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
    console.log('route get');

    return {
      width,
      transform: [
        { translateX },
        { scale },
      ],
      opacity,
    };
  };
  
  _handleChangeTab = (index) => {
    this.setState({

      navigation: { ...this.state.navigation, index },
    });
    console.log('someData:'+ JSON.stringify(this.state.navigation));
  };
  navigateTo(route,data) {
  
        this.props.replaceOrPushRoute(route,{
          navigator: this.props.navigator,
          passProps:{data:data}
        });
       
    };
 _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({user: null});
      console.log('userLogout:');
       this.props.navigator.push({
              title: 'Gps',
              id:'login',
              index: 0,
              navigator: this.props.navigator,
             });
       let keys = ['UID234', 'UID345'];
        AsyncStorage.multiRemove(keys, (err) => {
  // keys k1 & k2 removed, if they existed
  // do most stuff after removal (if you want)
         });
    })
  };
  _renderScene = ({ route }) => {
    var cause;
    if (!!this.state.causes.length && this.state.navigation.index+1) {
      cause = this.state.causes[this.state.navigation.index]
    } else {
      cause = {}
    }

    console.log('myalldata:'+ this.state.album[route.key] + 'key'+route.key);

   console.log('mydata')
     // console.log("PaasData:"+data);

    return (

      <View style={styles.page}>
        <TouchableOpacity  onPress={()=>this.props.navigator.push({
              title: 'Gps',
              id:'runscreen',
              navigator: this.props.navigator,
              passProps: {data : cause},
             })} style={styles.album}>
          <Image source={{uri:this.state.album[route.key]}} style={styles.cover}/>
          <View style={styles.borderhide}></View>
          <Text>{cause.cause_title}</Text>
         </TouchableOpacity >

         <TouchableOpacity  style={styles.btnbegin} text={'BEGIN RUN'} onPress={()=>this.props.navigator.push({
              title: 'Gps',
              id:'runscreen',
              navigator: this.props.navigator,
              passProps: {data: cause},
             })}>

          <Image style={{height:50,width:80}} source={ require('../../images/RunImage.png')}></Image>
          </TouchableOpacity>
      </View>
    );
  };

  _renderPage = (props,data) => {
     // console.log('REnderPage:'+JSON.stringify(this.state.dataSource));
    return (
      <TabViewPage
        {...props}
        style={this._buildCoverFlowStyle(props)}
        renderScene={this._renderScene}/>
    );
  };

  render() {
    return (
      <View>
       <TabViewAnimated
         style={[ styles.container, this.props.style ]}
         navigationState={this.state.navigation}
         renderScene={this._renderPage}
         onRequestChangeTab={this._handleChangeTab}/>
         <TouchableOpacity onPress={this._signOut.bind(this)} style={styles.Loginbtngg}><Text style={{color:'#db3236',textAlign:'left',marginLeft:3,}}>LOGOUT</Text><Image style={{height:40,width:40,}}source={require('../../images/google_plus.png')}/></TouchableOpacity>
        </View>
    );
  }

}

// function bindAction(dispatch) {
//     return {
//         openDrawer: ()=>dispatch(openDrawer()),
//         popRoute: () => dispatch(popRoute())
//     }
// }

var styles = StyleSheet.create({
 container: {
    flex: 1,
    top:260,
    backgroundColor: '#222'
  },
  page: {
    top:-180,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  album: {
    backgroundColor: '#fff',
    width: deviceWidth-60,
    height: deviceheight-170,
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      height: 8,
    },
    borderRadius:5,
  },
  cover: {
    width: deviceWidth-60,
    height:deviceheight/2-50,
    borderRadius:5,
  },
  borderhide:{
    width: deviceWidth-60,
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
    width:80,
    height:80,
    backgroundColor:'#d667cd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:80,
    top:-90,
  }
});
export default Profile;








