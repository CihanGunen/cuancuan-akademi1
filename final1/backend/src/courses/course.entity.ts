import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { Lesson } from '../lessons/lesson.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // ManyToOne ilişkisinde User tipini açıkça belirtelim
  @ManyToOne(() => User, (user) => user.id)
  instructor: User;

  @OneToMany('Lesson', (lesson: Lesson) => lesson.course)
  lessons: Lesson[];

  @ManyToMany('User', 'enrolledCourses')
  @JoinTable()
  students: User[];
}