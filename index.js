const fs = require("fs");

//Blocking synchronus way
/*
const textIn = fs.readFileSync("./txt/input.txt", { encoding: "utf-8" });
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File Written");
*/

//Non-Blocking asynchronus way
fs.readFile("./txt/start.txt", { encoding: "utf-8" }, (err, data1) => {
  if (err) throw new Error("There was an error with reading a file");
  fs.readFile(`./txt/${data1}.txt`, { encoding: "utf-8" }, (err2, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, { encoding: "utf-8" }, (err3, data3) => {
      console.log(data3);

      fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, { encoding: "utf-8" }, (err4) => {
        console.log("Your file has been written");
      });
    });
  });
});
