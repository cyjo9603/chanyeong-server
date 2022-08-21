import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserInput: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserInput);
  }

  async findOneByUserId(userId: string) {
    return this.userModel.findOne({ userId });
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return this.userModel.findByIdAndUpdate(new ObjectId(id), { refreshToken }, { new: true });
  }
}
