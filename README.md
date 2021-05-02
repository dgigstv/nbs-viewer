# nbs-viewer

JavaScript library for reading Minecraft Note Block Studio (.nbs) files. Only supports NBS files that are Version 5 and later. Not browser-compatible. Only meant for standalone Node usage.

## Usage

* Read a file into memory.

```javascript
const nbsViewer = require('nbs-viewer');

var mySong = nbsViewer.readAll('./mySong.nbs');
console.log(`${mySong.songAuthor} - ${mySong.songName}`);
```

* Read some notes. Songs are separated by note into "ticks." Ticks have layers, which then have individual notes.

```javascript
const nbsViewer = require('nbs-viewer');

var mySong = nbsViewer.read('./mySong.nbs');
console.log(`${mySong.songAuthor} - ${mySong.songName}`);

for (const tick of mySong.ticks) {
    console.log('At tick ${tick.tick}:');
    for (const note of tick.layers) {
        console.log(note);
    }
}
```

* Or, read notes via generator.

```javascript
const nbsViewer = require('nbs-viewer');

var mySong = nbsViewer.read('./mySong.nbs');
console.log(`${mySong.songAuthor} - ${mySong.songName}`);

(async function () {
    for async (const tick of mySong.ticks) {
        for (const note of tick.layers) {
            console.log(note);
        }
    }
})().then(() => console.log('Done!'));
```
