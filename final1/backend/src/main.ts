import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <--- Bu satırı ekledik, frontend erişebilsin diye.
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();