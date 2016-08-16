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
		      selectedTab: 'welcome',
          notifCount: 0,
          presses: 0,
		    };
	  }
    	render() {
    		return (
      <TabBarIOS 
        unselectedTintColor="white"
        tintColor="white"
        barTintColor="#3c1e71" 
        selectedTab={this.state.selectedTab} 
        navigator={this.props.navigator}>
        <TabBarIOS.Item
         onPress={() => {
            this.setState({
              notifCount: this.state.notifCount + 1,
            });
            }}
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          style = {styles.tab}
          selected={this.state.selectedTab === 'aboutus'}
          icon={require("../../images/aboutus2.png")}
          title="aboutus"
          onPress={() => {
              this.setState({
                  selectedTab: 'aboutus',
              });
          }}>
            <Aboutus/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'faq'}
          icon={require("../../images/faq2.png")}
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
          title="Run"
          icon={require("../../images/RunImage4.png")}
          onPress={() => {
              this.setState({
                  selectedTab: 'welcome',
              });
          }}>
        <Welcome navigator={this.props.navigator}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'feedback'}
          title="feedback"
          icon={require("../../images/feedback2.png")}
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
            icon={require("../../images/me2.png")}
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