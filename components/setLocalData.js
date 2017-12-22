import {
   AsyncStorage,
} from 'react-native';

export default {
    setData(key,data) {
	    return  AsyncStorage.setItem(key, (err, result) => {
	        let user = JSON.parse(result);            
	        return user
	    })
    }
}