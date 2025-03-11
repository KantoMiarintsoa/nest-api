import { IsBoolean } from "class-validator";

export class DesactiveUserDTO {
    @IsBoolean()
    isActive: Boolean
}