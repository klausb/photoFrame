const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const exif = require('jpeg-exif');
const R = require('ramda');
const options = require('./config.json') || {};
const includeFiles = options.includeFiles || [];
const includeDirs = options.includeDirs || [];

const fileRegs = R.map(pat => new RegExp(pat), includeFiles);
const dirRegs = R.map(pat => new RegExp(pat), includeDirs);
console.log(fileRegs);
console.log(dirRegs);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

const getAllFiles = function(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory() && file != '@eaDir' && R.any(reg => file.match(reg), dirRegs)) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (R.any(reg => file.match(reg), fileRegs)) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  })

  return arrayOfFiles
}

const files = getAllFiles(options.start);
const numFiles = files.length;

const f = n => n > numFiles ? false : [n, n+1];
let dynList = R.unfold(f, 0);

console.log(`serving ${numFiles} pictures`);

function pickNext() {
  let remainingIndex = dynList.length;
  let i = 0;
  if (remainingIndex == 0) {
    dynList = R.unfold(f, 0);
    console.log(`Resetting list`);
    remainingIndex = dynList.length;
  }
  i = Math.floor(Math.random() * remainingIndex);
  dynList.splice(i, 1);
  return i;
}

app.use('/img/:id', (req, res) => {
  const i = req.params.id;
  res.header('Content-Type', 'image/jpeg');
  // const exifData = exif.parseSync(files[i]);

  console.log(`load ${i}`);

  sharp(files[i])
    .rotate(0.0)
    .resize({
      fit: 'contain',
      width: 1024,
      height: 768,
      fit: sharp.fit.cover,
      position: sharp.strategy.attention
    })
    .jpeg()
    .pipe(res);
});

app.use('/next', (req, res) => {
  const i = pickNext();
  const fstr = files[i].split(path.sep);
  res.json({id: i, title: `${fstr[fstr.length-2]}`});
});

app.listen(9090, () => console.log('Listening on port 9090!'));
