import fs from 'fs';
import { from, defer, interval } from 'rxjs';
import { concatMap, delay, flatMap, map, take, tap } from 'rxjs/operators';
import xml2js from 'xml2js';
import path from 'path';

const INDEX_FILE = path.join(
  __dirname,
  '../../../datasets',
  'pages-articles-index.txt'
);
const XML_FILE = path.join(
  __dirname,
  '../../../datasets',
  'pages-articles.xml'
);

const file = XML_FILE; // replace with your file name
// const file = INDEX_FILE; // replace with your file name
// const chunkSize = 1024 * 1024; // 1 MB
const chunkSize = 500; // 1 KB

const parser = new xml2js.Parser();

const readFile = (filePath: fs.PathLike) =>
  defer(() => {
    const stream = fs.createReadStream(filePath, {
      highWaterMark: chunkSize,
      encoding: 'utf-8',
    });
    let remaining = '';
    stream.on('data', (data: string) => {
      // console.log(data.split('\n'));
      const chunk = remaining + data.toString();
      // const lines = chunk.split('\n');
      // remaining = lines.pop();
      // lines.forEach((line) => parser.parseString(line));
      // console.log(data.toString());
    });
    return stream.on('end', () => {
      // if (remaining) {
      //   parser.parseString(remaining);
      // }
    });
  });

from(readFile(file))
  .pipe(
    concatMap((value: any) =>
      interval(1000).pipe(
        take(1), // emit only one value after the interval
        map(() => value) // map the emitted value to the original value
      )
    )
  )
  // .pipe(flatMap(() => parser.getResult()))
  .subscribe({
    next(result) {
      // process each XML element here
      console.log(result);
    },
    error(err) {
      console.error(err);
    },
    complete() {
      console.log('Done!');
    },
  });
