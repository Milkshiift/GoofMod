/**
 * @name ScreenshareQualityPatch
 * @description Allows you to modify screenshare quality
 */

const resolutions = [480, 720, 1080, 1440];
const framerates = [5, 15, 30, 60];
const StreamQuality = await Vencord.Webpack.findByCode("goliveMaxQuality");
async function patchScreenshareQuality(height, framerate) {
    console.log("[ScreenshareQualityPatch] Loading screenshare quality patch...");
    height = roundToClosest(height, resolutions);
    framerate = roundToClosest(framerate, framerates);
    const aspectRatio = screen.width / screen.height;
    const width = Math.round(height * aspectRatio);

    after("getVideoQuality", StreamQuality.prototype, (response) => {
        response = {
            bitrateMin: 500000,
            bitrateMax: 70000000,
            bitrateTarget: 40000000,
            localWant: 100,
            capture: {
                framerate: framerate,
                width,
                height: height,
                pixelCount: width * height
            },
            encode: {
                framerate: framerate,
                width,
                height: height,
                pixelCount: width * height
            }
        };
        return response;
    }, false);

    after("getQuality", StreamQuality.prototype, (response) => {
        response = {
            bitrateMin: 500000,
            bitrateMax: 70000000,
            bitrateTarget: 40000000,
            localWant: 100,
            capture: {
                framerate: framerate,
                width,
                height: height,
                pixelCount: width * height
            },
            encode: {
                framerate: framerate,
                width,
                height: height,
                pixelCount: width * height
            }
        };
        return response;
    }, false);
}

window.ScreenshareQuality = {};
window.ScreenshareQuality.patchScreenshareQuality = patchScreenshareQuality;

function after(functionName, object, callback, once = false) {
    const originalFunction = object[functionName];
  
    object[functionName] = function (...args) {
      const result = originalFunction.apply(this, args);
      const newResult = callback.call(this, result, ...args);
  
      if (once) {
        object[functionName] = originalFunction;
      }
  
      return newResult === undefined ? result : newResult;
    };
}

function roundToClosest(input, array) {
    let closestValue = array[0];
    let smallestDifference = Math.abs(input - closestValue);
    for (let i = 1; i < array.length; i++) {
      let currentDifference = Math.abs(input - array[i]);
      if (currentDifference < smallestDifference) {
        closestValue = array[i];
        smallestDifference = currentDifference;
      }
    }
    return closestValue;
  }