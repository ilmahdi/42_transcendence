import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SocketAdapter } from './chat/utils/dtos/socketAdapter.class';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    
  });
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  app.enableCors({
    origin: process.env.FONTEND_URL,
  });
  await app.listen(3000);
}
bootstrap();
