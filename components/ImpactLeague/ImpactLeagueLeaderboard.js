
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
import styleConfig from '../styleConfig';
import apis from '../apis';
import LodingScreen from '../LodingScreen';
import commonStyles from '../styles';
import NavBar from '../navBarComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
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
          teamname:'Impact League',
          my_rate:1.0,
          my_currency:"INR",

        };
        this.renderRow = this.renderRow.bind(this);
      }

     componentWillMount() {        
          AsyncStorage.getItem('my_currency', (err, result) => {
            this.setState({
              my_currency:JSON.parse(result),
          })
          })     
          
       AsyncStorage.getItem('my_rate', (err, result) => {
            this.setState({
              my_rate:JSON.parse(result),
          })
          }) 

     }

      componentDidMount() {
         this.FetchDataifInternet();
         this.setState({
          teamname:this.props.team_name
         })
      }
      
      FetchDataifInternet(){
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
              this.FetchLeaderBoard();
            }else{
              this.FetchLeaderBoardLocally();
            } 
          }
        );
      }


    
     
      FetchLeaderBoardLocally(){
        AsyncStorage.getItem('ILleaderBoardData'+this.props.Team_id, (err, result) => {
          var boardData = JSON.parse(result);        
          if (boardData != null) {
            this.setState({
              ImpactLeagueLeaderBoardData:this.state.ImpactLeagueLeaderBoardData.cloneWithRows(boardData.results),
              BannerData:boardData.results,
              loaded: true,
            })
          }else{
             this.FetchDataifInternet();
          }
        }); 
      }



      FetchLeaderBoard() {     
           
        var url = apis.ImpactLeagueLeaderboardV2Api;
        var token = this.props.user.auth_token;
        console.log('token ' + token);
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
        if (rowData.social_thumb) {
          return(
            <Image style={styles.thumb} source={{uri:rowData.social_thumb}}></Image>
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
        var totalkms = (rowData.amount == null)?'0':rowData.amount;
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
        var textColor=(this.props.user.user_id === rowData.user_id)?'#fff':"#4a4a4a";
        var backgroundColor = (this.props.user.user_id === rowData.user_id)?'#ffcd4d':'#fff';
        return (
          <View style={[styles.cardLeaderBoard,{backgroundColor:backgroundColor}]}>
              <View style={style}>
                <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:13,color:textColor,}}>{rowID} </Text> 
              </View> 
              <View>{this.socialthumb(rowData)}</View>       
              <Text style={[styles.txt,{color:textColor}]}>{rowData.first_name} {rowData.last_name}</Text>
              <View style={{justifyContent: 'center',alignItems: 'center',}}>
              <Text style={[styles.txtSec,{color:textColor}]}>
              <Icon2 style={{color:textColor,fontSize:styleConfig.fontSizerleaderBoardContent+2,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}></Icon2> {(this.state.my_currency == 'INR' ? parseFloat(totalkms).toFixed(0) : parseFloat(totalkms/this.state.my_rate).toFixed(2))} </Text>
              </View>
          </View>
        );
      }
      leftIconRender(){
        return(
          <TouchableOpacity style={{paddingLeft:10,height:styleConfig.navBarHeight,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'flex-start',}} onPress={()=>this.goBack()} >
              <Icon style={{color:'white',fontSize:35,fontWeight:'bold'}}name={'ios-arrow-back'}></Icon>
            </TouchableOpacity>
        )
      }
      renderLoadingView() {
        return (
          <View style={{height:deviceHeight}}>
          <NavBar title={this.state.teamname} leftIcon={this.leftIconRender()}/>    
            <LodingScreen style={{ height:deviceHeight-150}}/>
          </View>
        );
      }

      render() {
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }
        else{
        console.log(this.state.isConnected);
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
           <NavBar title={this.state.teamname} leftIcon={this.leftIconRender()}/>
            <View style={{backgroundColor:'white', height:deviceHeight-75,width:deviceWidth}}>
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
    flex:1,
    color:'#4a4a4a',
    fontSize: styleConfig.fontSizerleaderBoardContent+2,
    fontWeight:'600',
    textAlign: 'left',
    marginLeft:10,
    fontFamily: 'Montserrat-Regular',
  },
  txtSec:{
    color:'#4a4a4a',
    fontSize:styleConfig.fontSizerleaderBoardContent+2,
    fontWeight:'400',
    fontFamily: 'Montserrat-Regular',
  },
   thumb: {
    height:styleConfig.navBarHeight-30,
    width:styleConfig.navBarHeight-30,
    borderRadius:(styleConfig.navBarHeight-30)/2,
    backgroundColor:'#ffcd4d',
    marginBottom: 5,
     borderColor:'#ccc',
     borderWidth:2,
  },

});
 export default ImpactLeagueLeaderBoard;