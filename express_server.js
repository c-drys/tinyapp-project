const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 5000; // default port 8080

app.use(cookieParser());
app.set("view engine", "ejs");

// convert the request body from a buffer to a readable string
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// add POST username for username cookie
app.post('/login', (req, res) => {
  res.cookie("username", req.body.username);
  // console.log("username", req.body.username)
  res.redirect('/urls');
});

// app.post('/login', (req, res) => {
//   const { email } = req.body;
//   for (const userId in users) {
//     const user = users[userId];
//     if (user.email === email) {
//         // log the user in (return) res.send
//         // res.cookie('userId', userId);
//         req.session.userId = userId;
//         res.redirect('/');
//     }
//     // email does not exist res.send
//   }
//   // final response
// });

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "password101"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "password202"
  }
}

// add POST endpoint to register
app.get('/register', (req, res) => {
  const newUserID = generateRandomString()
  users[newUserID] = {
  "id": newUserID, 
  "email": req.body.email,
  "password": req.body.password}
  console.log(users);
  // inspect data object contents 
  res.redirect(`/urls`);
});

// add POST logout & clear cookie 
app.post('/logout', (req, res) => {
  console.log(req.body);
  res.clearCookie("username", req.body.username);
  res.redirect('/urls');
});

// implement to always return 6 characters
function generateRandomString() {
  let str = '';
  let alphanum = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let alphanumlength = alphanum.length;
  for (let i = 0; i < 6; i++) {
    str += alphanum.charAt(Math.floor(Math.random() * alphanumlength));
  }
  return str;
}

// add GET index_ejs template route
app.get("/urls", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// add GET access to json 
app.get("/urls.json", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.json(urlDatabase, templateVars);
});

// add GET index_new template route
app.get("/urls/new", (req, res) => {
  let templateVars = {
  username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

// add GET register template route
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);         
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    username: req.cookies['username'],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// //add POST edit route redirect ??
// app.post("/urls/:shortURL/edit", (req, res) => {
//   let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
//   res.render("urls_show", templateVars);
// });

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

// catach all [failsafe]
// app.get('/' (req, res)) => {
  // console.log('*', (req, res)
  // res.redirect())

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

  // app.post("/urls", (req, res) => {
  //   console.log(req.body);  // Log the POST request body to the console
  //   res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // });
  
  // app.get("/", (req, res) => {
  //   res.send("Hello!");
  // });
  
  // app.get("/hello", (req, res) => {
  //   res.send("<html><body>Hello <b>Chris</b></body></html>\n");
  // });