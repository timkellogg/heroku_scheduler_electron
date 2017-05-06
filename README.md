# Summary

__**Heroku env scheduler** is a desktop gui that is designed to automate heroku environment variable changes. This is more of a proof of concept and will be remade later into a more production-ready web app so that it's proccesses are not local to a dev machine.__

## Installation

    $ npm install

## Running

Note, you should have the heroku toolbelt installed. You should also retrieve an api key from heroku.

    $ touch .env

    $ echo "HEROKU_API_TOKEN={...}" >> .env

    $ npm start
