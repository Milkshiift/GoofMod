/**
 * @name ConsoleSupressor
 * @description Suppresses Discord logger
 */

const patches = [
    {
        find: ".setLogFn",
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
    }
];