import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  AlertIOS,
  NetInfo,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import LodingScreen from '../../components/LodingScreen';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Motion extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      faqData: ds.cloneWithRows([]),
              loaded: false,

    };
  }
  navigateTOhome(){
    this.props.navigator.push({
            title: 'Gps',
            id:'tab',
            navigator: this.props.navigator,
           })
  }

  componentDidMount() {


    NetInfo.isConnected.fetch().done(
        (isConnected) => { this.setState({isConnected}); 
        if (isConnected) {
           this.fetchFaqData();
        };
         
      }
    );
  }
  
  fetchFaqData() {
    var url = 'http://dev.impactrun.com/api/faq/';
    fetch(url)
      .then( response => response.json() )
      .then( jsonData => {
        this.setState({
          faqData: this.state.faqData.cloneWithRows(jsonData.results),
           loaded: true,
        });
      })
    .catch( error => console.log('Error fetching: ' + error) );
  }
  
  
  renderRow(rowData){
    return (
      <View style={{backgroundColor:'#e6e2e2',padding:10,marginBottom:5}}>
      <View style={styles.thumb}>
        <Text style={styles.txt}>{rowData.question}</Text>
      </View>
      <Text style={styles.txtSec}>{rowData.answer}</Text>
      </View>
    );
  }
 renderLoadingView() {
    return (
      <View style={{height:deviceHeight,top:-30}}>
        <LodingScreen/>
      </View>
    );
  }
 SubmitFaq(){

  if (this.state.isConnected === true) {
   fetch("http://dev.impactrun.com/api/faq/", {
       method: "post",
       headers: {  
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          },
           body:JSON.stringify({
          "question":this.state.moreText,
          })

      })
      .then((response) => response.json())
       .then((response) => { 
         AlertIOS.alert('Thankyou for submitting your question');
         console.log('faqdata'+JSON.stringify(response));
         
      })
       
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
  }else{
    AlertIOS.alert('No Internet Connection');
  }
   dismissKeyboard();
   this._textInput.setNativeProps({text: ''});
 }

  render() {
      if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    console.log(this.state.isConnected);
    return (
      <View style={{height:deviceHeight,width:deviceWidth}}>
      <View style={{height:deviceHeight-50,width:deviceWidth}}>
        <View style={styles.Navbar}>
            <Text style={styles.menuTitle}>Faqs</Text>
        </View>
       
         <ListView
          dataSource={this.state.faqData}
          renderRow={this.renderRow}
          style={styles.container}>
        </ListView>
        <View style={styles.FaqSubmitWrap}>
          <TextInput
          ref={component => this._textInput = component} 
          style={styles.textEdit}
          onChangeText={(moreText) => this.setState({moreText})}
          placeholder="If you have any question ask us!"
          />
          <TouchableOpacity onPress={() => this.SubmitFaq()} style={styles.submitFaqbtn}><Text style={{color:'white'}}>Submit</Text></TouchableOpacity>
        </View>
        <KeyboardSpacer style={{backgroundColor:'#673AB7'}}/>
       </View>
      </View> 

    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    height:deviceHeight,
    width:deviceWidth,
    bottom:-45,
    marginTop:-45,
  },
  thumb: {
    backgroundColor: '#5bb75b',
    marginBottom: 5,
    elevation: 1
  },
  img: {
    height: 300
  },
  txt: {
    color:'white',
    margin: 10,
    fontSize: 16,
    textAlign: 'left'
  },
  txtSec:{
   padding:10,
   fontSize:15
  },
  FaqSubmitWrap:{
  paddingLeft:10,
  height:55,
  width:deviceWidth,
  flexDirection: 'row',
  justifyContent:'flex-start',
  alignItems:'center',
  backgroundColor:'#673AB7',
  borderBottomWidth:2,
  borderBottomColor:'#673AB7',
},
 Navbar:{
  paddingLeft:10,
  position:'relative',
  height:55,
  width:deviceWidth,
  flexDirection: 'row',
  justifyContent:'flex-start',
  alignItems:'center',
  backgroundColor:'#00b9ff',
  borderBottomWidth:2,
  borderBottomColor:'#e03ed2',
},
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
  textEdit: {
    marginLeft:-5,
    height:48, 
    borderColor: '#673AB7', 
    backgroundColor: 'white',
    borderWidth:4 ,
    borderRadius:8,
    width:deviceWidth-100,
    color:'black',
    padding:10,
    top:4,
  },
  submitFaqbtn:{
   height:42, 
   width:85,
   right:-4,
   borderRadius:8,
   justifyContent:'center',
   alignItems:'center',
   backgroundColor:'#d667cd', 
  }
});

export default Motion;