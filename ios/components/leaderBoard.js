
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
var deviceHeight = Dimensions.get('window').height;
import LeaderBoard from './leaderBoardData';
class Leaderboard extends Component {

		  render() {
		    return (
          <View>
            <View style={commonStyles.Navbar}>
              <Text style={commonStyles.menuTitle}>Leaderboard</Text>
            </View>
            <View style={{justifyContent: 'center',alignItems: 'center', width:deviceWidth,height:40,backgroundColor:'#00b9ff'}}>
              <Text style={{fontFamily: 'Montserrat-Regular',fontSize:20,color:'white'}}>Most kms this week</Text>
            </View>
            <LeaderBoard/>
          </View>
			  );
	    }
}
export default Leaderboard;