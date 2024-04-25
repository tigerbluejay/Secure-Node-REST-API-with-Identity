import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import { Course } from "./course";

@Entity({
    name: "LESSONS"
})

export class Lesson {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    duration:string;

    @Column()
    seqNo:number;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    lastUpdatedAt:Date;

    // a given lesson belongs to only one given course
    @ManyToOne(() => Course, course =>  course.lessons)
    @JoinColumn({
        name: "courseId" //foreign key
    })
    course:Course;
}