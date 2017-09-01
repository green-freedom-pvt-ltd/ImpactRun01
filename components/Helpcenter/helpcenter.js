
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
            console.log('runData',RunData);
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
        if (rowData.name === 'Issue with past workout') {
          return this.navigateToRunhistory(rowData);
        }else if(rowData.name === 'Questions'){
           return this.navigateToHelp(rowData);
        }else if(rowData.name === 'Give feedback'){
            return this.navigateToFeedbackPage(rowData);
        }else if(rowData.name === 'Something else'){
          return this.navigateToListOfQuestions(rowData);
        }

       }
       
       navigateToHelp(rowData){
        this.props.navigator.push({
          title:'Questions',         
          component:Faq,
          navigationBarHidden: false,
          showTabBar: true,
          passProps:{
            rowData:rowData,
          }
        })
      }

      navigateToFeedbackPage(rowData){
        this.props.navigator.push({
          title:'Feedback',         
          component:EndFeedBack,
          navigationBarHidden: false,
          showTabBar: true,
          passProps:{
            data:rowData,
            getUserData:this.props.getUserData,
          }
        })
      }

      navigateToListOfQuestions(rowData){

        this.props.navigator.push({
          title:'Select issue',         
          component:QuestionLists,
          navigationBarHidden: false,
          showTabBar: true,
          passProps:{
           rowData:rowData,
           data:rowData.moreList,
           getUserData:this.props.getUserData,
           user:this.props.user,
          }
        })
      }


       navigateToRunhistory(rowData){
        this.props.navigator.push({
          title:'Questions',         
          component:RunHistory,
          navigationBarHidden: false,
          showTabBar: true,
          passProps:{
            rowData:rowData,
            rawData:this.state.rawData,
            EmptyText:this.state.EmptyText,
            helpcenter:true,
            rowList:rowData.moreList,
            user:this.props.user,
            getUserData:this.props.getUserData,
          }
        })
      }
      
 

      componentDidMount() {
        
        var QuestionLists = [
          {'name':'Issue with past workout',
          'iconName':'share',
          'labelname':'pastworkout',
          'moreList':[
              {'name':'Less distance recorded',
               'header':'Got it. We regret that your distance counted was lesser than actual.',
               'discription':'GPS gets tricky at times. But no worries, just enter below the correct distance in Kms, and submit. Or chat with us. We will look into the case and change accordingly. Thanks for letting us know.',  
               'hint':'Enter correct distance in Kms',
               'labelname':'less',
               'inputLebel':'',
              },
              {'name':'More distance recorded',
               'header':'Got it. So awesome of you for letting us know !',
               'discription':'GPS gets tricky at times. Please enter below the correct distance in Kms and submit. Or chat with us.Thanks for letting us know.',
                'hint':'Enter correct distance in Kms',
                'labelname':'more',
                'inputLebel':'',
              },

              {'name':'Why is it scratched off',
               'header':'Got it.',
               'discription':'A scratched or a flagged workout is a workout detected as humanly impossible in our system. Hence it is not counted',
               'hint':'Enter feedback here',
               'labelname':'scratched',
               'inputLebel':'Issue still not resolved? Send feedback or chat with us.',
              },
              {'name':"I wasn't in a vehicle",
                'header':'Got it. Thanks for informing.',
                'discription':'Our automated algorithm detects when our app is used in a vehicle. Your workout is one of the 1.3 % of incorrectly detected cases. We are sorry for that. ',
                'hint':'Enter feedback here',
                'labelname':'notvehicle',
                'inputLebel':'Issue still not resolved? Send feedback or chat with us.',
              },
              {'name':'Impact missing in Leaderboard',
                'header':'Got it. Thanks for informing.',
                'discription':'Data in leaderboard is fetched from server, but sometimes your workouts take a few hours to sync on server. Please wait for some time and make sure that you are connected to internet.',
                'hint':'Enter feedback here',
                'labelname':'leaderboardadd',
                'inputLebel':'Issue still not resolved? Send feedback or chat with us.',
              },
              {'name':'Something else',
               'header':'',
               'discription':'Please enter the details of your workout along with actual distance (in Kms) and submit. We will look into it and add.',
               'hint':'Enter feedback here',
               'labelname':'else',
               'inputLebel':'Let us know about your issue. Send feedback or chat with us.',
              },
            ],
          },
          {
          'name':'Questions',
          'screenName':'',
          'labelname':'question',
          'moreList':null,
         },
          {
          'name':'Give feedback',
          'iconName':'feedback',
          'labelname':'feedback',
          'moreList':null,
         },
          {
          'name':'Something else',
          'labelname':'else',
          'moreList':[
              {'name':'Distance not accurate',
               'header':'Got it. Thanks for informing',
               'discription':'Our tracking algorithm uses a combination of GPS and motion sensors in the device to calculate distance.Sometimes because of unreliability and low accuracy of these sensor readings it ends up recording wrong distance.We are working hard everyday to make our tracking algorithm more accurate and robust and it would help enormously if you could tell us a bit more about the discrepancy you observed.',
               'inputLebel':'Tell us more about the issue',
               'labelname':'less',
               'hint':'Enter here',
              },
              {'name':'Workout missing from history',
               'header':'Got it. Thanks for letting us know.',
               'discription':'Please enter the details of your workout and submit. We`ll look into it and add from backend',
               'inputLebel':'Give feedback ',
               'labelname':'workoutmissing',
               'hint':'Enter details here',

              },

              {'name':'Impact missing in Leaderboard',
               'header':'Got it. Thanks for informing.',
               'discription':'Data in leaderboard is fetched from server, but sometimes your workouts take a few hours to sync on server. Please wait for some time and make sure that you are connected to internet',
               'inputLebel':'Issue still not resolved? Send feedback or chat with us.',
               'labelname':'leaderboardadd',
               'hint':'Enter feedback here',
              },
              {'name':"I wasn't in a vehicle",
                'header':'Got it. Thanks for informing',
                'discription':'Our automated algorithm detects when our app is used in a vehicle. Your workout is one of the 1.3 % of incorrectly detected cases. We are sorry for that. ',
                'inputLebel':'Issu still not resolved? Send feedback or chat with us.',
                'labelname':'notvehicle',
                'hint':'Enter feedback here',
              },
              {'name':'Issue with GPS',
                'header':'Got it.',
                'discription':'GPS can be tricky when you are using the app indoors or when the weather is cloudy/rainy. Try to be in open areas. You can also try restarting the GPS through system settings.',
                'inputLebel':'Issu still not resolved? Send feedback or chat with us.',
                'labelname':'gpsissue',
                'hint':'Enter feedback here',
              },
              {'name':'Zero distance recorded',
               'header':'Got it.',
               'discription':'Please enter the details of your workout along with actual distance (in Kms) and submit. We will look into it and add.',
               'inputLebel':'',
               'labelname':'zerodistance',
               'hint':'Enter details here',
              },
              {'name':' Still something else',
               'header':'',
               'discription':'',
               'inputLebel':'Let us know about your issue. Send feedback or chat with us.',
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
        console.log('rowData',rowData);
        return (
          <TouchableOpacity  onPress={()=> this.navigateToNextPage(rowData)}style={{paddingLeft:20,height:50, width:deviceWidth,justifyContent: 'center',flexDirection:'row',backgroundColor:"white",}}>           
            <View style = {{flex:1,justifyContent: 'center',borderBottomWidth:1,borderBottomColor:'#e2e5e6',alignItems:'flex-start'}}>
              <Text style={{color:'#595c5d'}}>{rowData.name}</Text>
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
                <ListView
                style={{height:deviceHeight,width:deviceWidth,backgroundColor:'#e2e5e6',paddingTop:50,}}
                renderRow={this.renderRow}
                dataSource={this.state.HelpCenterTabs}/>
               </View>
              );
          }
  }



 export default HelpCenter;