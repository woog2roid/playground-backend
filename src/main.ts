import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://woog2roid.github.io',
      'https://service.woog2roid.dev',
      'https://todo.woog2roid.dev',
      //goorm dev 환경
      'https://mil-frontend-tcuwk.run.goorm.io',
    ],
    credentials: true,
  });

  app.use(cookieParser());

  const config = new DocumentBuilder().setTitle('Playground API').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`server listening on port ${PORT}`);
}
bootstrap();
