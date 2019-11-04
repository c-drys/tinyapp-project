// // implement a function to retrun 6 characters to represent a short URL
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

// scan the email database for registered users
const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    } 
  }
  return false;
};

// display short URLS to the user who has created them 
let urlsForUser = function(userID, urlDatabase) {
  let filteredURLs = {};
  for (const shortURL of Object.keys(urlDatabase)) {
    if (urlDatabase[shortURL].userID === userID) {
      filteredURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return filteredURLs;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser };