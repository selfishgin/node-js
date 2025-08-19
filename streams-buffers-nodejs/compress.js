import fs from "fs"
import zlib from "zlib"
import { pipeline } from "stream"

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.on('data', (chunk) => {
  let text = chunk.toString();

  let cleaned = text.replace(/[0-9]/g, '');

  writeStream.write(cleaned);
});

readStream.on('end', () => {
  console.log('Done!');
  writeStream.end();
});