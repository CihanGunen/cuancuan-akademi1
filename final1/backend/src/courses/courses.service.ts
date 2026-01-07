import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(courseData: any, user: Partial<User>): Promise<Course> {
    const newCourse = new Course();
    newCourse.title = courseData.title;
    newCourse.description = courseData.description;
    newCourse.instructor = user as User;
    return await this.coursesRepository.save(newCourse);
  }

  async findAll(): Promise<Course[]> {
    return await this.coursesRepository.find({
      relations: ['instructor', 'students'],
    });
  }
  

  // Yeni: Tek bir kursun detayını getirme
  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['instructor', 'students'],
    });
    if (!course) throw new NotFoundException('Kurs bulunamadı');
    return course;
  }

  async update(id: number, updateData: any): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Kurs bulunamadı');
    
    await this.coursesRepository.update(id, updateData);
    const updated = await this.coursesRepository.findOne({ where: { id }, relations: ['instructor'] });
    if (!updated) throw new NotFoundException('Güncelleme hatası');
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.coursesRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Silinecek kurs bulunamadı');
  }

  async enroll(courseId: number, userId: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { id: courseId }, relations: ['students'] });
    if (!course) throw new NotFoundException('Kurs bulunamadı');

    if (!course.students.some(s => s.id === userId)) {
      course.students.push({ id: userId } as User);
    }
    return await this.coursesRepository.save(course);
  }

  async unenroll(courseId: number, userId: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { id: courseId }, relations: ['students'] });
    if (!course) throw new NotFoundException('Kurs bulunamadı');

    course.students = course.students.filter((s) => s.id !== userId);
    return await this.coursesRepository.save(course);
  }
}