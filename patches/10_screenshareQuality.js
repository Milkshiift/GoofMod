/**
 * @name ScreenshareQualityPatch
 * @description Allows you to modify screenshare quality
 */

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

async function patchScreenshareQuality(height, framerate) {
    console.log("[ScreenshareQualityPatch] Loading screenshare quality patch...");
    const StreamQuality = await Vencord.Webpack.findByPropsLazy("VIDEO_QUALITY_MODES_TO_OVERWRITES").VideoQualityManager;
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

// Setting default settings
//patchScreenshareQuality(720, 30);

window.ScreenshareQuality = {};
window.ScreenshareQuality.patchScreenshareQuality = patchScreenshareQuality;