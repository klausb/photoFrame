# PhotoFrame - Bring life back to your forgotten iPad

## Documentation

PhotoFrame provides a simple web server and web-page to show a random photo sequence on a tablet/PC screen. It is not completely rando, as it does not repeat a photo before all have been shown. After that, it starts over a runs a new random series.

The web-page is intentionally kept simple to support even oldest iOS versions. Because of that, PhotoFrame can show photos on an iPad 1.

All image transformation is done on the server using the `sharp` library. In the UI, it shows a full-page image with a caption in the lower left corner. The caption shown is the folder name of the photo being shown.

## Runnning

Run the server directly using `node imageServer.js` or use the Dockerfile to run it as container.

On your tablet load the page on port 9090:
```
http://<host>:9090/
```

On an iPad, place the URL to the springboard to run it as a web-app. This removes the browser header and footer.

Photos change after 20 seconds. Feel free to change it in `index.html`.

## Configure

You can configure basic file/directory filtering and the start folder to search for image files in configure.json:

```
{
    "includeFiles": [ ".*jpg", ".*jpeg" ],
    "includeDirs": [ ".*2020.*", ".*Sylt.*" ],
    "start": "/photos"
}
```
