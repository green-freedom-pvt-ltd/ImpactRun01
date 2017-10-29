import React, { Component } from 'react';
import { View, AsyncStorage,ScrollView, Text, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './sliderStyle';
import SliderEntry from './SliderEntry';
import styles, { colors } from './index.style';
import { ENTRIES1, ENTRIES2 } from './entries';

const SLIDER_1_FIRST_ITEM = 1;

export default class example extends Component {

    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            slider1Ref: null,
            causes : [],
        };
    }



    componentDidMount() {
    	 var provider = this.props.provider;
        var causeNum = this.props.myCauseNum;
        if (causeNum != null || undefined) {
  
            AsyncStorage.multiGet(causeNum, (err, stores) => {

                var _this = this
                stores.map((item) => {

                    let key = item[0];
                    let val = JSON.parse(item[1]);
                   
                    let causesArr = _this.state.causes.slice()
                    causesArr.push(val)  
                    console.log('causesArr',causesArr);                
                    _this.setState({causes: causesArr})
                    _this.setState({album : Object.assign({}, _this.state.album, {[val.cause_title]: [val.amount_raised,val.amount,val.total_runs,val.cause_completed_image,val.is_completed,val]})})
                    _this.setState({brief : Object.assign({}, _this.state.brief, {[val.cause_brief]: val.cause_image})})
                });
              this.setState({
                loadingimage:false,
                navigation: Object.assign({}, this.state.navigation, {
                index: 0,
                routes: Object.keys(this.state.album).map(key => ({ key })),

              })

              })
          });
         
        }else{
          this.props.fetchDataonInternet();
        }
    }

    _renderItem ({item, index}) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
            />
        );
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    get example1 () {
        const { slider1ActiveSlide, slider1Ref } = this.state;

        return (
            <View >
                <Carousel
                  onSnapToItem={(slideIndex)=>console.log('slideIndex',slideIndex)}
                  ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
                  data={this.props.causes}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.6}
                  enableMomentum={false}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  scrollEndDragDebounceValue={Platform.OS === 'ios' ? 0 : 100}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <Pagination
                  dotsLength={this.props.causes.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={slider1Ref}
                  tappableDots={!!slider1Ref}
                />
            </View>
        );
    }

    get example2 () {
        return (
            <View style={styles.exampleContainer}>
                <Text style={styles.title}>Example 2</Text>
                <Text style={styles.subtitle}>Momentum | Left-aligned | Autoplay</Text>
                <Carousel
                  data={ENTRIES2}
                  renderItem={this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  enableMomentum={false}
                  activeSlideAlignment={'start'}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={2500}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  removeClippedSubviews={false}
                />
            </View>
        );
    }

    get gradient () {
        return (
            <LinearGradient
              colors={[colors.background1, colors.background2]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            />
        );
    }

    render () {
        return (
            <View style={styles.container}>
                <StatusBar
                  translucent={true}
                  backgroundColor={'rgba(0, 0, 0, 0.3)'}
                  barStyle={'light-content'}
                />
                { this.gradient }
                <View
                  style={styles.scrollview}
                  contentContainerStyle={styles.container}
                  indicatorStyle={'white'}
                  scrollEventThrottle={200}
                  directionalLockEnabled={true}
                >
                    { this.example1 }
                </View>
            </View>
        );
    }
}