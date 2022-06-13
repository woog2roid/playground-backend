import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

import fs from 'fs';

declare const module: any;

async function bootstrap() {
  const httpsOptions =
    process.env.NODE_ENV === 'production'
      ? {
          key: fs.readFileSync(process.env.PRIVKEY, 'utf8'),
          cert: fs.readFileSync(process.env.CERT, 'utf8'),
          ca: fs.readFileSync(process.env.CA, 'utf8'),
        }
      : undefined;

  const app = httpsOptions
    ? await NestFactory.create(AppModule, {
        httpsOptions,
      })
    : await NestFactory.create(AppModule);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: [process.env.CORS_PROD, process.env.CORS_DEV],
    credentials: true,
  });

  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_COOKIE_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle('Playground API')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`server listening on port ${PORT}`);
}

bootstrap();
