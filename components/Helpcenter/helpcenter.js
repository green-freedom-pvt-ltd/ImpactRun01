
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    Text,
    Linking,
    RefreshControl,
    ListView,
    SegmentedControlIOS,
  } from 'react-native';
import Share, {ShareSheet, Button} from 'react-native-share';
import IconSec from 'react-native-vector-icons/Ionicons';
import commonStyles from '../styles';
import styleConfig from '../styleConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Faq from '../faq/faq';
import QuestionLists from './listviewQuestions';
import RunHistory from '../profile/runhistory/runHistory';
import EndFeedBack from './endFeedBackPage';
import NavBar from '../navBarComponent';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;


class HelpCenter extends Component {
     constructor(props) {
        super(props);
         this.fetchRunDataLocally();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            HelpCenterTabs: ds.cloneWithRows([]),
        };
        this.renderRow = this.renderRow.bind(this);
      }
        


     
      
       fetchRunDataLocally(){
          AsyncStorage.getItem('fetchRunhistoryData', (err, result) => {
            var RunData = JSON.parse(result);
            if (result != null || undefined) {
              this.setState({
                rawData: RunData,
                EmptyText:'Select workout with issue',
              })
            }else{
               this.setState({
                EmptyText: 'no runs in runhistory',
              })
            }
          });
       }

       navigateToNextPage(rowData){
        if (rowData.name === 'I have an issue with past workout') {
          return this.navigateToRunhistory(rowData);
        }else if(rowData.name === 'I have a question'){
           return this.navigateToHelp(rowData);
        }else if(rowData.name === 'I have a suggestion'){
            return this.navigateToFeedbackPage(rowData);
        }else if(rowData.name === 'My issue isn\'t listed here'){
          return this.navigateToListOfQuestions(rowData);
        }

       }
       
        navigateToHelp(rowData){
        this.props.navigator.push({
          title:'Questions',         
          id:'faq',
          passProps:{
            rowData:rowData,
            user:this.props.user,
          }
        })
      }

      navigateToFeedbackPage(rowData){
        this.props.navigator.push({
          title:'Feedback',         
          id:'feedback',
          passProps:{
            data:rowData,
            tag:rowData.labelname,
            getUserData:this.props.getUserData,
            user:this.props.user,
          }
        })
      }

      navigateToListOfQuestions(rowData){
        this.props.navigator.push({
          title:'Select issue',         
          id:'listquestions',
          passProps:{
           rowData:rowData,
           data:rowData.moreList,
           tag:rowData.labelname,
           getUserData:this.props.getUserData,
           user:this.props.user,
          }
        })
      }


       navigateToRunhistory(rowData){
        this.props.navigator.push({
          title:'Select Workout',         
          id:'runhistory',
          passProps:{
            rowData:rowData,
            rawData:this.state.rawData,
            EmptyText:this.state.EmptyText,
            helpcenter:true,
            tag:rowData.labelname,
            rowList:rowData.moreList,
            user:this.props.user,
            getUserData:this.props.getUserData,
          }
        })
      }
      
 

      componentDidMount() {
        
        var QuestionLists = [
          {'name':'I have an issue with past workout',
          'iconName':'share',
          'labelname':'pastworkout',
          'moreList':[
              {'name':'Less distance recorded',
               'header':'',
               'discription':'Got it. We regret that your distance counted was lesser than actual.\n \nThis might be due to poor GPS signals we are recieving from your device.\n \nBut no worries, tell us more. We would love to help.',  
               'hint':'Enter feedback here',
               'tag':'pastworkout',
               'labelname':'less',
               'inputLebel':'Send feedback to us.',
              },
              {'name':'More distance recorded',
               'header':'Got it. So awesome of you for letting us know !',
               'discription':'This might be due to poor GPS signals we are recieving from your device.\n \nBut no worries, tell us more. We would love to help.',
                'hint':'Enter feedback here',
                'tag':'pastworkout',
                'labelname':'more',
                'inputLebel':'Send feedback to us.',
              },

              {'name':'Why is it scratched off',
               'header':'Got it.',
               'discription':'A scratched or a flagged workout is a workout detected as humanly impossible in our system. Hence it is not counted.',
               'hint':'Enter feedback here',
               'tag':'pastworkout',
               'labelname':'scratched',
               'inputLebel':'Issue still not resolved? Send feedback to us.',
              },
              {'name':"I wasn't in a vehicle",
                'header':'Got it. Thanks for informing.',
                'discription':'Our automated algorithm detects when our app is used in a vehicle. Your workout is one of the 1.3 % of incorrectly detected cases. We are sorry for that.',
                'hint':'Enter feedback here',
                'tag':'pastworkout',
                'labelname':'notvehicle',
                'inputLebel':'Issue still not resolved? Send feedback to us.',
              },
              {'name':'Impact missing in Leaderboard',
                'header':'Got it. Thanks for informing.',
                'discription':'Sometimes your workouts take a few hours to sync on our database. Please wait for some time, and make sure that you are connected to internet.',
                'hint':'Enter feedback here',
                'tag':'pastworkout',
                'labelname':'leaderboardadd',
                'inputLebel':'Issue still not resolved? Send feedback to us.',
              },
              {'name':'Something else',
               'header':'Thankyou for letting us know.',
               'discription':'Please enter in detail what is the issue with workout.',
               'hint':'Enter feedback here',
               'tag':'pastworkout',
               'labelname':'stillelse',
               'inputLebel':'Let us know about your issue. Send feedback to us.',
              },
            ],
          },
          {
          'name':'I have a question',
          'screenName':'',
          'labelname':'question',
          'moreList':null,
         },
          {
          'name':'I have a suggestion',
          'iconName':'feedback',
          'labelname':'feedback',
          'moreList':null,
          'header':'That is great! We love to hear from our user',
          'inputLebel':'Enter your feedback here',
          'discription':'Submit your feedback',
         },
          {
          'name':'My issue isn\'t listed here',
          'labelname':'else',
          'moreList':[
              {'name':'Distance not accurate',
               'header':'Got it. Thanks for informing',
               'discription': 'Our tracking algorithm uses a combination of GPS and motion sensors in the device to calculate distance. \n\nSometimes because of unreliability and low accuracy of these sensors it ends up recording wrong distance.\n \nWe are working hard everyday to make our tracking algorithm more robust. It would help a lot if you could tell us a bit more about the discrepancy you observed.',
               'inputLebel':'Tell us more about the issue',
               'tag':'else',
               'labelname':'notaccurate',
               'hint':'Enter here',
              },
              {'name':'Workout missing from history',
               'header':'Got it. Thanks for letting us know.',
               'discription':'Got it. Thanks for letting us know.\nPlease enter the details of your workout and submit. We\'ll look into it and add from backend.',
               'inputLebel':'Tell us more about the issue',
               'tag':'else',
               'labelname':'workoutmissing',
               'hint':'Enter details here',

              },

              {'name':'Impact missing in Leaderboard',
               'header':'Got it. Thanks for informing.',
               'discription':'Our tracking algorithm uses a combination of GPS and motion sensors in the device to calculate distance. \n\nSometimes because of unreliability and low accuracy of these sensors it ends up recording wrong distance.\n \nWe are working hard everyday to make our tracking algorithm more robust. It would help a lot if you could tell us a bit more about the discrepancy you observed.',
               'inputLebel':'Issue still not resolved? Send feedback to us.',
               'tag':'else',
               'labelname':'leaderboardadd',
               'hint':'Enter feedback here',
              },
              {'name':"I wasn't in a vehicle",
                'header':'Got it. Thanks for informing',
                'discription':'Our automated algorithm detects when our app is used in a vehicle. Your workout is one of the 1.3 % of incorrectly detected cases. We are sorry for that. ',
                'inputLebel':'Issue still not resolved? Send feedback to us.',
                'tag':'else',
                'labelname':'notvehicle',
                'hint':'Enter feedback here',
              },
              {'name':'Issue with GPS',
                'header':'Got it.',
                'discription':'GPS can be tricky when you are using the app indoors or when the weather is cloudy/rainy. Try to be in open areas. You can also try restarting the GPS through system settings.',
                'inputLebel':'Issue still not resolved? Send feedback to us.',
                'tag':'else',
                'labelname':'gpsissue',
                'hint':'Enter feedback here',
              },
              {'name':'Zero distance recorded',
               'header':'Got it.',
               'discription':'Please enter the details of your workout along with actual distance (in Kms) and submit. We will look into it and add.',
               'inputLebel':'Please enter the details here',
               'tag':'else',
               'labelname':'zerodistance',
               'hint':'Enter details here',
              },
              {'name':' Still something else',
               'header':'Thankyou for letting us know.',
               'discription':'Please enter in detail what is the issue with workout.',
               'inputLebel':'Let us know about your issue. Send feedback to us.',
               'tag':'else',
               'labelname':'else',
               'hint':'Enter feedback here',
              },
            ],
         },
      
        ]
       

        this.setState({
           HelpCenterTabs: this.state.HelpCenterTabs.cloneWithRows(QuestionLists),
        })
          AsyncStorage.getItem('USERDATA', (err, result) => {
            let user = JSON.parse(result);
            this.setState({
              user:user,
              loaded:true
            })

          })  
      }





 
      
   


      renderRow(rowData) {
        return (
          <TouchableOpacity  onPress={()=> this.navigateToNextPage(rowData)}style={{paddingLeft:20,height:50, width:deviceWidth,justifyContent: 'center',flexDirection:'row',backgroundColor:"white",}}>           
            <View style = {{flex:1,justifyContent: 'center',borderBottomWidth:1,borderBottomColor:'#e2e5e6',alignItems:'flex-start'}}>
              <Text style={{fontWeight:'600',color:'#595c5d',fontFamily:styleConfig.LatoBlack,fontSize:styleConfig.helpCenterListFontSize,opacity:.90}}>{rowData.name}</Text>
            </View>
            <View style={{flex:-1,width:50 ,justifyContent: 'center',alignItems: 'center',borderBottomWidth:1,borderBottomColor:'#e2e5e6',}}>
                <IconSec style={{color:'#c1c6c7',fontSize:20,}}name={'ios-arrow-forward'}></IconSec>
            </View>
          </TouchableOpacity>
        );
      }

      render() {
         return (
              <View style={{height:deviceHeight,width:deviceWidth}}>
              <NavBar title={'Help'}/>
                <ListView
                style={{top:10,height:deviceHeight,width:deviceWidth,backgroundColor:'white',}}
                renderRow={this.renderRow}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.HelpCenterTabs}
                scrollEnabled={false}/>
               </View>
              );
          }
  }



 export default HelpCenter;