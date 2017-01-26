
import React, { Component } from 'react';

import{
  AppRegistry,
  Text,
  View,
  AsyncStorage,
  AlertIOS
} from 'react-native';

const DropDown = require('react-native-dropdown');
const {
  Select,
  Option,
  OptionList,
  updatePosition
} = DropDown;

class ImpactLeagueDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: ''
    };
  }

  componentDidMount() {
    updatePosition(this.refs['SELECT1']);
    updatePosition(this.refs['OPTIONLIST']);
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }


  city(province) {

    this.setState({
      ...this.state,
      city: province
    });
    let City_object = {
     city:this.state.city,
    };
    // You only need to define what will be added or updated
    let City_delta = {
    city:this.state.city,
    };

    AsyncStorage.setItem('City', JSON.stringify(City_object), () => {
      AsyncStorage.mergeItem('City', JSON.stringify(City_delta), () => {
        AsyncStorage.getItem('City', (err, result) => {
        });
      });
    });
  }


  render() {

    var city = this.props.city;
    // var cityOptions = '';
    // var i;
    // for (i = 0; i < city.length; i++) {
    //   if(city[i].city != null){
    //     cityOptions +=  "<Option>" + city[i].city + "</Option>";}
    // }
    // console.log(cityOptions);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',}}>
          <Select
            width={250}
            ref="SELECT1"
            optionListRef={this._getOptionList.bind(this)}
            defaultValue="choose your city"
            onSelect={this.city.bind(this)}
           >
           <Option>{city[0].city}</Option>
            <Option>{city[1].city}</Option>
            <Option>{city[2].city}</Option>
            <Option>{city[3].city}</Option>
          </Select>
          <OptionList ref="OPTIONLIST"/>
      </View>
    );
  }
}
 

export default ImpactLeagueDropdown; 