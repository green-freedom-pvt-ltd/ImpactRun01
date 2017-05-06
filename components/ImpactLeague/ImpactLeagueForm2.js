
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
    ActivityIndicatorIOS,
    AsyncStorage
  } from 'react-native';
  import commonStyles from '../styles';
  import Icon from 'react-native-vector-icons/Ionicons';
  var deviceWidth = Dimensions.get('window').width;
  var deviceHeight = Dimensions.get('window').height;
  import styleConfig from '../styleConfig';
  import SubmitBtn from '../submitbtn';
  import apis from '../apis';
  import ImpactLeagueDropDown from './ImpactLeagueComponents/dropDownComponent';
  import ImpactLeagueDropDown2 from './ImpactLeagueComponents/dropDownComponent2';
  import ModalDropdown from './ImpactLeagueComponents/modelindex.js';
   import ModalDropdown2 from './ImpactLeagueComponents/modelindex2.js';


  class ImpactLeagueForm2 extends Component {
      
      
    constructor() {
      super();
      this.state = {
        department:'',
        city:'',
        errtext:'',
        loading:false,
        animating: true,
      };
    }


      componentDidMount() {
  
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
          })
          this.navigateTOhome(responseJson);
          this.RouteChangeField(responseJson)

        })
        .catch((error) => {
          console.error(error);
        });
      }


      RouteChangeField(responseJson){
          var userdata = this.props.user;
        // first user, delta values
        let UID234_delta = {
            team_code:responseJson.team_code,
         };

        let multi_merge_pairs = [
          ['UID234', JSON.stringify(UID234_delta)],
           
        ]
        AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
            AsyncStorage.multiGet(['UID234'], (err, stores) => {
                stores.map((result, i, store) => {
                    let key = store[i][0];
                    let val = store[i][1];
                });
              
            });
        })   
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
              <ActivityIndicatorIOS
               style={{height: 80}}
                size="large"
              >
              </ActivityIndicatorIOS>
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
        var data = this.props.data;
  		  return (
          <View>
            <View style={commonStyles.Navbar}>
              <Text style={commonStyles.menuTitle}>Impact League</Text>
            </View>
            <View style ={styles.container}>
              <Image source={{uri:data.impactleague_banner}} style={styles.bannerimage}>
              </Image>
              <Text style={{padding:20, paddingTop:25,color:styleConfig.purplish_brown,fontFamily:styleConfig.FontFamily,fontSize:styleConfig.fontSizer3}}>Just a couple of more questions</Text>
              <View>
              <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
              <View>
               <Text style={styles.Errtext}>{this.state.errtext}</Text>
               </View>
               <TouchableOpacity onPress={() => this.submitCityDepartment()} style={styles.submitbtn}>
                  <Text style={{color:'white'}}>SUBMIT</Text>
              </TouchableOpacity>
              </View>
              <View style = {{top:-50,width:deviceWidth,justifyContent: 'center',alignItems:'center'}}>
              <ModalDropdown onSelect={(idx, value) => this.onSelectCity(idx, value)} showsVerticalScrollIndicator={true} textStyle={styles.textStyle} dropdownStyle={styles.dropdownStyle} style = {styles.dropdown} defaultIndex ={1} animated={true} options={this.props.cities}>
              </ModalDropdown>    
              <ModalDropdown2 onSelect={(idx,value) => this.onSelectDepartment(idx,value)} defaultIndex ={3} textStyle={styles.textStyle} dropdownStyle={styles.dropdownStyle} style = {styles.dropdown}   options={this.props.departments}>
              </ModalDropdown2>  
              </View>  
              </View>
            </View>
           {this.isloading()}
          </View>
  			);
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
    width:deviceWidth-80,
    marginBottom:10,
    backgroundColor:'white',
    borderRadius:5,
    borderColor:'grey',
    borderWidth:1,
    justifyContent:'center',
    alignItems: 'center',
    height:40,
  },
  dropdownStyle:{
    backgroundColor:'white',
    justifyContent:'center',
    alignItems: 'center',
  },
  textStyle:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  }

});
 export default ImpactLeagueForm2;
  // <ImpactLeagueDropDown city={data.company_attribute}>
  //             </ImpactLeagueDropDown>
  //              <ImpactLeagueDropDown2 department={data.company_attribute}>
  //             </ImpactLeagueDropDown2>