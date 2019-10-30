const express = require("express");
const app = express();
const PORT = 5000; // default port 8080

app.set("view engine", "ejs");

// convert the request body from a buffer to a readable string
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// implement to alwasy return 6 characters
function generateRandomString() {
  let str = '';
  let alphanum = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let alphanumlength = alphanum.length;
  for (let i = 0; i < 6; i++) {
    str += alphanum.charAt(Math.floor(Math.random() * alphanumlength));
  }
  return str;
}

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// add GET index_ejs template route
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// add GET access to json 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// add GET index_new template route
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);         
});

app.get('/urls:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    long: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars)

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//add POST edit route redirect ??
app.post("/urls/:shortURL/edit", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// add POST delete route re-direct
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// app.post("/urls", (req, res) => {
  //   console.log(req.body);  // Log the POST request body to the console
  //   res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // });
  
  
  // app.get("/hello", (req, res) => {
  //   res.send("<html><body>Hello <b>Chris</b></body></html>\n");
  // });