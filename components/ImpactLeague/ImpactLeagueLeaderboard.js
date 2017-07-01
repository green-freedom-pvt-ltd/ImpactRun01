
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
    WebView,
    NetInfo,
    AlertIOS,
    ListView,
    AsyncStorage,
    RefreshControl,
  } from 'react-native';

import apis from '../apis';
import LodingScreen from '../LodingScreen';
import commonStyles from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class ImpactLeagueLeaderBoard extends Component {

      constructor(props) {
        super(props);
       
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          ImpactLeagueLeaderBoardData: ds.cloneWithRows([]),
          loaded: false,
          refreshing:false,
        };
        this.renderRow = this.renderRow.bind(this);
      }

      componentDidMount() {
         this.FetchLeaderBoardLocally();
      }
      
      FetchDataifInternet(){
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
               this.FetchLeaderBoard();
            }else{
              AlertIOS.alert('No internet connection', 'Please connect your device to internet connection')
            } 
          }
        );
      }


      componentWillUnmount() {
       
      }
      
     
      FetchLeaderBoardLocally(){
        AsyncStorage.getItem('ILleaderBoardData'+this.props.Team_id, (err, result) => {
          var boardData = JSON.parse(result);        
          if (boardData != null) {
            this.setState({
              ImpactLeagueLeaderBoardData:this.state.ImpactLeagueLeaderBoardData.cloneWithRows(boardData.results),
              BannerData:boardData.results,
              teamname:boardData.results[0].team,
              loaded: true,
            })
          }else{
             this.FetchDataifInternet();
             this.setState({
              teamname:'Impact League'
             })
          }
        }); 
      }



      FetchLeaderBoard() {     
           
        var url = apis.ImpactLeagueLeaderboardApi;
        var token = this.props.user.auth_token;
        if (this.props.user.team_code == this.props.Team_id) {
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
              ImpactLeagueLeaderBoardData: this.state.ImpactLeagueLeaderBoardData.cloneWithRows(jsonData.results),
              loaded: true,
              refreshing:false,
            });
            let ILleaderBoardData = jsonData;
            AsyncStorage.setItem('ILleaderBoardData'+this.props.Team_id,JSON.stringify(ILleaderBoardData));
          })       
          .catch( error => console.log('Error fetching: ' + error));

        }else{
          var url2 = url +"?team_id="+this.props.Team_id;
          fetch(url2,{
          method: "GET",
          headers: {  
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
          }
          })
        .then( response => response.json() )
        .then( jsonData => {
          
          this.setState({
            ImpactLeagueLeaderBoardData: this.state.ImpactLeagueLeaderBoardData.cloneWithRows(jsonData.results),
            loaded: true,
            refreshing:false,
          });
          AsyncStorage.removeItem('ILleaderBoardData'+this.props.Team_id,(err) => {
          });
          let ILleaderBoardData2 = jsonData;
          AsyncStorage.setItem('ILleaderBoardData'+this.props.Team_id,JSON.stringify(ILleaderBoardData2));
          })
        .catch( error => console.log('Error fetching: ' + error));
        }
      }

     goBack(){
      this.props.navigator.pop({
        navigator: this.props.navigator,
      })
      }
      socialthumb(rowData){
        if (rowData.user.social_thumb) {
          return(
            <Image style={styles.thumb} source={{uri:rowData.user.social_thumb}}></Image>
            )
        }else{
          return(
             <Image style={styles.thumb} source={require('../../images/profile_placeholder.jpg')}></Image>
            
            )
        }
      }

      _onRefresh() {
        this.setState({refreshing: true});
        this.FetchLeaderBoard();
      }


      renderRow(rowData,index,rowID){
        var totalkms = (rowData.league_total_distance.total_distance == null)?'0':rowData.league_total_distance.total_distance;
        rowID++
        var me = this;
        let style = [
          styles.row, 
          {
            'alignItems': 'center',
            'justifyContent': 'center',
            'alignItems': 'center',
            'height':25,
            'width':25,
          }
        ];
        var backgroundColor = (this.props.user.user_id === rowData.user.user_id)?'#ffcd4d':'#fff';
        return (
          <View style={[styles.cardLeaderBoard,{backgroundColor:backgroundColor}]}>
              <View style={style}>
                <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:15,color:'#4a4a4a',}}>{rowID}</Text>
              </View> 
              <View>{this.socialthumb(rowData)}</View>       
              <Text style={styles.txt}>{rowData.user.first_name} {rowData.user.last_name}</Text>
              <Text style={styles.txtSec}>{parseFloat(totalkms).toFixed(2)} Km</Text>
          </View>
        );
      }
      renderLoadingView() {
        return (
          <View style={{height:deviceHeight}}>
          <View style={commonStyles.Navbar}>
            <TouchableOpacity style={{left:0,position:'absolute',height:60,width:60,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'white',fontSize:34,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon>
            </TouchableOpacity>
              <Text numberOfLines={1} style={commonStyles.menuTitle}>{this.state.teamname}</Text>
            </View>     
            <LodingScreen style={{ height:deviceHeight-150}}/>
          </View>
        );
      }

      render() {
        if (!this.state.loaded ) {
          return this.renderLoadingView();
        }
        console.log(this.state.isConnected);
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
           <View style={commonStyles.Navbar}>
            <TouchableOpacity style={{left:0,position:'absolute',height:60,width:60,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'white',fontSize:34,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon>
            </TouchableOpacity>
              <Text numberOfLines={1} style={commonStyles.menuTitle}>{this.state.teamname}</Text>
            </View>
            <View style={{backgroundColor:'white', height:deviceHeight-75,width:deviceWidth,}}>
               <ListView 
                refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />}
                dataSource={this.state.ImpactLeagueLeaderBoardData}
                renderRow={this.renderRow}
                style={styles.container}
                >
              </ListView>
            </View> 
         </View>
        );
      }
}

const styles = StyleSheet.create({
  container:{
    height:deviceHeight-75,

  },
  cardLeaderBoard:{
    alignItems: 'center',
    flexDirection:'row',
    padding:10,
    left:5,
    borderRadius:5,
    width:deviceWidth-10,
    borderBottomWidth:1,
    borderColor:'#CCC',
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
   thumb: {
    height:50,
    width:50,
    borderRadius:25,
    backgroundColor:'#ffcd4d',
    marginBottom: 5,
     borderColor:'#ccc',
     borderWidth:2,
  },

});
 export default ImpactLeagueLeaderBoard;