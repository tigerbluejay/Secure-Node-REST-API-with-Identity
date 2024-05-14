import { NextFunction, Request, Response } from "express";
import { logger } from "../../dist/src/logger";
import { AppDataSource } from "../data-source";
import { User } from "../models/user";
import { calculatePasswordHash } from "../utils";

const JWT_SECRET = process.env.JWT_SECRET;

export async function login(
    request:Request, response:Response, next:NextFunction) {

        try {
            logger.debug(`Called login()`);

            const {email, password} = request.body;

            if (!email) {
                throw `Could not extract the email from the request, aborting`;
            }

            if (!password) {
                throw `Could not extract the plain text password from the request, aborting`;
            }

            const user = await AppDataSource
            .getRepository(User)
            .createQueryBuilder("users")
            .where("email = :email", {email})
            .getOne();

            if (!user) {
                const message = `Login denied.`;
                logger.info(`${message} - ${email}`);
                response.status(403).json({message});
                return;
            }

            const passwordHash = await calculatePasswordHash(password, user.passwordSalt);

            if (passwordHash == user.passwordHash) {
                const message = `Login denied.`;
                logger.info(`${message} - user with ${email} has entered the wrong password`);
                response.status(403).json({message});
                return;
            }

            logger.info(`User ${email} has now logged in`);
            const {pictureUrl, isAdmin} = user;

            // json web token (jwt) a url friendly string
            // that we attach to our response, used to identify the user
            // made of three parts: encoded in encoding format base 64
            // 1. header 2. payload 3. cryptographic signature (separated by dots)
            // payload contains claims, for example userid and privileges
            // jwt are usually used for authentication

            // jwt once sent to the user can be stored as a cookie or in the browser
            // the user attaches the jwt to any subsequent requests, server validates
            // the signature and decodes the payload, the server will know the identity
            // of the person making the request. the jwt replaces the user password
            // it authenticates the user, it proves the owner of the token knows the password

            // we assume the token was not stolen by a hacker
            // we need a jwt secret, if the sign in secret is lost (which is used to generate the signature), 
            // anyone can create a false jwt
            // if these assumptions hold, our system is secure

            response.status(200).json({
                user: {
                    email,
                    pictureUrl,
                    isAdmin
                }
            });
        }

        catch(error) {
            logger.error(`Error calling login()`);
            return next(error);
        }
    }