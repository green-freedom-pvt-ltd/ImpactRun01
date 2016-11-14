import React, { Component } from 'react';
import Modal from 'react-native-simple-modal';
import Share, {ShareSheet, Button} from 'react-native-share';
import {
   Text,
   StyleSheet,
   TouchableOpacity,
   View,
   Image,
   AlertIOS,
   Dimensions,
   AsyncStorage
} from 'react-native';
const height = Dimensions.get('window').height;
import styleConfig from './styleConfig';
import apis from './apis'
class Model extends Component {
  constructor() {
    super();
    this.state = {
      offset:10,
      visible: false,
      open:false,
      openmodel:false,
    };
  }
   
  onCancel() {
    this.setState({visible:false});
  }
  onOpen() {
    this.setState({visible:true});
  }

  componentDidMount() {
    AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
        stores.map((result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
            this.setState({
              userData:JSON.parse(val),
              openmodel:true
            })
            AlertIOS.alert('mymodel',JSON.stringify(this.state.openmodel));
            var openmodel = this.state.openmodel;
            this.render(openmodel);
        });

    });
    this.setState({
      open:this.props.show,
    })
 	  this.fetchModelData();  
  }
  
  
  fetchModelData() {
    var url = apis.DownshareMealapi;
    fetch(url)
      .then( response => response.json() )
      .then( jsonData => {
        this.setState({
           ModelData:jsonData.results[0],
        });
        AlertIOS.alert('myVelue',JSON.stringify(this.state.ModelData));
        console.log('thisModeldata', this.state.ModelData.campaign_image);
      })
    .catch( error => console.log('Error fetching: ' + error) );
  }
  
  modelRender(openmodel){
    if (this.state.ModelData && this.state.userData) {
 

      let open = this.props.show;
      console.log('mymodelData',this.state.open);
      let shareOptions = {
        title: "ImpactRun",
        message:this.state.ModelData.campaign_share_template,
        url: "http://www.impactrun.com/#",
        subject: "Download ImpactRun Now " //  for email
      };
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Modal
             offset={this.state.offset}
             open={true}
             modalDidOpen={() => console.log('modal did open',this.props.show)}
             modalDidClose={() => this.setState({open: false})}
             style={{alignItems: 'center'}}>
                <View>
                  <View>
                    <Image style={styles.ModelImage} source={{uri:this.state.ModelData.campaign_image}}>
                    </Image>
                  </View>
                  <View>
                    <Text style={styles.campaignTitle}>{this.state.ModelData.campaign_title}</Text>
                    <Text style={styles.campaignDisc}>{this.state.ModelData.campaign_description}</Text>
                    <TouchableOpacity
                      style={styles.shareBtn}
                      onPress={()=>{Share.open(shareOptions)}}>
                      <Text style={{color:'white'}}>{this.state.ModelData.button_text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{flex:1,justifyContent: 'center',alignItems: 'center',marginLeft:10,marginBottom:10,marginRight:10,}}
                      onPress={() => this.setState({open: false})}>
                      <Text>Skip</Text>
                    </TouchableOpacity>
                  </View>
                </View>
          </Modal>
      </View>   
    );
}else{
  return;
}
  }
  render(openmodel) {
    return (
       <View>
         {this.modelRender(openmodel)}
       </View>   
    );
  }
}

const styles = StyleSheet.create({
  ModelImage:{
    borderRadius:2,
    height:height-380,
    
  },
  shareBtn:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:15,
    margin:20,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
        height: 3,
      },
    backgroundColor:styleConfig.light_gold,
  },
  campaignTitle:{
    fontSize:styleConfig.FontSizeTitle,
    color:styleConfig.greyish_brown_two,
    margin:20,
  },
  campaignDisc:{
    fontSize:styleConfig.FontSizeDisc,
    color:styleConfig.greyish_brown_two,
    marginLeft:20,
    marginRight:20,
  }
});
export default Model;