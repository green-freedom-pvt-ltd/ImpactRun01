import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { BarChart } from 'react-native-ios-charts';

const styles = StyleSheet.create({
  container: {
    height:200,
    width:300,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent'
  }
});

export default class Bar extends Component {
  static displayName = 'Bar';
  componentDidMount() {
  }
  render() {
    const config = {
      dataSets: [{
        values: [5, 40, 77, 81, 43],
        drawValues: false,
        colors: ['rgb(107, 243, 174)'],
        label: 'Company A'
      }, {
        values: [40, 5, 50, 23, 79],
        drawValues: false,
        colors: ['rgb(166, 232, 255)'],
        label: 'Company B'
      }, {
        values: [10, 55, 35, 90, 82],
        drawValues: false,
        colors: ['rgb(248, 248, 157)'],
        label: 'Company C'
      }],
      labels: ['1990', '1991', '1992', '1993', '1994'],
      legend: {
      },
      xAxis: {
        position: 'bottom'
      },
      leftAxis: {
        drawGridLines: false,
        spaceBottom: 0.05
      },
      rightAxis: {
        drawGridLines: false,
        spaceBottom: 0.05
      },
      valueFormatter: {
        type: 'regular',
        maximumDecimalPlaces: 0
      },
      viewport: {
        left: 20,
        top: 0,
        right: 20,
        bottom: 50
      }
    };
    return (
      <BarChart
          config={{
            dataSets: [{
              values: [1, 2, 3, 10],
              colors: ['green'],
              label: '2015',
            }, {
              values: [3, 2, 1, 5],
              colors: ['red'],
              label: '2014',
            }],
            labels: ['a', 'b', 'c', 'd'],
          }}
          style={styles.container}
        />
    );
  }
}
