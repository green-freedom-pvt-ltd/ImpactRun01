'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
    TabBarIOS,
  } from 'react-native';
  import Welcome from'./HomeScreen';
  import Aboutus  from'./aboutus';
  import Profile  from'./profile';
  import Feedback  from'./feedback';
  import Faq  from'./faq';
    class devdactic_tabs extends Component {
    	constructor(props) {
		    super(props);
		    this.state = {
		      selectedTab: 'welcome'
		    };
	  }
    	render() {
    		return (
      <TabBarIOS style={styles.tabsWrap} selectedTab={this.state.selectedTab}  navigator={this.props.navigator}>
        <TabBarIOS.Item
          style = {styles.tab}
          selected={this.state.selectedTab === 'aboutus'}
          systemIcon="contacts"
          onPress={() => {
              this.setState({
                  selectedTab: 'aboutus',
              });
          }}>
            <Aboutus/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'faq'}
          systemIcon="recents"
          title="Faq"
          onPress={() => {
              this.setState({
                  selectedTab: 'faq',
              });
          }}>
            <Faq/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'welcome'}
          icon={require("../../images/RunImage.png")}
          onPress={() => {
              this.setState({
                  selectedTab: 'welcome',
              });
          }}>
            <Welcome navigator={this.props.navigator}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'feedback'}
          systemIcon="featured"
          onPress={() => {
                this.setState({
                    selectedTab: 'feedback',
                });
          }}>
          <Feedback/>
        </TabBarIOS.Item>
                <TabBarIOS.Item
          selected={this.state.selectedTab === 'profile'}
          title="me"
          systemIcon="contacts"
          onPress={() => {
              this.setState({
                  selectedTab: 'profile',
              });
          }}>
            <Profile/>
        </TabBarIOS.Item>
      </TabBarIOS>
    		);
    	}
	  
     }


var styles = StyleSheet.create({
  tabsWrap:{
   backgroundColor:'white',
  },
  tab:{
    backgroundColor:'black',
    height:50,
    width:50,
  },

})
   export default devdactic_tabs;