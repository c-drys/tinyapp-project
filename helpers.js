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
      return user;
    }
  }
  return {};
};

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

module.exports = { generateRandomString, getUserByEmail, urlsForUser}