import { Module } from '@nestjs/common';

import { DateTimeScalar } from './scalars/date-time.scalar';

@Module({
  providers: [DateTimeScalar],
})
export class CommonModule {}
