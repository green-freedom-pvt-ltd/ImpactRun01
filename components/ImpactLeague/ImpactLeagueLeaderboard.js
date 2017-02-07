
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
        };
        this.renderRow = this.renderRow.bind(this);
      }

      componentDidMount() {
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
               this.fetchFeedData();
            };  
          }
        );
      }
      
      componentWillUnmount() {
        console.log('myComponent')    
      }

      fetchFeedData() {       
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
          });
  
          console.log('response',jsonData);
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
          });
  
          console.log('response',jsonData);
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

      renderRow(rowData,index,rowID){
        var totalkms = (rowData.league_total_distance.total_distance == null)?'0':rowData.league_total_distance.total_distance;
        rowID++
        var me = this;
        let colors = ['#ffcd4d', '#ffcd4d', '#ffcd4d', 'white','white','white','white','white','white','white',];
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
          <View style={styles.cardLeaderBoard}>
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
            <TouchableOpacity style={{top:10,left:0,position:'absolute',height:70,width:70,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'white',fontSize:30,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon>
            </TouchableOpacity>
              <Text style={commonStyles.menuTitle}>Team Leaderboard</Text>
            </View>     
            <LodingScreen style={{ height:deviceHeight-150}}/>
          </View>
        );
      }

      render() {
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }
        console.log(this.state.isConnected);
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
           <View style={commonStyles.Navbar}>
            <TouchableOpacity style={{top:10,left:0,position:'absolute',height:70,width:70,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'white',fontSize:30,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon>
            </TouchableOpacity>
              <Text style={commonStyles.menuTitle}>Team Leaderboard</Text>
            </View>
            <View style={{backgroundColor:'white', height:deviceHeight-75,width:deviceWidth,}}>
               <ListView 
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
    backgroundColor:'white',
    alignItems: 'center',
    flexDirection:'row',
    padding:10,
    marginTop:5,
    left:5,
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