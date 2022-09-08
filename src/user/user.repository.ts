import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { MongooseCommonRepository } from '@/common/repository/mongoose-common.repository';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserRepository extends MongooseCommonRepository<UserDocument, CreateUserDto> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async findOneByUserId(userId: string) {
    return this.userModel.findOne({ userId });
  }

  async updateRefreshToken(id: ObjectId, refreshToken: string | null) {
    return this.userModel.findByIdAndUpdate(id, { refreshToken }, { new: true });
  }
}
