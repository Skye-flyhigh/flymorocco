import fs from "fs";
import path from "path";

const tmpPath = path.join(process.cwd(), "tmp");

fs.readdir(tmpPath, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(tmpPath, file), err => {
      if (err) throw err;
    });
  }
});