var args = require('./args'),
    chalk = require('chalk'),
    fs = require('fs'),
    parseArgs = require('minimist'),

    exec = require('child_process').exec,
    pathing = require('path');

var path = pathing.dirname(require.main.filename) + '/lib/config.json',
    help = require('./help');

/**
 * Config - constructor of Config
 *
 * @param  {object} units Units system used
 * @param  {string} ip    ip address to use.
 */
function Config(units, ip) {
    this.args = parseArgs(process.argv.slice(2));
    this.units = units;
    this.ip = ip;
}


/**
 *Config.sudo - allow the user to save his config
 *
 * @return {type}  description
 */
Config.prototype.sudo = function () {

    var that = this;

    if (that.args.s === true || that.args.save === true) {

        var args = ' weather ',
            arr = process.argv.slice(2);

        arr.forEach(function (arg) {
            args += arg + ' ';
        });

        that.control();
    } else {
        that.control();
    }
};

/**
 * Config.control - Check all props of config
 *
 */
Config.prototype.control = function () {
    var keys = Object.keys(this.args).length - 1,
        args = this.args;

    if (keys === 0 || args.v) {
        read(this.args, this.units, this.ip);
    } else if (args.s || args.save) {
        write(this.args, this.units, this.ip);
    } else if (args.c || args.a !== null || args.address !== null) {
        handleArgs(this.args, this.units, this.ip);
    }
};

if(!String.prototype.includes) {
    String.prototype.includes = function(arg) {
    return this.indexOf(arg) != -1;
    };
}


/**
 * write - Save the presets data
 *
 * @param  {type} args  Well, the args given by the user in CLI
 * @param  {type} units the units system to use
 * @param  {type} ip    the ip to use
 */
function write(args, units, ip) {

    console.log(chalk.red('you may have to use ') + chalk.bgBlack.white('sudo') +
        chalk.red(' to save presets. a fix is on the way, don\'t worry.'));

    fs.writeFile(path, JSON.stringify(args, null, 2), function (err) {
        if (err) {
            console.log(chalk.red('✗ couldn\'t save preset'));
            handleArgs(args, units, ip);
        } else {
            if (args.v || args.verbose) {
                console.log(chalk.green('✓ saved preset'));
            }
            handleArgs(args, units, ip);
        }
    });

}

/**
 * read - Read the preset data.
 *
 * @param  {type} args  Well, the args given by the user in CLI
 * @param  {type} units the units system to use
 * @param  {type} ip    the ip to use
 */
function read(args, units, ip) {

    if (args.c && !(args.s || args.save)) {
        handleArgs(args, units, ip);
    } else {

        fs.readFile(path, function (err, data) {
            if (err) {
                console.log(chalk.red('✗ couldn\'t read preset data: you have no presets! run the ') + chalk.bgBlack.white(' -s ') +
                    chalk.red(' or the ') + chalk.bgBlack.white('-save') + chalk.red('\n option after any commands to save preferences'));

                handleArgs(args, units, ip);
            } else {
                if (args.v || args.verbose) {
                    console.log(chalk.green('✓ read preset'));
                }

                handleArgs(JSON.parse(data), units, ip);
            }
        });
    }
}

/**
 * handleArgs - Do some stuff depending on the flag given in the CLI
 *
 * @param  {type} argv  description
 * @param  {type} units description
 * @param  {type} ip    description
 * @return {type}       description
 */
function handleArgs(argv, units, ip) {

    help(argv);

    if (argv.c || argv.config) {
        units = {
            type: 'si',
            tmp: '˚C',
            speed: 'mps'
        };
    }

    if (argv.address || argv.a) {
        args.address(argv.address || argv.a, args.weatherRequest, units, argv);
    } else if (argv.lat && argv.long) {
        args.weatherRequest({lat: argv.lat, long: argv.long}, units, argv);
    } else {
        args.automatic(ip, args.weatherRequest, units, argv);
    }

}

/**
 * instance - Pretty obvious
 *
 * @param  {type} units description
 * @param  {type} ip    description
 * @return {type}       description
 */
function instance(units, ip) {
    return new Config(units, ip);
}


module.exports = instance;
