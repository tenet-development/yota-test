import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const options = new DocumentBuilder()
    .setTitle('CS')
    .setDescription('CS Component API description')
    .setVersion('0.0.1')
    .addTag('cs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);  

  app.enableShutdownHooks();

  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
