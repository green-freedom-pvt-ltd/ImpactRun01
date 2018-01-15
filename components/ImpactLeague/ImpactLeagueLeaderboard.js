
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
const CleverTap = require('clevertap-react-native');
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class ImpactLeagueLeaderBoard extends Component {

      constructor(props) {
        super(props);  
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          ImpactLeagueLeaderBoardData: ds.cloneWithRows([]),
          Tooltiplist: ds.cloneWithRows([]),
          loaded: false,
          refreshing:false,
          teamname:'Impact League',
          my_rate:1.0,
          my_currency:"INR",
          openTooltip:false,
          rowID:0,
          totalkms:0,
        };
        this.renderRow = this.renderRow.bind(this);
        this.renderRowTooltiplist = this.renderRowTooltiplist.bind(this);

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
            UserLeaguedata:this.props.user.user_id,
            teamname:this.props.team_name,
            Tooltiplist:this.state.Tooltiplist.cloneWithRows([{'title':'Help','functions':'help'},{'title':'Exit League','functions':'exitLeague',}]),
          })
      }

     

      exitLeague(){
        var data = new FormData();
        data.append("user",this.props.user.user_id)
        data.append("team_code",this.props.user.team_code)
        data.append("is_logout",'true');
        fetch(apis.employeetoteamApi,{
            method: 'put',
            headers: {  
              'Authorization':"Bearer "+ this.props.user.auth_token,
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data'
            },
            body:data
          
          })
          .then( response => response.json())
          .then( jsonData => {
            console.log('jsonData123',jsonData);
            let userData = {
              team_code:jsonData.team_code
            }
        // first user, delta values
            AsyncStorage.mergeItem('USERDATA', JSON.stringify(userData), () => {
             AsyncStorage.getItem('USERDATA', (err, result) => {
              console.log('result', result)
              this.navigateTOhome();
             })
            }) 
            AlertIOS.alert('title',JSON.stringify(jsonData));
          }).catch((error)=>{
           console.log('erroremployeTeam', error);
          })
      }
      

      navigateTOhome(){
        this.props.navigator.replace({
        id:'tab',
        passProps:{profileTab:'welcome', user:this.props.user},
        navigator: this.props.navigator,
        })
      }

      navigateTOhelpCenter(){
        this.props.navigator.replace({
        id:'tab',
        passProps:{profileTab:'help', user:this.props.user},
        navigator: this.props.navigator,
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
          result.forEach((item,i)=>{
            if (item.user_id === this.props.user_id) {
               var totalkms = (item.amount == null)?'0':item.amount;
              this.setState({
                  UserLeaguedata:item,
                  rowID:i,
                  totalkms:totalkms,
              })
            };
          })
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
          CleverTap.recordEvent('ON_CLICK_SELF_TEAM_LEAGUE_BOARD');
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
          CleverTap.recordEvent('ON_CLICK_OTHER_TEAM_LEAGUE_BOARD');
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
          jsonData.results.forEach((item,i)=>{
            if (item.user_id === this.props.user_id) {
               var totalkms = (item.amount == null)?'0':item.amount;
              this.setState({
                  UserLeaguedata:item,
                  rowID:i,
                  totalkms:totalkms,
              })
            };
          })
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
        if (this.props.user.user_id === rowData.user_id) {
          this.setState({
            UserLeaguedata:rowData,
            rowID:rowID,
            totalkms:totalkms,
          })
        };
        var textColor=(this.props.user.user_id === rowData.user_id)?'#fff':"#4a4a4a";
        var backgroundColor = (this.props.user.user_id === rowData.user_id)?styleConfig.light_sky_blue:'#fff';
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
              <Icon style={{color:'black',fontSize:responsiveFontSize(4),fontWeight:'bold',opacity:.80}}name={'ios-arrow-back'}></Icon>
            </TouchableOpacity>
        )
      }
      renderLoadingView() {
        return (
          <View style={{height:deviceHeight}}>
          <NavBar title={this.state.teamname} leftIcon={this.leftIconRender()} rightIcon = {this.rightIconRender()}/>    
            <LodingScreen style={{ height:deviceHeight-150}}/>
          </View>
        );
      }
      rightIconRender(){
        return(
            <TouchableOpacity style={{height:60,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'flex-end'}} onPress={()=>this.exitLeaguepopu()} >
              <Icon style={{color:'black',fontSize:responsiveFontSize(3.5),fontWeight:'bold',opacity:.80}}name={'md-more'}></Icon>
            </TouchableOpacity>
          )
      }

      exitLeaguepopu(){
        if (!this.state.openTooltip) {
          this.setState({
            openTooltip:true,
          })
        }else{
          this.setState({
            openTooltip:false,
          })
        }
      }
      
      
     

      openTooltip(){
        if (this.state.openTooltip) {
          return(
            <TouchableOpacity style={{position:'absolute',top:0,height:deviceHeight,width:deviceWidth,backgroundColor:'transparent'}} onPress={()=> this.exitLeaguepopu()}> 
              <View style={{top:50,height:100,width:200,backgroundColor:'white',position:'absolute',right:30,shadowColor: '#000000',shadowOpacity: 0.4,shadowRadius: 4,shadowOffset: {height: 2,},}}>
                <ListView 
                dataSource={this.state.Tooltiplist}
                renderRow={this.renderRowTooltiplist}
                style={styles.container}
                >
              </ListView>
              </View>
            </TouchableOpacity>
            )
        }else{
          return;
        }
      }


      renderRowTooltiplist(rowData){
        console.log('rowData',rowData)
        return(
          <TouchableOpacity onPress={()=> this.onclickpopuRow(rowData)}style={{width:200,height:50,justifyContent: 'center',paddingLeft:10,}}>
            <Text>{rowData.title}</Text>
          </TouchableOpacity >
        )
      }
      

      onclickpopuRow(rowData){
        console.log('rowData1', rowData);
        if (rowData.functions === 'exitLeague') {
          return this.exitLeague();
        }else if(rowData.functions === 'help'){
          return this.navigateTOhelpCenter();
        }
      } 
      
      userLeagueRow(){
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
        
        var rowData = this.state.UserLeaguedata;
        var textColor=(this.props.user.user_id === rowData.user_id)?'#fff':"#4a4a4a";
        return(
          <View style={[styles.cardLeaderBoard,{backgroundColor:styleConfig.light_sky_blue}]}>
              <View style={style}>
                <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:13,color:textColor,}}>{this.state.rowID} </Text> 
              </View> 
              <View>{this.socialthumb(rowData)}</View>       
                <Text style={[styles.txt,{color:textColor}]}>{rowData.first_name} {rowData.last_name}</Text>
                <View style={{justifyContent: 'center',alignItems: 'center',}}>
                <Text style={[styles.txtSec,{color:textColor}]}>
                <Icon2 style={{color:textColor,fontSize:styleConfig.fontSizerleaderBoardContent+2,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}></Icon2> {(this.state.my_currency == 'INR' ? parseFloat(this.state.totalkms).toFixed(0) : parseFloat(this.state.totalkms/this.state.my_rate).toFixed(2))} </Text>
              </View>
          </View>
        )
      }

      render() {
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }
        else{
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
           <NavBar title={this.state.teamname} leftIcon={this.leftIconRender()} rightIcon = {this.rightIconRender()}/>
            <View onPress={()=> this.exitLeaguepopu()} style={{top:10,backgroundColor:'white', height:deviceHeight-styleConfig.tabHeight-15,width:deviceWidth}}>
               <ListView 
                refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />} dataSource={this.state.ImpactLeagueLeaderBoardData}
                renderRow={this.renderRow}
                style={styles.container}>
              </ListView>
            </View> 
            {this.openTooltip()}
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
    width:deviceWidth,
    height:styleConfig.navBarHeight,
    borderBottomWidth:1,
    borderColor:'#CCC',
  },
  txt: {
    flex:1,
    color:'#4a4a4a',
    fontSize: styleConfig.fontSizerleaderBoardContent+2,
    fontWeight:'800',
    textAlign: 'left',
    marginLeft:10,
    fontFamily:styleConfig.LatoRegular,
  },
  txtSec:{
    color:'#4a4a4a',
    fontSize:styleConfig.fontSizerleaderBoardContent+2,
    fontWeight:'800',
    fontFamily: styleConfig.LatoRegular,
  },
   thumb: {
    height:styleConfig.navBarHeight-10,
    width:styleConfig.navBarHeight-10,
    borderRadius:(styleConfig.navBarHeight-10)/2,
    backgroundColor:styleConfig.light_sky_blue,
    marginBottom: 5,
     borderColor:'#ccc',
     borderWidth:2,
  },

});
 export default ImpactLeagueLeaderBoard;