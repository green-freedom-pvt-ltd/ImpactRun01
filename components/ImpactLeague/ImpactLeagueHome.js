
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
import apis from '../apis';
import commonStyles from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import LodingScreen from '../LodingScreen';
import TimerMixin from 'react-timer-mixin';
import styleConfig from '../styleConfig'

import NavBar from '../navBarComponent';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import impactleagueleaderboard from '../ImpactLeague/ImpactLeagueLeaderboard';
class ImpactLeague extends Component {

      constructor(props) {
        super(props);
        this.fetchDataLocally();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          LeaderBoardData: ds.cloneWithRows([]),
          loaded: false,
          refreshing: false,
          downrefresh:true,
        };
        this.renderRow = this.renderRow.bind(this);
        this.NavigateToDetail = this.NavigateToDetail.bind(this);
      }

      mixins: [TimerMixin]
       

      componentDidMount() { 
        this.getUserData();      
        setTimeout(() => {this.setState({downrefresh: false})}, 1000)
      }

      componentWillMount() {
      }


      fetchDataLocally(){
        AsyncStorage.getItem('USERDATA', (err, result) => {
          let user = JSON.parse(result);
          this.setState({
            user: user,
          })
          AsyncStorage.getItem('teamleaderBoardData', (err, result) => {
            var boardData = JSON.parse(result);
            if (result != null || undefined) {
              this.setState({
                LeaderBoardData: this.state.LeaderBoardData.cloneWithRows(boardData.results),
                BannerData:boardData.results[0].impactleague_banner,
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
        })
      }

      getUserData(){
        AsyncStorage.getItem('USERDATA', (err, result) => {
          let user = JSON.parse(result);
          this.setState({
            user: user,
          })
          NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({isConnected}); 
              if (isConnected) {
                 this.fetchLeaderBoardData();
              };  
            }
          );
        })
      }

    
      fetchLeaderBoardData() {      
        var token = this.state.user.auth_token;
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
            BannerData:jsonData.results[0].impactleague_banner,
          });
           AsyncStorage.removeItem('teamleaderBoardData',(err) => {
         
         });
          let teamleaderBoardData = jsonData;
          AsyncStorage.setItem('teamleaderBoardData',JSON.stringify(teamleaderBoardData)); 
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
          title: rowData.team_name,
          component:impactleagueleaderboard,
          passProps:{user:this.state.user, Team_id:rowData.id,team_name:rowData.team_name}
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
        var textColor=(me.state.user.team_code === rowData.id)?'#fff':"#4a4a4a";
        var backgroundColor =(me.state.user.team_code === rowData.id)?'#ffcd4d':'#fff';
        return (
          <View style={{justifyContent: 'center',alignItems: 'center',}}>
            <TouchableOpacity onPress={()=>this.NavigateToDetail(rowData)} style={[styles.cardLeaderBoard,{backgroundColor:backgroundColor}]}>
              <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:styleConfig.fontSizerleaderBoardContent+2,color:textColor,}}>{rowID}</Text>
              <Text numberOfLines={1} style={[styles.txt,{color:textColor,flex:1}]}>{rowData.team_name}</Text>
              <View style={{justifyContent: 'center',alignItems: 'center',}}>
               <Text style={[styles.txtSec,{color:textColor}]}>{parseFloat(rowData.total_distance.total_distance).toFixed(0)} Km</Text> 
              </View>             
            </TouchableOpacity>
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
      
      swwipeDowntoRefress(){
        if (this.state.downrefresh === true) {
          return(
            <View style={styles.swipedown}><Text style={styles.txt3}>Pull down to refresh</Text></View>
            )
        }else{
          return;
        }
      }

      leftIconRender(){
          return(
            <TouchableOpacity style={{paddingLeft:10,height:styleConfig.navBarHeight,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'flex-start',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'white',fontSize:35,fontWeight:'bold'}}name={(this.props.data === 'fromshare')?'md-home':'ios-arrow-back'}></Icon>
            </TouchableOpacity>
          )
        }
      
      render(rowData,jsonData) {
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }

        return (
          <View>
            <View>
             <Image source={{uri:this.state.BannerData}} style={styles.bannerimage}/>
               {this.swwipeDowntoRefress()}
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
  swipedown:{
    height:30,
    width:deviceWidth,
    backgroundColor:styleConfig.bright_blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerimage:{
    height:deviceHeight/2-100,
  },

  txt: {
    width:deviceWidth-200,
    color:'#4a4a4a',
    fontSize: styleConfig.fontSizerleaderBoardContent+2,
    fontWeight:'600',
    textAlign: 'left',
    marginLeft:10,
    fontFamily: 'Montserrat-Regular',
  },
  txt3: {
    color:'white',
    fontSize: 13,
    fontWeight:'400',
    fontFamily: 'Montserrat-Regular',
  },
  txtSec:{
   fontSize:styleConfig.fontSizerleaderBoardContent+2,
   fontWeight:'400',
   textAlign:'center',
   fontFamily: 'Montserrat-Regular',
  },
});
 export default ImpactLeague;