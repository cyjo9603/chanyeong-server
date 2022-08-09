import { Resolver, Query } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

import { Sample } from './schemas/sample.schema';

@Resolver(() => Sample)
export class SampleResolver {
  constructor(private configService: ConfigService) {}

  @Query(() => Sample)
  sample() {
    const value = this.configService.get('test.b');
    console.log(this.configService.get('test'));
    return { value: value };
  }
}
