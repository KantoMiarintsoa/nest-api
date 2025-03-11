import { IsEmail, IsString, Length } from "class-validator";
import { UniqueEmail } from "src/validators/unique-email.validators";

export class RegisterUSerDto {
    @IsString()
    name: string

    @IsString()
    @IsEmail({}, { message: "invalid email address" })
    @UniqueEmail()
    email: string

    @IsString()
    @Length(6, undefined, { message: "Password must be between 6 characters" })
    password: string
}

