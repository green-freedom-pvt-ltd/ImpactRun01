import {Navigation} from 'react-native-navigation';
import {Component} from 'react';
import { AsyncStorage,} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var settingicon = 'data:image/png;base64,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'
var userArray;
class Route extends Component{

  constructor(props) {
    super(props);
    
    this.state = {
      user:null,
    };
    this.getUserData = this.getUserData.bind(this);
    this.tabNavigation = this.tabNavigation.bind(this);
    this.getUserData();
  }

  getUserData(){
    AsyncStorage.getItem('USERDATA', (err, result) => {
        let user = JSON.parse(result);
        this.setState({
          user:user,
        })
        userArray = user;

       if(user !=  null)
       {

       }
      console.log('user12',user,userArray);
        
    }).catch((err)=>{
      console.log('err',err);
    })
  }


  tabNavigation(){
     Icon.getImageSource('ios-settings', 30, '#F5002A').then((source) => {
        Navigation.startTabBasedApp({
          tabs:[
            {
              label:'Settings',
              screen:'setting',
              title:'setting',
              icon:source,
            },
            {
              label:'Profile',
              screen:'profile',
              title:'Profile',
            },
            {
              label:'Home',
              screen:'home',
              title:'ImpactRun',
            },
            {
              label:'Leaderboard',
              screen:'leaderboard',
              title:'Leaderboard',
            },
            {
              label:'Help',
              screen:'helpcenter',
              title:'HelpCenter',
              
            }
          ],
          passProps: {user:userArray,getUserData:this.getUserData,tabNavigation:this.tabNavigation},
        })
      });

  }
 

  componentDidMount() {
   
      this.tabNavigation();
        

  }

  render(){
    return null;
  }
}
export default Route ;
 
// export default () => {
 
// }