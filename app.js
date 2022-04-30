import http from "http";
import { readFile } from "fs";
import nlp from "compromise";
import pianoplayer from 'compromise.pianoplayer';

function test() {
  readFile("./sample.txt", "utf8", (err, data) => {
    if (err) {
      throw new Error(err);
    }
    nlp.plugin(pianoplayer);
    const doc = nlp(data);
    doc.sequence().debug();
  });
}

function requestListener(req, res) {
  res.writeHead(200);
  test();
  res.end("Disambiguation::");
}

const server = http.createServer(requestListener);
server.listen(8080);
