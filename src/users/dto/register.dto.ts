import { IsString } from "class-validator";

export class RegisterUSerDto {
    @IsString()
    firstName: string


}