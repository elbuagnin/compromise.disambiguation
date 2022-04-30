import http from "http";
import { readFile } from "fs";
import nlp from "compromise";
import * as diss from './index.js';

function test() {
  readFile("./sample.txt", "utf8", (err, data) => {
    if (err) {
      throw new Error(err);
    }

    nlp.plugin(diss.disambiguationPlugin);
    const doc = nlp(data);
    doc.disambiguate().debug();
  });
}

function requestListener(req, res) {
  res.writeHead(200);
  test();
  res.end("Disambiguation::");
}

const server = http.createServer(requestListener);
server.listen(8080);
