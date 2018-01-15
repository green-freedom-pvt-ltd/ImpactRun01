import {
   AsyncStorage,
} from 'react-native';

export default {
    setUserData(key,data) {
	    return  AsyncStorage.setItem(key,data,(err, result) => {
	        return result
	    })
    },

    setTotalRaisedData(key,data) {
	    return  AsyncStorage.setItem(key, (err, result) => {
	        let totalRaised = JSON.parse(result);            
	        return totalRaised
	    })
    },
    setleaderData(key,data) {
	    return  AsyncStorage.setItem(key, (err, result) => {
	        let leaderData = JSON.parse(result);            
	        return leaderData
	    })
    },
    setLeagueData(key,data) {
	    return  AsyncStorage.setItem(key, (err, result) => {
	        let LeagueData = JSON.parse(result);            
	        return LeagueData
	    })
    },
    setfaqData(key,data) {
	    return  AsyncStorage.setItem(key, (err, result) => {
	        let faqData = JSON.parse(result);            
	        return faqData
	    })
    },
    setRunHistoryData(key,data) {
	    return  AsyncStorage.setItem(key, (err, result) => {
	        let RunHistoryData = JSON.parse(result);            
	        return RunHistoryData
	    })
    },
    setData(key,data) {
	    return  AsyncStorage.setItem(key,data,(err, result) => {
	    	// console.log('dataset:=> '+key,data);
	        return data
	    })
    },
}