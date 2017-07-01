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
     this.getKMfunction();
     this.state = {
      prevKm:0,
      levelKm:0,
     };
   }

   componentDidMount() {
    var totalkm = this.props.totalKm;
    if (this.props.totalKm != undefined) {
    this.setState({
      level:this.userLevelFunction(totalkm),
      totalKm:this.props.totalKm,
    })
   this.userLevelFunction = this.userLevelFunction.bind(this)
  }else{


   }
 }

 getKMfunction(){
   AsyncStorage.getItem('totalkm', (err, result) => {
    this.setState({
      totalKm:result,
      level:this.userLevelFunction(result),
    })
    
   })
 }
   
   userLevelFunction(totalkm){
   if (totalkm != null) {
    if (totalkm <= 50 ) { 
      this.setState({
        prevKm:0,
        levelKm:50,
        progressVal:totalkm/50,

      })
      return 1;
    }else if (totalkm <= 250){
      
      this.setState({
        prevKm:50,
        levelKm:250,
        progressVal:(totalkm-50)/200,
        
      })
      return 2;
    }else if (totalkm <= 500) {
      this.setState({
        prevKm:250,
        levelKm:500,
        progressVal:(totalkm-250)/250,
      })
      return 3;
    }else if (totalkm <= 1000){
      this.setState({
        prevKm:500,
        levelKm:1000,
        progressVal:(totalkm-500)/500,
      })
      return 4;
      
    }else if (totalkm <= 2500) {
      console.log(totalkm/4200)
      this.setState({
        prevKm:1000,
        levelKm:2500,
        progressVal:(totalkm-1000)/1500,
      })
      return 5;
    }else if (totalkm <= 5000){
      this.setState({
        prevKm:2500,
        levelKm:5000,
        progressVal:(totalkm-2500)/2500,
      })
      return 6;
      
    }else if (totalkm <= 10000) {
      this.setState({
        prevKm:5000,
        levelKm:10000,
        progressVal:(totalkm-5000)/5000,
      })
      return 7;
    }

    }else{
      return
    }
   }
   

   capitalizeFirstLetter () {
    return this.props.userName.charAt(0).toUpperCase() + this.props.userName.slice(1);
   }

    render(){
   
    	return(
    		<View style={styles.Maincontainer}>
          <Text style={[styles.usernameText,{width:this.props.widthBar}]}>{this.capitalizeFirstLetter()+" "+this.props.lastname}</Text>
          <View style={[styles.wrapLevelKm,{width:this.props.widthBar}]}>
           <Text style={styles.kmtext}>{this.state.prevKm}km</Text><Text  style={styles.kmtext2}>{this.state.levelKm}km</Text>
         </View>
    		 <LevelBarComponent unfilledColor={'grey'} height={6} width={this.props.widthBar} progress={this.state.progressVal}  />
         <Text style = {[styles.leveltext,{width:this.props.widthBar}]}>Level {this.state.level}</Text>
    		</View>
    		)
    }
  }

  var styles = StyleSheet.create({
    Maincontainer:{
      height:70,
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
      fontSize:styleConfig.FontSizeDisc+5,
      marginBottom:5,
    },
    kmtext:{
      fontWeight:'500',
      color:styleConfig.greyish_brown_two,
      fontFamily:styleConfig.FontFamily,
      fontSize:styleConfig.FontSizeDisc-4,
      flex:1,

    },
     kmtext2:{
      fontWeight:'500',
      color:styleConfig.greyish_brown_two,
      fontFamily:styleConfig.FontFamily,
      fontSize:styleConfig.FontSizeDisc-4,
      flex:1,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      textAlign:'right',
    },
    leveltext:{
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.FontSizeDisc,
      fontWeight:'500',
      fontFamily:styleConfig.FontFamily3,
    }
  })

export default levelBar;