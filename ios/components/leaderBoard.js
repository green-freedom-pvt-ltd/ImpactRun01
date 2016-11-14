
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
  import FaqData from './faqData';
  import ImpactLeagueCode from '../../components/ImpactLeagueCode'
  import ScrollableTabView, { ScrollableTabBarLeaderBoard, } from 'react-native-scrollable-tab-view';
  import Icon from 'react-native-vector-icons/Ionicons';
  import commonStyles from '../../components/styles';
  var deviceWidth = Dimensions.get('window').width;
  import LoginBtn from '../../components/LoginBtns';
  var deviceHeight = Dimensions.get('window').height;
  import LeaderBoard from './leaderBoardData';

class Leaderboard extends Component {
      

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
		  render() {
		    return (
          <View>
            <View style={commonStyles.Navbar}>
              <Text style={commonStyles.menuTitle}>Leaderboard</Text>
            </View>
             <ScrollableTabView
              style={styles.scrollTabWrapper}
              initialPage={1}
              vertical={false}
              renderTabBar={() => <ScrollableTabBarLeaderBoard />}>
              <View tabLabel='All'>{this.renderLeaderboadScreen()}</View>
              <View tabLabel='Team'>
               <ImpactLeagueCode/>
              </View>
              </ScrollableTabView>
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