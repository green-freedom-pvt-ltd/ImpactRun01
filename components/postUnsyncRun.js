import {
   AsyncStorage,
   AlertIOS,
} from 'react-native';
import getLocalData from './getLocalData.js';
import setLocalData from './setLocalData.js';
import apis from './apis.js';
const CleverTap = require('clevertap-react-native');
var NetworkResponcePostRun = [];
export default {
        fetchLocalRunData(user){
            return getLocalData.getData('UnsyncedData')
                  .then((result)=>{
                    var rundata = JSON.parse(result); 
                    console.log('rundata',rundata);
                    if (rundata != null  ) {
                      if (rundata.length > 0 ) {
                            if(user != null){
                               return this.postPastRun(rundata[0],user,rundata);
                            }
                      }else{
                        console.log('runData ',rundata);
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
                    team_id:RunData.team_id,
                    client_run_id:RunData.client_run_id,
                })
            })
            .then(_this.handleNetworkErrors.bind(_this))
            .then((userRunData) => {
              console.log('userRunData',userRunData);

                return this.postlocationdata(RunData,userRunData,user.auth_token,rundata,user); 
               
                CleverTap.recordEvent('ON_RUN_SYNC',{
                    'upload_result':'success',
                    'client_run_id':userRunData.client_run_id,
                    'http_status':NetworkResponcePostRun,
                });       
            }).catch((error)=>{
                console.log('error',error);
                CleverTap.recordEvent('ON_RUN_SYNC',{
                    'upload_result':'failed',
                    'client_run_id':RunData.client_run_id,
                    'message_from_server':error,
                    'http_status':NetworkResponcePostRun,
                });
            })
        }, 

      async postlocationdata(RunData,data,tokenparse,rundata,user){
          var _this = this;
          console.log('RunData',RunData);
          var item =  RunData.locationArray[0] ;
          console.log('item',item);
          if (RunData.locationArray.length != 0) {
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
                    start_time_epoch: data.start_time_epoch,
                    end_time_epoch: data.end_time_epoch,
                    was_in_vehicle:true,
                    location_array:item
                  }),
               })
              .then(_this.handleNetworkErrors.bind(_this))
              .then((userRunData) => {
                  RunData.locationArray.shift(0);
                  console.log('RunData123location',RunData);
                  this.postlocationdata(RunData,data,tokenparse,rundata,user)
              }).catch((err)=>{
                console.log('postlocationdataerror',err);
              })
            }else{
               var remvedfetcheddata = rundata;
                console.log('remvedfetcheddata',remvedfetcheddata);
                var listToremove =[];
                listToremove.push(data.start_time);
                var removeIndex = remvedfetcheddata.map(function(item) { return item.start_time; }).indexOf(data.start_time); 
                remvedfetcheddata.splice(removeIndex, 1);   
                console.log('remvedfetcheddata',remvedfetcheddata);
                if (remvedfetcheddata != null) {
                     setLocalData.setData('UnsyncedData', JSON.stringify(remvedfetcheddata))
                }else{
                      setLocalData.setData('UnsyncedData', JSON.stringify([]))
                } 
                
              this.fetchLocalRunData(user);
            }
        },

        handleNetworkErrors(response){
            console.log('response',response);
            NetworkResponcePostRun.push(response.status)
            return response.json();
        }

}