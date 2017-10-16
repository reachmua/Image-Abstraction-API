Image Abstraction Node.js API.

This app uses a simple MongoDB and static `express` server.

## Running the server 

1) Open `app.js` and start the Mongo server with: 
    `$ ./mongod`

2) You can launch the app from the Terminal:
    Then run `app.js` in the terminal with: `node app.js`

3) Use Cases:
    i.) Get the image URLs for a set of images relating to a given search string <searchValue>.
        `localhost/<port>/api/imagesearch/:searchValue`.
    
    ii.) Get a list of the most recently submitted search strings.
        `localhost/<port>/api/imagesearch/searchHistory`.