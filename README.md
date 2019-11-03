                                                                                                      # tinyapp-project
                                                                                            LHL: W3: tinyApp Assignment

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Login Page"](https://github.com/drystar/tinyapp-project/blob/master/docs/login.png?raw=true)
!["Create shortURL Page"](https://github.com/drystar/tinyapp-project/blob/master/docs/create-new-url.png?raw=true)
!["My URLs Page"](https://github.com/drystar/tinyapp-project/blob/master/docs/my-urls.png?raw=true)

## Dependencies

- Node.js
- Express ^4.17.1
- EJS ^2.7.1
- bcrypt 2.0.0
- body-parser 1.19.0
- cookie-session ^1.3.3

## Dev Dependencies

- chai ^4.2.0
- eslint ^6.6.0
- mocha ^6.2.2
- nodemon ^1.19.4


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Available on localhost: 5000

## Using the App

- Registration required to access app features
- Login is required 
- User can click 'create new URL' in header
- User can submit as many new URLs as desired, each will be stored in their personal log accessed via "My URLs" in header
- User's can edit/ delete their own URLs 
- User's can share their short URLs with others to utilise
- Log out via the button in the header
- User's URLs will be stored in the database for future reference 
