const cookieSession = require('cookie-session')
const express = require("express");
const app = express();
//const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const PORT = 5000; // default port 8080

app.use(cookieSession({
  name: 'session',
  keys: [/* secret keys */
  'asdfghjkl']
}))
//app.use(cookieParser());
app.set("view engine", "ejs");

// convert the request body from a buffer to a readable string
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {

  'b2xVn2': { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  '9sm5xK': { longURL: "http://www.google.ca", userID: "user2RandomID" },
  'akjbjb': { longURL: "http://shop.lululemon.com", userID: "userRandomID" },
  'aq684i': { longURL: "http://bbc.co.uk/iplayer", userID: "user2RandomID" },
  'yimgsv': { longURL: "http://vancouver.ca", userID: "user2RandomID" },
  'f20flh': { longURL: "http://www.instagram.com", userID: "userRandomID" },
  'kkzlwh': { longURL: "http://www.urbandictionary.com", userID: "user2RandomID" },
  'tagwgw': { longURL: "http://www.gq.com", userID: "user2RandomID" }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    //Password: "password101"
    password: bcrypt.hashSync("password101", 10)
  },  
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    //Password: "password202"
    password: bcrypt.hashSync("password202", 10)
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

// add GET index_ejs template route
app.get('/urls', (req, res) => {
  const currentUser = req.session.user_id;
  if (!currentUser) {
    res.redirect(`/login`);
  }
  const filteredURLs = urlsForUser(currentUser);
  let templateVars = { urls: filteredURLs, user: users[currentUser] };
  res.render(`urls_index`, templateVars);
});

// add GET register_ejs template route
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render(`urls_register`, templateVars);
});

// add GET access to json
app.get("/urls.json", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.json(urlDatabase, templateVars);
});

// add GET for urls_login
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render(`login`, templateVars);
});

// verify user on registry, redirect if unverified
const registeredUser = function(email) {
  for (let user of Object.keys(users)) {
    if (email === users[user]["email"]) {
      return registeredUser;
    }
  }
};

// scan object for user ID
// const getUserByEmail = function(users, email) {
//   for (const newUserID in users) {
//     // console.log(users[newUserID].email);
//     // console.log(email);
//     if (users[newUserID].email === email) {
//       return users[newUserID];
//     }
//   }
//   return false;
// };

const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return false;
};

// add GET index_new template route
app.get("/urls/new", (req, res) => {
  const user = getUserByEmail(users[req.session.user_id])
  if (!user) {
    return res.redirect(`/login`);
  }
    let templateVars = { 
      user: users[req.session["user_id"]] 
    };
    res.render("urls_new", templateVars);
  })

  // // res.render("urls_new", templateVars);

  // if (req.session.user_id) {
//  else {
//     res.redirect(`/login`);
//   }
// });

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const user = req.session.user_id
  const newURL = {};
  newURL["longURL"] = req.body.longURL;
  newURL["userID"] = user;
  urlDatabase[shortURL] = newURL;
  //console.log(urlDatabase);
  res.redirect(`/urls`);
});

app.get("/urls/:shortURL", (req, res) => {
  const currentUser = req.session.user_id;
  if (!currentUser) {
    return res.status(403).send("NO ACCESS Forbidden to Editing this URL");
  } else {
  let templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render(`urls_show`, templateVars);
};
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// implement function that users can only see their own URLs
let urlsForUser = function(userID) {
  let filteredURLs = {};
  for (const shortURL of Object.keys(urlDatabase)) {
    if (urlDatabase[shortURL].userID === userID) {
      filteredURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return filteredURLs;
};

// add POST delete route re-direct
app.post("/urls/:shortURL/delete", (req, res) => {
  const currentUser = req.session.user_id;
    if (!currentUser) {
      res.redirect(`/access`);
    } else {
    delete urlDatabase[req.params.shortURL];
      return res.redirect("/urls");
  }
});

// add POST edit route re-direct
app.post("/urls/:shortURL", (req, res) => {
  const currentUser = req.session.user_id;
console.log('iii', currentUser)

  if (!currentUser) {
    return res.status(403).send("NO ACCESS Forbidden from Editing this URL");
  } else {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL
    return res.redirect(`/urls`); 
    }
});

// const longURL = urlDatabase[req.params.shortURL].longURL;
//   res.redirect(longURL);

// add POST username for username cookie
app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);
if (req.body.email !== user.email) {
  return res.sendStatus(403)
}
if (!bcrypt.compareSync(req.body.password, user.password)) {
  return res.sendStatus(403)
}


  // // if  (req.body.email === "" || req.body.password === "") {
  // //   res.sendStatus(400);
  // } else if (!user) {
  //   res.sendStatus(403);
  // } else {
  //   console.log("users ID'd", user);
    req.session.user_id = user.id //("user_id", user.id);
  //   // console.log("username", req.body.username)
    res.redirect(`/urls`);
  // // }
});

// add POST register for new user
app.post("/register", (req, res) => {
  let newUserID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  console.log("imhashed", hashedPassword);
  if (req.body.email === "" || req.body.password === "") {
    res.sendStatus(400);
  } else {
    users[newUserID] = {
      id: newUserID,
      email: req.body.email,
      Password: hashedPassword
    };
    console.log(bcrypt.compareSync('asdf', hashedPassword))
    }
  // console.log(users);
  req.session.user_id = newUserID;
  // console.log(newUserID);
  // inspect data object contents
  res.redirect(`/urls`);
});

// add POST logout & clear user cookie
app.post("/logout", (req, res) => {
  //console.log(req.body);
  req.session = null 
  // res.clearCookie("user_id", users[req.session.user_id]);
  res.redirect(`/login`);
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