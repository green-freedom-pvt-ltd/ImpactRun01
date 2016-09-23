
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  ScrollView,
  AppRegistry,
  Dimensions,
  ActivityIndicatorIOS
} from 'react-native';

import GiftedListView from 'react-native-gifted-listview';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class RunHistroy extends Component {

      renderRunsRow(rowData) {
        var RunAmount=parseFloat(rowData.run_amount).toFixed(0);
        var RunDistance = parseFloat(rowData.distance).toFixed(1);
        var RunDate = rowData.start_time;
        var day = RunDate.split("-")[2];
        var time = rowData.run_duration;
        var minutes = time.split(":")[1];
        return (
          <TouchableHighlight underlayColor="#dddddd">
            <View style={styles.container}>
              <View  style={styles.btnbegin}>
                <Image style={{height:40,width:60}} source={ require('../../images/RunImage.png')}></Image>
              </View>
              <View style={styles.rightContainer}>
                <Text style={styles.title}>{rowData.cause_run_title}</Text>
                 <Text style={styles.StartTime}>{RunDate}</Text>
                <View style={styles.runDetail}>
                  <Text style={styles.runContent}>{RunDistance} Km</Text>
                  <Text style={styles.runContent}>{RunAmount} Rs</Text>
                  <Text style={styles.runContent}>{minutes} mins</Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        );
      }
      NotLoginView(){
        if(this.props.user && Object.keys(this.props.user).length === 0 ){
        }else{
          return (
            <View>
              <Text style={{fontFamily: 'Montserrat-Regular',}}>Please Login To See your Run</Text>
            </View>
          ) 
        }
      }
      render() {
        var fetchingRun = this.props.fetchRunData;
        var user = this.props.user || 0;
        if (Object.keys(user).length) {
          return (
            <GiftedListView
              rowView={this.renderRunsRow}
              onFetch={fetchingRun}
              firstLoader={true} // display a loader for the first fetching
              pagination={true} // enable infinite scrolling using touch to load more
              refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
              withSections={false} // enable sections
              customStyles={{
                paginationView: {
                  backgroundColor: '#f4f4f4',
                },
              }}
              refreshableTintColor="#00b9ff"
            />
          )
        }else {
            return (
            <View style={{paddingTop:10,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
               {this.NotLoginView()}
            </View>    
          )
          
         };
        } 

    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius:5,
    margin:5,
    marginBottom:0,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      height: 3,
    },
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    width:deviceWidth-100,
    fontSize: 16,
    marginLeft:3,
    color:'black',
    fontWeight:'600',
    backgroundColor:'transparent',
    fontFamily: 'Montserrat-Regular',
  },
   StartTime: {
    width:deviceWidth-100,
    fontSize: 14,
    marginLeft:3,
    color:'black',
    fontWeight:'300',
    backgroundColor:'transparent',
    fontFamily: 'Montserrat-Regular',
  },
  runDetail:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height:30,
    width:deviceWidth-150,
    right:0,
    marginLeft:40,
  },
  runContent: {
    height:20,
    width:deviceWidth/4,
    justifyContent: 'center',
    alignItems: 'center',
    color:'black',
    fontWeight:'400',
    fontFamily: 'Montserrat-Regular',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 10,
    backgroundColor: 'white',
    paddingBottom:60,
  },
  btnbegin:{
    margin:10,
    width:50,
    height:50,
    backgroundColor:'#00b9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:80,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      height: 3,
    },
  },
  ListViewPage:{
    height:deviceHeight,
    width:deviceWidth,
  },
});

export default RunHistroy;