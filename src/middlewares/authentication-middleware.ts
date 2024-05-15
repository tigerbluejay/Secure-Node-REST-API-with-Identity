import {NextFunction, Request, Response} from "express";
import { logger } from "../logger";

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export function checkIfAuthenticated(
    request: Request, response: Response, next: NextFunction
) {
    //recover the token from the request
    // information about who made the request
    const authJwtToken = request.headers.authorization;

    // if no information in the request, deny the request
    if (!authJwtToken) {
        logger.info(`The authentication JWT is not present, access denied`);
        response.sendStatus(403); // send a status to the client (forbidden)
        return; // early exit from middleware
    }
    
    checkJwtValidity(authJwtToken) // this will return a promise
    .then(user => { // we will be receiving the user profile
        logger.info(`Authentication JWT successfully decoded`, user);
        request["user"] = user; // store the user profile in the request's user property
        // this way the profile can be retrieved by the rest of the middleware chain
        next(); // proceed with the next middleware
    })
    .catch(err => {
        logger.error(`Could not validate the authentication JWT, access denied`, err);
        response.sendStatus(403);
    });
}

async function checkJwtValidity(authJwtToken:string) { // authentication json web token as input
    const user = await jwt.verify(authJwtToken, JWT_SECRET); // user will be the json web token payload if verified
    logger.info("Found user details in JWT:", user);
    return user; // return the user profile (the userId and isAdmin flag included)
}