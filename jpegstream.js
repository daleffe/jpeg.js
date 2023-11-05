var JPEGStream = (function(module) {
  "use strict";

  module.Stream = function(args) {
    var self = this;

    self.url = args.url;
    self.username = args.username || '';
    self.password = args.password || '';

    self.onStart = args.onStart || null;
    self.onStop = args.onStop || null;
    self.onFrame = args.onFrame || null;
    self.onError = args.onError || null;

    self.refreshRate = args.refreshRate || 500;

    self.running = false;
    self.frameTimer = 0;

    self.img = new Image();

    async function getFrame() {
      const options = {method: 'GET', mode: 'cors',cache: 'no-store'}

      if ((typeof self.username === "string" || self.username instanceof String) && (typeof self.password === "string" || self.password instanceof String)) {
        if (self.username.length > 0 && self.password.length > 0) options.headers = new Headers({Authorization: "Basic " + btoa(self.username + ':' + self.password)});
      }

      const response = await fetch(self.url, options)

      if (response.ok) {
        if (response.headers.get("Content-Type").startsWith('image')) {
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);

          self.img.src = objectURL;

          return true;
        }
      }

      return JSON.stringify({status: response.status, body: await response.text()});
    }

    async function takeSnapshot() {
      const status = await getFrame();

      if (status == true) {
        if (self.onFrame) self.onFrame(self.img);
      } else {
        if (self.onError) self.onError(status);
      }
    }

    async function setRunning(running) {
      self.running = running;

      if (self.running) {
        if (self.onStart) self.onStart();

        self.frameTimer = setInterval(takeSnapshot, self.refreshRate);
      } else {
        if (self.onStop) self.onStop();

        self.img.src = "#";
        clearInterval(self.frameTimer);
      }
    }

    self.snapshot = function() { takeSnapshot(); }
    self.start = function() { setRunning(true); }
    self.stop = function() { setRunning(false); }
  };

  module.Player = function(container, url, username, password, options) {
    var self = this;

    function updateFrame(img) {
      if (container) if (container.getElementsByTagName('img').length == 0) container.append(img)
    }

    if (typeof container === "string" || container instanceof String) {
      container = document.getElementById(container);
    }

    if (!options) options = {};

    options.url = url;
    options.username = username;
    options.password = password;

    options.onFrame = updateFrame;

    self.stream = new module.Stream(options);

    self.start = function() { self.stream.start(); }
    self.stop = function() { self.stream.stop(); }
    self.snapshot = function() { self.stream.snapshot(); }
  };

  return module;
})(JPEGStream || {});