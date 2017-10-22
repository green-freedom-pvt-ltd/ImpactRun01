/**
 * Created by sohobloo on 16/9/13.
 */

'use strict';

import React, {
  Component,
  
} from 'react';
const PropTypes = require('prop-types');

import {
  NativeModules,
  StyleSheet,
  Dimensions,
  View,
  Text,
  ListView,
  TouchableWithoutFeedback,
  TouchableWithNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ActivityIndicator,
} from 'react-native';
import styleConfig from '../../components/styleConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

var deviceWidth = Dimensions.get('window').width;
const TOUCHABLE_ELEMENTS = ['TouchableHighlight', 'TouchableOpacity', 'TouchableWithoutFeedback', 'TouchableWithNativeFeedback'];

export default class ModalDropdown extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,

    accessible: PropTypes.bool,
    animated: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,

    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

    adjustFrame: PropTypes.func,
    renderRow: PropTypes.func,
    renderSeparator: PropTypes.func,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    defaultIndex: 0,
    defaultValue: '',
    options: null,
    animated: true,
    showsVerticalScrollIndicator: true
  };

  constructor(props) {
    super(props);

    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;

    this.state = {
      disabled: props.disabled,
      accessible: props.accessible !== false,
      loading: props.options == null,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex
    };
  }

  componentWillReceiveProps(nextProps) {
    var buttonText = this._nextValue == null ? this.state.buttonText : this._nextValue.toString();
    var selectedIndex = this._nextIndex == null ? this.state.selectedIndex : this._nextIndex;
    if (selectedIndex < 0) {
      selectedIndex = nextProps.defaultIndex;
      if (selectedIndex < 0) {
        buttonText = nextProps.defaultValue;
      }
    }
    this._nextValue = null;
    this._nextIndex = null;

    this.setState({
      disabled: nextProps.disabled,
      loading: nextProps.options == null,
      buttonText: buttonText,
      selectedIndex: selectedIndex
    });
  }

  render() {
    return (
      <View {...this.props}>
        {this._renderButton()}
        {this._renderModal()}
      </View>
    );
  }

  _updatePosition(callback) {
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = {x: px, y: py, w: width, h: height};
        callback && callback();
      });
    }
  }

  show() {
    this._updatePosition(() => {
      this.setState({
        showDropdown: true
      });
    });
  }

  hide() {
    this.setState({
      showDropdown: false
    });
  }

  select(idx) {
    var value = this.props.defaultValue;
    if (idx == null || this.props.options == null || idx >= this.props.options.length) {
      idx = this.props.defaultIndex;
    }

    if (idx >= 0) {
      value = this.props.options[idx].toString();
    }

    this._nextValue = value;
    this._nextIndex = idx;

    this.setState({
      buttonText: value,
      selectedIndex: idx
    });
  }

  _renderButton() {
    return (
      <TouchableOpacity ref={button => this._button = button}
                        disabled={this.props.disabled}
                        accessible={this.props.accessible}
                        onPress={this._onButtonPress.bind(this)}>
        {
          this.props.children ||
          (
            <View style={styles.button}>
              <Text style={[styles.buttonText, this.props.textStyle]}
                    numberOfLines={1}>
                {this.state.buttonText}{'     '}
              <Icon style={{color:"black",fontSize:16,}} name="caret-down"></Icon>
              </Text>
            </View>
          )
        }
      </TouchableOpacity>
    );
  }

  _onButtonPress() {
    if (!this.props.onDropdownWillShow ||
      this.props.onDropdownWillShow() !== false) {
      this.show();
    }
  }

  _renderModal() {
    if (this.state.showDropdown && this._buttonFrame) {
      let frameStyle = this._calcPosition();
      let animationType = this.props.animated ? 'fade' : 'none';
      return (
        <Modal animationType={animationType}
               transparent={true}
               onRequestClose={this._onRequestClose.bind(this)}
               supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
          <TouchableWithoutFeedback accessible={this.props.accessible}
                                    onPress={this._onModalPress.bind(this)}>
            <View style={styles.modal}>
              <View style={styles.dropdown}>
                {this.state.loading ? this._renderLoading() : this._renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  _calcPosition() {
    let dimensions = Dimensions.get('window');
    let windowWidth = dimensions.width-220;
    let windowHeight = dimensions.height;

    let dropdownHeight = (this.props.dropdownStyle && StyleSheet.flatten(this.props.dropdownStyle).height) ||
      StyleSheet.flatten(styles.dropdown).height;

    let bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    let rightSpace = windowWidth - this._buttonFrame.x;
    let showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
    let showInLeft = rightSpace >= this._buttonFrame.x;

    var style = {
      height: dropdownHeight,
      top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
    };

    if (showInLeft) {
      style.left = this._buttonFrame.x;
    } else {
      let dropdownWidth = (this.props.dropdownStyle && StyleSheet.flatten(this.props.dropdownStyle).width) ||
        (this.props.style && StyleSheet.flatten(this.props.style).width) || -1;
      if (dropdownWidth !== -1) {
        style.width = dropdownWidth - 220;
      }
      style.right = rightSpace - this._buttonFrame.w;
    }

    if (this.props.adjustFrame) {
      style = this.props.adjustFrame(style) || style;
    }

    return style;
  }

  _onRequestClose() {
    if (!this.props.onDropdownWillHide ||
      this.props.onDropdownWillHide() !== false) {
      this.hide();
    }
  }

  _onModalPress() {
    if (!this.props.onDropdownWillHide ||
      this.props.onDropdownWillHide() !== false) {
      this.hide();
    }
  }

  _renderLoading() {
    return (
      <ActivityIndicator size='small'/>
    );
  }

  _renderDropdown() {
    return (
      <ListView style={styles.list}
                dataSource={this._dataSource}
                renderRow={this._renderRow.bind(this)}
                renderSeparator={this.props.renderSeparator || this._renderSeparator.bind(this)}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={this.props.showsVerticalScrollIndicator}
      />
    );
  }

  get _dataSource() {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.props.options);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    let key = `row_${rowID}`;
    let highlighted = rowID == this.state.selectedIndex;
    let row = '';
    if (highlighted == true){
     row = !this.props.renderRow ?
      (<Text style={[styles.rowText, highlighted && styles.highlightedRowText]}>
        {rowData}{'   '}
        <Icon style={{color:"black",fontSize:styleConfig.fontSizer1,}} name="caret-down"></Icon>
      </Text>) :
      this.props.renderRow(rowData, rowID, highlighted);      
    }
    else
    {
     row = !this.props.renderRow ?
      (<Text style={[styles.rowText, highlighted && styles.highlightedRowText]}>
        {rowData}
      </Text>) :
      this.props.renderRow(rowData, rowID, highlighted);
    }
    let preservedProps = {
      key: key,
      accessible: this.props.accessible,
      onPress: () => this._onRowPress(rowData, sectionID, rowID, highlightRow),
    };
    if (TOUCHABLE_ELEMENTS.find(name => name == row.type.displayName)) {
      var props = {...row.props};
      props.key = preservedProps.key;
      props.onPress = preservedProps.onPress;
      switch (row.type.displayName) {
        case 'TouchableHighlight':
        {
          return (
            <TouchableHighlight {...props}>
              {row.props.children}
            </TouchableHighlight>
          );
        }
          break;
        case 'TouchableOpacity':
        {
          return (
            <TouchableOpacity {...props}>
              {row.props.children}
            </TouchableOpacity>
          );
        }
          break;
        case 'TouchableWithoutFeedback':
        {
          return (
            <TouchableWithoutFeedback {...props}>
              {row.props.children}
            </TouchableWithoutFeedback>
          );
        }
          break;
        case 'TouchableWithNativeFeedback':
        {
          return (
            <TouchableWithNativeFeedback {...props}>
              {row.props.children}
            </TouchableWithNativeFeedback>
          );
        }
          break;
        default:
          break;
      }
    }
    return (
      <TouchableHighlight {...preservedProps}>
        {row}
      </TouchableHighlight>
    );
  }

  _onRowPress(rowData, sectionID, rowID, highlightRow) {
    if (!this.props.onSelect ||
      this.props.onSelect(rowID, rowData) !== false) {
      highlightRow(sectionID, rowID);
      this._nextValue = rowData;
      this._nextIndex = rowID;
      this.setState({
        buttonText: rowData.toString(),
        selectedIndex: rowID
      });
    }
    if (!this.props.onDropdownWillHide ||
      this.props.onDropdownWillHide() !== false) {
      this.setState({
        showDropdown: false
      });
    }
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    let key = `spr_${rowID}`;
    return (<View style={styles.separator}
                  key={key}
    />);
  }
}

const styles = StyleSheet.create({
  button: {
    width:deviceWidth-220,
    height:40,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 12,
  },
  modal: {
    // flexGrow: 1
  },
  dropdown: {
    marginTop:180,
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 185,
    marginLeft: 225,
    
  },
  loading: {
    alignSelf: 'center'
  },
  list: {

    width:deviceWidth-230,
  },
  rowText: {
    color:styleConfig.greyish_brown_two,
    fontSize:15,
    fontWeight:'400',
    fontFamily:styleConfig.FontFamily,
    paddingHorizontal: 3,
    paddingVertical: 10,
    backgroundColor: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  highlightedRowText: {
    color: 'black'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray'
  }
});