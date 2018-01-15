import {
   AsyncStorage,
   AlertIOS,
} from 'react-native';
import getLocalData from './getLocalData.js';
import apis from './apis.js';
const CleverTap = require('clevertap-react-native');
import fetchDatafromApi from './getDataFromApi.js';
import setLocalData from './setLocalData.js';
export default {
       fetchRunhistoryupdataData(user,runversion){
             return getLocalData.getData('fetchRunhistoryData')
                .then((fetchRunhistoryData)=>{                   
                var runArray = (JSON.parse(fetchRunhistoryData) != null)?JSON.parse(fetchRunhistoryData):[];
                var _this = this;
                var mergerowData = [];
                var token = user.auth_token;
                var runversionfetch = runversion;
                if (runversionfetch != 0 ) {
                   var url ='http://dev.impactrun.com/api/runs/'+'?client_version='+runversionfetch;
                }else{
                   var url = apis.runListapi;
                }
                let headerData = {
                  method: "GET",
                  headers: {
                    'Authorization':"Bearer "+ token,
                    'Content-Type':'application/x-www-form-urlencoded',
                  }
                }
               return fetchDatafromApi.fetchData(url,headerData)
                .then( jsonData => {
                    if(jsonData.count > 0 ){
                        setLocalData.setData("pastRunSyncTime",JSON.stringify(this.returnNEwDate()))
                        var runversion = jsonData.results;
                        var array = [];
                        var itemsProcessed = 0;
                        var _this = this;
                         runversion.forEach(function(item) {
                            itemsProcessed ++ ;
                            var newRunAddedFrombackend = [];         
                            var objIndex = runArray.findIndex(obj => obj.start_time == item.start_time);
                            if (objIndex === -1) {
                                array.push(item);
                            }
                            runArray[objIndex] = item;
                            

                        })

                        if (itemsProcessed === jsonData.results.length) {
                                // if (jsonData.count > 5) {                      
                                let fetchRunhistoryData = array.concat(runArray);
                                return setLocalData.setData("fetchRunhistoryData",JSON.stringify(fetchRunhistoryData))
                                .then(()=>{
                                    
                                    console.log('mydata',jsonData);
                                     
                                   if (jsonData.next != null) {
                                     console.log('mydata2',jsonData);
                                        var nextpage = jsonData.next
                                        return _this.nextPage(nextpage,user);
                                    }else{
                                      this.setRunVersion(); 
                                      return JSON.parse(fetchRunhistoryData);
                                   }
                                })
                            };
                      
                         
                    }else{
                        console.log('jsonData123',jsonData);
                        var _this = this;
                        let responceversion = {
                          runversion:this.returnNEwDate()
                        }
                        let keys = ['runversion','pastRunSyncepochtime'];
                        AsyncStorage.multiRemove(keys, (err) => {
                            setLocalData.setData("runversion",JSON.stringify(responceversion))
                            .then(()=>{
                                
                                setLocalData.setData("pastRunSyncTime",JSON.stringify(this.returnNEwDate()))
                            })
                        });
                        return JSON.parse(fetchRunhistoryData);                   
                      
                    } 
                         
                })
                .catch(function(err) {
                    console.log('err123',err);
                    return err;
                }) 
                 
            })   
        },

        returnNEwDate(){
            var newDate = new Date();
            var pastRunSyncTimeepoch = newDate.getTime()/1000
            return parseFloat(parseInt(pastRunSyncTimeepoch)+30).toFixed(0);
        },


         nextPage(nextpage,user){
            
            return getLocalData.getData('fetchRunhistoryData')
            .then((result)=>{
            var runArray = (JSON.parse(result) != null)?JSON.parse(result):[];   
            var _this = this;
            var token = user.auth_token;
            var url = nextpage;

            return fetch(url,{
                method: "GET",
                headers: {
                    'Authorization':"Bearer "+ token,
                    'Content-Type':'application/x-www-form-urlencoded',
                }
            })
             .then(response => response.json())
            .then( jsonData => {
           
            var nextpagesec = jsonData.next;  
            // console.log('jsonData',jsonData,nextpagesec);
            var itemsProcessed = 0;
            var runversion = jsonData.results;
            var array = [];
            var _this = this;
            runversion.forEach(function(item) {
                itemsProcessed++;
                var newRunAddedFrombackend = [];                
                var objIndex = runArray.findIndex(obj => obj.start_time == item.start_time);
                if (objIndex === -1) {
                  array.push(item);
                }
                runArray[objIndex] = item;
                
            })
             if (itemsProcessed === jsonData.results.length) {
                      
                    let fetchRunhistoryData = array.concat(runArray);
                    return setLocalData.setData('fetchRunhistoryData', JSON.stringify(fetchRunhistoryData))
                    .then((result)=>{
                         
                         return _this.LoadMoverRunView(nextpagesec,user,fetchRunhistoryData);
                    })
                   
                }
            })
            .catch(( error) => {
                console.log('Error fetching: ' + error)} );
                this.nextPage(nextpage,user);
                return JSON.parse(result);
                AlertIOS.alert('Network error', 'network problem while fetching all runs');
            })
           
       
        },


        LoadMoverRunView(nextpagesec,user,fetchRunhistoryData){
            console.log('nextpagesec',nextpagesec);

            if (nextpagesec != null) {
                return this.nextPage(nextpagesec,user);
            }else{
              this.setRunVersion();
              return fetchRunhistoryData;
            };
        },
        
       


         setRunVersion(){
              let responceversion = {
                runversion:this.returnNEwDate()
              }
              console.log('store version out',responceversion);
              let keys = ['runversion'];
              AsyncStorage.multiRemove(keys, (err) => {
                setLocalData.setData("runversion",JSON.stringify(responceversion))
                .then((result)=>{
                  console.log('store version in',responceversion.runversion);

                });
              }); 
         }


        

}