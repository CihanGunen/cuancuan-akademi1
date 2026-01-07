import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Course } from './courses/course.entity';
import { Lesson } from './lessons/lesson.entity';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345', // Senin şifren
      database: 'final_proje', // pgAdmin'de az önce oluşturduğumuz isim
      entities: [User, Course, Lesson],
      synchronize: true, // Bu true olduğu için tabloları kendi oluşturacak
    }),
    UsersModule,
    CoursesModule,
    LessonsModule,
    AuthModule,
  ],
})
export class AppModule {}