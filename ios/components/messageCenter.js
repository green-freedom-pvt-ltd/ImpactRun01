import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class MessageCenter extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      moviesData: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    this.fetchMoviesData();
  }

  renderRow(rowData){
    return (
      <View style={styles.thumb}>
      
        <Image
          source={{uri:'https://image.tmdb.org/t/p/w500_and_h281_bestv2/'+rowData.poster_path}}
          resizeMode="cover"
          style={styles.img} />
          <Text style={styles.txt}>{rowData.title} (Rating: {Math.round( rowData.vote_average * 10 ) / 10})</Text>
      </View>
    );
  }

  fetchMoviesData() {
    var url = 'http://api.themoviedb.org/3/movie/now_playing?api_key=17e62b78e65bd6b35f038505c1eec409';
    fetch(url)
      .then( response => response.json() )
      .then( jsonData => {
        this.setState({
          moviesData: this.state.moviesData.cloneWithRows(jsonData.results),
        });
      })
    .catch( error => console.log('Error fetching: ' + error) );
  }

  render() {
    return (
     <ScrollView>
      <View style={styles.Navbar}>
       <Text style={styles.menuTitle}>Settings</Text>
     </View>
      <ListView
        dataSource={this.state.moviesData}
        renderRow={this.renderRow}
        style={styles.container}
      />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
  },
  thumb: {
    backgroundColor: '#ffffff',
    marginBottom: 5,
    elevation: 1
  },
  img: {
    height: 300
  },
  txt: {
    margin: 10,
    fontSize: 16,
    textAlign: 'left'
  },
   Navbar:{
    paddingLeft:10,
    position:'absolute',
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
});

export default MessageCenter;