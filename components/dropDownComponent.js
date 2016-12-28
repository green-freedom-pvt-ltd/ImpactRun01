var React = require('react-native');
var {
  Component,
  AppRegistry,
  Text,
  View,
} = React;

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
      canada: ''
    };
  }

  componentDidMount() {
    updatePosition(this.refs['SELECT1']);
    updatePosition(this.refs['OPTIONLIST']);
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }


  _canada(province) {

    this.setState({
      ...this.state,
      canada: province
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',marginTop:10,backgroundColor:'white'}}>
          <Select
            width={250}
            ref="SELECT1"
            optionListRef={this._getOptionList.bind(this)}
            defaultValue="choose your city"
            onSelect={this._canada.bind(this)}>
            <Option>Delhi</Option>
            <Option>Mumbai</Option>
            <Option>banglore</Option>
            <Option>chennai</Option>
            <Option>deharadun</Option>
            <Option>Northwest Territories</Option>
          </Select>
          <OptionList ref="OPTIONLIST"/>
      </View>
    );
  }
}
 

export default ImpactLeagueDropdown; 