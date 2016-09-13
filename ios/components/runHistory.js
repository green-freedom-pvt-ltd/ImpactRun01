
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
} from 'react-native';

import GiftedListView from 'react-native-gifted-listview';
import API from '../../components/RunPaginationApi';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class RunHistroy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runCount: 0
    };
    this.onFetch = this.onFetch.bind(this);
  }
 
  onFetch(page = 1, callback, options) {
    let rowArray = [];
    Promise.resolve(API.getAllRuns(page))
    .then((response) => {
      console.log('responseData',JSON.stringify(response.count));
      this.setState({
        runCount: response.count
      });
      response.results.map((object) => {
        rowArray.push(object);
      });
    }).then(() => {
      if (page === Math.round(this.state.runCount/5)) {
        callback(rowArray, {
          allLoaded: true,
        });
      } else {
        callback(rowArray);
      }
    });
    setTimeout(() => {
    }, 1000);
  }

  renderRunsRow(rowData) {
    return (
      <TouchableHighlight
        underlayColor="#dddddd"
      >
        <View style={styles.container}>
        <View  style={styles.btnbegin} text={'BEGIN RUN'} >
           <Image style={{height:40,width:60}} source={ require('../../images/RunImage.png')}></Image>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{rowData.cause_run_title}</Text>
          <View style={styles.runDetail}>
          <Text style={styles.year}>{rowData.distance} Km</Text>
          <Text style={styles.year}>{rowData.run_amount} Rs</Text>
          <Text style={styles.year}>{rowData.run_duration}</Text>
          </View>
        </View>
      </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
            <GiftedListView
              rowView={this.renderRunsRow}
              onFetch={this.onFetch}
              firstLoader={true} // display a loader for the first fetching
              pagination={true} // enable infinite scrolling using touch to load more
              refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
              withSections={false} // enable sections
              customStyles={{
                paginationView: {
                  backgroundColor: '#eee',
                },
              }}

              refreshableTintColor="blue"
            />
        
    );
  }
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderRadius:3,
    margin:5,
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
    fontSize: 18,
    marginBottom: 8,
    marginLeft:20,
    color:'#673AB7',
    fontWeight:'600',
    backgroundColor:'transparent',
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
  year: {
    height:20,
    width:deviceWidth/4,
    justifyContent: 'center',
    alignItems: 'center',
    color:'#673AB7',
    fontWeight:'700',
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
    backgroundColor:'#673ab7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:80,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
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