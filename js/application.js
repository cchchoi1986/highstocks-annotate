var data = [];
var notes = [];

$(document).ready(function(){
  // data is an array
  

  {  //ajax get data request
    var grabData = function(data){
      $.ajax({
        type: 'GET',
        url: 'https://www.quandl.com/api/v1/datasets/WORLDBANK/CHN_IT_NET_USER_P2.json?trim_start=1990-12-31&trim_end=2013-12-31&auth_token=CfHkvtWKbe789s3Qtvtv',
        datatype: 'JSON',
        success: function(response){
          // getting 1 temperature
          // console.log(response.data[0]);

          // loop to getting all temperatures
          $(response.data).each(function(){
          //   console.log(this[0]);
          //   console.log(this[1]);
          // });

          // collecting each data point
            var dataPoint = {};
            dataPoint.y = this[1];
            dataPoint.x = new Date(this[0]);
            // add each datapoint to data array
            // console.log(dataPoint);
            data.push(dataPoint);
            
          });
          data = data.reverse();
          // console.log(data[0]);
          
          // // print out data;
          // console.log(data);
          initializeHighChart();
          
        },
        error: function(){
          alert("couldn't hit me bro!");
        }
      });
    }
  }
  { //Post Annotations
    $(document).on('click','.ccbutton',function(){
      $.ajax({
          type: 'POST',
          url: 'http://ga-wdi-api.meteor.com/api/posts/',
          data: {
              user: 'cchchoi1986',
              title: $('#title').val(),
              text: $('#content').val(),
              x: ($('#date').val()),
              dateCreated: new Date()
          },
          dataType: 'json',
          success: function(response){
              console.log(response);
          }
      });
    });
  }
  { //Get Annotations
    var grabAnnot = function(){
      $.ajax({
          type: 'GET',
          url: 'http://ga-wdi-api.meteor.com/api/posts/search/cchchoi1986',
          dataType: 'json',
          success: function(response){
              // console.log(response[0]);
              var i = 0;
              while (i < response.length){
                var obj = {};
                // obj.id = response[i]._id;
                obj.title = response[i].title;
                obj.text = response[i].text;
                obj.x = new Date(response[i].x);
                // obj.dateCreated = new Date(response[i].dateCreated);
                // console.log(obj);
                notes.push(obj);
                i++;
              }
              notes = notes.reverse();
              console.log(notes);
          }
      });
    };
  }
  { //run grabData function
    grabData(data);
    grabAnnot();
  }
  { //Chart settings
    function initializeHighChart(){
      $('#chart').highcharts({
        //key: value
        title: {
          text: 'China: Internet Users from quandl'
        },
        subtitle: {
          text: 'now with Annotations!'
        },
        xAxis: {
          // config of xAxis
          type: 'datetime',
          title: {
            text: 'Year'
          },
          dateTimeLabelFormats: {
              millisecond: '%H:%M:%S.%L',
              second: '%H:%M:%S',
              minute: '%H:%M',
              hour: '%H:%M',
              day: '%e. %b',
              week: '%e. %b',
              month: '%b \'%y',
              year: '%Y'
          }
        },
        yAxis: {
          // config of yAxis
          min: 0,
          max: 50,
          title: {
              text: 'Number of Internet Users'
          }
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          borderWidth: 1
        },
        series: [
          {
            name: 'Internet Users per 100 people',
            data: data
          },
          {
            type: 'flags',
            name: 'Flags on series',
            data: notes,
            onSeries: 'dataseries',
            shape: 'squarepin'
          }
        ]
      });
    }
  }

});