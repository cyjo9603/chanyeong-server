import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from '../config/configuration';
import { directiveCombiner } from './common/directives/directive-combiner';
import { filterConvertDirectiveTransformer } from './common/directives/filter-convert.directive';
import { sortConvertDirectiveTransformer } from './common/directives/sort-convert.directive';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleResolver } from './sample/sample.resolver';
import { SampleModule } from './sample/sample.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommonModule } from './common/common.module';
import { DirectiveLocation, GraphQLDirective } from 'graphql';

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
      context: (ctx) => ({ ...ctx }),
      transformSchema: (schema) =>
        directiveCombiner(schema, [
          { name: 'filterConvert', transformer: filterConvertDirectiveTransformer },
          { name: 'sortConvert', transformer: sortConvertDirectiveTransformer },
        ]),
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'filterConvert',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
          new GraphQLDirective({
            name: 'sortConvert',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      definitions: {
        customScalarTypeMapping: {
          DateTime: 'Date',
        },
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
      }),
      inject: [ConfigService],
    }),
    SampleModule,
    CommonModule,
    UserModule,
    AuthModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, SampleResolver],
})
export class AppModule {}
