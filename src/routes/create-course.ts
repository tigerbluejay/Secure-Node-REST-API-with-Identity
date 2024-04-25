import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";


export async function createCourse(
    request:Request, response:Response, next:NextFunction) {

        try {
            logger.debug(`Called createCourse()`);
            
            const data = request.body;

            if (!data) {
                throw `No data available, cannot save course.`;
            }

            const course = await AppDataSource.manager.transaction(
                "REPEATABLE READ", // with this configuration any reads of the db table
                                   // will have to wait for the current transaction to complete
                                   // until the transaction commits or rolls back in order to
                                   // update the sequential number.
                                   // this avoids concurrency problems that could result in courses
                                   // created with the same seqNo
                    async (transactionalEntityManager) => {

                        const repository = transactionalEntityManager.getRepository(Course);
                        
                        const result = await repository
                            .createQueryBuilder("courses")
                            .select("MAX(courses.seqNo)", "max")
                            .getRawOne();

                        const course = repository
                            .create({
                                ...data,
                                seqNo: (result?.max ?? 0) + 1
                            });
                        
                        await repository.save(course);

                        return course;
                    }
            );

            response.status(200).json({course})


        }
        catch(error) {
            logger.error(`Error calling createCourse()`);
            return next(error);
        }

    }

    /* To test this endpoint in the terminal: 
    Invoke-WebRequest -Method POST http://localhost:9003/api/courses -ContentType "application/json" 
    -Body '{"url": "firebase-bootcamp", "title": "Firebase Bootcamp", "iconUrl": 
    "https://angular-university.s3-us-west-1.amazonaws.com/course-images/firebase-course-1.jpg", 
    "longDescription": "Complete Guided Tour to the Firebase Ecosystem.", "category": "BEGINNER"}'
    */