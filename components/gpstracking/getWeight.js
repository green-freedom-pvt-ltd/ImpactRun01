 
import{AsyncStorage }from "react-native" 

 export default ()=>{

 getWeight(){
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
}