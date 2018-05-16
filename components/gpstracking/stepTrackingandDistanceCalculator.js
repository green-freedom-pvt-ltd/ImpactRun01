 var {
    Accelerometer,
    Gyroscope,
    Magnetometer
} = require('NativeModules');
import {
   AsyncStorage,
   AlertIOS,
   DeviceEventEmitter,
} from 'react-native';

export default{
	 getGetSteps() {
	 	Accelerometer.setAccelerometerUpdateInterval(0.2);
	 	DeviceEventEmitter.addListener('AccelerationData', function (data) {
	      // console.log('data',data);
	      var x = data.acceleration.x;
	      var y = data.acceleration.y;
	      var z = data.acceleration.z;
	      
	      // console.log('data.acceleration.x',data.acceleration.x);
	      // console.log('data.acceleration.y',data.acceleration.y);
	      // console.log('data.acceleration.z',data.acceleration.z);
	      // console.log('SQRT ',Math.sqrt(x*x+y*y+z*z));
	      // console.log('steps FromFile ', Math.sqrt(x*x+y*y+z*z));
	      if (Math.sqrt(x*x+y*y+z*z) > 1.27 || Math.sqrt(x*x+y*y+z*z) < 0.73) {
	        // console.log('steps FromFile ', Math.sqrt(x*x+y*y+z*z));
	      
	      }
	      


	    });
	    Accelerometer.startAccelerometerUpdates();
	 }
}