
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
import EndFeedBack from './endFeedBackPage';
import NavBar from '../navBarComponent';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;


class QuestionLists extends Component {
     constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            HelpCenterTabs: ds.cloneWithRows([]),


        };
        this.renderRow = this.renderRow.bind(this);
      }

     

       
        navigateToNextPage(rowData){
        this.props.navigator.push({
          title:'Feedback',         
          id:'feedback',
          passProps:{
            rowData:this.props.rowData,
            runData:this.props.runData,
            data:rowData,
            user:this.props.user,
            tag:this.props.tag,
            sub_tag:rowData.labelname,
            getUserData:this.props.getUserData,
          }
        })
      }
      
 

      componentDidMount() {
        console.log('tags',this.props.tag);
        this.setState({
           HelpCenterTabs: this.state.HelpCenterTabs.cloneWithRows(this.props.data),
        })
      }





     
    goBack(){
        this.props.navigator.pop({});
    }
    
    leftIconRender(){
          return(
            <TouchableOpacity style={{paddingLeft:10,height:styleConfig.navBarHeight,width:50,backgroundColor:'transparent',justifyContent: 'center',alignItems: 'flex-start',}} onPress={()=>this.goBack()} >
              <IconSec style={{color:'black',fontSize:35,fontWeight:'bold',opacity:.80}}name={(this.props.data === 'fromshare')?'md-home':'ios-arrow-back'}></IconSec>
            </TouchableOpacity>
          )
        }

      
   


      renderRow(rowData) {
        console.log('rowData',rowData);
        return (
          <TouchableOpacity  onPress={()=> this.navigateToNextPage(rowData)}style={{paddingLeft:20,height:50, width:deviceWidth,justifyContent: 'center',flexDirection:'row',backgroundColor:"white",}}>           
            <View style = {{flex:1,justifyContent: 'center',borderBottomWidth:1,borderBottomColor:'#e2e5e6',alignItems:'flex-start'}}>
              <Text style={{color:'#595c5d',fontSize:styleConfig.helpCenterListFontSize,fontFamily:styleConfig.LatoBlack,fontWeight:'600'}}>{rowData.name}</Text>
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
              <NavBar title={'Select issue'} leftIcon={this.leftIconRender()}/>
              <ListView
                style={{height:deviceHeight,width:deviceWidth,backgroundColor:'white',top:10}}
                renderRow={this.renderRow}
                dataSource={this.state.HelpCenterTabs}
                scrollEnabled={false}/>
               </View>
              );
          }
      }
 export default QuestionLists;