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
import Modal from '../../downloadsharemeal/CampaignModal'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import QuestionLists from '../../Helpcenter/listviewQuestions.js';
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
          my_rate:1.0,
          my_currency:"INR",
        };
        this.renderRunsRow = this.renderRunsRow.bind(this);
        this.fetchRunhistoryupdataData = this.fetchRunhistoryupdataData.bind(this);
        this.covertmonthArrayToMap = this.covertmonthArrayToMap.bind(this);

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
    AsyncStorage.getItem('my_distance', (err, result) => {
        this.setState({
          my_distance:JSON.parse(result),
      })
    })     

    }

        componentDidMount() {


            AsyncStorage.getItem('runversion', (err, result) => {
              console.log("result",result);

              if (result != null) {
                var version = JSON.parse(result).runversion;
                this.setState({
                  runversion:version,
                })
                console.log('runversion',this.state.runversion,version,JSON.parse(result));
              }else{
                var newDate = new Date();
                var convertepoch = newDate.getTime()/1000
                var epochtime = parseFloat(convertepoch).toFixed(0);
                let responceversion ={
                  runversion:epochtime
                }
                AsyncStorage.setItem('runversion', JSON.stringify(responceversion), () => {
                  console.log("runversion",responceversion);
                  this.setState({
                    runversion:responceversion.runversion,
                  }) 
                })
              }
              })
           
         this.state.someData =  this.props.rawData
        

        if (this.state.someData != null) {
          let sortedRuns = this.state.someData.sort((a,b) => {
            if (a.version < b.version) {
              return -1;
            }
            if (a.version > b.version) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
          this.setState({
            runHistoryData:this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(sortedRuns)),
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

      navigateBackToHelp(rowData){
        if (this.props.helpcenter) {
        this.props.navigator.push({
          title:'Select issue',         
          id:'listquestions',
          // component:QuestionLists,
          // navigationBarHidden: false,
          // showTabBar: true,
          passProps:{
            rowData:this.props.rowData,
            runData:rowData,
            data:this.props.rowList,
            getUserData:this.props.getUserData,
            user:this.props.user,
          }
        })
      }else{
        return;
      }
      }

      navigateBackToHelpFlaged(rowData){
        if (this.props.helpcenter) {
        this.props.navigator.push({
          title:'Select issue',         
          component:QuestionLists,
          navigationBarHidden: false,
          showTabBar: true,
          passProps:{
            rowData:rowData,
            data:this.props.rowList,
          }
        })
      }else{
       this.onPressFlagedRun(rowData);
      }
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
        var hrsAndMins = (hours != '00')? (hours*60)+ parseInt(minutes)+" min":(minutes != '00')? minutes+" min":seconds+" sec";
        var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var MyRunMonth = monthShortNames[RunDate.split("-")[1][0]+ RunDate.split("-")[1][1]-1];
        var day = RunDate.split("-")[2][0]+RunDate.split("-")[2][1]+'  '+MyRunMonth+'  ' + RunDate.split("-")[0];
        var backgroundColor = (rowData.is_flag)?'#f0f0f0':'white';
        var textDecoration = (rowData.is_flag)?'line-through':'none';
        if (rowData.is_flag) {
        return (
          <TouchableHighlight onPress={()=> this.navigateBackToHelpFlaged(rowData)}underlayColor="#dddddd">
            <View style={[styles.container,{backgroundColor:backgroundColor}]}>
              <View style={styles.rightContainer}>          
              <View style={styles.runDetail}>
                <View style={styles.cause_run_titleWrap}>
                <View>
                  <Text style={styles.title}>{rowData.cause_run_title}</Text>
                </View>
                  <Icon style={{color:'grey',fontSize:20,margin:10,marginRight:20,}} name ={'error'}></Icon>
                </View>
                <View style={{flexDirection:'row',flex:1}}>
                  <View style={styles.runContent}>
                    <Text style={[styles.runContentText,{textDecorationLine:textDecoration}]}>{(this.state.my_distance == 'miles' ? parseFloat(RunDistance*0.621).toFixed(1) : RunDistance)} {(this.state.my_distance == 'miles' ? 'mi' : 'km')}</Text>
                  </View>
                  <View style={styles.runContent}>
                    <Text style={[styles.runContentText,{textDecorationLine:textDecoration}]}><Icon2 style={{color:styleConfig.greyish_brown_two,fontSize:styleConfig.FontSize3,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}></Icon2> {(this.state.my_currency == 'INR' ? RunAmount : parseFloat(RunAmount/this.state.my_rate).toFixed(2))} </Text>
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
          <TouchableHighlight onPress = {()=>this.navigateBackToHelp(rowData)} underlayColor="#dddddd">
            <View style={[styles.container,{backgroundColor:backgroundColor}]}>
              <View style={styles.rightContainer}>          
              <View style={styles.runDetail}>
                <View style={styles.cause_run_titleWrap}>
                <View>
                  <Text style={styles.title}>{rowData.cause_run_title}</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row',flex:1}}>
                  <View style={styles.runContent}>
                    <Text style={styles.runContentText}>{(this.state.my_distance == 'miles' ? parseFloat(RunDistance*0.621).toFixed(1) : RunDistance)} {(this.state.my_distance == 'miles' ? 'mi' : 'km')}</Text>
                  </View>
                  <View style={styles.runContent}>
                    <Text style={styles.runContentText}> <Icon2 style={{color:styleConfig.greyish_brown_two,fontSize:styleConfig.FontSize3,fontWeight:'400'}}name={this.state.my_currency.toLowerCase()}></Icon2> {(this.state.my_currency == 'INR' ? RunAmount : parseFloat(RunAmount/this.state.my_rate).toFixed(2))}</Text>
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
        var _this = this;
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
            
              var newDate = new Date();
              var convertepoch = newDate.getTime()/1000
              var epochtime = parseFloat(convertepoch).toFixed(0);
              let responceversion = {
                runversion:epochtime
              }
              let keys = ['runversion'];
              AsyncStorage.multiRemove(keys, (err) => {
                AsyncStorage.setItem("runversion",JSON.stringify(responceversion),()=>{
                  _this.setState({
                     runversion:responceversion.runversion,
                   })
                });
              });
               
            var runversion = jsonData.results;
            var array = this.props.rawData;
            runversion.forEach(function(item) {
             var newRunAddedFrombackend = [];         
              console.log("array",array)   
              objIndex = array.findIndex(obj => obj.start_time == item.start_time);
              objIndexSec = array.findIndex(obj => obj.start_time != item.start_time);
             console.log("objIndexSec",objIndexSec,item.start_time,objIndex);
              if (objIndex === -1) {
                array.push(item);
              }
               array[objIndex] = item;
              })


                this.rows = array;
                console.log("runHistoryData",this.rows);
                 this.setState({
                   runHistoryData:this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.rows)),
                   refreshing:false,
                 });

                 let fetchRunhistoryData = this.rows;
                 AsyncStorage.setItem('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData), () => {

                 })
                 if (jsonData.count > 5) {
                   if (jsonData.next) {
                    var nextpage = jsonData.next
                    this.nextPage(nextpage);

                   };
                 }
         }else{
          var newDate = new Date();
            var convertepoch = newDate.getTime()/1000
            var epochtime = parseFloat(convertepoch).toFixed(0);
            let responceversion = {
              runversion:epochtime
            }
            let keys = ['runversion'];
            AsyncStorage.multiRemove(keys, (err) => {
              AsyncStorage.setItem("runversion",JSON.stringify(responceversion),()=>{
                _this.setState({
                   runversion:responceversion.runversion,
                 })
              });
            });
          _this.setState({
            refreshing:false,
          })
        }
        })
         .catch(function(err) {
          _this.setState({
            refreshing:false,
          })
          console.log('err123',err);
          return err;

        })


      }



      nextPage(nextpage){
       var _this =this;
        var token = this.props.user.auth_token;
        var url = nextpage;
        fetch(url,{
          method: "GET",
          headers: {
            'Authorization':"Bearer "+ token,
            'Content-Type':'application/x-www-form-urlencoded',
          }
        })
        .then( response => response.json() )
        .then( jsonData => {
          var nextpagesec = jsonData.next;
          console.log('jsonData',jsonData)
          var newDate = new Date();
          var convertepoch = newDate.getTime()/1000
          var epochtime = parseFloat(convertepoch).toFixed(0);
          let responceversion = {
            runversion:epochtime
          }
          let keys = ['runversion'];
          AsyncStorage.multiRemove(keys, (err) => {
            AsyncStorage.setItem("runversion",JSON.stringify(responceversion),()=>{
              _this.setState({
                 runversion:responceversion.runversion,
               })
            });
          });
               
          var runversion = jsonData.results;
          var array = this.props.rawData;
          runversion.forEach(function(item) {
            var newRunAddedFrombackend = [];         
            console.log("array",array)   
            objIndex = array.findIndex(obj => obj.start_time == item.start_time);
            objIndexSec = array.findIndex(obj => obj.start_time != item.start_time);
            console.log("objIndexSec",objIndexSec,item.start_time,objIndex);
            if (objIndex === -1) {
              array.push(item);
            }
            array[objIndex] = item;
          })
          this.rows = array;
          console.log("runHistoryData",this.rows);
          this.setState({
            runHistoryData:this.state.runHistoryData.cloneWithRowsAndSections(this.covertmonthArrayToMap(this.rows)),
            refreshing:false,
          });
          let fetchRunhistoryData = this.rows;
          AsyncStorage.setItem('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData), () => {
          })

          this.LoadmoreView(nextpagesec);
        })
        .catch( error => console.log('Error fetching: ' + error) );

       
      }


      covertmonthArrayToMap(rowData) {
        if (rowData) {
        console.log('rowData',rowData);
        let _this = this;
        var rundateCategory = {}; // Create the blank map
        var rows = rowData;
        rows.forEach(function(runItem) {
        var RunDate = runItem.start_time;
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



      _onRefresh() {
        this.setState({refreshing: true});
        this.fetchRunhistoryupdataData();
      }

      LoadmoreView(nextpagesec){
        if (nextpagesec != null) {
          this.nextPage(nextpagesec);
        };
      }

      goBack(){
          this.props.navigator.pop({});
      }

      headerFromHelp(){
        if (this.props.EmptyText) {
          return(
            <View style={{width:deviceWidth,height:50,justifyContent: 'center',alignItems: 'center',}}><Text>{this.props.EmptyText}</Text></View>
            )
        }else{
          return;
        }
      }

      render(rowData) {
        var fetchingRun = this.props.fetchRunData;
          return (
            <View>
              <View style={{height:deviceHeight-styleConfig.navBarHeight}}>
              {this.headerFromHelp()}
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
                  {this.modelView()}
                  {this.modelViewEnterWeight()}
              </View>
            </View>
          )

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
    height:deviceHeight,
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