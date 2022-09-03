import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { AllowNamespaceValidationPipe } from './types/pipes/namespace.validate.pipe';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => String)
  async uploadImage(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @Args('namespace', { type: () => String }, AllowNamespaceValidationPipe) namespace: string,
  ) {
    return this.uploadService.upload(file, namespace);
  }
}
