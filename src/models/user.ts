import {Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({
    name: "USERS"
})

export class User {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email:string;

    @Column()
    passwordHash:string; // the password is not saved to the db, instead the hash is saved to the db

    @Column()
    passwordSalt:string; // used to calculate the passwordHash

    @Column()
    pictureUrl:string;

    @Column()
    isAdmin:boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    lastUpdatedAt: Date;


}