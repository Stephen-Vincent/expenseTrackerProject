import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

export class ParsedObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!ObjectId.isValid(value))
      throw new BadRequestException('Validation failed, expected an ObjectId');
    return value;
  }
}
