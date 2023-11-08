# JPEG Client for JavaScript
Client to get sequential images from URL and take snapshots with auth basic support.

Using the standard **<img>** tag, we are unable to include authentication (_e.g. http://user:pass@ip:port/path_), if necessary, due to browser limitations.

To solve this problem, [we adapted this client](https://gist.github.com/codebrainz/eeeeead894e8bdff059b), allowing, for example, cameras that only have the snapshot feature (_without MJPEG stream availability_) to be transmitted using sequential requests.

## For MJPEG streams
New features and bugfixes will be available in [this version](https://github.com/daleffe/mjpeg.js), which also supports MJPEG streams.

## How to use

Add the *jpeg.js* script to your HTML page:
```html
<script src="jpeg.js"></script>
```

Create the player and set connection parameters/events as needed:
```javascript
var player = new JPEG.Player("player", "http://<address>:<port>/<path>", "<username>", "<password>", {onError:  onErr, onStart: onStarted, onStop: onStopped});
```
Parameters available:
1. container element
2. URL
3. Username (_optional_)
4. Password (_optional_)
5. Options
* Image class
* Image alternative text
* Image title
* Timeout (_in ms_)
* Refresh Rate
* Events (_see below_)

## Methods
* _start()_
* _stop()_
* _snapshot()_

### **start()**
Start sequential capture:
```javascript
var player = new JPEG.Player("player", "http://<address>:<port>/<path>", "<username>", "<password>", {onStart: onStarted});
player.start();
```

### **stop()**
Stop sequential capture or abort current connection:
```javascript
var player = new JPEG.Player("player", "http://<address>:<port>/<path>", "<username>", "<password>", {onStop: onStopped});
player.stop();
```

### **snapshot()**
Take snapshot:
```javascript
var player = new JPEG.Player("player", "http://<address>:<port>/<path>", "<username>", "<password>", {onError:  onErr, onStart: onStarted, onStop: onStopped});
player.snapshot();
```

## Events
Events are assigned at object creation:
* **onStart**
* **onStop**
* **onError**(_JSON_)
  * _JSON_: Displays the returned status code and request body text.
* **onFrame**
 * _event_: Event triggered by ***<img>*** onload.

```javascript
function onErr(text) {
  console.error(text);
  player.stop();
}

function onStarted() {
  console.log('Started');
}

function onStopped() {
  console.warn('Stopped');
}

function onFrame(e) {
  e.preventDefault();
  e.stopPropagation();

  console.log('New frame',e);
}
```