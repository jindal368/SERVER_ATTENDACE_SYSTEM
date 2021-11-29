import pkg from "winston";
const {createLogger,format, transports} = pkg;
const {colorize,printf,combine,timestamp}=format;

const myFormat=printf(info=>{
    return `${info.timestamp}: ${info.level}: ${info.message}`;
});

// logging levels
const levels = {
    debug: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    error: 0,
    silly: 6
  };

const logger=createLogger({
    levels,
    format:combine(timestamp(),colorize(),myFormat),
    transports:[new transports.Console(),
        new transports.File({
            filename:'./logs/development.log'
        })
    ]
});

export default logger;