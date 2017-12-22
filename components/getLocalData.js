import {
   AsyncStorage,
   AlertIOS,
} from 'react-native';

export default {
    getData(key) {
	    return  AsyncStorage.getItem(key, (err, result) => {
	        let data = JSON.parse(result);  
	        return data;
	    })
    }
}