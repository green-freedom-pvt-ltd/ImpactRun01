    

import {AsyncStorage} from "react-native"
export default =>(){

    saveDataperiodcally(){    
      this.IntervelSaveRun = setInterval(()=>{
        if (distancePriv != 0) { 
          var distance = parseFloat(Number(parseFloat(this.state.distanceTravelled).toFixed(1)) + distancePriv).toFixed(1);
          let Rundata = {
            data:this.props.data,
            distance:parseFloat(this.state.distanceTravelled).toFixed(1),
            impact:parseFloat(this.state.distance * this.props.data.conversion_rate).toFixed(0)/this.state.my_rate,
            speed:this.state.currentSpeed,
            time:this.state.mainTimer,
            StartLocation:this.state.StartLocation,
            EndLocation:this.state.newlatlong,
            calories_burnt:this.state.calorieBurned,
            StartRunTime:this.state.myrundate,
            noOfsteps:this.state.numberOfSteps,
            ocationArray:this.state.locationArray,
           }
          AsyncStorage.setItem('runDataAppKill',JSON.stringify(Rundata));
          AsyncStorage.getItem('runDataAppKill', (err, result) => {
          }); 
        }else{
          let Rundata = {
              data:this.props.data,
              distance:parseFloat(this.state.distanceTravelled).toFixed(1),
              impact:parseFloat(this.state.distanceTravelled).toFixed(1) * this.props.data.conversion_rate/this.state.my_rate,
              speed:this.state.currentSpeed,
              time:this.state.mainTimer,
              calories_burnt:this.state.calorieBurned,
              StartLocation:this.state.StartLocation,
              EndLocation:this.state.newlatlong,
              StartRunTime:this.state.myrundate,
              noOfsteps:this.state.numberOfSteps,
              locationArray:this.state.locationArray,
          }
          AsyncStorage.setItem('runDataAppKill',JSON.stringify(Rundata)); 
          AsyncStorage.getItem('runDataAppKill', (err, result) => {
          }); 
        }   
      },30000)
    }
  }