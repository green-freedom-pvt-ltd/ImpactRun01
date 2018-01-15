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
  import Icon from 'react-native-vector-icons/FontAwesome';
  var deviceWidth = Dimensions.get('window').width;
  var deviceHeight = Dimensions.get('window').height;
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

  class levelBar extends Component {
   constructor(props) {
     super(props);
     this.state = {
      prevKm:0,
      levelKm:0,
      progressVal:0,
      my_rate:1.0,
      my_currency:"INR",
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
           <Text style={styles.kmtext}><Icon style={{fontSize:styleConfig.profileLevelBarlabelFont}} name={this.state.my_currency.toLowerCase()}></Icon> {(this.state.my_currency == 'INR' ? this.props.prevKm : parseFloat(this.props.prevKm/this.state.my_rate).toFixed(2))}</Text><Text  style={styles.kmtext2}><Icon  style={{fontSize:styleConfig.profileLevelBarlabelFont}} name={this.state.my_currency.toLowerCase()}></Icon> {(this.state.my_currency == 'INR' ? this.props.levelKm : parseFloat(this.props.levelKm/this.state.my_rate).toFixed(2))}</Text>
         </View>
         <LevelBarComponent unfilledColor={'grey'} height={responsiveHeight(0.9)} width={responsiveWidth(70)} progress={this.props.progressVal}  />
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
      fontSize:styleConfig.profileNameFont,
      marginBottom:responsiveHeight(1.2),
    },
    kmtext:{
      fontWeight:'800',
      color:styleConfig.greyish_brown_two,
      fontFamily:styleConfig.LatoRegular,
      fontSize:styleConfig.profileLevelBarlabelFont,
      flex:1,
      opacity:.80,

    },
     kmtext2:{
      fontWeight:'800',
      color:styleConfig.greyish_brown_two,
      fontFamily:styleConfig.LatoRegular,
      fontSize:styleConfig.profileLevelBarlabelFont,
      flex:1,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      textAlign:'right',
      opacity:.80,
    },
    leveltext:{
      top:responsiveHeight(0.46875),
      color:styleConfig.greyish_brown_two,
      fontSize:styleConfig.profileLevelFont,
      fontWeight:'800',
      fontFamily:styleConfig.LatoBlack,
    }
  })

export default levelBar;