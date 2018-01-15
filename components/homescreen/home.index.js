import React, { Component } from 'react';
import { View, AsyncStorage,ScrollView, Text, StatusBar, Platform } from 'react-native';

import CarouselCard from 'react-native-card-carousel'
import getLocalData from '../getLocalData.js';
import CauseCard from './causeCard';

export default class example extends Component {

    constructor (props) {
        super(props);
        this.state = {
         causes : [],
         cause:null,
        };
    }



    componentDidMount() {
      getLocalData.getData('causes')
      .then((causes)=>{
        console.log('causes',JSON.parse(causes));
        this.setState({
          causeData:JSON.parse(causes).results,
        })
      })
    	 var provider = this.props.provider;
        var causeNum = this.props.myCauseNum;
  
            AsyncStorage.multiGet(causeNum, (err, stores) => {

                var _this = this
                console.log('value',stores);
               
                _this.setState({cause: stores})
                stores.map((item) => {

                    let key = item[0];
                    let val = JSON.parse(item[1]);
                    console.log('causesArr',val);
                    let causesArr = _this.state.causes.slice()
                    causesArr.push(val)  
                    console.log('causesArr',causesArr);                
                    _this.setState({causes: causesArr})
                    _this.setState({album : Object.assign({}, _this.state.album, {[val.cause_title]: [val.amount_raised,val.amount,val.total_runs,val.cause_completed_image,val.is_completed,val]})})
                    _this.setState({brief : Object.assign({}, _this.state.brief, {[val.cause_brief]: val.cause_image})})
                });
              this.setState({
                loadingimage:false,
                navigation: Object.assign({}, this.state.navigation, {
                index: 0,
                routes: Object.keys(this.state.album).map(key => ({ key })),

              })

              })
          });
         
       
    }


    render () {

       if (this.state.causeData != null ) {
        return (   
          <CarouselCard
            height={300}
            interval={4000}
            data={this.state.causeData}
            onPress={item => {}}
            contentRender={item => <CauseCard item = {item}/>}/>
        );
      }else{
        return(
          <Text>loading..</Text>
          )
      }
      
    }
}