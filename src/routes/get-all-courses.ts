import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";

// our endpoint
// if we want our express request to be passed on to the next middleware or endpoint
// we pass the NextFunction
export async function getAllCourses(request: Request, response: Response, next:NextFunction){

    // we wrap in a try catch block to handle errors in async function call
    try {

        logger.debug(`Called getAllCourses()`);

        // uncomment this to put to work the error handling mechanism
        // and trigger the last middleware in the setUpExpress() in server.ts
        // throw {error: "Thrown Error!"};
    
        const courses = await AppDataSource
        .getRepository(Course)
        .createQueryBuilder("courses")
        // one to many relationships are not eager loaded by default
        // so we need to add the next call
        // this next line will load all lessons associated with the courses
        // .leftJoinAndSelect("courses.lessons", "LESSONS")
        .orderBy("courses.seqNo")
        .getMany(); // returns an array of courses
    
    
        response.status(200).json({courses});
    
    } catch (error) {
        logger.error(`Error calling getAllCourses()`);
        return next(error);
    }

 
}