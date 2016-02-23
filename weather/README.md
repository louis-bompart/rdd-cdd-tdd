# cli-weather

Cli-weather it's a simple client to get weather in your terminal.

#### Installation

Use NPM CLI in the current folder :
`$ npm install`

#### How it's works

Cli-weather need two parameters to run :
 * A location. (e.g: Toronto, Toulouse...)
 * An units' system. (e.g: Fahrenheit or Celsius, Meters or Miles...)

#### How to use it

To get the weather of the current location (based on your IP) :
`$ node index.js`
To get the weather of Atlanta :  
`$ node index.js -a "Atlanta, GA"`  
`$ node index.js --address="Atlanta, GA"`
To get the weather of the given GPS location :
`$ node index.js --lat=34.1036 --long=-84.6374`  

#### Units

By default, imperial units are used. If you want to use the metric ones, use the -c option flag. (celsius for temp and meters per second for windspeed)

`$ node index.js -c`  

If you want to keep the location for a specific area or use Celsius instead of Fahrenheit, use the -s or --save option flag.
