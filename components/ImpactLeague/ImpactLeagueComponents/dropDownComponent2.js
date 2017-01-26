
import React, { Component } from 'react';

import{
  AppRegistry,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

const DropDown = require('react-native-dropdown');
const {
  Select,
  Option,
  OptionList,
  updatePosition,
  
} = DropDown;

class ImpactLeagueDropdown2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: ''
    };
  }

  componentDidMount() {
    updatePosition(this.refs['SELECT1']);
    updatePosition(this.refs['OPTIONLIST']);
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }


  department(province) {
    this.setState({
      ...this.state,
      department: province
    });
    let Department_object = {
     department: this.state.department,
    };
    // You only need to define what will be added or updated
    let  Department_delta = {
     department: this.state.department,
    };

    AsyncStorage.setItem('Department', JSON.stringify( Department_object), () => {
      AsyncStorage.mergeItem('Department', JSON.stringify( Department_delta), () => {
        AsyncStorage.getItem('Department', (err, result) => {
        });
      });
    });
  }

  render() {
    var department = this.props.department;
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent',bottom:100}}>
          <Select
            width={250}
            ref="SELECT1"
            optionListRef={this._getOptionList.bind(this)}
            defaultValue="choose your department"
            onSelect={this.department.bind(this)}>
            <Option>{department[0].department}</Option>
            <Option>{department[1].department}</Option>
            <Option>{department[2].department}</Option>
            <Option>{department[3].department}</Option>
          </Select>
          <OptionList ref="OPTIONLIST"/>
      </View>
    );
  }
}
 

export default ImpactLeagueDropdown2; 