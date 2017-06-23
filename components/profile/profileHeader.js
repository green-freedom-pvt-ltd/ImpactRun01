'use strict';
var React = require('react');
var ReactNative = require('react-native');

var {
  StyleSheet,
  Image,
  Text,
  View,
  AsyncStorage,
  Dimensions,
  VibrationIOS,
  Navigator,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicatorIOS
} = ReactNative;


var FB_PHOTO_WIDTH = 200;
var base64Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABICAYAAACqT5alAAAABGdBTUEAALGPC/xhBQAABOFJREFUeAHtmlmIFEcYx2dUxDt4YTSieCAqHkgkJARU9EFFgygeICIi+qCgQRHFh4CQhzwsgSiJeGD0yQNR8SDg8WBWvFZNRFkkEW/BCKsuisQcuvl9Zqbt6emq6aquaWd2+4P/dPVX31lfV3X1dGcyhtTU1HQdVAotNgw/08pUodrl04SrvYKl4k8rXGqEqr0/y3K7hSQ+NEhkIrKdDeTLKforxu8bONguCd9CYaCBUjWLrkzncDWXL0rs76PCLwhsCtgcJUDXMu8j4Z3ZbPY4iawHL10nVMpeG43AVvoehPSvgNcrhB+VJXYzJP2cBXMPzSVRFUPkDsCTlTpIC2AMDTLfnssqDcLoszAFBOM8PNT6bWJrbJhjA95Cv718G/3DChsrkr6k5Z7vEVW+zMkvHiOBhlzSTQo/WQU/CvsZQrvBY/AEPM0df+YYpNkwhoFuoHsOYzlOBbakKuQbSbgBDAqx3DOEF5W1ieptiCKM3B3kBB5xOUrAjcB2R9fDM1bYaBDDjwp53lnoHPZ69Y2FBD1AL6LtXU2vVbL47YDuaIX1R5LwNUXnEpRtV2NJ9iL6RoOGfGvwPbo1ipiisFch1D5E8DW8+gwOPgYqOhRURNBklf4T+XlBG2HnyHUGPwETKlilURwB/lIYqPX8IvCbQkjYx4D3NEXbJGHRfwPGec4UDWTEjyl5CaM4FzRoDCwT1/mNx1e09ylimQa/HkOy6l4CXRRyKras9vdUnT7+Q187avMT4uqK8BdgkkZJFsUdXj9K8phYC8pBUZKVqTW/HM5zNmflk5VFS7Z5ci+eA2xGWUzo6N3cyUkRxFDQLqBUJBfotz2tIb+DocoEMQo8BC5pad4ZRjuCb8G/4CaYmO+TI+e3gUv6EWNvi+r3U9BGoDc459DrzFwy07F5L8TuTniyw5KE5Vbmgv7GyJqCxHQnCMucXgDugrgkK+eFEkZE5kwJmSjdckfYDwar8pMVVEkoSv+nYAYYDvqAIcBqF4Sea5LVVx5hZe2RNeAw8/UPju6IQVgHKoH+IYiOppnpJ3S4tbPh7MS5V6mm8T8mNgnLM6yxozIMx2kbm8YJM6qvcLTXxpljnV029owTzjnZZuPMoc45Br7exp5Vwjirw9kJG4eOdL52ZCe6GVbIYUBu8EnTkehRFktaVVjMUOUbHL4pNllWjvxX9mVZPeiMU9pW4GhCJX6Nn8m6eBLpI4gPQF2Zk5Yt4/JEEorihGA6gVNlSlp2VPImobKIoNqCGiCXniu6g6HxlZVpIBoC/BxcBXFI/oj7AVTKQ0ogy8ApgcrjpTz/ngYmFX+C/EbQN2Cyek4JvidYBF4BFcn8HwdaV09mJSIlmUZVtvA3lFB31m298XAWQcKG0oQTHvDE3aUVTnzIE3aYVjjhAU/cXYurcBvXQ8wmQl6nyvvg4GvVthpfI9Gb7+uXl3u/8yfDFR+v8poE3Re4fBn3XeVl6YuIZOXx0DV95HMRu+l6DvePHVGxgX7FLHuO64TtI0lIs8UlrH1dWmrQmawTkFnrkxtD2/vix8eP0zyPsnyVJ9TIyu1fzf/nGvzGvS31xlecbyKjhOr/uO1xFAWdTIu7pNOEdZdDc+hLK9wcqqjLIa2wbnSaQ19a4eZQRV0OcXda8tXbSZ0Dx33yBUBK6QhoRuA/Om5HY4SRRjAAAAAASUVORK5CYII=";
import LevelBar from './levelBar';
import styleConfig from '../../components/styleConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../styles';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
var RupeeImage = 'data:image/png;base64,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';
var UserProfile = React.createClass({
    getInitialState: function(){
      return {
        user:null,
        Circlefill:0,

      };
      this.fetchUserData = this.fetchUserData.bind(this);
    },
    componentWillMount:function() {

    },
    componentDidMount:function() {
    },

    social_thumb:function(){
      if (this.props.user.first_name != '') {
        return(
          <Image  style={styles.UserImage} source={{uri:this.props.user.social_thumb}}></Image>
        )
      };
      return(
        <View>
          <Image style={styles.UserImage} source={require('../../images/profile_placeholder.jpg')}></Image>
        </View>
      )
    },

    fullname:function(){
      if (this.props.user != null) {
        return(
        <View>
          <Text style={styles.profilename}>{this.props.user.first_name} {this.props.user.last_name}</Text>
        </View>
        )
      };
      return(
        <Text></Text>
      )
    },
    TotalAmount:function(){

      if (this.props.userTotalAmount != null) {
        return(
           <Text style={styles.totalcontentText}>{parseFloat(this.props.userTotalAmount).toFixed(0)}</Text>
          )
      }else{
        return(
             <ActivityIndicatorIOS
                style={{height: 10,marginTop:5}}
                size="small"
              />
          )
      }
    },

    TotalRuns:function(){
      if (this.props.RunCount != null) {
        return(
          <Text style={styles.totalcontentText}>{this.props.RunCount}</Text>
        )
      }else{
        return(
            <ActivityIndicatorIOS
                style={{height: 10,marginTop:5}}
                size="small"
              />
        )
      }
    },
    fetchUserData:function(){
      this.props.fetchUserData();
    },
    navigateToProfileForm() {
      this.props.navigator.push({
      title: 'Gps',
      id:'profileform',
      index: 0,
      passProps:{fetchRunData:this.onFetch,user:this.props.user,getUserData:this.props.getUserData,getRunCount:this.getRunCount,fetchAmount:this.fetchAmount},
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      navigator: this.props.navigator,
      });
    },

      renderEditProfileIcon(){
        if (this.props.user != null) {

        return(
           <TouchableOpacity style={{height:70,width:70,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.navigateToProfileForm()} >
             <Icon style={{fontSize:22, height:40,width:40,top:18, color:'white'}} name={'pencil'} ></Icon>
            </TouchableOpacity>
          );
         }else{
          return;
         }
      },

    render: function() {
      if (this.props.user != null) {
        return (
      <View>

          <View style={commonStyles.Navbar}>
              <Text style={commonStyles.menuTitle}>Profile</Text>
              <View style={{position:'absolute',right:0,top:0,}}>{this.renderEditProfileIcon()}</View>
          </View>

        <View>
          <View style={styles.userimagwrap}>
          <View style={styles.UserImageWrap}>{this.social_thumb()}</View>
          <View style={styles.barWrap}>
          <LevelBar totalKm={this.props.totalKm} userName={this.props.user.first_name} lastname={this.props.user.last_name} widthBar={deviceWidth-150} totalKm={this.props.totalKm}/>
          </View>
          </View>
        </View>
        </View>
        );
      };
    }
});


var styles = StyleSheet.create({
  loginContainer: {
    marginTop: 150,
    paddingTop:10,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barWrap:{
  width:deviceWidth-120,
  justifyContent: 'center',
  },
  bottomBump: {
    marginBottom: 15,
  },
  UserImageWrap:{
   flex:1,
   justifyContent: 'center',
   alignItems: 'center',
  },
  UserImage:{
    width:70,
    height:70,
    borderRadius:35,
  },
  userimagwrap:{
    flexDirection:'row',
    height:80,
    width:deviceWidth,
    top:10,
  },
  userContentwrap:{
    width:deviceWidth,
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 61,
  },
  NameWraper:{
    flexDirection: 'row',
    justifyContent:'center',
  },
  profilename:{
    marginTop:15,
    marginLeft:15,
    color:styleConfig.greyish_brown_two,
    fontSize:18,
    fontWeight:'600',
    fontFamily:styleConfig.FontFamily,
  },
  totalcontentText:{
    left:0,
    fontSize:16,
    fontWeight:'500',
    color:styleConfig.greyish_brown_two,
    fontFamily:styleConfig.FontFamily,
  },
  totalcontentTextSec:{
    fontSize:12,
    fontWeight:'500',
    color:styleConfig.greyish_brown_two,
    fontFamily:styleConfig.FontFamily,
  },
});

module.exports = UserProfile;