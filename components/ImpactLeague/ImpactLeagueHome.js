
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
    ListView,
    AlertIOS,
    NetInfo,
    AsyncStorage,
    RefreshControl,
  } from 'react-native';
import TimeFormatter from 'minutes-seconds-milliseconds';
import apis from '../apis';
import commonStyles from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import GiftedListView from 'react-native-gifted-listview';
import LodingScreen from '../LodingScreen';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class ImpactLeague extends Component {
      
      constructor(props) {
        super(props);
        this.fetchDataLocally();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          LeaderBoardData: ds.cloneWithRows([]),
          loaded: false,
          refreshing: false,
        };
        this.renderRow = this.renderRow.bind(this);
        this.NavigateToDetail = this.NavigateToDetail.bind(this);
      }

      componentDidMount() { 
        this.fetchLeaderBoardDataIntervel = setInterval(()=>{
          this.getUserData();
         },(60000*60)*3)
        // this.props.getUserData();
      }
      
      fetchDataLocally(){
        AsyncStorage.multiGet(['UID234'], (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let val = store[i][1];
          let user = JSON.parse(val);
            this.setState({
              user:user,
            })
          AsyncStorage.getItem('teamleaderBoardData', (err, result) => {
            var boardData = JSON.parse(result);
            console.log('boardData',boardData);
            if (result != null || undefined) {
              this.setState({
                LeaderBoardData: this.state.LeaderBoardData.cloneWithRows(boardData.results),
                BannerData:boardData.results,
                leaguename:boardData.results[0].impactleague,
                loaded: true,
              })
            }else{
               this.getUserData();
               this.setState({
                leaguename:'Impact League'
               })
            }
          }); 
        }); 
        });
      }

      getUserData(){
        AsyncStorage.multiGet(['UID234'], (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
            let user = JSON.parse(val);
              this.setState({
                user:user,
              })
            NetInfo.isConnected.fetch().done(
              (isConnected) => { this.setState({isConnected}); 
                if (isConnected) {
                   this.fetchLeaderBoardData();
                };  
              }
            );
            console.log('myData',this.state.user);
            })
          })
        
      }

    
      fetchLeaderBoardData() {
         AsyncStorage.removeItem('teamleaderBoardData',(err) => {
          console.log(err,'itemremoved');
         });
        var token = this.state.user.auth_token;
        console.log('mytoken',token)
        var url = apis.ImpactLeagueTeamLeaderBoardApi;
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
            LeaderBoardData: this.state.LeaderBoardData.cloneWithRows(jsonData.results),
            loaded: true,
            refreshing:false,
            BannerData:jsonData.results,
          });
          let teamleaderBoardData = jsonData;
          AsyncStorage.setItem('teamleaderBoardData',JSON.stringify(teamleaderBoardData));
          AsyncStorage.getItem('teamleaderBoardData', (err, result) => {            
          });  
          console.log('data12345',jsonData);
        })
        .catch( error => console.log('Error fetching: ' + error) );
      }

      NavigateToleagueend(){
      this.props.navigator.push({
         title: 'leaderboard',
        id:'leaderboard',
      })
      }

  
      NavigateToDetail(rowData){
       this.props.navigator.push({
        title: 'impactleaguehome',
        id:'impactleagueleaderboard',
        passProps:{user:this.props.user, Team_id:rowData.id}
      })
      }

      goBack(){
        if (this.props.data == 'fromshare') {
          this.props.navigator.push({
          id:'tab',
          })
        }else{
          this.props.navigator.pop({})
        }
        
      }
      _onRefresh() {
        this.setState({refreshing: true});
        this.fetchLeaderBoardData();
      }

      renderRow(rowData,index,rowID){
        rowID++
        var me = this;
        console.log('user',me.state.user);
        var backgroundColor =(me.state.user.team_code === rowData.id)?'#ffcd4d':'#fff';
        return (
          <View style={{justifyContent: 'center',alignItems: 'center',}}>
            <TouchableOpacity onPress={()=>this.NavigateToDetail(rowData)} style={[styles.cardLeaderBoard,{backgroundColor:backgroundColor}]}>
              <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:17,color:'#4a4a4a',}}>{rowID}</Text>
              <Text style={styles.txt}>{rowData.team_name}</Text>
              <View style={{width:deviceWidth/2-20, alignItems:'flex-end'}}>
              <Text style={styles.txtSec}>{parseFloat(rowData.total_distance.total_distance).toFixed(2)} Km</Text> 
              </View>             
            </TouchableOpacity>
          </View>
        );
      
      }
      renderLoadingView() {
        return (
          <View style={{height:deviceHeight}}>
          <View style={commonStyles.Navbar}>
            <TouchableOpacity style={{top:10,left:0,position:'absolute',height:70,width:70,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'white',fontSize:30,fontWeight:'bold'}}name={(this.props.data === 'fromshare')?'md-home':'ios-arrow-back'}></Icon>
            </TouchableOpacity>
              <Text numberOfLines={1} style={commonStyles.menuTitle}>{this.state.leaguename}</Text>
            </View>
            <LodingScreen style={{height:deviceHeight-50}}/>
          </View>
        );
      }

      render(rowData,jsonData) {
        console.log('bannerimage',this.state.BannerData);
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }
        console.log(this.state.isConnected);
        return (
          <View>
           <View style={commonStyles.Navbar}>
            <TouchableOpacity style={{top:10,left:0,position:'absolute',height:70,width:70,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'white',fontSize:30,fontWeight:'bold'}}name={(this.props.data === 'fromshare')?'md-home':'ios-arrow-back'}></Icon>
            </TouchableOpacity>
              <Text numberOfLines={1} style={commonStyles.menuTitle}>{this.state.leaguename}</Text>
            </View>
            <View>
             <Image source={{uri:this.state.BannerData[0].impactleague_banner}} style={styles.bannerimage}>
              </Image>
              <ListView 
               refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />}
                navigator={this.props.navigator}
                dataSource={this.state.LeaderBoardData}
                renderRow={this.renderRow}
                style={styles.container}>
                <View style={{width:deviceWidth,height:20,backgroundColor:'red'}}></View>
              </ListView>
            </View>
          </View>
        );
      }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    height:deviceHeight-(deviceHeight/2-100)-75,
  },
  cardLeaderBoard:{
    alignItems: 'center',
    flexDirection:'row',
    padding:20,
    margin:5,
    width:deviceWidth-10,
    borderRadius:5,
    shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
      },
  },
  bannerimage:{
    height:deviceHeight/2-100,
    borderWidth:1,
    borderColor:'#CCC',

  },
   txt: {
    width:deviceWidth-200,
    color:'#4a4a4a',
    fontSize: 15,
    fontWeight:'400',
    textAlign: 'left',
    marginLeft:10,
    fontFamily: 'Montserrat-Regular',
  },
  txtSec:{
   color:'#4a4a4a',
   fontSize:17,
   fontWeight:'400',
   right:deviceWidth/4-50,
   textAlign:'right',
   alignItems:'flex-end',
   fontFamily: 'Montserrat-Regular',
  },
});
 export default ImpactLeague;