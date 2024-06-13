npm install to install all the dependencies

copy the contents of .env.copy into .env

The username and the password must be hasded you can do this by using the crypto function found in ./functions/cypto.js file.
You can uncomment the lines {blow the password needs to be hashed} comment once done put in your username is the pass variable and run node ./functions/cypto.js. It shoud give you a 16 bit hased code so the same for the db password and put  them both respectively on the .env file.

For the acess and secret token use the command node -e "console.log(require('crypto').randomBytes(64).toString('hex'));" in your terminal which shall give you a 64 bit code and put the code in the acess token and do the same again and put in in the refresh token.

The PORT is for the server port on which you  want too run the code