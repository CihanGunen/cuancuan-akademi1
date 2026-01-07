import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() courseData: any) {
    const { instructorId, ...data } = courseData;
    return this.coursesService.create(data, { id: instructorId });
  }

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }
  @Get(':id')
async findOne(@Param('id') id: string) {
  // Console'daki 404 hatasını bu metod çözecek
  return this.coursesService.findOne(+id);
}

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.coursesService.update(+id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }

  @Post(':id/enroll')
  async enroll(@Param('id') id: string, @Body('userId') userId: number) {
    return this.coursesService.enroll(+id, userId);
  }

  @Post(':id/unenroll')
  async unenroll(@Param('id') id: string, @Body('userId') userId: number) {
    return this.coursesService.unenroll(+id, userId);
  }
}