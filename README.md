# JPEG Client for JavaScript
Client to get sequential images from URL and take snapshots with auth basic support.

Using the standard **<img>** tag, we are unable to include authentication (_e.g. http://user:pass@ip:port/path_), if necessary, due to browser limitations.

To solve this problem, we adapted this client, allowing, for example, cameras that only have the snapshot feature (_without MJPEG stream availability_) to be transmitted using sequential requests.

## How to use

Add the *jpegstream.js* script to your HTML page:
```html
<script src="jpegstream.js"></script>
```

Create the player and enter the connection parameters and events you want to control:
```javascript
var player = new JPEGStream.Player("player", "http://<address>:<port>/<path>", "<username>", "<password>", {onError:  onErr, onStart: onStarted, onStop: onStopped});
```
Parameters available:
1. container element
2. URL
3. Username (_optional_)
4. Password (_optional_)
5. Options
* Refresh Rate
* Events (_see below_)

## Methods
* _start()_
* _stop()_
* _snapshot()_

### **start()**
Starts sequential image capture:
```javascript
var player = new JPEGStream.Player("player", "http://<address>:<port>/<path>", "<username>", "<password>", {onError:  onErr, onStart: onStarted, onStop: onStopped});
player.start();
```

### **stop()**
Stops sequential image capture:
```javascript
var player = new JPEGStream.Player("player", "http://<address>:<port>/<path>", "<username>", "<password>", {onError:  onErr, onStart: onStarted, onStop: onStopped});
player.stop();
```

### **snapshot()**
Take snapshot:
```javascript
var player = new JPEGStream.Player("player", "http://<address>:<port>/<path>", "<username>", "<password>", {onError:  onErr, onStart: onStarted, onStop: onStopped});
player.snapshot();
```

## Events
Events are assigned upon object creation:
* **onStart**
* **onStop**
* **onError**(_text_)
  * _Text_: Displays the returned text in the request body.

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
```