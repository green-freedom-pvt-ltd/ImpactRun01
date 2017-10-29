import React, { Component, PropTypes } from 'react';
import { View, Text, Image,Dimensions,TouchableOpacity } from 'react-native';
import styles from './sliderStyle.js';
import { ParallaxImage } from 'react-native-snap-carousel';
import ProgressBar from './causeprogressbar';
import styleConfig from '../../components/styleConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;
export default class SliderEntry extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        illustration: PropTypes.string,
        even: PropTypes.bool
    };
   
    get image () {
        const { data: { cause_image }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri:cause_image}}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={[styles.image, { position: 'relative' }]}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: cause_image}}
              style={styles.image}
            />
        );
    }


    render () {
        const { data: { cause_title, cause_brief,amount,amount_raised,total_runs }, even } = this.props;

        const uppercaseTitle = cause_title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
              numberOfLines={2}
            >
                { cause_title.toUpperCase() }
            </Text>
        ) : false;
         var money = JSON.stringify(parseFloat(amount_raised).toFixed(0));
        if (money.length > 5) {
          var lenth = money.length;
          var commmaplace = lenth-4;
          var Moneyfinalvalue =JSON.parse(money.slice(0,commmaplace)+ ',' + money.slice(commmaplace,lenth)) ; 
        }else{
          var Moneyfinalvalue = JSON.parse(money);
        }
        var Runs = JSON.stringify(parseFloat(total_runs).toFixed(0));
        if (Runs.length > 5) {
        var runlength = Runs.length;
        var commmaplacerun =runlength-4;
        var runFinalvalue = JSON.parse(Runs.slice(0,commmaplacerun)+ ',' + Runs.slice(commmaplacerun,lenth));
        }else{
          var runFinalvalue = JSON.parse(Runs);
        }
        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { alert(`You've clicked '${cause_title}'`); }}
              >
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={4}
                    >
                        { cause_brief }
                    </Text>
                    <View style = {styles.wraptext}>
                      <Text style = {styles.textMoneyraised}>Raised <Icon style={{color:styleConfig.greyish_brown_two,fontSize:10,fontWeight:'400'}}name="inr"></Icon> {Moneyfinalvalue}</Text>
                      <Text style = {styles.textMoneyraised}>{parseFloat((amount_raised/amount)*100).toFixed(0)}%</Text>
                    </View>
                   <ProgressBar unfilledColor={'black'} height={styleConfig.barHeight} width={deviceWidth-125} progress={amount_raised/amount}/>
                    <View style = {styles.wraptext2}>
                      <Text style = {styles.textMoneyraised}> {runFinalvalue} ImpactRuns </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
