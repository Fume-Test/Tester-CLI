const fs = require('fs-extra');
const path = require('path');

module.exports = (on, config) => {
  on('after:spec', (spec, results) => {
    if (results && results.video) {
      const videoPath = results.video;
      const caseID = config.env.caseID || 'default_case'; // Use a default name if caseID is not set
      const newVideoName = `${caseID}.mp4`;
      const newVideoPath = path.join(path.dirname(videoPath), newVideoName);

      // Rename the video
      return new Promise((resolve, reject) => {
        fs.rename(videoPath, newVideoPath, (error) => {
          if (error) {
            return reject(error);
          }
          resolve(newVideoPath);
        });
      });
    }
  });
};
