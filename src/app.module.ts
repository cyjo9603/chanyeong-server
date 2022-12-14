import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ObjectId } from 'mongodb';
import { SentryModule } from '@ntegral/nestjs-sentry';

import configuration from '../config/configuration';
import { getRevision } from './common/utils/get-revision';
import { directiveCombiner } from './common/directives/directive-combiner';
import { filterConvertDirectiveTransformer } from './common/directives/filter-convert.directive';
import { sortConvertDirectiveTransformer } from './common/directives/sort-convert.directive';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleResolver } from './sample/sample.resolver';
import { sentryPlugin } from './sentry/sentry.plugin';
import { SampleModule } from './sample/sample.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommonModule } from './common/common.module';
import { TechStackModule } from './tech-stack/tech-stack.module';
import { UploadModule } from './upload/upload.module';
import { ProjectModule } from './project/project.module';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const env = configService.get('env');
        const dsn = configService.get('sentry.dsn');
        const revision = env === 'production' ? getRevision() : undefined;

        return { dsn, release: revision };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
      context: (ctx) => ({ ...ctx, dataloaders: {} }),
      plugins: [sentryPlugin],
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
          ObjectId,
        },
        additionalHeader: "import { ObjectId } from 'mongodb'",
      },
      cors: {
        credentials: true,
        origin: process.env.NODE_ENV !== 'production' ? /chanyeong\.com$/ : true,
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
    TechStackModule,
    UploadModule,
    ProjectModule,
    ExperienceModule,
  ],
  controllers: [AppController],
  providers: [AppService, SampleResolver],
})
export class AppModule {}
