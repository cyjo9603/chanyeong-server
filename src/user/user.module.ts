import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: User.name,
          useFactory: () => {
            const schema = UserSchema;

            schema.pre('save', function (next) {
              if (this.isModified('password') || this.isNew) {
                this.password = UserService.hashPassword(this.password);
              }

              next();
            });

            return schema;
          },
        },
      ],
      'blog',
    ),
  ],
  providers: [UserService],
})
export class UserModule {}
