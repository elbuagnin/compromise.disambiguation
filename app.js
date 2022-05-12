import http from "http";
import { readFile } from "fs";
import nlp from "compromise";
import playerpiano from "compromise.playerpiano";

function test() {
  readFile("./sample.txt", "utf8", (err, data) => {
    if (err) {
      throw new Error(err);
    }

    nlp.plugin(playerpiano);
    const doc = nlp(data);
    const options = "verbose=results";
    doc.sequence(options);
  });
}

function requestListener(req, res) {
  res.writeHead(200);
  test();
  res.end("Disambiguation::");
}

const server = http.createServer(requestListener);
server.listen(8080);
