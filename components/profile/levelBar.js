import React, { Component } from 'react';
import{
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
  } from 'react-native';
  import LevelBarComponent from './levelBarComponent';
  import styleConfig from '../styleConfig';
  var deviceWidth = Dimensions.get('window').width;
  var deviceHeight = Dimensions.get('window').height;

  class levelBar extends Component {
   constructor(props) {
     super(props);
     this.state = {
      prevKm:0,
      levelKm:0,
      progressVal:0,
     };
   }

  componentDidMount() {
    // var _this = this;
    // setTimeout(function(){    
    //   var totalkm = _this.props.totalKm;
    //   if (_this.props.totalKm != undefined) {
    //   _this.setState({
    //     totalKm:_this.props.totalKm,

    //   })
    //   }else{
        

    //   }
    // },2000);
    
   
  }

 getKMfunction(){
   AsyncStorage.getItem('totalkm', (err, result) => {
    this.setState({
      totalKm:result,
      level:this.userLevelFunction(result),
    })
    
   })
 }
   

   

   capitalizeFirstLetter () {
    return this.props.userName.charAt(0).toUpperCase() + this.props.userName.slice(1);
   }

    render(){
   
    	return(
    		<View style={styles.Maincontainer}>
          <Text style={[styles.usernameText,{width:this.props.widthBar}]}>{this.props.userName +" "+this.props.lastname}</Text>
          <View style={[styles.wrapLevelKm,{width:this.props.widthBar}]}>
           <Text style={styles.kmtext}>{this.props.prevKm}km</Text><Text  style={styles.kmtext2}>{this.props.levelKm}km</Text>
         </View>
    		 <LevelBarComponent unfilledColor={'grey'} height={6} width={this.props.widthBar} progress={this.props.progressVal}  />
         <Text style = {[styles.leveltext,{width:this.props.widthBar}]}>Level {this.props.level}</Text>
    		</View>
    		)
    }
  }

  var styles = StyleSheet.create({
    Maincontainer:{

    },
    wrapLevelKm:{
      flexDirection:'row',
    },
    progress:{
      flex:1,
    },
    usernameText:{
      color:styleConfig.greyish_brown_two,
      fontFamily:styleConfig.FontFamily,
      fontWeight:"600",
      fontSize:styleConfig.FontSizeDisc+7,
      marginBottom:5,
    },
    kmtext:{
      fontWeight:'500',
      color:styleConfig.greyish_brown_two,
      fontFamily:styleConfig.FontFamily,
      fontSize:styleConfig.fontSizerlabel-2,
      flex:1,

    },
     kmtext2:{
      fontWeight:'500',
      color:styleConfig.greyish_brown_two,
      fontFamily:styleConfig.FontFamily,
      fontSize:styleConfig.fontSizerlabel-2,
      flex:1,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      textAlign:'right',
    },
    leveltext:{
      top:3,
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.fontSizerlabel,
      fontWeight:'500',
      fontFamily:styleConfig.FontFamily3,
    }
  })

export default levelBar;