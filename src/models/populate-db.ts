import * as dotenv from "dotenv"; // we need the environment variables to connect to the database
const result = dotenv.config();

import "reflect-metadata";  // we need reflect-metadata library available to typeorm
                            // to process the entity's decorators properly

import {COURSES} from "./db-data"; // make use of the data
import { AppDataSource } from "../data-source";
import { Course } from "./course";
import { Lesson } from "./lesson";

import { DeepPartial } from "typeorm";

// POPULATE DB SCRIPT
async function populateDb() {

    await AppDataSource.initialize(); // initialize our postgres data source, this returns a promise
    console.log(`Database connection ready.`);

    const courses = Object.values(COURSES) as DeepPartial<Course>[];

    //Typeorm repository: we can create a new course, delete a course, find a course with given criteria
    // all db operations are possible thanks to repository
    const courseRepository = AppDataSource.getRepository(Course);
    const lessonRepository = AppDataSource.getRepository(Lesson);

    for (let courseData of courses){
        console.log(`Inserting the current course ${courseData.title}`);
        const course = courseRepository.create(courseData);
        await courseRepository.save(course);

        for (let lessonData of courseData.lessons) {
            console.log(`Inserting lesson ${lessonData.title}`);
            const lesson = lessonRepository.create(lessonData);
            lesson.course = course;
            await lessonRepository.save(lesson);
        }
    }

    const totalCourses = await courseRepository
        .createQueryBuilder()
        .getCount();


    const totalLessons = await lessonRepository
        .createQueryBuilder()
        .getCount();


    console.log(`Data inserted - courses ${totalCourses}, lessons ${totalLessons}`);

    } 

populateDb() // function returns a promise, then() executes if the promise executes successfully
    .then(() => {
        console.log(`Finished populating database`);
        process.exit(0); // successful process exit (code 0)
    }) // if the promise is evaluated successfully
    .catch(err => { // in the case of error in the catch callback we receive the err error
        console.error(`Error populating databse,`, err); // log the error object
    })