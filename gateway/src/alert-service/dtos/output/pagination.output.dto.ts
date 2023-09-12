import { ApiProperty } from '@nestjs/swagger';

export class PaginationOutputDto {
  @ApiProperty({
    type: Array<any>,
    description: 'list of items',
    default: [],
  })
  result: any[];

  @ApiProperty({
    type: Number,
    description: 'total number of items',
    default: 0,
  })
  total: number;
}
