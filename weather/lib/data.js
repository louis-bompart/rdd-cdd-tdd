var chalk = require('chalk'),
    red = chalk.red,
    blue = chalk.blue,
    table = require('cli-table');

/**
 * collectDates - Collect all dates from data
 *
 * @param  {Array} data  Source data
 * @return {Array}      Array of dates
 */
function collectDates(data) {
    var dates = [];

    data.forEach(function (obj) {
        var date = new Date(obj.time * 1000);
        dates.push(date.toDateString());
    });

    return dates;
}
/**
 * collectLows - Collect the highest temperature
 *
 * @param  {Array} data   source data
 * @param  {Object} units units to use
 * @return {Array}        table of formated T°.
 */
function collectHighs(data, units) {
    var highs = [],
        temp,
        point;

    data.forEach(function (obj) {

        point = Math.floor(obj.temperatureMax);

        if (units.tmp.includes('C')) {
            temp = 'high: ' + (point > 0 ? chalk.red(point + units.tmp) : chalk.blue(point + units.tmp));
        } else {
            temp = 'high: ' + (point > 32 ? chalk.red(point + units.tmp) : chalk.blue(point + units.tmp));
        }

        highs.push(temp);
    });

    return highs;
}

/**
 * collectLows - Collect the lowest temperature
 *
 * @param  {Array} data   source data
 * @param  {Object} units units to use
 * @return {Array}        table of formated T°.
 */
function collectLows(data, units) {
    var lows = [],
        temp,
        point;

    data.forEach(function (obj) {
        point = Math.floor(obj.temperatureMin);

        if (units.tmp.includes('C')) {
            temp = 'low: ' + (point > 0 ? chalk.red(point + units.tmp) : chalk.blue(point + units.tmp));
        } else {
            temp = 'low: ' + (point > 32 ? chalk.red(point + units.tmp) : chalk.blue(point + units.tmp));
        }

        lows.push(temp);
    });

    return lows;
}

/**
 * collectSummary - Collect the summaries
 *
 * @param  {Array} data source data
 * @return {Array}      Array of summaries.
 */
function collectSummary(data) {
    var summaries = [];

    data.forEach(function (obj) {
        summaries.push(obj.summary.toLowerCase());
    });

    return summaries;
}

/**
 * collectPrecip - Collect the preciipations data
 *
 * @param  {Array} data Source data
 * @return {Array}      Array of string containing the % of precipProbability
 */
function collectPrecip(data) {

    var precips = [];

    data.forEach(function (obj) {
        precips.push(Math.ceil(obj.precipProbability * 100) + '% precip.');
    });

    return precips;

}

/**
 * formatTime - Display the time in a AM/PM format.
 *
 * @param  {Object} date  source date
 * @return {string}       return the formated string.
 */
function formatTime(date) {
    var suffix = "am";
    var hours = date.getHours();

    if (hours > 12) {
        hours = hours - 12;
        suffix = "pm";
    } else if (hours == 12) {
        suffix = "pm";
    }
    if (hours < 10) {
        hours = " " + hours;
    }

    var minutes = date.getMinutes();

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return hours + ":" + minutes + " " + suffix;
}
/**
 * collectSunsets - Create a tab with all date of sunrises
 *
 * @param  {type} data          raw data
 * @return {Array(string)}      Array of sunrises
 */
function collectSunrises(data) {
    var sunrises = [];

    data.forEach(function (obj) {
        if(obj.sunriseTime) {
            var sunrise = new Date(obj.sunriseTime * 1000);
            sunrises.push('☀ ' + formatTime(sunrise));
        } else {
            sunrises.push('');
        }
    });

    return sunrises;
}

/**
 * collectSunsets - Create a tab with all date of sunsets
 *
 * @param  {type} data          raw data
 * @return {Array(string)}      Array of sunsets
 */
function collectSunsets(data) {
    var sunsets = [];

    data.forEach(function (obj) {
        if(obj.sunsetTime) {
            var sunset = new Date(obj.sunsetTime * 1000);
            sunsets.push('☾ ' + formatTime(sunset));
        } else {
            sunsets.push('');
        }
    });

    return sunsets;
}

/**
 * display - Compute the string
 *
 * @param  {Date}   now   The current instant
 * @param  {Object} units The units to used
 * @return {String}       the computed string.
 */
function display(now, units) {


    var current = '\nCurrent Conditions:\n------------------\n',
        temp = '';

    if (units.c) {
        temp = (now.temperature > 0 ? chalk.red(Math.ceil(now.temperature) + units.tmp) : chalk.blue(Math.floor(now.temperature) + units.tmp)) + ' -- feels like ' +
            (now.apparentTemperature > 0 ? chalk.red(Math.ceil(now.apparentTemperature) + units.tmp) : chalk.blue(Math.floor(now.apparentTemperature)));
    } else {
        temp = (now.temperature > 32 ? chalk.red(Math.ceil(now.temperature) + units.tmp) : chalk.blue(Math.floor(now.temperature) + units.tmp)) + ' -- feels like ' +
            (now.apparentTemperature > 32 ? chalk.red(Math.ceil(now.apparentTemperature) + units.tmp) : chalk.blue(Math.floor(now.apparentTemperature) + units.tmp));
    }

    var wind = (now.windSpeed % 1 ? Math.floor(now.windSpeed) : Math.ceil(now.windSpeed)) + units.speed + ' wind';

    current += temp + ' -- ' + wind + ' -- ' + now.summary.toLowerCase();

    return current + '\n';
}

/**
 * displayTable - Display an array
 *
 * @param  {type} headers  description
 * @param  {type} highs    description
 * @param  {type} lows     description
 * @param  {type} icons    description
 * @param  {type} precips  description
 * @param  {type} sunrises description
 * @param  {type} sunsets  description
 * @return {type}          description
 */
function displayTable(headers, highs, lows, icons, precips, sunrises, sunsets) {
    var Table = new table({
        head: headers,
        chars: {
            'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''
        },
        style: {
            head:['dim']
        }
    });

    Table.push(highs, lows, icons, precips, sunrises, sunsets);

    return Table.toString();
}

/**
 * icon - Convert text array to icons array
 *
 * @param  {Array} array source array
 * @return {Array}       icons array
 */
function icon(array) {
    var icons = [];

    array.forEach(function (point) {
        var name = point.icon;
        switch (name) {
            case 'clear-day':case 'clear-night':
            icons.push('☀ clear');
            break;
            case 'rain':
                icons.push('☂ rain');
                break;
            case 'snow':
                icons.push('❄ snow');
                break;
            case 'sleet':
                icons.push('☂❄ sleet');
                break;
            case 'wind':
                icons.push('➳ wind');
                break;
            case 'fog':
                icons.push('☁ fog');
                break;
            case 'partly-cloudy-day':case 'partly-cloudy-night':
                icons.push('☁☀ partly cloudy');
                break;
            default:
                icons.push('☁ clouds');
                break;
        }
    });

    return icons;
}

module.exports = {
    collectDates: collectDates,
    collectHighs: collectHighs,
    collectLows: collectLows,
    collectSummary: collectSummary,
    collectPrecip: collectPrecip,
    collectSunrises: collectSunrises,
    collectSunsets: collectSunsets,
    display: display,
    displayTable: displayTable,
    icon: icon
};
