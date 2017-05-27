
const React = require('react');
const ReactNative = require('react-native');
const {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Dimensions,
  AsyncStorage,
} = ReactNative;
const Button = require('../node_modules/react-native-scrollable-tab-view/Button');
import UserProfile from './profile/profileHeader';
const WINDOW_WIDTH = Dimensions.get('window').width;
import styleConfig from './styleConfig';

const ScrollableTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    underlineColor: React.PropTypes.string,
    underlineHeight: React.PropTypes.number,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    activeBackgroundColor: React.PropTypes.string,
    InactiveBackgroundColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    scrollOffset: React.PropTypes.number,
    style: View.propTypes.style,
    tabStyle: View.propTypes.style,
    tabsContainerStyle: View.propTypes.style,
    textStyle: Text.propTypes.style,
  },

  getDefaultProps() {
    return {
      scrollOffset: 50,
      activeTextColor: 'white',
      inactiveTextColor: '#1d1d26',
      underlineColor: '#673AB7',
      backgroundColor: 'white',
      activeBackgroundColor:styleConfig.bright_blue,
      InactiveBackgroundColor:'white',
      style: {},
      tabStyle: {
        width:WINDOW_WIDTH/2-70,
        alignItems: 'center',
        justifyContent: 'center',
        height:30,
        borderRadius:30,
        backgroundColor:'white',
      },
      tabsContainerStyle: {
        position:'absolute',
        height:60,
        width:WINDOW_WIDTH,
        borderRadius:3,
        alignItems: 'center',
        justifyContent: 'center',
        top:150,

      },
    };
  },
 
  getInitialState() {
    this._tabsMeasurements = [];
    return {
      _leftTabUnderline: new Animated.Value(0),
      _widthTabUnderline: new Animated.Value(0),
      _containerWidth: null,
    };
  },

  componentDidMount() {
    this.props.scrollValue.addListener(this.updateView);
  },

  updateView(offset) {
    const position = Math.floor(offset.value);
    const pageOffset = offset.value % 1;
    const tabCount = this.props.tabs.length;
    const lastTabPosition = tabCount - 1;

    if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
      return;
    }

    if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
      this.updateTabPanel(position, pageOffset);
      this.updateTabUnderline(position, pageOffset, tabCount);
    }
  },

  necessarilyMeasurementsCompleted(position, isLastTab) {
    return this._tabsMeasurements[position] &&
      (isLastTab || this._tabsMeasurements[position + 1]) &&
      this._tabContainerMeasurements &&
      this._containerMeasurements;
  },

  updateTabPanel(position, pageOffset) {
    const containerWidth = this._containerMeasurements.width;
    const tabWidth = this._tabsMeasurements[position].width;
    const nextTabMeasurements = this._tabsMeasurements[position + 1];
    const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
    const tabOffset = this._tabsMeasurements[position].left;
    const absolutePageOffset = pageOffset * tabWidth;
    let newScrollX = tabOffset + absolutePageOffset;

    // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
    newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth ) / 2 ;
    newScrollX = newScrollX >= 0 ? newScrollX : 0;

    if (Platform.OS === 'android') {
      this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false, });
    } else {
      const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
      newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
      this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false, });
    }

  },

  updateTabUnderline(position, pageOffset, tabCount) {
    const lineLeft = this._tabsMeasurements[position].left;
    const lineRight = this._tabsMeasurements[position].right;

    if (position < tabCount - 1) {
      const nextTabLeft = this._tabsMeasurements[position + 1].left;
      const nextTabRight = this._tabsMeasurements[position + 1].right;

      const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
      const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

      this.state._leftTabUnderline.setValue(newLineLeft);
      this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
    } else {
      this.state._leftTabUnderline.setValue(lineLeft);
      this.state._widthTabUnderline.setValue(lineRight - lineLeft);
    }
  },

  renderTabOption(name, page) {
    const isTabActive = this.props.activeTab === page;
    const { activeTextColor, inactiveTextColor, textStyle,activeBackgroundColor,InactiveBackgroundColor} = this.props;
    const TabActiveBackground = isTabActive ? activeBackgroundColor : InactiveBackgroundColor;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : '500';

    return <Button
      key={`${name}_${page}`}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => this.props.goToPage(page)}
      onLayout={this.measureTab.bind(this, page)}
    > 
    <View style={styles.tabBtnWrap}>
      <View style={[styles.tab, this.props.tabStyle,{backgroundColor:TabActiveBackground}]}>
        <Text style={[{color: textColor,fontFamily: 'Montserrat-Regular',fontWeight, }, textStyle, ]}>
          {name}
        </Text>
      </View>
      </View>
    </Button>;
  },

  measureTab(page, event) {
    const { x, width, height, } = event.nativeEvent.layout;
    this._tabsMeasurements[page] = {left: x, right: x + width, width, height, };
    this.updateView({value: this.props.scrollValue._value, });
  },
  // getUserData(){
  //    AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
  //         stores.map((result, i, store) => {
  //             let key = store[i][0];
  //             let val = store[i][1];
  //             this.setState({
  //               user:JSON.parse(val),
  //             })
  //             console.log("UserDataProfile :" + key, val);
  //         });
  //     });
  //   },
  //   componentWillMount(){
  //     this.getUserData();
  //   },
  render() {
    const tabUnderlineStyle = {
          height: this.props.underlineHeight,
      backgroundColor: this.props.underlineColor,

    };

    const dynamicTabUnderline = {
      left: this.state._leftTabUnderline,
      width: this.state._widthTabUnderline,
    };
    var user = {
      first_name:'',
      last_name:'',
      social_thumb:'../../images/profile_placeholder.jpg',
      total_distance:{total_distance:0},
      total_amount:{total_amount:0},
     }
    if (this.props.user && Object.keys(this.props.user).length > 0) {
      user = this.props.user;
    }
    return  <View
      style={[styles.container, {backgroundColor: this.props.backgroundColor, }, this.props.style]}
      onLayout={this.onContainerLayout}
    ><View style={{top:-150}}>
    <UserProfile userTotalAmount={this.props.userTotalAmount} RunCount={this.props.RunCount} getRunCount={this.props.getRunCount} getUserData={this.props.getUserData} user={user}></UserProfile> 
    </View>
      <ScrollView
        ref={(scrollView) => { this._scrollView = scrollView; }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled={true}
        bounces={false}
      >

      </ScrollView>
        <View
          style={[styles.tabs, {width: this.state._containerWidth, }, this.props.tabsContainerStyle]}
          ref={'tabContainer'}
          onLayout={this.onTabContainerLayout}
        >
        <View style={styles.tabCenterWrapper}>
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
        </View>

    </View> ;
  },

  onTabContainerLayout(e) {
    this._tabContainerMeasurements = e.nativeEvent.layout;
    let width = this._tabContainerMeasurements.width-2;
    if (width < WINDOW_WIDTH) {
      width = WINDOW_WIDTH;
    }
    this.setState({ _containerWidth: width, });
    this.updateView({value: this.props.scrollValue._value, });
  },

  onContainerLayout(e) {
    this._containerMeasurements = e.nativeEvent.layout;
    this.updateView({value: this.props.scrollValue._value, });
  },
});

module.exports = ScrollableTabBar;

const styles = StyleSheet.create({
  tab: {
    backgroundColor:'transparent',
    height: 40,
    width:120,
  },
  tabBtnWrap:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor:'transparent',
    height: 200,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor:'#ccc',
    paddingTop:8,

  },
  tabs: {
    flexDirection: 'row',
  },
  tabCenterWrapper:{
    width:(WINDOW_WIDTH/2-68)*2,
    height:34,
    top:-7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor:styleConfig.bright_blue,
    borderRadius:30,
    backgroundColor:'white',
  },
});