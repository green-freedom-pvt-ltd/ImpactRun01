
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
    ActivityIndicator,
    AsyncStorage
  } from 'react-native';
  import commonStyles from '../styles';
  import Icon from 'react-native-vector-icons/Ionicons';
  var deviceWidth = Dimensions.get('window').width;
  import NavBar from '../navBarComponent';
  var deviceHeight = Dimensions.get('window').height;
  import styleConfig from '../styleConfig';
  import SubmitBtn from '../submitbtn';
  import apis from '../apis';
  import ModalDropdownCity from './ImpactLeagueComponents/modelindex.js';
  import ModalDropdownDepartment from './ImpactLeagueComponents/modelindex2.js';
  import ImpactLeague from './ImpactLeagueHome';

  class ImpactLeagueForm2 extends Component {
      
      
    constructor() {
      super();
      this.state = {
        department:'',
        city:'',
        errtext:'',
        loading:false,
        data:null,
        animating: true,
        Home:false,
      };
    }


      componentDidMount() {
        // this.props.getUserData();
      }


      componentWillMount() {
       
      }
      

      getCityDepartment(){
        var department = this.state.department;
        var city = this.state.city;

          if (city != '') {
            this.setState({
              city:city,        
            })         
            }else{
            this.setState({
              errtext:'please choose city',
            })
          }

          if (department != '') {
          this.setState({
            department:department,          
          })
          if (city != '') {this.putRequestCityDepartment();}
          
          }else{
            this.setState({
              errtext:'please choose department',
            })
          }
            
      }

      submitCityDepartment(){
        this.getCityDepartment();
      }

     
      putRequestCityDepartment(){   
        this.setState({
          loading:true,
        }) 
        var data = this.props.data;
        var city = this.state.city;
        var department = this.state.department;
        let formData = new FormData();
        formData.append('user',data.user);
        formData.append('team', data.team);
        formData.append('city',this.state.city);
        formData.append('department',this.state.department);
          var token = this.props.user.auth_token;
          fetch(apis.ImpactLeagueCodeApi, {
            method: 'PUT',
            datatype:'json',
            headers: {
              'Authorization':'Bearer '+token,
              'Accept': 'application/json',
              'Content-Type':'application/x-www-form-urlencoded',
            },
            body:formData
            })
         .then((response)=>{
          return response.json();
         })
        .then((responseJson) => {
          this.setState({
            loding:false,
            data:responseJson,
            Home:true,
          })

          // this.RouteChangeField(responseJson)

        })
        .catch((error) => {
          console.error(error);
        });
      }


      onSelectCity(idx,value){
        console.log('index',idx,value);
        this.setState({
          city:value,
        })
      }

      onSelectDepartment(idx,value){
        console.log('index',idx,value);
        this.setState({
          department:value,
        })
      }
      


      isloading(){
        if (this.state.loading) {
          return(
            <View style={{position:'absolute',top:0,backgroundColor:'rgba(4, 4, 4, 0.56)',height:deviceHeight,width:deviceWidth,justifyContent: 'center',alignItems: 'center',}}>
              <ActivityIndicator
               style={{height: 80}}
                size="large"
              >
              </ActivityIndicator>
            </View>
            )
        }else{
          return;
        }
      }

      navigateTOhome(responseJson){
        this.props.navigator.replace({
          title: 'impactleaguehome',
          id:'impactleaguehome',
          navigator: this.props.navigator,
          passProps:{
            backTo:'learderboad',
            user:this.props.user,
            data:responseJson,
            getUserData:this.props.getUserData,
          }
        })
      }
      
     
  

  		render(cities) {
        if (this.state.Home != true) {
        var data = this.props.data;
        console.log('data',data);
  		  return (
          <View>
          <View style={commonStyles.Navbar}>
              <Text style={commonStyles.menuTitle}>Impact League</Text>
            </View>
            <View style ={styles.container}>
              <Image source={{uri:data.impactleague_banner}} style={styles.bannerimage}>
              </Image>
              <Text style={{padding:20, paddingTop:25,color:styleConfig.purplish_brown,fontFamily:styleConfig.FontFamily,fontSize:styleConfig.fontSizer3}}>Just a couple of more questions</Text>
              <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
              <View>
               <Text style={styles.Errtext}>{this.state.errtext}</Text>
               </View>
               <TouchableOpacity onPress={() => this.putRequestCityDepartment()} style={styles.submitbtn}>
                  <Text style={{color:'white'}}>SUBMIT</Text>
              </TouchableOpacity>
              </View>
              <View style = {{top:-300,height:deviceHeight/2-200, width:deviceWidth,justifyContent: 'center',alignItems:'center'}}>
              <ModalDropdownCity onSelect={(idx, value) => this.onSelectCity(idx, value)} showsVerticalScrollIndicator={true} textStyle={styles.textStyle} dropdownStyle={styles.dropdownStyle} style = {styles.dropdown} defaultIndex ={1} animated={true} options={this.props.cities}>
              </ModalDropdownCity>    
              <ModalDropdownDepartment onSelect={(idx,value) => this.onSelectDepartment(idx,value)} defaultIndex ={3} textStyle={styles.textStyle} dropdownStyle={styles.dropdownStyle} style = {styles.dropdown}   options={this.props.departments}>
              </ModalDropdownDepartment>  
              </View>  
            </View>
           {this.isloading()}
          </View>
  			);
       }else{
        return(
           <ImpactLeague user={this.props.user} data={this.state.data} getUserData={this.props.getUserData}/>   
        )
       }
  	  }
  }

const styles = StyleSheet.create({
  container: {
    height:deviceHeight,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  bannerimage:{
    width:deviceWidth,
    height:deviceHeight/2-100,
  },
   Errtext:{
    top:110,
    color:'red',
    fontFamily:styleConfig.FontFamily3,
    fontSize:styleConfig.FontSize3,
  },
  submitbtn:{
    justifyContent: 'center',
    alignItems: 'center',
    width:deviceWidth-70,
    height:45,
    borderRadius:2,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
        height: 2,
      },
      top:130,
    backgroundColor:styleConfig.light_gold,
  },
  dropdown:{
    width:deviceWidth-79,
    marginBottom:10,
    backgroundColor:'white',
    borderRadius:5,
    borderColor:'grey',
    borderWidth:1,
    justifyContent:'center',
    alignItems: 'center',
    height:41,
  },
  dropdownStyle:{
    backgroundColor:'white',
    justifyContent:'center',
    alignItems: 'center',
  },
  textStyle:{
    fontFamily:styleConfig.FontFamily3,
    fontSize:12,
  }

});
 export default ImpactLeagueForm2;
  // <ImpactLeagueDropDown city={data.company_attribute}>
  //             </ImpactLeagueDropDown>
  //              <ImpactLeagueDropDown2 department={data.company_attribute}>
  //             </ImpactLeagueDropDown2>