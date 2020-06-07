function Data(id, house, duration, src, url) {
    this.id = id, 
    this.house = house,
    this.src = src,
    this.duration = duration,
    $.getJSON(url, this.onLoad.bind(this));
}
Data.prototype.onLoad = function(res){
    
    this.response = insertAverage(res, ['used'], ['adu']);
    let html;

    // Retrieve the template data
    //let template = $('#summary-table').html();

    // Compile the template data into a function
    //let templateScript = Handlebars.compile(template);

    //let html = templateScript(this);
    // precompiled
    if (this.duration.includes("month")){
        //html = Handlebars.templates.SummaryMonthly(this);
        html = JST['./src/templates/SummaryMonthly.handlebars'](this);
    }
    else {
        //html = Handlebars.templates.SummaryYearly(this);
        html = JST['./src/templates/SummaryYearly.handlebars'](this);
    }

    // Insert the HTML code into the page
    $('#'+this.id).append(html);
}

var data = [];

// thanks http://www.mredkj.com/javascript/numberFormat.html
let addCommas = function (nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

Handlebars.registerHelper('round', function (str) {
    return addCommas(Math.round(parseFloat(str)));
})
Handlebars.registerHelper('round1', function (str) {
    return addCommas(parseFloat(str).toFixed(1));
})
Handlebars.registerHelper('dateYYYY', function (str) {
    return moment(str).format('YYYY');
})
Handlebars.registerHelper('dateYYYY-MM', function (str) {
    return moment(str).format('YYYY-MM');
})
Handlebars.registerHelper('dateMMM', function (str) {
    return moment(str).format('MMM');
})

let insertAverage = function(data, props, avg_props) {

    let i, j, d,
    adu,
    daysInMonth,
    daysInYear,
    totalDays = 0;

    if (data.interval === 'year') {
      // years
      for ( j = 0; j < data.items.length; j++ ) {
        // assume for now that yearly date ranges always start in January
        daysInYear = 365;
        if ( moment( data.items[j].date ).isLeapYear() ) { daysInYear++; }

        for ( i = 0; i < props.length; i++ ) {

          adu = data.items[j][ props[i] ] / daysInYear;
          data.items[j][ avg_props[i] ] = adu;
        }

        totalDays = totalDays + daysInYear;
      }
    } else {
      // months
      for ( j = 0; j < data.items.length; j++ ) {

        for ( i = 0; i < props.length; i++ ) {

          daysInMonth = moment( data.items[j].date ).daysInMonth();
          adu = data.items[j][ props[i] ] / daysInMonth;
          data.items[j][ avg_props[i] ] = adu;
        }

        totalDays = totalDays + daysInMonth;
      }
    }
    // total
    for ( i = 0; i < props.length; i++ ) {

      adu = data.totals[ props[i] ] / totalDays;
      data.totals[ avg_props[i] ] = adu;
    }
    return data;
}

let displayTables = function(){
    // get all tags with class home-performance-summary
    $('.home-performance-summary').each(function (i) {
        // for each tag get it's attributes
        id = $(this).attr("id");
        house = $(this).attr("house");
        interval = $(this).attr("interval");
        start = $(this).attr("start");
        duration = $(this).attr("duration");
        src = $(this).attr("src");
        url = src + '/api/houses/' + house + '/views/summary/?interval=' + interval + '&start=' + start + '&duration=' + duration; 
        data.push(new Data(id, house, duration.replace(/[0-9]/g, ''), src, url));
    });
}

// function to call after page has loaded
$(document).ready(function() {
    displayTables();
})

// mock data
/*
var data = [
    { // object 1
        "id": "q1-2015",
        "house": "0",
        "interval": "months",
        "start": "2015-01-01",
        "duration": "3month",
        "src": "/homeperformance",
        "response": {
            "interval": "month", 
            "items": [
            {
                "date": "2013-01-01", 
                "hdd": "1188.587", 
                "net": "402.5750000000000", 
                "solar": "-478.3740000000000", 
                "used": "880.9490000000000"
            }, 
            {
                "date": "2013-02-01", 
                "hdd": "1066.626", 
                "net": "362.4900000000000", 
                "solar": "-449.0810000000000", 
                "used": "811.5710000000000"
            }, 
            {
                "date": "2013-03-01", 
                "hdd": "982.961", 
                "net": "187.8310000000000", 
                "solar": "-618.3740000000000", 
                "used": "806.2050000000000"
            }
            ], 
            "totals": {
            "hdd": "3238.174", 
            "net": "952.8960000000000", 
            "solar": "-1545.8290000000000", 
            "used": "2498.7250000000000"
            }, 
            "view": "summary"
        }
    }
]
*/