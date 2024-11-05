import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // Import ScheduleModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AssetsModule } from './assets/assets.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PriceModule } from './price/price.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Set up ScheduleModule to enable cron jobs
    ConfigModule.forRoot({ isGlobal: true }), // Ensure ConfigModule is global
    AuthModule,
    AssetsModule,
    PortfolioModule,
    PriceModule,
    UserModule,
  ],
  controllers: [AppController], // Removed AuthController since it's in AuthModule
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes('assets', 'portfolio');
  }
}