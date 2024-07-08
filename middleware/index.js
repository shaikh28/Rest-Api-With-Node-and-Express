const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `${Date.now()},${req.method},${req.path}`,
      (err, data) => {
        next();
      }
    );
    // next()// this will let the server give the response to client  from server
  };
}

module.exports = {
  logReqRes,
};
