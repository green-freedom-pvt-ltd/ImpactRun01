import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  AlertIOS,
  VibrationIOS,
  NetInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import LodingScreen from '../../components/lodingScreen';
import API from '../../components/LeaderBoardApi';
import GiftedListView from 'react-native-gifted-listview';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class LeaderboardData extends Component {
  
      constructor(props) {
        super(props);
        this.state = {
          runCount: 0
        };
        this.onFetch = this.onFetch.bind(this);
      }
     

      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
        })
      }

      componentDidMount() {
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
            };  
          }
        );
      }
      
      onFetch(page = 1, callback, options) {
        let rowArray = [];
        var user = this.props.user;
        Promise.resolve(API.getAllUser(page,user))
        .then((response) => {
          this.setState({
            runCount: response.count
          });
          response.results.map((object) => {
            rowArray.push(object);
          });
        }).then(() => {
          if (page === Math.round((this.state.runCount/20))) {
            callback(rowArray, {
              allLoaded: true,
            });
          } else {
            callback(rowArray);
          }
        });   
      }

      renderRow(rowData, index,rowID){
        rowID++
        let colors = ['#ffcd4d', '#ffcd4d', '#ffcd4d', 'white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white'];
        let style = [
          styles.row, 
          {'backgroundColor': colors[rowID % colors.length-1],
            'alignItems': 'center',
            'flexDirection':'row',
            'borderRadius':12.5,
            'right':5,
            'justifyContent': 'center',
            'alignItems': 'center',
            'height':25,
            'width':25,
          }
        ];
        return (
          <View  style={styles.cardLeaderBoard}>
            <View style={style}>
              <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:15,color:'#4a4a4a',}}>{rowID}</Text>
            </View>
            <Image style={styles.thumb} source={{uri:rowData.social_thumb}}></Image>
            <View>
              <Text style={styles.txt}>{rowData.first_name} {rowData.last_name}</Text>
            </View>
            <Text style={styles.txtSec}>{parseFloat(rowData.last_week_distance.last_week_distance).toFixed(2)} Km</Text>
          </View>
        );
      }

      renderLoadingView() {
        return (
          <View style={{height:deviceHeight}}>
            <LodingScreen style={{height:deviceHeight-50}}/>
          </View>
        );
      }
    
      render() {
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
            <View style={{height:deviceHeight-95,width:deviceWidth}}>
               <GiftedListView
                rowView={this.renderRow}
                onFetch={this.onFetch}
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
                renderSeparator = {(sectionId, rowId) => <View key={rowId} style={styles.separator}/> }/>
             </View>
          </View> 
        );
      }
}

const styles = StyleSheet.create({
  thumb: {
    height:50,
    width:50,
    borderRadius:25,
    backgroundColor:'#5bb75b',
    marginBottom: 5,
  },
  separator: {
      height: 1,
      backgroundColor: '#CCC'
    },
  cardLeaderBoard:{
    backgroundColor:'white',
    alignItems: 'center',
    flexDirection:'row',
    padding:10,
    marginTop:5,
    left:5,
    width:deviceWidth-10,
  },
  txt: {
    width:deviceWidth-200,
    color:'#4a4a4a',
    fontSize: 14,
    fontWeight:'400',
    textAlign: 'left',
    marginLeft:10,
    fontFamily: 'Montserrat-Regular',
  },
  txtSec:{
   color:'#4a4a4a',
   fontSize:14,
   fontWeight:'400',
   position:'absolute',
   right:15,
   top:30,
   fontFamily: 'Montserrat-Regular',
  },


});

export default LeaderboardData;