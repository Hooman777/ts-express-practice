import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model<User> {

    @Column({
        type: DataType.STRING
    })
    name: string;

    @Column({
        type: DataType.STRING
    })
    email: string;

    @Column({
        type: DataType.STRING
    })
    username: string;

    @Column({
        type: DataType.STRING
    })
    password: string;
}
