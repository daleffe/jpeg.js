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
    self.timeout = args.timeout || 20000;

    self.running = false;
    self.frameTimer = 0;

    self.img = new Image();

    function getFrame(isSnapshot = false) {
      if (self.frameTimer != 0) clearInterval(self.frameTimer);

      const request = new XMLHttpRequest();

      request.timeout = self.timeout;
      request.responseType = 'arraybuffer';

      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          try {
            if (request.status == 200) {
              if (request.getResponseHeader('content-type').startsWith('image/')) {
                self.img.src = URL.createObjectURL(new Blob([request.response], { type: request.getResponseHeader('content-type') }));

                self.onFrame(self.img);

                if (self.refreshRate > 0 && !isSnapshot) self.frameTimer = setInterval(getFrame, self.refreshRate);

                return;
              }
            }

            var charset = "utf-8";
            var text = "";
            var contentType = request.getResponseHeader('content-type');

            if (contentType) {
              const contentType = contentType.toLowerCase().split(';',2).map(function(item) {
                return item.trim();
              });

              if (contentType[1] !== undefined) if (contentType[1].startsWith("charset=")) charset = contentType[1].replace("charset=","");

              if (contentType[0].includes("text") || contentType.includes("json") || contentType[1].includes("xml")) {
                text = new TextDecoder(charset).decode(request.response);
              }
            }

            self.onError(JSON.stringify({status: request.status, message: text}));
          } catch (e) {
            self.onError(JSON.stringify({status: -1, message: JSON.stringify(e)}));
          }
        }
      }

      try {
        request.open("GET",self.url,true);
        if ((typeof self.username === "string" || self.username instanceof String) && (typeof self.password === "string" || self.password instanceof String)) {
          if (self.username.length > 0 && self.password.length > 0) request.setRequestHeader("Authorization","Basic " + btoa(self.username + ':' + self.password));
        }
        request.send(null);
      } catch (e) {
        self.onError(JSON.stringify({status: -2, message: JSON.stringify(e)}));
      }
    }

    function takeSnapshot() {
      getFrame(true);
    }

    function setRunning(running) {
      self.running = running;

      if (self.running) {
        if (self.onStart) self.onStart();

        if (self.frameTimer == 0) getFrame();
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