import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AssetsModule } from './assets/assets.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [AuthModule, AssetsModule, PortfolioModule, PriceModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
