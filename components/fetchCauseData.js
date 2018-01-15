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
       getCauseFromApi(auth_token){
            let headerData = {
                method: "GET",
                headers: {
                    'Authorization':auth_token,
                }
            }
            return fetch(apis.causeListapi,headerData)
             .then( response => response.json())
            .then((causes)=>{
                console.log('newData',causes);    
                var indexcause = -1;   
                var causes = causes;
                var causesData = []
                var newData = []
                var itemsProcessed = 0;

                 causes.results.forEach((item, i) => {                    
                    itemsProcessed++;
                    if (item.is_active || item.is_completed) {
                        indexcause = indexcause + 1
                        causesData.push(['causes' + indexcause, JSON.stringify(item)])
                        newData.push('causes' + indexcause);
                    };
                    
                    console.log(itemsProcessed,causes.count);
                    if(itemsProcessed === causes.count) {
                        console.log('indaat',newData);
                        
                        this.AfterFetchcause(newData,causesData,causes);
                        
                    }
                })
                 return newData
                                                              
            })
            .catch((err)=>{
                console.log("errorcauseapi ",err)
                if (err != null) {
                    return this.getCause(auth_token);
                };
            })
        },

        getCause(auth_token){
            getLocalData.getData('CauseNumber')
            .then((result)=>{  
                if (result != null ) {
                    return result
                }else{
                    this.getCauseFromApi(auth_token);
                }
            })           
        },

        AfterFetchcause(newData,causesData,causes){    
            let myCauseNum = newData;
           
            AsyncStorage.removeItem('CauseNumber',(err) => {
            });
            getLocalData.getData('overall_impact')
            .then((result)=>{
                if (result != null) {
                    AsyncStorage.removeItem('oldoverall_impact',(err) => {
                    });
                    setLocalData.setData('oldoverall_impact',result)
                };
            })
            console.log('causes',causes);
            setLocalData.setData('exchangeRates',JSON.stringify(causes.exchange_rates));
            setLocalData.setData('overall_impact',JSON.stringify(causes.overall_impact));
            setLocalData.setData('CauseNumber',JSON.stringify(myCauseNum))
            .then((data)=>{
                console.log('CauseNumber',data);
            })       
            var newDate = new Date();
            var convertepoch = newDate.getTime()/1000
            var epochtime = parseFloat(convertepoch).toFixed(0);
            AsyncStorage.removeItem('causeFeatchVersion',(err) => {
            });
            setLocalData.setData('causeFeatchVersion',JSON.stringify(epochtime));
            getLocalData.getData('CauseNumber')
            .then((data)=>{
                console.log('dataCauseNymber',data);
                
            })         
            AsyncStorage.multiRemove(newData, (err) => {
            })
            AsyncStorage.multiSet(causesData, (err) => {
            })

        }     

}