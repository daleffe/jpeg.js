# JPEG Client for JavaScript
Client to get sequential images from URL and take snapshots with auth basic support.

Using the standard **<img>** tag, we are unable to include authentication (_e.g. http://user:pass@ip:port/path_), if necessary, due to browser limitations.

To solve this problem, we adapted this client, allowing, for example, cameras that only have the snapshot feature (_without MJPEG stream availability_) to be transmitted using sequential requests.
