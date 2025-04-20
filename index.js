import fs from "node:fs";
import http from "node:http";

import path from "path";
const __dirname = path.resolve();

//Blocking synchronus way
/*
const textIn = fs.readFileSync("./txt/input.txt", { encoding: "utf-8" });
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File Written");
*/

//SECTION Non-Blocking asynchronus way
// fs.readFile("./txt/start.txt", { encoding: "utf-8" }, (err, data1) => {
//   if (err) throw new Error("There was an error with reading a file");
//   fs.readFile(`./txt/${data1}.txt`, { encoding: "utf-8" }, (err2, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, { encoding: "utf-8" }, (err3, data3) => {
//       console.log(data3);

//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, { encoding: "utf-8" }, (err4) => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });

//SECTION SERVER
const server = http.createServer();

const replaceTemplate = (temp, product) => {
  let output = temp.replaceAll("{%PRODUCTNAME%}", product.productName);
  output = output.replaceAll("{%IMAGE%}", product.image);
  output = output.replaceAll("{%PRICE%}", product.price);
  output = output.replaceAll("{%FROM%}", product.from);
  output = output.replaceAll("{%NUTRIENTS%}", product.nutrients);
  output = output.replaceAll("{%QUANTITY%}", product.quantity);
  output = output.replaceAll("{%DESCRIPTION%}", product.description);
  output = output.replaceAll("{%ID%}", product.id);

  if (!product.organic) output = output.replaceAll("{%NOT_ORGANIC%}", "not-organic");

  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const cardTemplate = fs.readFileSync(`${__dirname}/templates/templete-card.html`, "utf-8");

const dataObj = JSON.parse(data);

// Listen to the request event
server.on("request", (request, res) => {
  const pathName = request.url;

  if (pathName === "/overview" || pathName === "/") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => {
        return replaceTemplate(cardTemplate, el);
      })
      .join("");
    const output = overviewTemplate.replace("{%PRODUCT_CARDS%}", cardsHtml);
    console.log(output);
    res.end(output);
  } else if (pathName === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(productTemplate);
  } else if (pathName === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    //HEADERS ALWAYS BEFORE THE RESPONSE
    res.writeHead(404, { "content-type": "text/html", "my-own-header": "hello-world" });
    res.end("<h1>Page not Found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
