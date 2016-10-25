
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
            <View style={{justifyContent: 'center',alignItems: 'center', width:deviceWidth,height:40,backgroundColor:'#00b9ff'}}>
              <Text style={{fontFamily: 'Montserrat-Regular',fontSize:20,color:'white'}}>Most Kms Last 7 Days</Text>
            </View>
            <View>{
              this.renderLeaderboadScreen()
            }</View>
          </View>
			  );
	    }
}
export default Leaderboard;