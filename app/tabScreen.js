import {Navigation} from 'react-native-navigation';
import { AsyncStorage,} from 'react-native';

import Home from '../components/homescreen/HomeScreen.ios';
import CauseDetail from '../components/homescreen/CauseDetail';
import RunLoading from '../components/gpstracking/runlodingscreen';
import RunScreen from '../components/gpstracking/home.ios';
import ShareScreen from '../components/sharescreen/shareScreen';
import LeaderBoard from '../components/leaderboard/leaderBoard';
import ImpactLeague from '../components/ImpactLeague/ImpactLeagueHome';
import ImpactLeagueTeamLeaderBoard from '../components/ImpactLeague/ImpactLeagueLeaderboard';
import HelpCenter from '../components/Helpcenter/helpcenter';
import Question from '../components/faq/faq';
import FeedBack from '../components/Helpcenter/endFeedBackPage';
import QuestionList2 from '../components/Helpcenter/listviewQuestions';
import Profile from '../components/profile/profile.index';
import RunHistory from '../components/profile/runhistory/runHistory';
import EditProfile from '../components/profile/profileForm';
import Setting from '../components/settings/setting';
import Feed from '../components/feed/messageCenter';
import FeedDetail from '../components/feed/messageDetail';
import Icon from 'react-native-vector-icons/Ionicons';
import route from './route';
import Login from '../components/login/login';




 export default () => {
   

  Navigation.registerComponent('route', ()=> route);  
  Navigation.registerComponent('home', ()=> Home);
  Navigation.registerComponent('causedetail', ()=> CauseDetail);
  Navigation.registerComponent('runloading', ()=> RunLoading);
  Navigation.registerComponent('runscreen', ()=> RunScreen);
  Navigation.registerComponent('sharescreen', ()=> ShareScreen);
  Navigation.registerComponent('leaderboard', ()=> LeaderBoard);
  Navigation.registerComponent('impactleague', ()=> ImpactLeague);
  Navigation.registerComponent('impactleagueteamboard', ()=> ImpactLeagueTeamLeaderBoard);
  Navigation.registerComponent('helpcenter', ()=> HelpCenter);
  Navigation.registerComponent('question', ()=> Question);
  Navigation.registerComponent('feedback', ()=> FeedBack);
  Navigation.registerComponent('questionlist2', ()=> QuestionList2);
  Navigation.registerComponent('profile', ()=> Profile);
  Navigation.registerComponent('runhistory', ()=> RunHistory);
  Navigation.registerComponent('editprofile', ()=> EditProfile);
  Navigation.registerComponent('setting', ()=> Setting);
  Navigation.registerComponent('feed', ()=> Feed);
  Navigation.registerComponent('feeddetail', ()=> FeedDetail);  
  Navigation.registerComponent('login', ()=> Login);
  getUser = () =>{
     AsyncStorage.getItem('USERDATA', (err, result) => {
      let user = JSON.parse(result);
      resultpass = result;
      console.log("result",user);
    }).then((result) => {
     if (result != null){
      navigateToRoute('route',result);
     }else{
       navigateToRoute('login',result);
     }
     
    })
  }
  getUser()

 


 navigateToRoute = (route,user)=>{
  Navigation.startSingleScreenApp({
        screen: {
          screen: route,
           // unique ID registered with Navigation.registerScreen
          title: 'Welcome', // title of the screen as appears in the nav bar (optional)
          navigatorStyle: {
            navBarHidden:true,
          }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        
        passProps: {user:user,getUserData:this.getUser.bind(this)}, // simple serializable object that will pass as props to all top screens (optional)
        animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
  });
 }
  
      
    
}
