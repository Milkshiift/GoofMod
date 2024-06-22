/**
 * @name InvidiousEmbeds
 * @description Replaces YouTube embeds with Invidious embeds
 */

const patches = [
    {
        find: ',"%"),maxWidth',
        replacement: [
            {
                match: /(:.,src:.\.url)/,
                replace: "$1.replace('https://www.youtube.com/embed/', window.InvidiousEmbeds.fastestInstance())+'&local=true'"
            }
        ],
        plugin: "InvidiousEmbeds"
    }
];

// TODO: Make fastestInstanceCached persistent across restarts
// https://farside.link/invidious/
let fastestInstanceCached = "https://invidious.reallyaweso.me/latest_version?id=";
async function updateFastestInstance() {
    const response = await fetch("https://api.invidious.io/instances.json?pretty=0&sort_by=type,users");
    const json = await response.json();
    const instances = json.map((instance) => instance[1].uri);

    console.log("Testing Invidious instances...");
    let prevBestTime = Infinity;
    let prevBestInstance = null;
    for (const instance of instances) {
        if (!instance.includes("https")) continue;
        const start = performance.now();
        try {
            await fetch(instance+"/embed/ekQHJX9rMp8");
        } catch (e) {}
        const end = performance.now();
        const time = end - start;
        console.log(instance, time);
        if (time < prevBestTime) {
            prevBestTime = time;
            prevBestInstance = instance;
        }
    }

    console.log("Fastest instance:", prevBestInstance, prevBestTime);
    fastestInstanceCached = prevBestInstance+"/latest_version?id=";
}

//updateFastestInstance();

window.InvidiousEmbeds = {};
window.InvidiousEmbeds.fastestInstance = () => fastestInstanceCached;
