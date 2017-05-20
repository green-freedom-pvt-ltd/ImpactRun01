import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  ListView,
  ScrollView,
  AppRegistry,
  Dimensions,
  ActivityIndicatorIOS,
  RefreshControl,
  AsyncStorage,
  TouchableOpacity,
  AlertIOS,
} from 'react-native';
import apis from '../../apis';
import styleConfig from '../../styleConfig';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import BackgroundJob from 'react-native-background-job';
import LoginBtns from '../../login/LoginBtns';
import commonStyles from '../../styles';
import BackgroundFetch from "react-native-background-fetch";


class RunHistroy extends Component {  
     

     constructor(props) {
        super(props);
        this.fetchRunDataLocally();
        var ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1.version !== row2.version,
          sectionHeaderHasChanged: (section1, section2) => section1.version !== section2.version,
        });
        this.state = {
           rowData:[],
          runHistoryData: ds.cloneWithRowsAndSections([]),
          loaded: false,
          refreshing: false,   
        };
        this.renderRunsRow = this.renderRunsRow.bind(this);
      }
      


      componentDidMount() {
         BackgroundFetch.configure({
          stopOnTerminate: false
         }, function() {
          this.fetchRunhistoryupdataData();
          
          // To signal completion of your task to iOS, you must call #finish!
          // If you fail to do this, iOS can kill your app.
          BackgroundFetch.finish();
        }, function(error) {
        });
      }

      
      
      
      fetchRunDataLocally(){      
        AsyncStorage.multiGet(['UID234'], (err, stores) => {
        stores.map((result, i, store) => {1
          let key = store[i][0];
          let val = store[i][1];
          let user = JSON.parse(val);
            this.setState({
              user:user,
              rawData: [],
            })
         
           AsyncStorage.getItem('nextpage', (err, result) => {
            this.setState({
              nextPage:JSON.parse(result),
            })
            
            })
            AsyncStorage.getItem('runversion', (err, result) => {
            this.setState({
              runversion:JSON.parse(result),
            })
          })
          AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {           
            var RunData = JSON.parse(result);
            if (result != null || undefined) {
              AlertIOS.alert('local se');
              this.setState({
                rawData: this.state.rawData.concat(RunData),
                loaded: true,
                runHistoryData:this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.state.rawData.concat(RunData))),
              })
            }else{
               this.fetchRunhistoryData();              
            }
          }); 
        }); 
        });
      }


     isFlagedRun(rowData){
      if (rowData.is_flag === false) {
      return(
       <Icon style={{color:'black',fontSize:20,margin:10}} name ="error_outline">error_outline</Icon>
       )
      }else{
        return;
      }
     }
     tooltip(){
       setState({
        shoe:true,
       })
     }
     
     
      fetchRunhistoryData() {
        var token = this.state.user.auth_token;
        var url = apis.runListapi;
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
            rawData: this.state.rawData.concat(jsonData.results),
            runHistoryData: this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.state.rawData.concat(jsonData.results))),
            loaded: true,
            refreshing:false,
            RunCount:jsonData.count,
            nextPage:jsonData.next,
          });
          if (this.state.nextPage != null) {

          fetch(this.state.nextPage,{
          method: "GET",
          headers: {  
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
            }
          })
          
          .then( response => response.json())
          .then( jsonDataobj => {
            this.setState({
              rawData: this.state.rawData.concat(jsonDataobj.results),
              runHistoryData: this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.state.rawData.concat(jsonDataobj.results))),
              nextPage:jsonDataobj.next,
              RunCount:jsonDataobj.count,
            })
            let RunCount = this.state.RunCount;
            AsyncStorage.setItem('RunCount', JSON.stringify(RunCount));
               if (jsonData.results != null || undefined) {
                 AsyncStorage.removeItem('runversion',(err) => {
                });
                var newDate = new Date();
                var convertepoch = newDate.getTime()/1000
                var epochtime = parseFloat(convertepoch).toFixed(0);
                let responceversion = epochtime;
                AsyncStorage.setItem("runversion",JSON.stringify(responceversion),()=>{
                 AsyncStorage.getItem('runversion', (err, result) => {
                  this.setState({
                    runversion:JSON.parse(result),
                  })
                })
                });
              }else{
                return;
              }
              let nextpage = this.state.nextPage;
              AsyncStorage.setItem('nextpage',JSON.stringify(nextpage)); 
              var storepage =  this.state.rawData.concat();
              let fetchRunhistoryData = this.state.rawData.concat();
              AsyncStorage.setItem('fetchRunhistoryData',JSON.stringify(storepage));
              this.LoadmoreView();
          })
          }else{
            return;
          }
        })
         .catch( error => console.log('Error fetching: ' + error) );
                
      }

      removeallRun(){
          AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
         });
      }


      onPressFlagedRun(){
       AlertIOS.alert('Flagged Run','We found some error with this run, this will not be recorded. Do give feedback for this run, if you have any.',
         [
         {text: 'OK',},
         {text: 'FEEDBACK', onPress: () => this.GiveFeedback()}
         ],);
      }

      renderSectionHeader(sectionData, category) {
        return (
          <View style={[commonStyles.Navbar,{height:30,width:deviceWidth,justifyContent:'flex-start',paddingTop:0,paddingLeft:5}]}>
          <Text style={commonStyles.menuTitle2}>{category}</Text>
          </View>
        )
      }


      renderRunsRow(rowData) {
        if (rowData) {
        var RunAmount=parseFloat(rowData.run_amount).toFixed(0);
        var RunDistance = parseFloat(rowData.distance).toFixed(1);
        var RunDate = rowData.start_time;
        var day = RunDate.split("-")[2];
        var time = rowData.run_duration;        
        var hours = time.split(":")[0];
        var minutes = time.split(":")[1];
        var seconds = time.split(":")[2];
        var hrsAndMins = (hours != '00')? hours+" hrs "+ minutes+" mins "+ seconds +" sec":(minutes != '00')? minutes+" mins " + seconds+" sec":seconds+" sec";
        var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var MyRunMonth = monthShortNames[RunDate.split("-")[1][0]+ RunDate.split("-")[1][1]-1]; 
        var day = RunDate.split("-")[2][0]+RunDate.split("-")[2][1]+'  '+MyRunMonth+'  ' + RunDate.split("-")[0];
          var backgroundColor = (rowData.is_flag)?'#f0f0f0':'white';
          var textDecoration = (rowData.is_flag)?'line-through':'none';
        if (rowData.is_flag) {
      
        return (
          <TouchableHighlight onPress={()=> this.onPressFlagedRun()}underlayColor="#dddddd">
            <View style={[styles.container,{backgroundColor:backgroundColor}]}>
              <View style={styles.rightContainer}>          
              <View style={styles.runDetail}>
                <View style={styles.cause_run_titleWrap}>
                <View>
                 <Text style={styles.StartTime}>{day}</Text>
                  <Text style={styles.title}>{rowData.cause_run_title}</Text>
                </View>
                  <Icon style={{color:'grey',fontSize:20,margin:10,marginRight:20,}} name ={'error'}></Icon>
                </View>
                <View style={{flexDirection:'row',flex:1}}>
                  <View style={styles.runContent}>
                    <Text style={[styles.runContentText,{textDecorationLine:textDecoration}]}>{RunDistance} Km</Text>
                  </View>
                  <View style={styles.runContent}>
                    <Text style={[styles.runContentText,{textDecorationLine:textDecoration}]}>{RunAmount} <Icon2 style={{color:styleConfig.greyish_brown_two,fontSize:styleConfig.FontSize3,fontWeight:'400'}}name="inr"></Icon2></Text>
                  </View>
                  <View style={styles.runContent}> 
                    <Text style={[styles.runContentText,{textDecorationLine:textDecoration}]}>{hrsAndMins}</Text>
                  </View>
               </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        );
       }else{

          return (
          <TouchableHighlight underlayColor="#dddddd">
            <View style={[styles.container,{backgroundColor:backgroundColor}]}>
              <View style={styles.rightContainer}>          
              <View style={styles.runDetail}>
                <View style={styles.cause_run_titleWrap}>
                <View>
                 <Text style={styles.StartTime}>{day}</Text>
                  <Text style={styles.title}>{rowData.cause_run_title}</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row',flex:1}}>
                  <View style={styles.runContent}>
                    <Text style={styles.runContentText}>{RunDistance} Km</Text>
                  </View>
                  <View style={styles.runContent}>
                    <Text style={styles.runContentText}>{RunAmount} <Icon2 style={{color:styleConfig.greyish_brown_two,fontSize:styleConfig.FontSize3,fontWeight:'400'}}name="inr"></Icon2> </Text>
                  </View>
                  <View style={styles.runContent}> 
                    <Text style={styles.runContentText}>{hrsAndMins}</Text>
                  </View>
               </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        );
       }
       };
      }

      NotLoginView(){
        if(this.props.user && Object.keys(this.props.user).length === 0 ){
        }else{
          return (
            <View style={{height:deviceHeight/2,width:deviceWidth,top:(deviceHeight/2)-210,}}>
              <LoginBtns getUserData={this.props.getUserData}/>
            </View>
          ) 
        }
      }

      fetchRunhistoryupdataData(){
        var token = this.state.user.auth_token;
        var runversionfetch =this.state.runversion;
        var url ='http://dev.impactrun.com/api/runs/'+'?client_version='+runversionfetch;
        console.log('mydataurl',url);
        fetch(url,{
          method: "GET",
          headers: {  
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
          }
        })
        .then( response => response.json() )
        .then( jsonData => {
           if(jsonData.count > 0 ){
           var runversion = jsonData.results;
           var ids = [];
           var i;
           for (i = 0; i < runversion.length; i++) {
               ids.push(runversion[i]);
           }
           var newRow = ids;
           this.rows = newRow.concat(this.state.rawData.concat());
           this.setState({
             rawData:this.rows,
             runHistoryData: this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.rows)),
             refreshing:false,         
           });
           AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
           });
           let fetchRunhistoryData = this.rows;
           AsyncStorage.setItem('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData), () => {
 
           })
           console.log('this.state.rawData.concat12(',this.state.rawData.concat()[0].version);
            if (jsonData != null || undefined) {
              AsyncStorage.removeItem('runversion',(err) => {
              });
              var newDate = new Date();
              var convertepoch = newDate.getTime()/1000
              var epochtime = parseFloat(convertepoch).toFixed(0);
              let responceversion = epochtime;
              AsyncStorage.setItem("runversion",JSON.stringify(responceversion),()=>{
               this.setState({
                 runversion:responceversion
               })
            });
           }
         }else{
          this.setState({
            refreshing:false,    
          })         
        }
        })
       
      }

      nextPage(){
        if (this.state.nextPage != null) {
        var token = this.state.user.auth_token;
        var url = this.state.nextPage;
        console.log('nextPage',)
        console.log('url',url);
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
            rawData: this.state.rawData.concat(jsonData.results),
            runHistoryData:this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.state.rawData.concat(jsonData.results))),
            loaded: true,
            refreshing:false,
            nextPage:jsonData.next,
            RunCount:jsonData.count,
          });
          let RunCount = this.state.RunCount;
          AsyncStorage.setItem('RunCount', JSON.stringify(RunCount));
          AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
         });
          AsyncStorage.removeItem('nextpage',(err) => {
         });
          let nextpage = this.state.nextPage;
          AsyncStorage.setItem('nextpage', JSON.stringify(nextpage));
          let fetchRunhistoryData = this.state.rawData.concat();
          AsyncStorage.setItem('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData), () => {
 
           })
          this.LoadmoreView();
        })
        .catch( error => console.log('Error fetching: ' + error) );
       
       }else{
        this.props.getRunCount();
        this.props.fetchAmount();
       }
      }
      

      covertmonthArrayToMap(rowData) {
        if (rowData[0].start_time != null || undefined) {
        let _this = this;
        var rundateCategory = {}; // Create the blank map
        var rows = rowData;
        rows.forEach(function(runItem) {
        console.log('runItem',runItem.start_time);
        var RunDate = runItem.start_time;
        var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var MyRunMonth = monthShortNames[RunDate.split("-")[1][0]+ RunDate.split("-")[1][1]-1]; 
        var day = RunDate.split("-")[2][0]+RunDate.split("-")[2][1]+'  '+MyRunMonth+'  ' + RunDate.split("-")[0];
        if (!rundateCategory[day]) {
          // Create an entry in the map for the category if it hasn't yet been created
          rundateCategory[day] = [];
        }
        rundateCategory[day].push(runItem);  
        });
        
        return rundateCategory;
      }else{
       return this.covertmonthArrayToMap();
     }
      }



      _onRefresh() {
        this.setState({refreshing: true});
        this.fetchRunhistoryupdataData();
      }

      LoadmoreView(){
        this.nextPage();
      }

      render(rowData) {
        var fetchingRun = this.props.fetchRunData;
        var user = this.props.user || 0;
        if (Object.keys(user).length) {
          return (
            <View style={styles.ListViewPage}>
            <TouchableOpacity  onPress={()=> this.removeallRun()}><Text style = {styles.Moretxt}>Load more</Text></TouchableOpacity>
            <ListView
               renderSectionHeader={this.renderSectionHeader}
               refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />}
                style={styles.listView}
                dataSource={this.state.runHistoryData}
                renderRow={this.renderRunsRow}/>
             </View>
              )
        }else {
            return (
            <View style={{paddingTop:10,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
               {this.NotLoginView()}
            </View>    
          )
          
         };
        } 
      };

const styles = StyleSheet.create({
  container: {
    width:deviceWidth-10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    borderRadius:5,
    paddingTop:0,
    paddingBottom:0,
    borderBottomWidth:1,
    marginBottom:5,
    borderColor:'#e1e1e8',
    shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: {
        height: 3,
      },
  },
  rightContainer: {
    flex: 1,
  },
  morebtn:{
    width:deviceWidth,
    position:'absolute',
    bottom:50,
    height:30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:styleConfig.bright_blue,
  },
  Moretxt:{
    color:'white',
    fontFamily:styleConfig.FontFamily,
  },
  title: {
    fontSize: 16,
    marginLeft:3,
    color:styleConfig.greyish_brown_two,
    fontWeight:'400',
    backgroundColor:'transparent',
    fontFamily: styleConfig.FontFamily,
  },
   StartTime: {
    fontSize: 14,
    marginLeft:4,
    color:styleConfig.brownish_grey,
    fontWeight:'400',
    backgroundColor:'transparent',
    fontFamily: styleConfig.FontFamily,
  },
  runDetail:{
    flexDirection: 'column',
    width:deviceWidth-10,
    padding:5,
    paddingRight:0
  },
  runContent: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding:5,
  },
  runContentText: {
    color:styleConfig.greyish_brown_two,
    fontWeight:'500',
    fontSize:16,
    left:-1,
    fontFamily:styleConfig.FontFamily,
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    backgroundColor: 'white',
    marginBottom:50,
  },
  ListViewPage:{
    paddingTop:5,
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
  },
  cause_run_titleWrap:{
    justifyContent:'space-between',
    flexDirection:'row',
    flex:2,
  },
});

export default RunHistroy;