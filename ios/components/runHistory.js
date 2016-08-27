
'use strict';

import React, { Component } from 'react';

 import{
  ListView,
  StyleSheet,
  Text,
  View,
   Image,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  AlertIOS

} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class RunHistroy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

   componentDidMount() {
     AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
        stores.map((result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
            this.setState({
              Storeduserdata:val
            })
            console.log("UserDatakey2 :" + key, val);

            if (this.state.Storeduserdata != null) {
               this.fetchData();
             }else{
              AlertIOS.alert('you are not Loged in');
             }
            
        });

    });
     
   }
  fetchData() {
      var userdata = this.state.Storeduserdata;
      var UserDataParsed = JSON.parse(userdata);
      var user_id =JSON.stringify(UserDataParsed.user_id);
      var token = JSON.stringify(UserDataParsed.auth_token);
      var tokenparse = JSON.parse(token);
      console.log('myRunData'+userdata);
      var tokenparse = JSON.parse(token);
        fetch("http://139.59.243.245/api/runs/?page=" + 1, {
        method: "GET",
         headers: {  
            'Authorization':"Bearer "+tokenparse,
          }
        })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.results),
          loaded: true,
          myPage:responseData.count,
          next:responseData.next,

        });
        console.log('daatarunHistroy'+JSON.stringify(this.state.dataSource));
                    console.log('myHistroryRunCount'+ this.state.myPage);
                  
      })
      .done();
    }

  render(data) {
   
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
     
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
      />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading runs...
        </Text>
      </View>
    );
  }

  renderMovie(data) {
    var data = data;
    console.log('mysecrun5'+data.cause_run_title);
    return (
      <View style={styles.container}>
        
          <TouchableOpacity  style={styles.btnbegin} text={'BEGIN RUN'} >
             <Image style={{height:40,width:60}} source={ require('../../images/RunImage.png')}></Image>
          </TouchableOpacity>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{data.cause_run_title}</Text>
          <View style={styles.runDetail}>
          <Text style={styles.year}>{data.distance}</Text>
          <Text style={styles.year}>{data.run_amount}</Text>
          <Text style={styles.year}>{data.run_duration}</Text>
          </View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderRadius:3,
    margin:5,
    shadowColor: '#000000',
      shadowOpacity: 0.8,
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
      backgroundColor:'#d667cd',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:80,
      shadowColor: '#000000',
      shadowOpacity: 0.8,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
      },
    }
});

export default RunHistroy;