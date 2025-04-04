import { IsEmail, IsStrongPassword } from 'class-validator';
// import "class-validator/types/decorator/string/IsEmail"; // Ensure proper type inference
// import "class-validator/types/decorator/string/IsStrongPassword"; // Ensure proper type inference

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
