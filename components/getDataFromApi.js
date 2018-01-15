import {
   AsyncStorage,
   AlertIOS,
} from 'react-native';

export default {
    fetchData(url,headerData) {
	    return fetch(url,headerData)
        .then( response => response.json())
        .then( jsonData => {
          // console.log('fetchedDataurl : '+ url +'  data  :'+JSON.stringify(jsonData));
          
          return jsonData 
        })
        .catch( error => {
          
        	console.log('Error fetching url : ' + url +  '  error : ' + error) 
            this.fetchData(url);
        });
    }
}