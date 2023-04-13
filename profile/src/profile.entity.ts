import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  number: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;
  //
  // @Column({ type: 'numeric', unique: true, nullable: false })
  // userId: number;
}
