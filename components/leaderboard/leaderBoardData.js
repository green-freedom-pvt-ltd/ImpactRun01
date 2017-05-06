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
import LodingScreen from '../LodingScreen';
import API from './LeaderBoardApi';
import GiftedListView from 'react-native-gifted-listview';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class LeaderboardData extends Component {
  
      constructor(props) {
        super(props);
        this.state = {
          responce:null,
          userCount: 0,
          myindex:null,
        };
        this.onFetch = this.onFetch.bind(this);
        this.renderRow = this.renderRow.bind(this);
      }
     
     
      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
        })
      }

      componentDidMount() {
      this.onFetch();
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {

            };  
          }
        );
      }
      
      onFetch(page = 1, callback, options) {
        console.log('fetched');
        let rowArray = [];
        var user = this.props.user;
        Promise.resolve(API.getAllUser(page,user))
        .then((response) => {
          this.setState({
            userCount: response.count,
            responce:response,
          });
          console.log('thisresponce',this.state.responce);
          response.results.map((object) => {
            rowArray.push(object);
          });
          })
        .catch((error) => {
         
            AlertIOS.alert('No internet connection');
           
        })
        .then(() => {
          if (page === Math.round((this.state.userCount))) {
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
        if (this.props.user.user_id === rowData.user_id) {
          this.setState({
          myindex:(this.state.userCount <= 50)?rowData.ranking:50,
          
        })
          this.setState({
            rowData:rowData,
          })
          console.log('ranking',this.state.myindex);
        };
        
        console.log('renderrow',rowData);
        var myflex = (this.props.user.user_id === rowData.user_id)?1:0;
        // console.log('rodatacount',this.state.userCount,this.state.responce);
        var backgroundcolor=(this.props.user.user_id === rowData.user_id)?'#ffcd4d':"white";
        var myposition = (this.props.user.user_id === rowData.user_id)?'absolute':'relative';
        var mytop = (this.props.user.user_id === rowData.user_id)?-100:0;
        var visiblity = (this.props.user.user_id === rowData.user_id)?0:1;
        let colors = ['#ffcd4d', '#ffcd4d', '#ffcd4d', 'white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white','white'];
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
        console.log('reowdataleaderboard',rowData);
        return (
          <View  style={[styles.cardLeaderBoard,{backgroundColor:backgroundcolor}]}>
           <View style={styles.flexbox1}>
            <View style={style}>
              <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:15,color:'#4a4a4a',}}>{rowData.ranking}</Text>
            </View>
           </View>
            <View style={styles.flexbox}>
            <Image style={styles.thumb} source={{uri:rowData.social_thumb}}></Image>
            </View>
            <View style={styles.flexbox2}>
            <Text style={styles.txt}>{rowData.first_name} {rowData.last_name}</Text>
            </View >
            <View style={styles.flexbox3}>
            <Text style={styles.txtSec}>{parseFloat(rowData.last_week_distance.last_week_distance).toFixed(2)} Km</Text>
            </View>
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


      // myRow(){
      //  var mydata = this.state.responce.results;
      //   return(
      //       <View  style={styles.mycardLeaderBoard}>
      //         <View style={styles.flexbox1}>
      //         <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:15,color:'#4a4a4a',}}>{mydata.ranking}</Text>
      //         </View>
      //         <View style={styles.flexbox}>
      //         <Image style={styles.thumb} source={{uri:mydata.social_thumb}}></Image>
      //         </View>
      //         <View style={styles.flexbox2}>
      //         <Text style={styles.txt}>{mydata.first_name} {mydata.last_name}</Text>
      //         </View>
      //         <View style={styles.flexbox3}>
      //         <Text style={styles.txtSec2}>{parseFloat(mydata.last_week_distance.last_week_distance).toFixed(2)} Km</Text>
      //         </View>
      //       </View>
      //       )

      // }

      render() {
         if (this.state.responce != null) {
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
            <View style={{backgroundColor:'white',height:deviceHeight-100,width:deviceWidth,paddingBottom:15,}}>
               <GiftedListView
               style={styles.container}
                rowView={this.renderRow}
                onFetch={this.onFetch}
                firstLoader={true} // display a loader for the first fetching
                pagination={false} // enable infinite scrolling using touch to load more
                refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                withSections={false} // enable sections
                customStyles={{
                  paginationView: {
                    backgroundColor: '#f4f4f4',
                  },
                }}
                refreshableTintColor="#00b9ff"
                renderSeparator = {(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}/>
             </View>
            
          </View> 
        );
        }else{
          return this.renderLoadingView();
        }
      }
}

const styles = StyleSheet.create({

  thumb: {
    height:50,
    width:50,
    borderRadius:25,
    backgroundColor:'#ffcd4d',
    borderColor:'#ccc',
    borderWidth:2,
  },
  separator: {
      height: 1,
      backgroundColor: '#CCC'
    },
  cardLeaderBoard:{
    alignItems: 'center',
    flexDirection:'row',
    padding:10,
    marginTop:5,
    left:5,
    width:deviceWidth,
    marginBottom:5,
    borderRadius:5,
  },
  txt: {
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
   fontFamily: 'Montserrat-Regular',
  },
  txtSec2:{
   color:'#4a4a4a',
   fontSize:14,
   fontWeight:'400',
   fontFamily: 'Montserrat-Regular',
  },
  mycardLeaderBoard:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    height:60,
    width:deviceWidth,
    top:-20,
    backgroundColor:'#ffcd4d'
  },
  flexbox:{
    height:50,
    width:50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexbox3:{
    height:50,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  flexbox2:{
    height:50,
    width:50,
    flex:1,
    alignItems: 'flex-start',
    justifyContent: 'center',

  },
  flexbox1:{
    height:50,
    width:40,
    alignItems: 'center',
    justifyContent: 'center',
  }


});

export default LeaderboardData;
