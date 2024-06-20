/**
 * @name ConsoleSupressor
 * @description Suppresses Discord logger
 */

const patches = [
    {
        find: "Σ:\"",
        replacement: [
            {
                match: /&&console(.*?)\).*?\)/,
                replace: ""
            }
        ],
        plugin: 'ConsoleSupressor'
    },
    {
        find: "getDetectableGames(){",
        replacement: [
            {
                match: /(getDetectableGames\(\)\{)([\s\S]*?)(},reportUnverifiedGame)/,
                replace: "$1$3"
            }
        ],
        plugin: 'ConsoleSupressor'
    },
    {
        find: "setDevtoolsCallbacks",
        replacement: [
            {
                match: /if\(null!=\i&&"0.0.0"===\i\.remoteApp\.getVersion\(\)\)/,
                replace: "if(true)"
            }
        ],
        plugin: 'ConsoleSupressor'
    }
];