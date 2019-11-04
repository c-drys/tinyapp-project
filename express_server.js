const cookieSession = require('cookie-session')
const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const PORT = 5000; // default port 8080
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: [/* secret keys */
  'asdfghjkl']
}))

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("password101", 10)
  },  
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("password202", 10)
    }
};

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


//get routes

app.get("/", (req, res) => {
  res.redirect(`/urls/`);
});

// add GET access to json
app.get("/urls.json", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.json(urlDatabase, templateVars);
});

// add GET register_ejs template route
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]};
  res.render(`urls_register`, templateVars);
});

// add GET for urls_login
app.get("/login", (req, res) => {
   if (users[req.session.user_id]) {
    return res.redirect(`urls`);
  };
  let templateVars = {
    user: users[req.session.user_id]};
  res.render(`login`, templateVars);
});

// add GET index_ejs template route
app.get('/urls', (req, res) => {
  const currentUser = req.session.user_id;
  if (!currentUser) {
    res.redirect(`/login`);
  }
  const filteredURLs = urlsForUser(currentUser, urlDatabase);
  let templateVars = { urls: filteredURLs, user: users[currentUser] };
  res.render(`urls_index`, templateVars);
});


// add GET index_new template route
app.get("/urls/new", (req, res) => {
  const currentUser = users[req.session.user_id];
  if (!currentUser) {
    return res.redirect(`/login`);
  }
    let templateVars = { 
      user: users[req.session.user_id]
    };
    res.render("urls_new", templateVars);
  })

// add GET to redirect short URL to longURL
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

// add GET to short URL access
  app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  });

//post routes 

// add POST register for new user
app.post("/register", (req, res) => {
  let newUserID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Invisibility is cool .. Not here tho');
  }
  for (const userId in users) {
    if (users[userId].email === req.body.email) {
      return res.status(400).send('I think I already know you..');
  }
  else 
    users[newUserID] = {
      id: newUserID,
      email: req.body.email,
      Password: hashedPassword
    };
    }
  req.session.user_id = newUserID;
  res.redirect(`/urls`);
});

// add POST username for username cookie
app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);
if (req.body.email !== user.email) {
  return res.status(403).send('Sorry Invalid Credentials');

}  if (!bcrypt.compareSync(req.body.password, user.password)) {
  return res.status(403).send('Hmmmmmm... do you need a Password Reminder?');

} req.session.user_id = user.id 
  res.redirect(`/urls`);
});

// add POST create URL and add to database 
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const user = req.session.user_id
  const newURL = {};
  newURL["longURL"] = req.body.longURL;
  newURL["userID"] = user;
  urlDatabase[shortURL] = newURL;
  res.redirect(`/urls`);
});


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
  if (!currentUser) {
    return res.status(403).send("NO ACCESS Forbidden from Editing this URL");
  } else {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL
    return res.redirect(`/urls`); 
    }
});

// add POST logout & clear user cookie
app.post("/logout", (req, res) => {
  req.session = null 
  res.redirect(`/login`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
