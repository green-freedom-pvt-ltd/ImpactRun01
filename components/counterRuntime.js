(function() {
  var moment = require('moment');
  

  function hours(duration){
    return format(duration.hours());
  }

  function minutes(duration){
    return format(duration.minutes());
  }

  function seconds(duration){
    return format(duration.seconds());
  }

  function milliseconds(duration){
    return format(duration.milliseconds());
  }

  function format(duration){
    if(!duration){
      return '00';
    } else if(('' + duration).length == 1){
      return '0' + duration;
    } else if(('' + duration).length == 3){
      return ('' + duration).slice(0, 2);
    } else {
      return duration;
    }
  }

  function convert(length) {
    if(!length) {
      return '00'
    }

    var duration = moment.duration(length);
    var formattedDuration = '';
    var formattedDurationcustom = '00';
    formattedDuration += hours(duration) + ':';
    formattedDuration += minutes(duration) + ':';
    formattedDuration += seconds(duration)
    if (formattedDuration.slice(0,2) != "00") {
      formattedDurationcustom = formattedDuration;
    }else if(formattedDuration.slice(3,5) != "00"){
      formattedDurationcustom = formattedDuration.slice(3,8);
    }else if(formattedDuration.slice(6,8) != "00"){
      formattedDurationcustom = formattedDuration.slice(6,8);
    } 
    return formattedDurationcustom;
  }

  module.exports = convert;
})()
