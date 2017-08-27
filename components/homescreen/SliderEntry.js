import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './sliderStyle.js';

export default class SliderEntry extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        illustration: PropTypes.string,
        even: PropTypes.bool
    };

    render () {
        const { cause_image } = this.props.cause;

        const uppercaseTitle = this.props.cause_title ? (
            <Text style={[styles.title, even ? styles.titleEven : {}]} numberOfLines={2}>{ this.props.cause.cause_title.toUpperCase() }</Text>
        ) : false;

        return (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.slideInnerContainer}
              onPress={() => { alert(`You've clicked '${cause_title}'`); }}
              >
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    <Image
                      source={{ uri: this.props.cause_image }}
                      style={styles.image}
                    />
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    { uppercaseTitle }
                    <Text style={[styles.subtitle, even ? styles.subtitleEven : {}]} numberOfLines={2}></Text>
                </View>
            </TouchableOpacity>
        );
    }
}