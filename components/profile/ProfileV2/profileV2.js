import React, {Animated, Component, View, StyleSheet, Text, Image} from 'react-native'

class Player extends Component {
  constructor () {
    super()
    const width = {pts: 30, ast: 45}
    this.state = {
      pts: new Animated.Value(width.pts),
      ast: new Animated.Value(width.ast),
      reb: new Animated.Value(width.reb)
    }
  }

   social_thumb(){
      if (this.props.user.first_name != '') {
        return(
          <Image  onPress={() => VibrationIOS.vibrate()} style={styles.UserImage} source={{uri:this.props.user.social_thumb}}></Image>
        )
      };
      return(
        <View>
          <Image style={styles.UserImage} source={require('../../images/profile_placeholder.jpg')}></Image>
        </View>
      )
  }

  handeleAnimation () {
    const timing = Animated.timing
    const width = {pts: 14, ast: 31}
    const indicators = ['pts', 'ast', 'reb']
    Animated.parallel(indicators.map(item => {
      return timing(this.state[item], {toValue: width[item]})
    })).start()
  }

  render () {
   const {pts, ast, reb, stl, blk, tov, min} = this.state

   return (
      <View style={styles.userimagwrap}>
        <View style={styles.UserImage}>{this.social_thumb()}</View>
      </View>
   )
  }
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 20
  },
  // Item
  item: {
    flexDirection: 'column',
    marginBottom: 5,
    paddingHorizontal: 10
  },
  UserImage:{
    height:80,
    width:80,
    borderRadius:40,
  },
  userimagwrap:{
    justifyContent: 'center',
    alignItems: 'center',
    height:80,
    width:80,
    borderColor:'rgba(247, 243, 243, 0.48)',
    borderRadius:40,
    shadowColor: '#000000',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      shadowOffset: {
        height:1,
      },
    top:10,
  },
  label: {
    color: '#CBCBCB',
    flex: 1,
    fontSize: 12,
    position: 'relative',
    top: 2
  },
  data: {
    flex: 2,
    flexDirection: 'row'
  },
  dataNumber: {
    color: '#CBCBCB',
    fontSize: 11
  },
  // Bar
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 8,
    marginRight: 5,
    paddingTop: 13
  },
  points: {
    backgroundColor: '#F55443'
  },
  assists: {
    backgroundColor: '#FCBD24'
  },
  rebounds: {
    backgroundColor: '#59838B'
  },
  steals: {
    backgroundColor: '#4D98E4'
  },
  blocks: {
    backgroundColor: '#418E50'
  },
  turnovers: {
    backgroundColor: '#7B7FEC'
  },
  minutes: {
    backgroundColor: '#3ABAA4'
  },
  // controller
  controller: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  button: {
    flex: 1,
    position: 'relative',
    top: -1
  },
  chevronLeft: {
    alignSelf: 'flex-end',
    height: 28,
    marginRight: 10,
    width: 28
  },
  chevronRight: {
    alignSelf: 'flex-start',
    height: 28,
    marginLeft: 10,
    width: 28
  },
  date: {
    color: '#6B7C96',
    flex: 1,
    fontSize: 22,
    fontWeight: '300',
    height: 28,
    textAlign: 'center'
  }

})


export default Player;