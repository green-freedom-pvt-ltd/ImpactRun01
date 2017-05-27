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
    RefreshControl,
    AsyncStorage,
  } from 'react-native';
  import Icon from 'react-native-vector-icons/Ionicons';
  import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
  import LodingScreen from '../LodingScreen';
  import apis from '../apis';
  import BackgroundFetch from "react-native-background-fetch";
  import styleConfig from '../styleConfig'
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class LeaderboardData extends Component {
  
      constructor(props) {
        super(props);
        this.fetchLeaderBoardLocally();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          LeaderBoard: ds.cloneWithRows([]),
          responce:null,
          userCount: 0,
          loaded:false,
          myindex:null,
          refreshing:false,
          downrefresh:true,
        };
        this.renderRow = this.renderRow.bind(this);
      }
     
     
      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
        })
      }

      
      fetchLeaderBoardLocally(){
        AsyncStorage.getItem('leaderBoard', (err, result) => { 
        var jsonData = JSON.parse(result);
        console.log('jsonData',jsonData);
        if (result != null || undefined) {
          this.setState({
            LeaderBoard: this.state.LeaderBoard.cloneWithRows(jsonData.results),
            loaded:true,
          })        
        }else{
         this.renderLoadingView()
        }
        });
      }

      componentDidMount() {  
        setTimeout(() => {this.setState({downrefresh: false})}, 1000)
      
      }
      
      fetchDataIfInternet(){
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
              this.fetchLeaderBoard();
            }else{
              return;
            }  
          }
        );
      }

      fetchLeaderBoard() {
       AsyncStorage.removeItem('leaderBoard',(err) => {
       });
        var token = this.props.user.auth_token;
        var url = apis.leaderBoardapi;
        fetch(url,{
          method: "GET",
          headers: {  
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
          }
        })
        .then( response => response.json() )
        .then( jsonData => {
          this.setState({
            LeaderBoard: this.state.LeaderBoard.cloneWithRows(jsonData.results),
            loaded: true,
            refreshing:false,
          });
          let leaderBoard = jsonData;
          AsyncStorage.setItem('leaderBoard',JSON.stringify(leaderBoard));
          AsyncStorage.getItem('leaderBoard', (err, result) => {   
          });  
          
        })
        .catch( error => console.log('Error fetching: ' + error) );
      }


      _onRefresh() {
        this.setState({refreshing: true});
        this.fetchLeaderBoard();
      }


      renderRow(rowData, index,rowID){
        rowID++       
        var myflex = (this.props.user.user_id === rowData.user_id)?1:0;
        // console.log('rodatacount',this.state.userCount,this.state.responce);
        var backgroundcolor=(this.props.user.user_id === rowData.user_id)?'#ffcd4d':"white";
        var myposition = (this.props.user.user_id === rowData.user_id)?'absolute':'relative';
        var mytop = (this.props.user.user_id === rowData.user_id)?-100:0;
        var visiblity = (this.props.user.user_id === rowData.user_id)?0:1;
        let style = [
          styles.row, 
          {
            'alignItems': 'center',
            'right':5,
            'justifyContent': 'center',
            'alignItems': 'center',
            'height':25,
            'width':25,
          }
        ];
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
          <View style={{top:-8,height:deviceHeight-150, width:deviceWidth,}}>
            <LodingScreen />
          </View>
        );
      }

      render() {
        if (this.state.loaded) {
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
            <View style={{backgroundColor:'white',height:deviceHeight-100,width:deviceWidth,paddingBottom:53}}>
            {this.swwipeDowntoRefress()}
               <ListView
                style={styles.container}
                renderRow={this.renderRow}
                refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />}
                dataSource={this.state.LeaderBoard}/>
             </View>
            
          </View> 
        );
      }else{
        return this.renderLoadingView();
      }
      }



      swwipeDowntoRefress(){
        if (this.state.downrefresh === true) {
          return(
            <View style={styles.swipedown}><Text style={styles.txt3}>Pull down to refresh</Text></View>
            )
        }else{
          return;
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
    width:deviceWidth,
    borderBottomWidth:1,
    borderColor:'#CCC',
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
  },
    swipedown:{
    height:30,
    width:deviceWidth,
    backgroundColor:styleConfig.bright_blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
    txt3: {
    color:'white',
    fontSize: 13,
    fontWeight:'400',
    fontFamily: 'Montserrat-Regular',
  },


});

export default LeaderboardData;
