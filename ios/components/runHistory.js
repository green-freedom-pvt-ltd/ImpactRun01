
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

import RunHistroyListView from '../../components/ListviewRunHistory';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import PTRView from 'react-native-pull-to-refresh';

class RunHistroy extends Component {
   
      renderRunsRow(rowData) {
        var RunAmount=parseFloat(rowData.run_amount).toFixed(0);
        var RunDistance = parseFloat(rowData.distance).toFixed(1);
        var RunDate = rowData.start_time;
        var day = RunDate.split("-")[2];
        var time = rowData.run_duration;
        var minutes = time.split(":")[1];
        var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var MyRunMonth = monthShortNames[RunDate.split("-")[1][0]+ RunDate.split("-")[1][1]-1]; 
        var day = RunDate.split("-")[2][0]+RunDate.split("-")[2][1]+'  '+MyRunMonth+'  ' + RunDate.split("-")[0];
        console.log('myRunDay2',MyRunMonth);
        return (

          <TouchableHighlight underlayColor="#dddddd">
            <View style={styles.container}>
              <View style={styles.rightContainer}>          
              <View style={styles.runDetail}>
                <View style={styles.cause_run_titleWrap}>
                 <Text style={styles.StartTime}>{day}</Text>
                  <Text style={styles.title}>{rowData.cause_run_title}</Text>
                </View>
                <View style={{flexDirection:'row',flex:1}}>
                  <View style={styles.runContent}>
                    <Text style={styles.runContentText}>{RunDistance} Km</Text>
                  </View>
                  <View style={styles.runContent}>
                    <Text style={styles.runContentText}>{RunAmount} Rs</Text>
                  </View>
                  <View style={styles.runContent}> 
                    <Text style={styles.runContentText}>{minutes} mins</Text>
                  </View>
               </View>
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
      render(rowData) {
        var fetchingRun = this.props.fetchRunData;
        var user = this.props.user || 0;
        if (Object.keys(user).length) {
          return (
            <RunHistroyListView
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
              mydata={rowData}
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
    width:deviceWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding:10,
    paddingTop:0,
    paddingBottom:0,
    marginBottom:5,
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
    fontSize: 16,
    marginLeft:3,
    color:'#4a4a4a',
    fontWeight:'400',
    backgroundColor:'transparent',
    fontFamily: 'Montserrat-Regular',
  },
   StartTime: {
    fontSize: 14,
    marginLeft:4,
    color:'#6a6a6a',
    fontWeight:'400',
    backgroundColor:'transparent',
    fontFamily: 'Montserrat-Regular',
  },
  runDetail:{
    flexDirection: 'column',
    width:deviceWidth,
    padding:5,
    paddingRight:0
  },
  runContent: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding:5,
  },
  runContentText: {
    color:'#4a4a4a',
    fontWeight:'500',
    fontSize:16,
    left:-1,
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
  ListViewPage:{
    height:deviceHeight,
    width:deviceWidth,
  },
  cause_run_titleWrap:{
    flex:2,
  },
});

export default RunHistroy;