import { IsEmail, IsString, Length } from "class-validator";

export class RegisterUSerDto {
    @IsString()
    name: string

    @IsString()
    @IsEmail({}, { message: "invalid email address" })
    email: string

    @IsString()
    @Length(6, undefined, { message: "Password must be between 6 and 20 characters" })
    password: string
}

