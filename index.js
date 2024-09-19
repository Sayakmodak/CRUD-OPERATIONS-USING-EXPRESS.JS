const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(express.json());
app.set("view engine", "ejs");


app.get('/', (req, res) => {
    fs.readdir("./tasks", (err, files) => {
        if (err) {
            console.log("Error occured");
        } else {
            console.log(files);
        }
        res.render("index", { files: files });
    })

})

app.post("/create", (req, res) => {
    console.log(req.body.title);
    console.log(req.body.details);
    const fileContent = `Title: ${req.body.title}\nDetails: ${req.body.details}\n`;
    const filePath = `./tasks/${req.body.title.split(" ").join("")}.txt`;
    fs.writeFile(filePath, fileContent, function (err) {
        if (err) {
            console.log("Error occured");
        }
        else {
            console.log('Saved!');
        }
        res.redirect("/");
    });
})

app.get("/files/:fileName", (req, res) => {
    fs.readFile(`./tasks/${req.params.fileName}`, "utf-8", (err, fileData) => {
        res.render("show", { title: req.params.fileName, fileData: fileData });
    })
})

app.get("/edit/:fileName", (req, res) => {
    res.render("edit", { old_name: req.params.fileName });
})


app.post("/edit", (req, res) => {
    fs.rename(`./tasks/${req.body.old_title}`, `./tasks/${req.body.new_title}`, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Rename Complete");
        }
    })
    res.redirect("/");
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})