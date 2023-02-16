import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class ValidateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  readonly password: string;
}
