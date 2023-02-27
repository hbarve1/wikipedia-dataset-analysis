/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import express from 'express';
import * as path from 'path';
import fs from 'node:fs';
import { readFile } from 'fs/promises';
import { pipeline } from 'node:stream/promises';
import readline from 'node:readline';

import { combineAll, combineLatestAll } from 'rxjs/operators';
// import * as readline from 'node:readline';
import * as rx from 'rxjs';
import { from, fromEvent, takeUntil, race, take, map, interval } from 'rxjs';
import { timeInterval, tap } from 'rxjs/operators';

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

// const app = express();

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

// app.get('/api', (req, res) => {
//   res.send({ message: 'Welcome to api!' });
// });

// const port = process.env.PORT || 3333;
// const server = app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}/api`);
// });
// server.on('error', console.error);

// (async () => {
//   const data = await readFile(path.join(__dirname, 'datasets'), {
//     encoding: 'utf-8',
//   });
//   console.log(data);
// })();

async function run(filePath) {
  const stream = fs.createReadStream(filePath, {
    encoding: 'utf-8',
  });

  stream.on('data', (chunk) => {
    console.log(chunk);
  });

  stream.on('end', () => {
    console.log('end');
  });

  stream.on('error', (err) => {
    console.log(err);
  });

  stream.on('close', () => {
    console.log('close');
  });

  stream.on('open', () => {
    console.log('open');
  });

  stream.on('ready', () => {
    console.log('ready');
  });

  stream.on('pause', () => {
    console.log('pause');
  });

  stream.on('resume', () => {
    console.log('resume');
  });

  stream.on('drain', () => {
    console.log('drain');
  });

  // console.log('Pipeline succeeded.');
}

// run(INDEX_FILE).catch(console.error);
// run(XML_FILE).catch(console.error);

const file = fs.createReadStream(INDEX_FILE);
const line = readline.createInterface({ input: file });

const fromLine = from(line);

// const line$ = fromLine.subscribe({
//   next: (dat) => {
//     console.log(dat);
//   },
//   error: (err) => {
//     console.log(err);
//   },
//   complete: () => {
//     console.log('complete');
//   },
// });

// line$.unsubscribe();

// setInterval(() => {
//   fromLine.subscribe({
//     next: (dat) => {
//       console.log(dat);
//     },
//     error: (err) => {
//       console.log(err);
//     },
//     complete: () => {
//       console.log('complete');
//     },
//   });
// }, 1000);

// rx.interval(4000)
//   .pipe(rx.take(2000))
//   .subscribe({
//     next: (dat) => {
//       console.log(dat);
//     },
//     error: (err) => {
//       console.log(err);
//     },
//   });

const rl = readline.createInterface({
  input: fs.createReadStream(INDEX_FILE, { encoding: 'utf-8' }),
});

// const lines = rx
//   .fromEvent(rl, 'line')
//   .takeUntil(rx.fromEvent(rl, 'close'))
//   .subscribe(
//     console.log,
//     (err) => console.log('Error: %s', err),
//     () => console.log('Completed')
//   );

// const obs = rx.interval(1000).pipe(
//   rx.mapTo(
//     fromEvent(rl, 'line').pipe(
//       takeUntil(
//         fromEvent(rl, 'data').pipe(take(1))

//         // race(
//         //   fromEvent(rl, 'data').pipe(take(1)),
//         //   fromEvent(rl, 'close').pipe(take(1)),
//         //   fromEvent(rl, 'error').pipe(
//         //     map((err) => {
//         //       throw err;
//         //     })
//         //   )
//         // )
//       )
//     )
//   ),
//   rx.take(10)
// );

// obs.subscribe(console.log);
// --------

// emit every 1s, take 2
const source$ = interval(1000).pipe(take(2));

// map each emitted value from source to interval observable that takes 5 values
const example$ = source$.pipe(
  map((val) =>
    interval(1000).pipe(
      map((i) => `Result (${val}): ${i}`),
      take(5)
    )
  )
);
/*
  2 values from source will map to 2 (inner) interval observables that emit every 1s.
  combineAll uses combineLatest strategy, emitting the last value from each
  whenever either observable emits a value
*/
// example$.pipe(combineAll()).subscribe(console.log);
example$.pipe(combineLatestAll()).subscribe(console.log);
