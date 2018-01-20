
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
import Icon2 from 'react-native-vector-icons/FontAwesome';
import LodingScreen from '../LodingScreen';
import TimerMixin from 'react-timer-mixin';
import styleConfig from '../styleConfig'
import ImpactLeagueCode from './ImpactLeagueCode';
import NavBar from '../navBarComponent';
import LoginBtns from '../login/LoginBtns';
import AnimateNumber from 'react-native-animate-number';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import impactleagueleaderboard from '../ImpactLeague/ImpactLeagueLeaderboard';
import Swiper from 'react-native-swiper';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
const CleverTap = require('clevertap-react-native');

var iphone5 = 568;
var iphone5s = 568;
var iphone6 = 667;
var iphone6s = 667;
var iphone7 = 667;
var iphone6Plus = 736;
var iphone6SPlus = 736;
var iphone7Plus = 736;
class ImpactLeague extends Component {

      constructor(props) {
        super(props);
     
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          LeaderBoardData: ds.cloneWithRows([]),
          Tooltiplist: ds.cloneWithRows([]),
          loaded: false,
          refreshing: false,
          downrefresh:true,
          user:null,
          isMounted:true,
          my_rate:1.0,
          my_currency:"INR",
          openTooltip:false,

        };
        this.fetchLeaderBoardData = this.fetchLeaderBoardData.bind(this);
        this.fetchDataLocally = this.fetchDataLocally.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.NavigateToDetail = this.NavigateToDetail.bind(this);
        this.renderRowTooltiplist = this.renderRowTooltiplist.bind(this);

      }

      mixins: [TimerMixin]
       

      componentDidMount() { 
        this.fetchDataLocally();
        this.getUserData();      
        setTimeout(() => {this.setState({downrefresh: false})}, 1000)
        this.setState({
          Tooltiplist:this.state.Tooltiplist.cloneWithRows([{'title':'Help','functions':'help'},{'title':'Exit League','functions':'exitLeague',}]),
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
      
      handleNetworkErrors(response){
            this.setState({
              NetworkResponcePostRun:response.status,
            })
            return response.json();
        }

      exitLeague(){
        var data = new FormData();
        data.append("user",this.state.user.user_id)
        data.append("team_code",this.state.user.team_code)
        data.append("is_logout",'true');
        fetch(apis.employeetoteamApi,{
            method: 'put',
            headers: {  
              'Authorization':"Bearer "+ this.props.user.auth_token,
              'Content-Type': 'multipart/form-data'
            },
            body:data,      
          })
          .then(this.handleNetworkErrors.bind(this))
          .then( jsonData => {
            let userData = {
              team_code:jsonData.team_code
            }
            // first user, delta values
             AsyncStorage.mergeItem('USERDATA', JSON.stringify(userData), () => {
             AsyncStorage.getItem('USERDATA', (err, result) => {
               AsyncStorage.removeItem('teamleaderBoardData',(err) => {  
              });
              this.navigateTOhome();
             })
            }) 
          }).catch((error)=>{
          })
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
                BannerData:boardData.impactleague_banner,
                leaguename:boardData.impactleague_name,
                total_amount:boardData.total_amount,
                total_members: boardData.total_members,
                total_runs: boardData.total_runs,
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
        var token = this.props.user.auth_token;
        var userdata = this.props.user;
        var url = apis.ImpactLeagueTeamLeaderBoardV2Api;
        fetch(url,{
          method: "GET",
          headers: {  
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
          }
        })
        .then( response => response.json() )
        .then( jsonData => {

          CleverTap.profileSet({'Name': userdata.first_name +' '+userdata.last_name, 'UserId':userdata.user_id , 'Email': userdata.email,'Identity':userdata.user_id,'LeagueName':jsonData.impactleague_name});
          this.setState({
            LeaderBoardData: this.state.LeaderBoardData.cloneWithRows(jsonData.results),
            loaded: true,
            refreshing:false,
            BannerData:jsonData.impactleague_banner,
            total_amount:jsonData.total_amount,
            total_members:jsonData.total_members,
            total_runs:jsonData.total_runs,
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
        console.log('NavigateToDetail Start');
        if(typeof this.props.navigator != 'undefined'){
          this.props.navigator.push({
            id:'impactleagueleaderboard',
            title: rowData.team_name,
            navigator: this.props.navigator,
            passProps:{user:this.state.user, Team_id:rowData.team_id,team_name:rowData.team_name}
          })
        }
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
        var textColor=(me.state.user.team_code === rowData.team_id)?'#fff':"#4a4a4a";
        var backgroundColor =(me.state.user.team_code === rowData.team_id)?styleConfig.light_sky_blue:'#fff';
        return (
          <View style={{justifyContent: 'center',alignItems: 'center',}}>
            <TouchableOpacity onPress={()=>this.NavigateToDetail(rowData)} style={[styles.cardLeaderBoard,{backgroundColor:backgroundColor}]}>
              <Text style={{fontFamily:styleConfig.MontSerratBold,fontWeight:'800',fontSize:styleConfig.ListViewTitelText,color:textColor,}}>{rowID}</Text>
              <Text numberOfLines={1} style={[styles.txt,{color:textColor,flex:1}]}>{this.capitalizeFirstLetter(rowData.team_name)}</Text>
              <View style={{justifyContent: 'center',alignItems: 'center',}}>
          
               <Text style={[styles.txtSec,{color:textColor}]}> <Icon2 style={{color:textColor,fontSize:styleConfig.ListViewTitelText,fontWeight:'800'}}name={me.state.my_currency.toLowerCase()}></Icon2> {(this.state.my_currency == 'INR' ? parseFloat(rowData.amount).toFixed(0) : parseFloat(rowData.amount/this.state.my_rate).toFixed(2)) } </Text> 
              </View>             
            </TouchableOpacity>
          </View>
        );
      
      }
      renderLoadingView() {
        return (
          <View style={{height:deviceHeight}}>
            <NavBar title={this.state.leaguename} leftIcon={this.leftIconRender()}/>
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
              <Icon style={{color:'black',fontSize:responsiveFontSize(3.5),fontWeight:'bold',opacity:.80}}name={(this.props.data === 'fromshare')?'md-home':'ios-arrow-back'}></Icon>
            </TouchableOpacity>
          )
        }



        rightIconRender(){
        return(
            <TouchableOpacity style={{height:60,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'flex-end',paddingRight:responsiveWidth(6.1)}} onPress={()=>this.exitLeaguepopu()} >
              <Icon style={{color:'black',fontSize:responsiveFontSize(3.5),fontWeight:'bold',opacity:.80,}}name={'md-more'}></Icon>
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

        return(
          <TouchableOpacity onPress={()=> this.onclickpopuRow(rowData)}style={{width:200,height:50,justifyContent: 'center',paddingLeft:10,}}>
            <Text>{rowData.title}</Text>
          </TouchableOpacity >
        )
      }
      

      onclickpopuRow(rowData){

        if (rowData.functions === 'exitLeague') {
          return this.exitLeague();
        }else if(rowData.functions === 'help'){
          return this.navigateTOhelpCenter();
        }
      } 



      capitalizeFirstLetter (userName) {
        return userName.charAt(0).toUpperCase() + userName.slice(1);
       }
      

      render(rowData,jsonData) {
        if (this.state.isMounted) {

        if (this.state.user) {
        if (this.state.user.team_code != 0) {
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }


        return (

        <View style={{height:deviceHeight,width:deviceWidth}}>
          <NavBar title={this.state.leaguename} leftIcon={this.leftIconRender()} rightIcon = {this.rightIconRender()} />
          <View style={styles.ImpactLeagueBanner}>
              <Swiper style={styles.wrapper} height={styleConfig.sliderHeightIL} width={deviceWidth} showsButtons={false} autoplay={true} autoplayTimeout = {4}>
                <View>
              <Image source={{uri:this.state.BannerData}} style={{height:styleConfig.sliderHeightIL-10,width:deviceWidth,backgroundColor:'white'}} resizeMode ={'contain'} >
              </Image>
                </View>
                <View style={styles.slide3}>
                 <Image source={require('../../images/impactleaguebanner.png')} style={styles.shadow}>         
                 
                  <View style={{alignItems:'center', justifyContent:'center',paddingTop: responsiveHeight(10)}}>
                      <Text style={{fontSize:styleConfig.FontSizeDisc+2,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily}}>Total Raised</Text>
                      <Text style={{fontSize:styleConfig.fontTotalRaised,top:responsiveHeight(1), color:styleConfig.light_sky_blue,fontWeight:'500',fontFamily:styleConfig.FontFamily}} ><Icon2 style={{color:styleConfig.orange,fontSize:styleConfig.fontSizerImpact-5,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}></Icon2>
                      {typeof this.state.total_amount == 'undefined' ? 0 :  (this.state.my_currency == 'INR' ? parseFloat(this.state.total_amount).toFixed(0) : parseFloat(this.state.total_amount/this.state.my_rate).toFixed(2)) }
                      </Text>
                  </View>
                    <View style={{flex: 1, marginTop:15, flexDirection:'row'}}>
                      <View style={{flex:1, justifyContent:'center',paddingLeft:20,}}>
                      <Text style={{fontSize:styleConfig.FontSizeTitle+5, color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily, textAlign:'left'}} > 
                      {typeof this.state.total_runs == 'undefined' ? 0 :  this.state.total_runs }
                      </Text>
                      <Text style={{fontSize:styleConfig.fontSizerlabel, fontFamily: styleConfig.FontFamily, color:'grey'}}> Walk/Runs</Text>
                      </View>

                      <View style={{flex:1, justifyContent:'center',paddingRight:20,}}>
                        <Text style={{fontSize:styleConfig.FontSizeTitle+5, color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily:styleConfig.FontFamily, textAlign:'right'}} >
                          {typeof this.state.total_members == 'undefined' ? 0 :  this.state.total_members }
                        </Text>
                        <Text style={{fontSize:styleConfig.fontSizerlabel, fontFamily: styleConfig.FontFamily, color:'grey',textAlign:'right'}}> Members </Text>
                      </View>
                    </View>

                </Image>
                
                </View>
              </Swiper>
             
          </View>
          <View>
           {this.swwipeDowntoRefress()}
           </View>
              <ListView 
               refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}/>}
                dataSource={this.state.LeaderBoardData}
                renderRow={this.renderRow}
                style={styles.container}>
                <View style={{width:deviceWidth,height:20,backgroundColor:'red'}}></View>
              </ListView>
              {this.openTooltip()}
          </View>
        );
        }else{
          return(
            <View>
             <ImpactLeagueCode user = {this.state.user} getUserData = {this.getUserData} />
             </View>
            )
        }
       }else{
          return(
            <LodingScreen/>
            )
       }
     }
      }


    componentWillUnmount() {
      this.setState({
        isMounted:false,
      })
    }

}

const styles = StyleSheet.create({
 wrapper: {
  },
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    height:((deviceHeight)/2)-100,
    width:deviceWidth,

  },
  slide3: {
    height:styleConfig.sliderHeightIL-10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Montserrat-Regular',
    flex: 1,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor:'white',
    height:styleConfig.sliderHeightIL-6-styleConfig.navBarHeight-20,
    top:5,
  },
    shadow: {
        height:styleConfig.sliderHeightIL,
        flex: 1,
        width: deviceWidth,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },

    ImpactLeagueBanner:{
      height:styleConfig.sliderHeightIL,
      width:deviceWidth,
      top:6,
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {
        height: 4,
      },
    },

    page:{
      marginLeft:50,
      flex:-1,
      width:deviceWidth-100,
      height:200,
      backgroundColor:'white',
      paddingLeft:10,
      paddingRight:10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {
        height: 4,
      },
      borderRadius:5,
    },

  cardLeaderBoard:{
    alignItems: 'center',
    flexDirection:'row',
    padding:20,
    width:deviceWidth,
    height:styleConfig.ListViewHeight,
    borderBottomWidth:1,
    borderColor:'#979797',
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
    fontSize: styleConfig.ListViewTitelText,
    fontWeight:'800',
    textAlign: 'left',
    marginLeft:responsiveWidth(6),
    fontFamily: styleConfig.MontSerratBold,
  },
  txt3: {
    color:'white',
    fontSize: styleConfig.ListViewTitelText,
    fontWeight:'800',
    fontFamily: styleConfig.MontSerratBold,
  },
  txtSec:{
   fontSize:styleConfig.ListViewTitelText,
   fontWeight:'800',
   textAlign:'center',
   fontFamily: styleConfig.MontSerratRegular,
  },
});
 export default ImpactLeague;