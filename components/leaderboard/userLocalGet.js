//get userData ();
import { AsyncStorage,} from 'react-native';

export default {
 //  getLocalUser() {
 //  	var resultpass ;
 //    AsyncStorage.getItem('USERDATA', (err, result) => {
	//     let user = JSON.parse(result);
	//     resultpass = result;
	//     console.log("result",user);
	// }).then((result) => {
	// 	console.log('responce',result);
 //        resultpass = result;
 //       return result;
 //     })
 //     return resultpass ;
 //   }


    _getFilter(key,callback)
       {
        multiGet = (key) => {
        var collect;
        try {
          var value = AsyncStorage.getItem(key).then(
            (values) => {
           //   value = values;
             console.log('Then: ',values);
             callback(values)
            });
        } catch (error) {
          console.log('Error: ',error);
        }
        console.log('Final: ',value);

        }
    }

}