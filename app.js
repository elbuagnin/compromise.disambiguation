import http from "http";
import { readFile } from "fs";
import nlp from "compromise";
import disambiguation from "./index.js";

function test() {
  readFile("./sample.txt", "utf8", (err, data) => {
    if (err) {
      throw new Error(err);
    }

    nlp.plugin(disambiguation);

    const doc = nlp(data);
    doc.disambiguate();
  });
}

function requestListener(req, res) {
  res.writeHead(200);
  test();
  res.end("Disambiguation::");
}

const server = http.createServer(requestListener);
server.listen(8080);
