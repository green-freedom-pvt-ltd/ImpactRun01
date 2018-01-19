import {
   AsyncStorage,
   AlertIOS,
} from 'react-native';
import getLocalData from '../getLocalData.js';
import setLocalData from '../setLocalData.js';
import apis from '../apis.js';
const CleverTap = require('clevertap-react-native');
export default {


async checkForTooFast(location,enabled,activityType){
        var location = location;
        if (enabled === true) {
          if (activityType.type === 'AUTOMOTIVE' && activityType.confidence >= 2) {    
              return true
          }else{
            return false
          }            
        }else{
          return
        }         
  }


}