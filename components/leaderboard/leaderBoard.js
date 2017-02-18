
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
    AlertIOS,
  } from 'react-native';
  import ImpactLeagueCode from '../ImpactLeague/ImpactLeagueCode'
  import ScrollableTabView, { ScrollableTabBarLeaderBoard, } from 'react-native-scrollable-tab-view';
  import Icon from 'react-native-vector-icons/FontAwesome';
  import commonStyles from '../styles';
  var deviceWidth = Dimensions.get('window').width;
  import LoginBtn from '../login/LoginBtns';
  var deviceHeight = Dimensions.get('window').height;
  import LeaderBoard from './leaderBoardData';
 var base64Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABICAYAAACqT5alAAAABGdBTUEAALGPC/xhBQAABOFJREFUeAHtmlmIFEcYx2dUxDt4YTSieCAqHkgkJARU9EFFgygeICIi+qCgQRHFh4CQhzwsgSiJeGD0yQNR8SDg8WBWvFZNRFkkEW/BCKsuisQcuvl9Zqbt6emq6aquaWd2+4P/dPVX31lfV3X1dGcyhtTU1HQdVAotNgw/08pUodrl04SrvYKl4k8rXGqEqr0/y3K7hSQ+NEhkIrKdDeTLKforxu8bONguCd9CYaCBUjWLrkzncDWXL0rs76PCLwhsCtgcJUDXMu8j4Z3ZbPY4iawHL10nVMpeG43AVvoehPSvgNcrhB+VJXYzJP2cBXMPzSVRFUPkDsCTlTpIC2AMDTLfnssqDcLoszAFBOM8PNT6bWJrbJhjA95Cv718G/3DChsrkr6k5Z7vEVW+zMkvHiOBhlzSTQo/WQU/CvsZQrvBY/AEPM0df+YYpNkwhoFuoHsOYzlOBbakKuQbSbgBDAqx3DOEF5W1ieptiCKM3B3kBB5xOUrAjcB2R9fDM1bYaBDDjwp53lnoHPZ69Y2FBD1AL6LtXU2vVbL47YDuaIX1R5LwNUXnEpRtV2NJ9iL6RoOGfGvwPbo1ipiisFch1D5E8DW8+gwOPgYqOhRURNBklf4T+XlBG2HnyHUGPwETKlilURwB/lIYqPX8IvCbQkjYx4D3NEXbJGHRfwPGec4UDWTEjyl5CaM4FzRoDCwT1/mNx1e09ylimQa/HkOy6l4CXRRyKras9vdUnT7+Q187avMT4uqK8BdgkkZJFsUdXj9K8phYC8pBUZKVqTW/HM5zNmflk5VFS7Z5ci+eA2xGWUzo6N3cyUkRxFDQLqBUJBfotz2tIb+DocoEMQo8BC5pad4ZRjuCb8G/4CaYmO+TI+e3gUv6EWNvi+r3U9BGoDc459DrzFwy07F5L8TuTniyw5KE5Vbmgv7GyJqCxHQnCMucXgDugrgkK+eFEkZE5kwJmSjdckfYDwar8pMVVEkoSv+nYAYYDvqAIcBqF4Sea5LVVx5hZe2RNeAw8/UPju6IQVgHKoH+IYiOppnpJ3S4tbPh7MS5V6mm8T8mNgnLM6yxozIMx2kbm8YJM6qvcLTXxpljnV029owTzjnZZuPMoc45Br7exp5Vwjirw9kJG4eOdL52ZCe6GVbIYUBu8EnTkehRFktaVVjMUOUbHL4pNllWjvxX9mVZPeiMU9pW4GhCJX6Nn8m6eBLpI4gPQF2Zk5Yt4/JEEorihGA6gVNlSlp2VPImobKIoNqCGiCXniu6g6HxlZVpIBoC/BxcBXFI/oj7AVTKQ0ogy8ApgcrjpTz/ngYmFX+C/EbQN2Cyek4JvidYBF4BFcn8HwdaV09mJSIlmUZVtvA3lFB31m298XAWQcKG0oQTHvDE3aUVTnzIE3aYVjjhAU/cXYurcBvXQ8wmQl6nyvvg4GvVthpfI9Gb7+uXl3u/8yfDFR+v8poE3Re4fBn3XeVl6YuIZOXx0DV95HMRu+l6DvePHVGxgX7FLHuO64TtI0lIs8UlrH1dWmrQmawTkFnrkxtD2/vix8eP0zyPsnyVJ9TIyu1fzf/nGvzGvS31xlecbyKjhOr/uO1xFAWdTIu7pNOEdZdDc+hLK9wcqqjLIa2wbnSaQ19a4eZQRV0OcXda8tXbSZ0Dx33yBUBK6QhoRuA/Om5HY4SRRjAAAAAASUVORK5CYII=";
  class Leaderboard extends Component {
     

      constructor(props) {
        super(props);
        this.state = {
          RouteImpactleague:'',
        };
      }


      componentDidMount() {
        this.props.getUserData();
      }

      navigateToImpactLeague(){
         if (this.props.user != null) {
         if (this.props.user.team_code === 0) {
          this.setState({
            RouteImpactleague:'impactleaguecode'
          })
         }else{
          this.setState({
            RouteImpactleague:'impactleaguehome'
          })

         }
         };
        this.props.navigator.push({
        id:this.state.RouteImpactleague,
        navigator: this.props.navigator,
        passProps:{user:this.props.user, getUserData:this.props.getUserData}
        })
      }

      renderLeaderboadScreen(){
        if (this.props.user != null) {
         return(
          <LeaderBoard user={this.props.user} />
          )
        }else{
        return(
          <View style={{justifyContent: 'center', alignItems: 'center', width:deviceWidth,height:deviceHeight,paddingTop:(deviceHeight/2)-150,}}>
          <Text style={{fontFamily: 'Montserrat-Regular',bottom:50,fontSize:16,}}>Please Login To See Leaderboard</Text>
          <LoginBtn getUserData={this.props.getUserData}/>
          </View>
          )
        }
      }

      renderImpactLeagueIcon(){
        if (this.props.user != null) {
        return(
           <TouchableOpacity style={{height:70,width:70,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.navigateToImpactLeague()} >
             <Image style={{height:20,width:20,top:5}} source={{uri: base64Icon, scale:3}} ></Image>
            </TouchableOpacity>
          );
         }else{
          return;
         }
      }

		  render() {
		    return (
          <View>
            <View style={commonStyles.Navbar}>
              <Text style={commonStyles.menuTitle}>Leaderboard</Text>
              <View style={{position:'absolute',right:0,top:0,}}>{this.renderImpactLeagueIcon()}</View>
            </View>
              <View >{this.renderLeaderboadScreen()}</View>
          </View>
			  );
	    }
}
var styles = StyleSheet.create({
  scrollTabWrapper:{
    position:'relative',
    width:deviceWidth,
    backgroundColor:'white',
    height:deviceHeight,
    top:0,
  },
  })
export default Leaderboard;