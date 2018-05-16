import {
   AsyncStorage,
   AlertIOS,
} from 'react-native';
import getLocalData from './getLocalData.js';
import setLocalData from './setLocalData.js';
import apis from './apis.js';
const CleverTap = require('clevertap-react-native');
export default {
        fetchLocalRunData(user){
            return getLocalData.getData('UnsyncedData')
                  .then((result)=>{
                       // setLocalData.setData("UnsyncLocationData",JSON.stringify(null));
                     getLocalData.getData("UnsyncLocationData").then((data)=>{
                      console.log('UnsyncLocationData',JSON.parse(data));
                     })
                    var rundata = JSON.parse(result); 
                    console.log('rundata',rundata);
                    if (rundata != null  ) {
                      if (rundata.length > 0 ) {
                            if(user != null){
                               return this.postPastRun(rundata[rundata.length-1],user,rundata);
                            }
                      }else{
                        console.log('runData ',rundata);
                        return this.postRunlocationPoints(user.auth_token); 
                      }
                    }else{
                        console.log('someerror');
                    }
                  })     
        },






      async postPastRun(result,user,rundata){
            var _this = this;
            let RunData = result; 

            console.log('RunData12',RunData,user.auth_token);
           return fetch(apis.runApi, {
                method: "POST",
                headers: {  
                  'Authorization':"Bearer "+ user.auth_token,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',    
                },
                body:JSON.stringify({
                    cause_run_title:RunData.cause_run_title,
                    user_id:user.user_id,
                    start_time:RunData.start_time,
                    end_time:RunData.end_time,
                    distance:RunData.distance,
                    peak_speed: 1,
                    avg_speed:RunData.avg_speed,
                    run_amount:RunData.run_amount,
                    run_duration:RunData.run_duration,
                    is_flag:false,
                    calories_burnt:RunData.calories_burnt,
                    start_location_lat:RunData.start_location_lat,
                    start_location_long:RunData.start_location_long,
                    end_location_lat:RunData.end_location_lat,
                    end_location_long:RunData.end_location_long,
                    no_of_steps:RunData.no_of_steps,
                    is_ios:RunData.is_ios,
                    num_spikes:RunData.num_spikes,
                    team_id:(RunData.team_id != 0)?RunData.team_id:null,
                    client_run_id:RunData.client_run_id,
                })
            })
            .then(_this.handleNetworkErrors.bind(_this))
            .then((userRunData) => {
              console.log('userRunData',userRunData);
                if (userRunData.client_run_id != null && userRunData.client_run_id != undefined) {

                  CleverTap.recordEvent('ON_RUN_SYNC',{
                      'upload_result':'success',
                      'client_run_id':userRunData.client_run_id,
                  });


                  var locationArraywithrunId = {
                    "run_id":userRunData.run_id,
                    "client_run_id":userRunData.client_run_id,
                    "location_array":RunData.locationArray,
                    "start_time_epoch": RunData.start_time_epoch,
                    "end_time_epoch": RunData.end_time_epoch,
                  }

                  getLocalData.getData("UnsyncLocationData").then((data)=>{
                    if (JSON.parse(data) != null) {

                      console.log('datalocationif',JSON.parse(data));
                      var arrayofLocation = JSON.parse(data);
                      arrayofLocation.push(locationArraywithrunId);
                      setLocalData.setData("UnsyncLocationData",JSON.stringify(arrayofLocation));
                      
                    }else{
                        var arrayofLocation = [];
                        console.log('datalocationelse',JSON.parse(data));
                        arrayofLocation.push(locationArraywithrunId);
                        setLocalData.setData("UnsyncLocationData",JSON.stringify(arrayofLocation));
                    }
                  })
                 


                var remvedfetcheddata = rundata;
                console.log('remvedfetcheddata',JSON.stringify(remvedfetcheddata));
                var removeIndex = remvedfetcheddata.map(function(item) { return item.client_run_id; }).indexOf(userRunData.client_run_id); 
                remvedfetcheddata.splice(removeIndex,1);   
                console.log('remvedfetcheddata',JSON.stringify(remvedfetcheddata));
                if (remvedfetcheddata != null) {

                     setLocalData.setData('UnsyncedData', JSON.stringify(remvedfetcheddata))
                     return this.fetchLocalRunData(user);
                }else{
                      
                      setLocalData.setData('UnsyncedData', JSON.stringify([]))
                      return this.fetchLocalRunData(user);
                } 
                
                
                   
                }else{
                  CleverTap.recordEvent('ON_RUN_SYNC',{
                    'upload_result':'failed',
                    'client_run_id':RunData.client_run_id,
                    'message_from_server':(userRunData),
                  });
                  return ;
                }
                      
            }).catch((error)=>{
                console.log('error',error);
                CleverTap.recordEvent('ON_RUN_SYNC',{
                    'upload_result':'failed',
                    'client_run_id':RunData.client_run_id,
                    'message_from_server':error,
                });
            })
        }, 

      async postlocationdata(tokenparse){
          var _this = this;
          // console.log('item',item);
          getLocalData.getData("UnsyncLocationData").then((data)=>{
           if (JSON.parse(data).length != 0 ){
            console.log('in',JSON.parse(data).length,JSON.parse(data));
            var arrayofdata = JSON.parse(data);
            var data = JSON.parse(data)[0];
            console.log('dataResult',data);
          if (data.location_array.length != 0) {
          fetch(apis.postLocationData, {
                 method: "POST",
                 headers: {  
                    'Authorization':"Bearer "+ tokenparse,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',           
                  },
                  body:JSON.stringify({
                    run_id: data.run_id,
                    client_run_id: data.client_run_id,
                    batch_num:0,
                    was_in_vehicle:false,
                    location_array:data.location_array
                  }),
               })
              .then(_this.handleNetworkErrors.bind(_this))
              .then((userRunData) => {

                console.log('RunData123',data.location_array,arrayofdata,userRunData);
                if (userRunData.run_location_id != null || userRunData.run_location_id != undefined) {

                  // console.log('BeforeRunDatalocationArrey',RunData.locationArray)
                  // RunData.locationArray.splice(0,1);
                  var remvedlocationdata = arrayofdata;
                  console.log('remvedfetcheddata',remvedlocationdata);
                  remvedlocationdata.splice(0,1);   
                  console.log('remvedfetcheddata',remvedlocationdata);
                  if (remvedlocationdata != null) {

                       setLocalData.setData('UnsyncLocationData', JSON.stringify(remvedlocationdata))
                       return this.postlocationdata(tokenparse);;
                  }else{
                        
                        setLocalData.setData('UnsyncLocationData', JSON.stringify([]))
                        return this.postlocationdata(tokenparse);;
                  } 
                  console.log('AfterRunDatalocationArrey',RunData.locationArray)
                  CleverTap.recordEvent('ON_RUN_SYNC_LOCATION_POINTS',{
                    'upload_result':'success',
                    'client_run_id':userRunData.run_location_id,
                  });
                  console.log('RunData123location',RunData,userRunData);
                  // this.postlocationdata(tokenparse);
                }else{
                  console.log('returnempty');
                }
              }).catch((err)=>{
                CleverTap.recordEvent('ON_RUN_SYNC_LOCATION_POINTS',{
                    'upload_result':'failed',
                    'client_run_id':data.client_run_id,
                  });
                console.log('postlocationdataerror',err);
              })
            }else{

              
            }
           }else{
            console.log('elseStatus',data);
           }
          })

        },



      postRunlocationPoints(tokenparse){
        _this = this;
        getLocalData.getData("UnsyncLocationData").then((data)=>{ 
          console.log('data',JSON.parse(data));
          var arrayOfrun = JSON.parse(data)
          for (i = 0; i < arrayOfrun.length; i++) {
            console.log('arrayOfrun[i]',arrayOfrun[i]);
             var locationPointArrey = arrayOfrun[i].location_array
              
            for (i = 0 ; i < locationPointArrey.length; i++){
            console.log('locationPointArrey',locationPointArrey);
            fetch(apis.postLocationData, {
                 method: "POST",
                 headers: {  
                    'Authorization':"Bearer "+ tokenparse,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',           
                  },
                  body:JSON.stringify({
                    run_id:arrayOfrun[i].run_id,
                    client_run_id: arrayOfrun[i].client_run_id,
                    batch_num:0,
                    was_in_vehicle:false,
                    location_array:locationPointArrey,
                  }),
               })
              .then(_this.handleNetworkErrors.bind(_this))
              .then((userRunData) => {

              }).catch((err)=>{
                CleverTap.recordEvent('ON_RUN_SYNC_LOCATION_POINTS',{
                    'upload_result':'failed',
                    'client_run_id':data.client_run_id,
                  });
                console.log('postlocationdataerror',err);
              })
             }

          }
        })
        
      },




        handleNetworkErrors(response){
            console.log('response',response);
            return response.json();
        }

}