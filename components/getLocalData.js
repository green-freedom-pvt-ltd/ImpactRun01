import {
   AsyncStorage,
   AlertIOS,
} from 'react-native';

export default {
    getData(key) {
	    return  AsyncStorage.getItem(key, (err, result) => {        
	        return JSON.parse(result);
	    })
    }
}