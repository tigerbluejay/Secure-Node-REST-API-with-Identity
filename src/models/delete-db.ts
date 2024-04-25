import * as dotenv from "dotenv";
const result = dotenv.config();

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Lesson } from "./lesson";
import { Course } from "./course";


async function deleteDb() {

    await AppDataSource.initialize()
    console.log(`Database connection ready`);

    console.log(`Clearing LESSONS table`);
    await AppDataSource.getRepository(Lesson).delete({});

    console.log(`Clearing COURSES table`);
    await AppDataSource.getRepository(Course).delete({});


}




deleteDb() // function returns a promise, then() executes if the promise executes successfully
    .then(() => {
        console.log(`Finished deleting database`);
        process.exit(0); // successful process exit (code 0)
    }) // if the promise is evaluated successfully
    .catch(err => { // in the case of error in the catch callback we receive the err error
        console.error(`Error deleting databse,`, err); // log the error object
    })