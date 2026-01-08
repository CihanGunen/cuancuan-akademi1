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
      // Render'daki DATABASE_URL'i okuması için url parametresini kullanıyoruz
      url: process.env.DATABASE_URL || 'postgres://postgres:12345@localhost:5432/final_proje',
      entities: [User, Course, Lesson],
      synchronize: true, // Geliştirme aşamasında tabloları otomatik oluşturur
      // Render PostgreSQL bağlantısı için gerekli SSL ayarı
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
      extra: process.env.DATABASE_URL ? {
        ssl: {
          rejectUnauthorized: false,
        },
      } : {},
    }),
    UsersModule,
    CoursesModule,
    LessonsModule,
    AuthModule,
  ],
})
export class AppModule {}
