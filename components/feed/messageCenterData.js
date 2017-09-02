
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
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          FeedData: ds.cloneWithRows([]),
          loaded: false,
          previewSource: '',
          error: null,
          res: null,
          value: {
            format: "png",
            quality: 0.9,
            result: "base64",
            snapshotContentContainer: false,
          },
           
        };
        this.rows = [];
        this.renderRow = this.renderRow.bind(this);
        this.NavigateToDetail = this.NavigateToDetail.bind(this);
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
          this.setState({
           FeedData: this.state.FeedData.cloneWithRows(feeddata),
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

      componentDidMount() {
        
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
            FeedData: this.state.FeedData.cloneWithRows(jsonData.results),
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
        if (rowData.message_video != "") {
          return(
            <View  style={styles.card}>
              <View style={styles.thumb}>
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
                style={styles.thumb}/>
              </View>
              <View style={{padding:10,}}>
              <View style={{borderLeftWidth:7,borderColor:'#4a4a4a',paddingLeft:10,marginTop:10,marginBottom:10,}}>
              <Text style={styles.txtSec}>{rowData.message_brief}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.txtSec}>{rowData.message_date}</Text>
                <Text style={styles.txtSec}>share</Text>
              </View>
              </View>
            </View>
              )
          }else{
            return(
               <TouchableOpacity ref={(instance) => this.rows.push(instance)} onPress={()=> this.NavigateToDetail(rowData)} style={styles.card}>
              <View style={styles.thumb}>
                <Image  style={styles.thumb} source={{uri:rowData.message_image}}></Image>
              </View>

              <View style={{padding:10,}}>
                <View style={{borderLeftWidth:7,borderColor:'#4a4a4a',paddingLeft:10,marginTop:10,marginBottom:10,}}>
                <Text style={styles.txtSec}>{rowData.message_brief}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={styles.txtSec}>{rowData.message_date}</Text>
                  <TouchableOpacity onPress={()=>this.snapshot(rowID)}>
                  <Text style={styles.txtSec}>share</Text>
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
    borderRadius:4,
    width:deviceWidth-10,
    backgroundColor:'white',
    marginTop:5,
    marginBottom:5,
  },
  txt:{
    fontSize:15,
    fontFamily: 'Montserrat-Regular',
  },
  thumb:{
    width:deviceWidth-10,
    height:deviceHeight/2-100,
  },
  txtSec:{
    color:'#4a4a4a',
    fontSize:styleConfig.fontSizerlabel,
    fontWeight:'400',
    fontFamily: 'Montserrat-Regular',
  },
 

});
 export default Feed;