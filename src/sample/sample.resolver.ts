import { Resolver, Query } from '@nestjs/graphql';

import { Sample } from './schemas/sample.schema';

@Resolver(() => Sample)
export class SampleResolver {
  @Query(() => Sample)
  sample() {
    return { value: 'sample' };
  }
}
