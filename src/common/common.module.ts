import { Module } from '@nestjs/common';

import { DateTimeScalar } from './scalars/date-time.scalar';
import { ObjectIdScalar } from './scalars/mongo-object-id.scalar';

@Module({
  providers: [DateTimeScalar, ObjectIdScalar],
})
export class CommonModule {}
