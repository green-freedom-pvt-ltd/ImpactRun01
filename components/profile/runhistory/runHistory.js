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
  TextInput,
} from 'react-native';
import apis from '../../apis';
import styleConfig from '../../styleConfig';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Ionicons';
import LoginBtns from '../../login/LoginBtns';
import commonStyles from '../../styles';
import BackgroundFetch from "react-native-background-fetch";
import Modal from '../../downloadsharemeal/CampaignModal'
import KeyboardSpacer from 'react-native-keyboard-spacer';

class RunHistory extends Component {

     constructor(props) {
        super(props);
        this.getWeightLocal();
        var ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1.version !== row2.version,
          sectionHeaderHasChanged: (section1, section2) => section1.version !== section2.version,
        });
        this.state = {
          rowData:[],
          runHistoryData: ds.cloneWithRowsAndSections([]),
          loaded: false,
          refreshing: false,
          open:false,
          user:null ,
          loadingFirst:false,
          newarray:false,
          enterWeightmodel:false,
          someData:null,
        };
        this.renderRunsRow = this.renderRunsRow.bind(this);
        this.fetchRunhistoryupdataData = this.fetchRunhistoryupdataData.bind(this);
        this.covertmonthArrayToMap = this.covertmonthArrayToMap.bind(this);

      }



      componentDidMount() {
         this.state.someData =  this.props.rawData
         AsyncStorage.getItem('runversion', (err, result) => {
            this.setState({
              runversion:JSON.parse(result).runverison,
            })
          })
        if (this.state.someData != null) {
        this.setState({
          runHistoryData:this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.props.rawData)),
        })
       }else{
       }
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



      removeallRun(){
          AsyncStorage.removeItem('fetchRunhistoryData',(err) => {
              console.log("fetchRunhistoryDataerr",err);
         });

      }

  


      onPressFlagedRun(rowData){
       AlertIOS.alert('Flagged Run','We found some error with this run, this will not be recorded. Do give feedback for this run, if you have any.',
         [
         {text: 'OK',},
         {text: 'FEEDBACK', onPress: () => this.GiveFeedback(rowData)}
         ],);
      }

      renderSectionHeader(sectionData, category) {
        return (
          <View style={[commonStyles.Navbar,{height:30,width:deviceWidth,justifyContent:'flex-start',paddingTop:0,paddingLeft:5}]}>
          <Text style={commonStyles.menuTitle2}>{category}</Text>
          </View>
        )
      }
      GiveFeedback(rowData){
        this.setState({
          open:true,
          runpostdata:JSON.stringify(rowData),
        })
      }

      postRunFeedback(){
         var user_id = this.props.user.user_id;
         var date = new Date();
         var feebback = 'Feedback by user: '+"Date :"+date+" "+this.state.runpostdata+"  Feedback Message: "+this.state.text;
         fetch(apis.UserFeedBack, {
            method: "post",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
            "feedback":feebback,
            "user_id":user_id,
            })
          })
          .then((response) => response.json())
          .then((response) => {
            this.closemodel();
            AlertIOS.alert('Thank you for giving your feedback');
          })
          .catch((err) => {
            console.log('err',err);
          })

      }

    modelView(){
      return(
        <Modal
        style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
           isOpen={this.state.open}
             >
            <View style={styles.modelWrap}>
              <Text style={{textAlign:'center', marginBottom:5,color:styleConfig.greyish_brown_two,fontWeight:'500',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,}}>FEEDBACK</Text>
              <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
               <View>
                 <TextInput
                 placeholder="Enter your feedback here"
                 style={{width:deviceWidth-100,height:(deviceHeight/10)-20,borderColor:'grey',borderWidth:1,padding:1,paddingLeft:5,fontSize:12}}
                 multiline = {true}
                 numberOfLines = {6}
                 onChangeText={(text) => this.setState({text})}
                 value={this.state.text}
                 />
                </View>
                <View style={styles.modelBtnWrap}>
                  <TouchableOpacity style={styles.modelbtn} onPress ={()=>this.closemodel()}><Text style={styles.btntext}>CLOSE</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.modelbtn}onPress ={()=>this.postRunFeedback()}><Text style={styles.btntext}>SUBMIT</Text></TouchableOpacity>
                </View>
              </View>
            </View>
            <KeyboardSpacer/>
          </Modal>
        )
      }
     
      getWeightLocal(){
        AsyncStorage.getItem('USERDATA',(err,result)=>{
          if (result != null) {
          var userData = JSON.parse(result);
          if (userData.body_weight != null) {
            this.setState({
              weight:userData.body_weight,
            })
          }else{
            this.setState({
              enterWeightmodel:true,
            })
          }
         }else{
          return;
         }
        })
 
      }

      putUserWeight(){
        var user_id = this.props.user.user_id;
        var auth_token = this.props.user.auth_token;
        this.closemodel();
        fetch(apis.userDataapi + user_id + "/", {
            method: "put",
            headers: {  
              'Authorization':"Bearer "+ auth_token,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
            "body_weight":this.state.bodyweight,
            })
          })
          .then((response) => response.json())
          .then((response) => { 
            let userbodyweight = {
              body_weight:response.body_weight
            }
            
            AsyncStorage.mergeItem('USERDATA',JSON.stringify(userbodyweight),()=>{
              this.props.getUserData();
            var userWeight = response.body_weight;
              this.setState({
                weight:userWeight,
              });
          })    
          .catch((err) => {
            console.log('err',err);
            if (err != null) {
              this.setState({
                enterWeightmodel:true,
              })
            };
          })
      }



    modelViewEnterWeight(){
      return(
        <Modal
        style={[styles.modelStyle,{backgroundColor:'rgba(12,13,14,0.1)'}]}
           isOpen={this.state.enterWeightmodel}
             >
            <View style={styles.modelWrap}>
              <View  style={styles.contentWrap}>
                <View style={styles.iconWrapmodel}>
                  <Icon3 style={{color:"white",fontSize:30,}} name={'md-create'}></Icon3>
                </View>
                <Text style={{textAlign:'center',marginTop:10,margin:5,color:styleConfig.greyish_brown_two,fontWeight:'600',fontFamily: styleConfig.FontFamily,width:deviceWidth-100,fontSize:25}}>ENTER BODY WEIGHT</Text>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={{textAlign:'center', marginBottom:10,color:styleConfig.greyish_brown_two,fontWeight:'400',fontFamily: styleConfig.FontFamily,fontSize:15}}>Your body weight is required to calculate calories burnt in every run or walk </Text>
                  <TextInput
                    placeholder="Enter Your weight in KG"
                    style={{width:deviceWidth-100,height:40,borderColor:'grey',borderWidth:1,padding:1,paddingLeft:5,fontSize:12}}
                    multiline = {true}
                    numberOfLines = {1}
                    keyboardType = "numeric"
                    onChangeText={(bodyweight) => this.setState({bodyweight})}
                    value={this.state.bodyweight}
                  />
                  <View style={styles.modelBtnWrap}>
                    <TouchableOpacity style={styles.modelPutweight}onPress ={()=>this.putUserWeight()}><Text style={styles.btntext}>SUBMIT</Text></TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
             <KeyboardSpacer/>
          </Modal>
        )
      }


      closemodel(){
        this.setState({
          open:false,
          enterWeightmodel:false,
          text:'',
        })
      }

      EnterWeight(){
        this.setState({
          enterWeightmodel:true,
        })
      }

      whyIamNotSeeingCaloriePopup(){
         AlertIOS.alert(
            'No calorie data',
            "We couldn't count calories as we didn't have your weight then. But no worries! We will count calories from now on :)",
              {text: 'OK', onPress: () => console.log('OK'), style: 'cancel'}     

            )
      }

      renderRunsRow(rowData) {
        if (rowData) {
        if (this.state.weight != null) {
          var colorie = (rowData.calories_burnt === null)? <TouchableOpacity onPress={()=> this.whyIamNotSeeingCaloriePopup()}><Text>--</Text></TouchableOpacity>:<Text style={styles.runContentText}>{parseFloat(rowData.calories_burnt).toFixed(1)} cal</Text>;
        }else{
         var colorie = (rowData.calories_burnt === null)? <TouchableOpacity onPress={()=> this.EnterWeight()}><Text>--</Text></TouchableOpacity>:<Text style={styles.runContentText}>{parseFloat(rowData.calories_burnt).toFixed(1)} cal</Text>;
        }
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
          <TouchableHighlight onPress={()=> this.onPressFlagedRun(rowData)}underlayColor="#dddddd">
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
                   <View onPress={()=> this.EnterWeight()}style={styles.runContent}>
                    {colorie}
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
                  <View onPress={()=> this.EnterWeight()}style={styles.runContent}>
                    {colorie}
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
              <LoginBtns />
            </View>
          )
        }
      }

      fetchRunhistoryupdataData(){
        var mergerowData = [];
        var token = this.props.user.auth_token;
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
          console.log('response: ',jsonData)
           if(jsonData.count > 0 ){
           var runversion = jsonData.results;
           var array = this.props.rawData;
           runversion.forEach(function(item) {         
                 console.log("array",array)   
                 objIndex = array.findIndex(obj => obj.start_time == item.start_time);
                 var arrray1 = array[objIndex] = item;
                                         
             })
            this.rows = array
                console.log("runHistoryData",this.rows);
                 this.setState({
                   runHistoryData:this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.rows)),
                   refreshing:false,
                 });
                 let fetchRunhistoryData = this.rows;
                 AsyncStorage.setItem('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData), () => {

                 })


           
           // console.log('Rows :' , this.rows);


           
           this.props.getRunCount();
           this.props.fetchAmount();
            if (jsonData != null || undefined) {

                var newDate = new Date();
                var convertepoch = newDate.getTime()/1000
                var epochtime = parseFloat(convertepoch).toFixed(0);
                let responceversion = {
                  runversion:epochtime
                }
                AsyncStorage.mergeItem("runversion",JSON.stringify(responceversion),()=>{
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
         .catch(function(err) {
          this.setState({
            refreshing:false,
          })
          console.log('err123',err);
          return err;

        })


      }



      nextPage(){
        if (this.state.nextPage != null) {
        var token = this.props.user.auth_token;
        var url = this.state.nextPage;
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
            loadingFirst:true,
            RunCount:jsonData.count,
          });

          var newDate = new Date();
          var convertepoch = newDate.getTime()/1000
          var epochtime = parseFloat(convertepoch).toFixed(0);
          let responceversion ={
            runversion:epochtime
          }
          AsyncStorage.mergeItem("runversion",JSON.stringify(responceversion),()=>{
            this.setState({
              runversion:responceversion
            })
          })
         .done();
         
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
        this.setState({
          loadingFirst:false,
        })
        this.props.getRunCount();
        this.props.fetchAmount();
       }
      }


      covertmonthArrayToMap(rowData) {
        if (rowData) {
        let _this = this;
        var rundateCategory = {}; // Create the blank map
        var rows = rowData;
        rows.forEach(function(runItem) {
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

      goBack(){
          this.props.navigator.pop({});
      }

      render(rowData) {
        var fetchingRun = this.props.fetchRunData;
        var user = this.props.user || 0;
        if (Object.keys(user).length) {
          return (
            <View>
              <View style={commonStyles.Navbar}>
                <TouchableOpacity style={{left:0,position:'absolute',height:60,width:60,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',}} onPress={()=>this.goBack()} >
                  <Icon3 style={{color:'white',fontSize:30,fontWeight:'bold'}}name={(this.props.data === 'fromshare')?'md-home':'ios-arrow-back'}></Icon3>
                </TouchableOpacity>
                  <Text numberOfLines={1} style={commonStyles.menuTitle}>{'Run History'}</Text>
              </View>
              <View style={{height:deviceHeight}}>
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
                  {this.runLodingFirstTime()}
                  {this.modelView()}
                  {this.modelViewEnterWeight()}

              </View>
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

      runLodingFirstTime(){
        if (this.state.loadingFirst) {
        return(
          <View style={styles.RunlodingFirstTimeView}>
          <ActivityIndicatorIOS color={'white'} size="small" ></ActivityIndicatorIOS>
          <Text style={styles.btntext} >Loading all runs ...</Text>
          </View>
          )
        }else{
          return;
        }
      }

  };




const styles = StyleSheet.create({

  RunlodingFirstTimeView:{
   justifyContent: 'center',
   alignItems: 'center',
   width:deviceWidth,
   height:60,
   top:-50,
   backgroundColor:styleConfig.bright_blue,
  },

  modelBtnWrap:{
    width:deviceWidth-100,
    flexDirection:'row',
    justifyContent: 'space-between',
  },

  modelbtn:{
    marginTop:(deviceHeight/10)-50,
    padding:8,
    width:((deviceWidth-120)/2)-10,
    alignItems: 'center',
    borderRadius:5,
    backgroundColor:styleConfig.bright_blue,
  },

  btntext:{
    color:'white',
    fontFamily: styleConfig.FontFamily,

  },

  modelWrap:{
    top:-70,
    padding:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    paddingBottom:5,
    borderRadius:5,
   },


  modelStyle:{
    justifyContent: 'center',
    alignItems: 'center',
   },

   iconWrapmodel:{
     justifyContent: 'center',
     alignItems: 'center',
     height:70,
     width:70,
     marginTop:-55,
     borderRadius:35,
     backgroundColor:styleConfig.bright_blue,
     shadowColor: '#000000',
     shadowOpacity: 0.4,
     shadowRadius: 4,
     shadowOffset: {
      height: 2,
     },
   },
   contentWrap:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    width:deviceWidth-100,
   },
   modelBtnWrap:{
    marginTop:10,
    width:deviceWidth-100,
    flexDirection:'row',
    justifyContent: 'space-between',
   },

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
    marginLeft:5,
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
  modelPutweight:{
    flex:1,
    height:40,
    margin:5,
    borderRadius:5,
    backgroundColor:styleConfig.pale_magenta,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext:{
    color:"white",
    textAlign:'center',
    margin:5,
    fontWeight:'600',
    fontFamily: styleConfig.FontFamily,
  },
});

export default RunHistory;