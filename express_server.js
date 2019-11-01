const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 5000; // default port 8080

app.use(cookieParser());
app.set("view engine", "ejs");

// convert the request body from a buffer to a readable string
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  akjbjb: "http://shop.lululemon.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "password101"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "password202"
  }
};

// // implement to always return 6 characters
const generateRandomString = function() {
  let str = "";
  let alphanum = "abcdefghijklmnopqrstuvwxyz0123456789";
  let alphanumlength = alphanum.length;
  for (let i = 0; i < 6; i++) {
    str += alphanum.charAt(Math.floor(Math.random() * alphanumlength));
  }
  console.log("string", str);
  return str;
};

// scan object for user ID
const findID = function(users, email) {
  for (const newUserID in users) {
    // console.log(users[newUserID].email);
    // console.log(email);
    if (users[newUserID].email === email) {
      return users[newUserID];
    }
  }
  return false;
};

// add GET index_ejs template route
app.get('/urls', (req, res) => {
  const currentUser = req.cookies['user_id'];
  if (!currentUser) {
    res.redirect('/login');
  }
  const filteredURLs = urlsForUser(currentUser);
  let templateVars = { urls: filteredURLs, user: users[currentUser] };
  res.render('urls_index', templateVars);
});

// add GET register_ejs template route
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_register", templateVars);
});

// add GET access to json
app.get("/urls.json", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.json(urlDatabase, templateVars);
});

// add GET for urls_login
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});

//verify user on registry, redirect if unverified 
const registeredUser = function(email) {
  for (let user of Object.keys(users)) {
    if (email === users[user]['email']) {
      return registeredUser;
    }
  }
};

// add GET index_new template route
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);

  if (req.cookies['user_id']) {
    res.render('urls_new', templateVars);

  } else {
    res.redirect(`/login`);
  }
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  const user = req.cookies['user_id']
  const newURL = {};
  newURL['longURL'] = req.body.longURL;
  newURL['userID'] = user;
  urlDatabase[shortURL] = newURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].longURL !== users[req.cookies['user_id']]
  ) {
    return res.status(403).send('NO ACCESS Forbidden from Editing this url');
  }
 
  // if (req.cookie["user_id"] === urlsForUser(shortURL)) {}
  // // true - access

  let templateVars = {
    user: users[req.cookies["user_id"]],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// implement function that users can only see their own URLs
let urlsForUser = function(userID) {
  let filteredURLs = [];
  for (const url of Object.keys(urlDatabase)) {
    if (urlDatabase[url] ["userID" === userID]) {
      filteredURLs[url] = urlDatabase[url];
    }
  }
  return filteredURLs;
};

const userURL = function(shortURL) {
  return urlDatabase[shortURL]['userID'];
};

// add POST delete route re-direct
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

// add POST username for username cookie
app.post("/login", (req, res) => {
  const user = findID(users, req.body.email);
  if  (req.body.email === "" || req.body.password === "") {
    res.sendStatus(400);
  } else if (!user) {
    res.sendStatus(403);
  } else {
    console.log("users ID'd", user);
    res.cookie("user_id", user.id);
    // console.log("username", req.body.username)
    res.redirect("/urls");
  }
});

// add POST register for new user
app.post("/register", (req, res) => {
  let newUserID = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
    res.sendStatus(400);
  } else {
    users[newUserID] = {
      id: newUserID,
      email: req.body.email,
      password: req.body.password
    };
  }
  console.log(users);
  res.cookie("user_id", newUserID);
  console.log(newUserID);
  // inspect data object contents
  res.redirect(`/urls`);
});

// user online 
const userLoggedIn= function(cookie) {
for (const user of Object.keys(users))
  if (cookie === user) {
    return userLoggedIn; 
  }
}

// add POST logout & clear user cookie
app.post("/logout", (req, res) => {
  //console.log(req.body);
  res.clearCookie("user_id", users[req.cookies["user_id"]]);
  res.redirect("/login");
});

// // add GET register template route
// app.get("/register", (req, res) => {
//   res.render("register");
// });

// //add POST edit route redirect ??
// app.post("/urls/:shortURL/edit", (req, res) => {
//   let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
//   res.render("urls_show", templateVars);
// });

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
