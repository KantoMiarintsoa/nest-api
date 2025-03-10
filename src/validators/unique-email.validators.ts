import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "src/common/prisma.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueEmailConstraint implements ValidatorConstraintInterface {
    constructor(private prisma: PrismaService) { }

    async validate(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })

        return !user
    }
}

export function UniqueEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueEmailConstraint
        })
    }
}