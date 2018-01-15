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
    AlertIOS,
    ListView,
    NetInfo,
    AsyncStorage,
    RefreshControl
  } from 'react-native';
  import getLocalUser from './userLocalGet';
  import styleConfig from '../../components/styleConfig';
  import LodingScreen from '../LodingScreen';
  import ImpactLeague from '../ImpactLeague/ImpactLeagueHome'
  import Icon from 'react-native-vector-icons/FontAwesome';
  import apis from '../apis';
  import commonStyles from '../styles';
  import NavBar from '../navBarComponent';
  var deviceWidth = Dimensions.get('window').width;
  import LoginBtn from '../login/LoginBtns';
  var deviceHeight = Dimensions.get('window').height;
  import ModalDropDown from './modelindex.js'
 var base64Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABICAYAAACqT5alAAAABGdBTUEAALGPC/xhBQAABOFJREFUeAHtmlmIFEcYx2dUxDt4YTSieCAqHkgkJARU9EFFgygeICIi+qCgQRHFh4CQhzwsgSiJeGD0yQNR8SDg8WBWvFZNRFkkEW/BCKsuisQcuvl9Zqbt6emq6aquaWd2+4P/dPVX31lfV3X1dGcyhtTU1HQdVAotNgw/08pUodrl04SrvYKl4k8rXGqEqr0/y3K7hSQ+NEhkIrKdDeTLKforxu8bONguCd9CYaCBUjWLrkzncDWXL0rs76PCLwhsCtgcJUDXMu8j4Z3ZbPY4iawHL10nVMpeG43AVvoehPSvgNcrhB+VJXYzJP2cBXMPzSVRFUPkDsCTlTpIC2AMDTLfnssqDcLoszAFBOM8PNT6bWJrbJhjA95Cv718G/3DChsrkr6k5Z7vEVW+zMkvHiOBhlzSTQo/WQU/CvsZQrvBY/AEPM0df+YYpNkwhoFuoHsOYzlOBbakKuQbSbgBDAqx3DOEF5W1ieptiCKM3B3kBB5xOUrAjcB2R9fDM1bYaBDDjwp53lnoHPZ69Y2FBD1AL6LtXU2vVbL47YDuaIX1R5LwNUXnEpRtV2NJ9iL6RoOGfGvwPbo1ipiisFch1D5E8DW8+gwOPgYqOhRURNBklf4T+XlBG2HnyHUGPwETKlilURwB/lIYqPX8IvCbQkjYx4D3NEXbJGHRfwPGec4UDWTEjyl5CaM4FzRoDCwT1/mNx1e09ylimQa/HkOy6l4CXRRyKras9vdUnT7+Q187avMT4uqK8BdgkkZJFsUdXj9K8phYC8pBUZKVqTW/HM5zNmflk5VFS7Z5ci+eA2xGWUzo6N3cyUkRxFDQLqBUJBfotz2tIb+DocoEMQo8BC5pad4ZRjuCb8G/4CaYmO+TI+e3gUv6EWNvi+r3U9BGoDc459DrzFwy07F5L8TuTniyw5KE5Vbmgv7GyJqCxHQnCMucXgDugrgkK+eFEkZE5kwJmSjdckfYDwar8pMVVEkoSv+nYAYYDvqAIcBqF4Sea5LVVx5hZe2RNeAw8/UPju6IQVgHKoH+IYiOppnpJ3S4tbPh7MS5V6mm8T8mNgnLM6yxozIMx2kbm8YJM6qvcLTXxpljnV029owTzjnZZuPMoc45Br7exp5Vwjirw9kJG4eOdL52ZCe6GVbIYUBu8EnTkehRFktaVVjMUOUbHL4pNllWjvxX9mVZPeiMU9pW4GhCJX6Nn8m6eBLpI4gPQF2Zk5Yt4/JEEorihGA6gVNlSlp2VPImobKIoNqCGiCXniu6g6HxlZVpIBoC/BxcBXFI/oj7AVTKQ0ogy8ApgcrjpTz/ngYmFX+C/EbQN2Cyek4JvidYBF4BFcn8HwdaV09mJSIlmUZVtvA3lFB31m298XAWQcKG0oQTHvDE3aUVTnzIE3aYVjjhAU/cXYurcBvXQ8wmQl6nyvvg4GvVthpfI9Gb7+uXl3u/8yfDFR+v8poE3Re4fBn3XeVl6YuIZOXx0DV95HMRu+l6DvePHVGxgX7FLHuO64TtI0lIs8UlrH1dWmrQmawTkFnrkxtD2/vix8eP0zyPsnyVJ9TIyu1fzf/nGvzGvS31xlecbyKjhOr/uO1xFAWdTIu7pNOEdZdDc+hLK9wcqqjLIa2wbnSaQ19a4eZQRV0OcXda8tXbSZ0Dx33yBUBK6QhoRuA/Om5HY4SRRjAAAAAASUVORK5CYII=";
  const CleverTap = require('clevertap-react-native');

var iphone5 = 568;
var iphone5s = 568;
var iphone6 = 667;
var iphone6s = 667;
var iphone7 = 667;
var iphone6Plus = 736;
var iphone6SPlus = 736;
var iphone7Plus = 736;
  class Leaderboard extends Component {
     

      constructor(props) {

        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          RouteImpactleague:'',
          LeaderBoard: ds.cloneWithRows([]),
          value:'Most Impact Last 7 days',
          fetched:false,
          responce:null,
          userCount: 0,
          loaded:false,
          myindex:null,
          refreshing:false,
          downrefresh:true,
          user:props.user,
          my_rate:1.0,
          my_currency:"INR",

        };
        this.renderRow = this.renderRow.bind(this);
        this.getUserData = this.getUserData.bind(this);
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
      
      fetchLeaderBoardLocally(value){
        AsyncStorage.getItem('leaderBoard' + value, (err, result) => {
        var jsonData = JSON.parse(result);
        if (result != null || undefined) {
          this.setState({
            LeaderBoard:this.state.LeaderBoard.cloneWithRows(jsonData.results),
            fetched:true,
            refreshing:false,
          }) 
        }else{
        if (this.state.user != null) {
         this.fetchDataIfInternet()
        }
        }
        });
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

      getUserData(){
        AsyncStorage.getItem('USERDATA', (err, result) => {
          let user = JSON.parse(result);
           this.setState({
            user:user,
           })
            if(this.state.user != null){
              this.fetchDataIfInternet();
            }
            this.props.getUserData();

        }) 
        
      }


      _onRefresh() {
        this.setState({refreshing: true});
        this.fetchDataIfInternet();
      }
     
      borderBottomWidth(){
        if (Dimensions.get('window').height === iphone6) {
         return  0.8
        }else if (Dimensions.get('window').height === iphone5){
          return  0.5
        }
        else if (Dimensions.get('window').height === iphone6SPlus){
          return  1
        }
        else if (Dimensions.get('window').height < iphone5){
          return  0.5
        }
      }

      renderRow(rowData, index,rowID){
        rowID++       
        var myflex = (this.state.user.user_id === rowData.user_id)?1:0;
        // console.log('rodatacount',this.state.userCount,this.state.responce);
        var textColor = (this.state.user.user_id === rowData.user_id)?"white":"#4a4a4a";
        var backgroundcolor=(this.state.user.user_id === rowData.user_id)?'#ffcd4d':"white";
        var myposition = (this.state.user.user_id === rowData.user_id)?'absolute':'relative';
        var mytop = (this.state.user.user_id === rowData.user_id)?-100:0;
        var visiblity = (this.state.user.user_id === rowData.user_id)?0:1;
        let style = [
          styles.row, 
          {
            'alignItems': 'center',
            'justifyContent': 'center',
            'alignItems': 'center',
          }
        ];
        return (
          <View  style={[styles.cardLeaderBoard,{backgroundColor:backgroundcolor,borderBottomWidth:this.borderBottomWidth()}]}>
           <View style={styles.flexbox1}>
            <View style={style}>
              <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:styleConfig.fontSizer4,color:textColor,}}>{rowData.ranking}</Text>
            </View>
           </View>
            <View style={styles.flexbox}>
            <Image style={styles.thumb} source={{uri:rowData.social_thumb}}></Image>
            </View>
            <View style={styles.flexbox2}>
            <Text style={[styles.txt,{color:textColor}]}>{rowData.first_name} {rowData.last_name}</Text>
            </View >
            <View style={styles.flexbox3}>
            <Text style={[styles.txtSec,{color:textColor}]}>
            <Icon style={{color:textColor,fontSize:styleConfig.fontSizerleaderBoardContent+2,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}></Icon> {(this.state.my_currency == 'INR' ? parseFloat(rowData.amount).toFixed(0) : parseFloat(rowData.amount/this.state.my_rate).toFixed(2)) }</Text>
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


      componentDidMount() {
          // get current route
       //   var route = this.props.route;
       //   console.log('route',route);
       // // update onRightButtonPress func
       //  this.props.rightButtonTitle = (this.state.user)?'title':'league'; 
       //  console.log('route',route);
       // // component will not rerender
       // this.props.navigator.replace(route);
       setTimeout(() => {this.setState({downrefresh: false})}, 1000)
       this.getUserData();
       this.fetchLeaderBoardLocally(this.state.value);

      }



      fetchDataIfInternet(){
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
              console.log('isConnect leaderBoard',isConnected);
              this.fetchLeaderBoard();
            }else{
               this.fetchLeaderBoardLocally(this.state.value);

            }  
          }
        );
      }
      

      fetchLeaderBoard() {
        AsyncStorage.removeItem('leaderBoard' + this.state.value,(err) => {
        });
         this.setState({
            fetched:false,
          });
        var token = this.state.user.auth_token;
        console.log("token",token);
        var stateValue = '';
        if (this.state.value == 'Last 7 days'){
          stateValue = 'last_7';
        }
        else if (this.state.value == 'Last 30 days'){
          stateValue = 'last_30'; 
        }
        else if(this.state.value == 'All Time'){
          stateValue = 'all_time';  
        }
        var url = apis.leaderBoardapi +'?interval=' + stateValue + '&orderby=amount';
        console.log('fetchLeaderBoardvalue',url);
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
            LeaderBoard:this.state.LeaderBoard.cloneWithRows(jsonData.results),
            fetched:true,
            refreshing:false,
          });
          this.render(this.state.LeaderBoardResult);   
          let leaderBoard = jsonData;
          console.log('leaderBoard',leaderBoard);
          AsyncStorage.setItem('leaderBoard'+this.state.value,JSON.stringify(leaderBoard));
          AsyncStorage.getItem('leaderBoard'+this.state.value, (err, result) => {   
          });  
          
        })
        .catch( (error) => {
          console.log('Error fetching: ' + error)
          this.setState({
            fetched:false,
          });
        });
      }




      navigateToImpactLeague(){

         AsyncStorage.getItem('USERDATA', (err, result) => {
          let user = JSON.parse(result);
          console.log("user",user.team_code);
          this.setState({
            user:user,
          })
          CleverTap.recordEvent('ON_CLICK_CUP_ICON',{
            'team_id':this.state.user.team_code
          });
          if (this.state.user.team_code === 0) {
            this.setState({
              RouteImpactleague:'impactleaguecode'
            })
          }else{               
            this.setState({
              RouteImpactleague:'impactleaguehome'
            })
          }
          this.props.navigator.push({
            id:this.state.RouteImpactleague,
            navigator: this.props.navigator,
            passProps:{user:this.props.user, getUserData:this.props.getUserData}
          })
        })



        // if (this.state.user != null) {
        //    this.props.navigator.push({
        //     title: 'ImpactLeague',
        //     component:ImpactLeague,
        //     passProps:{user:this.state.user,getUserData:this.getUserData,}
        // })

        // }else{
        //   return;
        // }
      }




       _onRightButtonIcon(){
        if (this.state.user != null) {
         return 'title'
        }else{
          return;
            
        }
       }
      _onRightButtonClicked() {
        this.navigateToImpactLeague();
      }

      refreshUser(){
        this.props.getUserData();
      }

      onSelectBoardType(idx,value){
        CleverTap.recordEvent('ON_CHANGE_GLOBAL_LEADERBOARD_RANGE');
        this.setState({
          value:value,
        })
        this.fetchLeaderBoardLocally(value);
      }

      renderLeaderboadScreen(dataleaderboad){
        if (this.state.user != null || undefined) {
          if (this.state.fetched === true) {
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
            <View style={{backgroundColor:'white',height:deviceHeight-styleConfig.tabHeight-styleConfig.navBarHeight-10,width:deviceWidth,paddingBottom:53}}>
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
        return this.renderLoadingView()
      }
     
        }else{
        return(
          <View style={{justifyContent: 'center', alignItems: 'center', width:deviceWidth,height:deviceHeight,paddingTop:(deviceHeight/2)-150,}}>
          <Text style={{fontFamily: 'Montserrat-Regular',bottom:50,fontSize:16,}}>Please Login To See Leaderboard</Text>
          <LoginBtn getUserData = {this.getUserData} />
          </View>
          )
        }
      }

      renderImpactLeagueIcon(){
        if (this.props.user != null) {
        return(
          <TouchableOpacity style={{flex:1,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'flex-end',}} onPress={()=>this.navigateToImpactLeague()} >
            <Icon style={{textAlign:'center',fontSize:26,opacity:.80}} name ={'trophy'}></Icon>
          </TouchableOpacity>
          );
         }else{
          return(
            <View></View>
            );
         }
      }

      render() {
        var dataleaderboad = this.state.LeaderBoardResult;
        return (
          <View>
            <NavBar title={'Leaderboard'} rightIcon={this.renderImpactLeagueIcon()}/>      
            <View style= {styles.textlast7daysWrap}>
              <ModalDropDown textStyle={styles.last7dayText} defaultValue = {'Last 7 days'} options={['Last 7 days', 'Last 30 days', 'All Time']} onSelect={(idx, value) => this.onSelectBoardType(idx, value)} >
              </ModalDropDown>
            </View>
             <View>{this.renderLeaderboadScreen(dataleaderboad)}</View>
          </View>
        );
      }
}
var styles = StyleSheet.create({
  scrollTabWrapper:{
    position:'relative',
    width:deviceWidth,
    backgroundColor:'white',
    height:deviceHeight,
    top:0,
  },
  textlast7daysWrap:{
    height:40,
    marginBottom:8,
    justifyContent: 'center',
    alignItems: 'center',
    width:deviceWidth,
    backgroundColor:'white',
    shadowColor: '#000000',
    shadowRadius:2,
    shadowOpacity: 0.1,
    shadowOffset: {
      height: 3,
    },
  },
  last7dayText:{
    color:styleConfig.greyish_brown_two,
    fontSize:15,
    fontWeight:'400',
    fontFamily:styleConfig.FontFamily,
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


  thumb: {
    height:styleConfig.navBarHeight-10,
    width:styleConfig.navBarHeight-10,
    borderRadius:(styleConfig.navBarHeight-10)/2,
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
    padding:5,
    width:deviceWidth,
    borderColor:'#CCC',
  },
  txt: {
    fontSize:styleConfig.fontSizerleaderBoardContent+2,
    fontWeight:'800',
    textAlign: 'left',
    marginLeft:10,
    fontFamily: styleConfig.LatoRegular,
  },
  txtSec:{
   color:styleConfig.warm_grey_three,
   fontSize:styleConfig.fontSizerleaderBoardContent+2,
   fontWeight:'800',
   fontFamily: styleConfig.LatoRegular,
  },
  txtSec2:{
   color:'black',
   fontSize:styleConfig.fontSizerleaderBoardContent+2,
   fontWeight:'800',
   fontFamily: styleConfig.LatoRegular,
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
    width:deviceWidth-170,
    flex:-1,
    alignItems: 'flex-start',
    justifyContent: 'center',

  },
  flexbox1:{
    height:30,
    width:30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  })
export default Leaderboard;