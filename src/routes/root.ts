import { Request, Response } from "express";

// this is the root route handler function
export function root(request: Request, response: Response){

    response.status(200).send("<h1>Express server is up and running</h1>");

}