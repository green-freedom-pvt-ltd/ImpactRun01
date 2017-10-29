
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
    Linking,
  } from 'react-native';
import moment from 'moment';
import messageCenter from './messageCenter';
import CauseDetail from './messageDetail'
import LodingScreen from '../../components/LodingScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import YouTube from 'react-native-youtube';
import styleConfig from '../styleConfig';
import Share, {ShareSheet, Button} from 'react-native-share';
import { takeSnapshot } from "react-native-view-shot";
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var DetailScreen = require('./messageDetail');
class Feed extends Component {
      constructor(props) {
        super(props);
         var ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1.message_center_id !== row2.message_center_id,
            sectionHeaderHasChanged: (section1, section2) => section1.message_center_id !== section2.message_center_id,
          });
         this.state = {
          FeedData: ds.cloneWithRowsAndSections([]),
          loaded: false,
          previewSource: '',
          error: null,
          res: null,
          value: {
            format: "png",
            quality: 0.9,
            result: "base64",
            snapshotContentContainer: false,
            notificationDate:'',
          },      
        };
        this.rows = [];
        this.renderRow = this.renderRow.bind(this);
        this.NavigateToDetail = this.NavigateToDetail.bind(this);
        this.covertmonthArrayToMap = this.covertmonthArrayToMap.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
      }



      covertmonthArrayToMap(rowData) {
        if (rowData) {
        console.log('rowData',rowData);
        let _this = this;
        var rundateCategory = {}; // Create the blank map
        var rows = rowData;
        rows.forEach(function(runItem) {
        var RunDate = runItem.message_date;
        var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var MyRunMonth = monthShortNames[RunDate.split("-")[1][0]+ RunDate.split("-")[1][1]-1];
        var day = RunDate.split("-")[2][0]+RunDate.split("-")[2][1]+'  '+MyRunMonth+'  ' + RunDate.split("-")[0];
        console.log("day",day);
        if (!rundateCategory[day]) {
          // Create an entry in the map for the category if it hasn't yet been created
          rundateCategory[day] = [];
        }
        rundateCategory[day].push(runItem);
        });
         console.log("rundateCategory",rundateCategory);
       return rundateCategory;
        }else{
       return this.covertmonthArrayToMap();
       }
      }

        renderSectionHeader(sectionData, category) {
        return (
          <View style={{height:30,width:deviceWidth,justifyContent:'flex-start',paddingTop:0,paddingLeft:5}}>
          <Text style={{color:'white'}}>{category}</Text>
          </View>
        )
      }

      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
       })
      }

      NavigateToDetail(rowData){
        this.props.navigator.push({
          title: 'Detail',
          component:CauseDetail, 
          navigationBarHidden: false,
          passProps:{data:rowData}
        })
      }
      
      getFeedFromlocal(){
       AsyncStorage.getItem('feedData', (err, result) => { 
          if (result != null || undefined) {
          var feeddata = JSON.parse(result);  
          console.log("faqdata",feeddata);
          let sortedFeeds = feeddata.sort((a,b) => {
          if (a.message_center_id < b.message_center_id) {
              return 1;
            }
            if (a.message_center_id > b.message_center_id) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });

          this.setState({
           FeedData:this.state.FeedData.cloneWithRowsAndSections(this.covertmonthArrayToMap(sortedFeeds)),
           loaded: true,
          })
         let feedCount =  {
          count:feeddata.length,
          };
          AsyncStorage.setItem('Feedcount', JSON.stringify(feedCount), () => {
        }); 
        }else{
          this.fetchifinternet();
        }
        });
      }

      fetchifinternet(){
         NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
               this.fetchFeedData();
            }else{
              this.getFeedFromlocal();
            } 
          }
        );
      }

      componentDidMount(rowData) {

        console.log('data',rowData);
        this.getFeedFromlocal();
      }
      
      componentWillUnmount() {
      }

      snapshot(rowID){
        var selectedRow = this.rows[rowID];
       console.log('selectedRow',selectedRow,rowID);
        takeSnapshot(selectedRow, this.state.value)
        .then(res =>
          this.state.value.result !== "file"
          ? res
          : new Promise((success, failure) =>
          // just a test to ensure res can be used in Image.getSize
          Image.getSize(
            res,
            (width, height) => (console.log(res,width,height), success(res)),
            failure
          )
          )
            
        )
        .then((res) => {
          this.setState({
            error: null,
            res,
            previewSource: { uri:
              this.state.value.result === "base64"
              ? "data:image/"+this.state.value.format+";base64,"+res
              : res }
          })

          var shareOptions = {
            // title: "ImpactRun",
            // message:"I ran "+distance+" kms and raised " +impact+ " rupees for "+cause.partners[0].partner_ngo+" on #Impactrun. Kudos "+cause.sponsors[0].sponsor_company+" for sponsoring my run.",
            url:"data:image/"+this.state.value.format+";base64,"+res,
            // subject: "Download ImpactRun Now " //  for email
          }
          Share.open(shareOptions)
        })
        .catch(error => (console.warn(error), this.setState({ error, res: null, previewSource: null })));
      }
      
     

      fetchFeedData() {
        var url = 'http://139.59.243.245/api/messageCenter/';
        fetch(url)
        .then( response => response.json() )
        .then( jsonData => {
          console.log('data',jsonData);
          this.setState({
            FeedData: state.FeedData.cloneWithRowsAndSections(this.covertmonthArrayToMap(jsonData.results)),
            loaded: true,
          });
          let feedCount =  {
            count:jsonData.count,
          };
        AsyncStorage.setItem('feedData', JSON.stringify(jsonData.results), () => {
        });
        AsyncStorage.setItem('Feedcount', JSON.stringify(feedCount), () => {
        });
        })
        .catch( error => console.log('Error fetching: ' + error) );
      }

      renderVideo(rowData,sectionID,rowID){
      
        this.state.notificationDate = moment(rowData.message_date).startOf('houre').fromNow();
        if (rowData.message_video != "") {
          return(
            <View  style={styles.card}>
              <View style={styles.thumbVid}>
                 <YouTube
                ref={(component) => {
                  this._youTubePlayer = component;
                }}
                videoId={rowData.message_video}           
                play={false}                     
                fullscreen={true}              
                loop={false}                    
                onReady={e => this.setState({ isReady: true })}
                onChangeState={e => this.setState({ status: e.state })}
                onChangeQuality={e => this.setState({ quality: e.quality })}
                onError={e => this.setState({ error: e.error })}
                onProgress={e => this.setState({ currentTime: e.currentTime, duration: e.duration })}
                style={styles.thumbVid}/>
              </View>
              <View style={{padding:10,}}>
              <View style={{borderColor:'#4a4a4a',paddingLeft:10,marginTop:10,marginBottom:10,}}>
              <Text style={styles.txtSec}>{rowData.message_brief}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                 <Text style={styles.txtSecdate}>{this.state.notificationDate}</Text>
                 <TouchableOpacity style={styles.shareBtn} onPress={()=>this.snapshot(rowID)}>
                    <Icon style={{color:'white',fontSize:styleConfig.fontSizerlabel+20}}name={'md-share'}></Icon>
                  </TouchableOpacity>
              </View>
              </View>
            </View>
              )
          }else{
             var ratio =[];
            Image.getSize(rowData.message_image, (width, height) => {
              ratio.push(width/height);
              this.setState({width: width, height: height,ratio:width/height});          
            });
            return(
               <TouchableOpacity ref={(instance) => this.rows.push(instance)} onPress={()=> this.NavigateToDetail(rowData)} style={styles.card}>
              <View style={styles.thumbVid}>
                <Image  style={[styles.thumb,{height:deviceWidth*ratio[0]}]} source={{uri:rowData.message_image}}></Image>
              </View>

              <View style={{padding:10,}}>
                <View style={{borderColor:'#4a4a4a',paddingLeft:10,marginTop:10,marginBottom:10,}}>
                <Text style={styles.txtSec}>{rowData.message_brief}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={styles.txtSecdate}>{this.state.notificationDate}</Text>
                  <TouchableOpacity style={styles.shareBtn} onPress={()=>this.snapshot(rowID)}>
                    <Icon style={{color:'white',fontSize:styleConfig.fontSizerlabel+20}}name={'md-share'}></Icon>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
              )
          }
      }
      

      renderRow(rowData,sectionID,rowID){
    
         var me = this;
         
         return (
          <View style={{justifyContent: 'center',alignItems: 'center',}}>
          {this.renderVideo(rowData,sectionID,rowID)}
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

      render() {
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
            <View style={{height:deviceHeight-65,width:deviceWidth}}>
               <ListView 
                renderSectionHeader={this.renderSectionHeader}
                ref={(instance) => this.list = instance}
                navigator={this.props.navigator}
                dataSource={this.state.FeedData}
                renderRow={this.renderRow}
                style={styles.container}>
              </ListView>
            </View> 
         </View>
        );
      }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e2e5e6',
    height:deviceHeight,
    width:deviceWidth,
  },
  card:{
    width:deviceWidth,
    backgroundColor:'white',
    marginTop:5,
    marginBottom:5,
  },
  txt:{
    fontSize:15,
    fontFamily: 'Montserrat-Regular',
  },
  thumb:{
    resizeMode:'cover',
    width:deviceWidth,
    height:deviceHeight/2-80,
  },
  thumbVid:{
    width:deviceWidth,
    height:deviceHeight/2-80,
  },
  txtSec:{
    color:'#4a4a4a',
    fontSize:styleConfig.fontSizerlabel+5,
    fontWeight:'400',
    fontFamily: 'Montserrat-Regular',
  },
  txtSecdate:{
    paddingLeft:10,
    color:'#7d7f82',
    fontSize:styleConfig.fontSizerlabel,
    fontFamily: 'Montserrat-Regular',
  },
  shareBtn:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#7d7f82',
  }
 

});
 export default Feed;