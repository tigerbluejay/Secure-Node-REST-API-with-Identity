import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Lesson } from "./lesson";

@Entity({
    name: "COURSES" // name of db table
})

export class Course {

    @PrimaryGeneratedColumn() // makes id a primary key
    id:number;
    
    @Column()
    seqNo:number;

    @Column()
    url:string;
    
    @Column()
    title:string;
    
    @Column()
    iconUrl:string;
    
    @Column()
    longDescription:string;
    
    @Column()
    category:string;

    @CreateDateColumn() // This should be filled in at entity creation time
    createdAt:Date;

    @UpdateDateColumn() // This should be updated every time the entity is updated
    lastUpdatedAt:Date;

    // a given course belongs to many lessons
    @OneToMany(() => Lesson, lesson => lesson.course)
    lessons: Lesson[];
}