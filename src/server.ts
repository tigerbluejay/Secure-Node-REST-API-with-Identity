import * as dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
    console.log(`Error loading environment variables, aborting`);
    process.exit(1);
}

console.log(process.env.PORT);

// SERVER
import "reflect-metadata"; // must import it first before importing anything else from typeorm
import * as express from 'express';
import {root} from "./routes/root";
import { isInteger } from './utils';
import { logger } from "./logger";
import { AppDataSource } from "./data-source";
import { getAllCourses } from "./routes/get-all-courses";
import { defaultErrorHandler } from "./middlewares/default-error-handler";
import { findCourseByUrl } from "./routes/find-course-by-url";
import { findLessonsForCourse } from "./routes/find-lessons-for-course";
import { updateCourse } from "./routes/update-course";
import { createCourse } from "./routes/create-course";
import { deleteCourseAndLessons } from "./routes/delete-course";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { checkIfAuthenticated } from "./middlewares/authentication-middleware";

const cors = require("cors"); // import the cors package
const bodyParser = require("body-parser"); // import the body-parser package

const app = express(); // initialize express


// setting up express routes and middleware
// from endpoints to authentication and authorization behavior
function setupExpress() {

    // middleware: add the cross origin header that tells the browser to accept cross origin requests
    // delegates the execution of the request to the next item on the middleware chain.
    app.use(cors({origin:true}));

    app.use(bodyParser.json()); // with json middleware of body parser the body of the message of the request
                                // is considered valid json, so the middleware is going to call json.parse
                                // and assign it to the request body

    // first express endpoint or route
    // a mapping between a request, a url, and a function
    app.route("/").get(root);

    // second endpoint points to the specified route
    // handles get requests by calling the getAllCourses function
    // app.route("/api/courses").get(getAllCourses);

    // if checkIfAuthenticated can't find a valid jwt token linked to a known user attached to a request
    // getAllCourses is not going to be called
    app.route("/api/courses").get(checkIfAuthenticated, getAllCourses);

    app.route("/api/courses/:courseUrl").get(checkIfAuthenticated, findCourseByUrl);

    app.route("/api/courses/:courseId/lessons").get(checkIfAuthenticated, findLessonsForCourse);

    app.route("/api/courses/:courseId").patch(checkIfAuthenticated, updateCourse);

    app.route("/api/courses").post(checkIfAuthenticated, createCourse);

    app.route("/api/courses/:courseId").delete(checkIfAuthenticated, deleteCourseAndLessons);

    app.route("/api/users").post(checkIfAuthenticated, createUser);

    app.route("/api/login").post(login);

    // last link in the middleware chain
    // this will only work if we used the NextFunction in getAllCourses call
    app.use(defaultErrorHandler);

}

// startup logic that launches the server
function startServer() {

    let port: number;

    const portEnv = process.env.PORT,
    portArg = process.argv[2];
    // the argv array contains the parameters of the process starting at the third element of the
    // array so [2], in position [0] we find the node process that is running, 
    // in position [1] we find the script that we are running
    

    // we first give precedence to environment port variable
    if (isInteger(portEnv)) {
      port = parseInt(portEnv);
    }

    // if none set, we give precedence to argument port variable
    if (!port && isInteger(portArg)) {
      port = parseInt(portArg);
    }

    // if none set, we set the port variable to 9000
    if (!port) {
      port = 9000;
    }

    app.listen(port, () => {
        // console.log(`HTTP REST API Server is now running at http://localhost:${port}`);
        logger.info(`HTTP REST API Server is now running at http://localhost:${port}`);

    })
}


AppDataSource.initialize()
.then(() => {
  logger.info(`The datasource has been initialized successfully`);
  setupExpress();
  startServer();
  })
  .catch(err => {
    logger.info(`Error during datasource initialization`);
    process.exit(1);
  })


/* package.json notes */
/*
"scripts": {
    // calls rimraft and cleans the dist folder
    "clean": "rimraf dist",
    // build a new version of our server
    "build": "tsc", 
    // run node in production without hot reloading
    "start-server": "node dist/server.js",
    // run node in development with hot reloading
    // when a file chnages launch the escaped path
    "start-dev-server": "tsc-watch --onSuccess \"node ./dist/server.js\"",
    // sequence of scripts we want to execute
    "dev": "npm-run-all clean build start-dev-server"
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@types/express": "^4.17.21",
    "npm-run-all": "^4.1.5", // allows you to run packages in sequence and in parallel
    "tsc-watch": "^6.2.0", // watches your ts project and if you change any of the files, it triggers a brand new build
    "typescript": "^5.4.5"
  },
  "dependencies": {
    "express": "^4.19.2",
    "rimraf": "^5.0.5" // completely clean the dist folder at the beginning of the build process
  }
*/