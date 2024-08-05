export class ValidationErrorResponseDto {
  /**
   * Error messages for each failing field
   */
  messages: string[];
  /** Short error message */
  error: string;

  /** Status code  */
  statusCode: number = 400;
}
