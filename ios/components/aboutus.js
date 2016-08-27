
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    Text,
    WebView
  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;


class Aboutus extends Component {
 
	render() {
		return (
           
            <ScrollView style={styles.aboutuusWrap}>
             <Text>
                India, a country of 1.27 billion, is still struggling to solve basic problems for majority of its people. More than half of urban India lives in slums and around 200 million go hungry everyday. If we include other major issues like illiteracy, malnutrition, drought etc, the list is never-ending.
                We, at ImpactRun, are creating a community of everyday change-makers. Our first step at achieving that is by first promoting PhilanthroFitness.(Philanthrofit - Defn - Doing good for society while getting fitter yourself. We envision a society where privileged empathise with the underprivileged and contribute in their upliftment.
                ImpactRun application encourages users (ImpactRunners) to run for a cause & impact lives by raising funds with every kilometer they run. The raised funds are donated to our partnered Non-Profit-Organisations(NPOs) for the causes in public health, education, women empowerment & livelihood. This empowering exchange happens with the support from our reputed Corporate Sponsors who allocate funds to our causes via their CSR budgets.
                With the above model, we are not only creating a sustainable and egalitarian society but also a fit nation. While on one hand we produce a more accountable model for CSR set-ups, on the other we use their monetary resources for everyday impact at grass-root level. 
                Each of us will 'run for our own lives' if need be. Now let's try running for others' lives for once. Not just because they need us. But more because it feels amazing!
                Now is the time. To empathize, act and join the revolution.
              </Text>
            </ScrollView>
    
        
			);
	       }

}
var styles = StyleSheet.create({

  Navbar:{
    paddingLeft:10,
    position:'relative',
    top:0,
    height:55,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
    backgroundColor:'#d667cd',
    borderBottomWidth:2,
    borderBottomColor:'#673AB7',
  },
  menuTitle:{
    left:20,
    color:'white',
    fontSize:20,
  },
  aboutuusWrap:{
    top:0,
    height:deviceHeight,
    width:deviceWidth,
   backgroundColor:'white',
  }
});

 export default Aboutus;