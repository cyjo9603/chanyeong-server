import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleResolver } from './sample/sample.resolver';
import { SampleModule } from './sample/sample.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
    }),
    SampleModule,
  ],
  controllers: [AppController],
  providers: [AppService, SampleResolver],
})
export class AppModule {}
