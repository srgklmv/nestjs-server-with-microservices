import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  //can be email also
  @Column({type: "varchar", length: 20, unique: true, nullable: false})
  login: string;

  @Column({type: "varchar", nullable: false})
  password: string;
  //
  // @Column({type: 'numeric', nullable: false, unique: true })
  // profileId: number;
}