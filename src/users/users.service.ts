import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { RegisterUSerDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto/update-user-dto';


@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService
    ) { }

    async createUser(data: RegisterUSerDto) {
        const userExist = await this.prisma.user.findUnique({
            where: { email: data.email }
        })

        if (userExist) {
            throw new BadRequestException({ message: 'email already exist' })
        }

        const hashedPassword = await this.hashPassword(data.password)
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            }
        })

    }

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 8)
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.prisma.user.findFirst({
            where: { email: email }
        })
    }

    async passwordMatch(hashedPassword: string | undefined, password: string) {
        return await bcrypt.compare(password, hashedPassword)
    }

    async findById(id: number) {
        return await this.prisma.user.findUnique({
            where: { id: id },
            select: {
                name: true,
                email: true,
                id: true
            }
        })
    }

    async updateUser(id: number, data: UpdateUserDTO) {
        const { password, oldPassword, ...body } = data
        const user = await this.prisma.user.findUnique({
            where: { id: id }
        })

        if (!user) {
            throw new NotFoundException({
                message: "user not found"
            })
        }

        if (password) {
            const passwordValid = await this.passwordMatch(user.password, oldPassword)

            if (passwordValid) {
                body["password"] = await this.hashPassword(password)
            }
            else {
                throw new BadRequestException({
                    message: "password did not match"
                })
            }
        }

        return await this.prisma.user.update({
            where: { id: id },
            data: body,
            select: {
                name: true,
                email: true,
                id: true
            }
        })
    }

    async deleteUser(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: id }
        })

        if (!user) {
            throw new NotFoundException({
                message: "user not found"
            })
        }

        await this.prisma.user.delete({
            where: { id: id }
        })

        return { message: "deleted" }

    }

    async getData(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: id }
        })

        if (!user) {
            throw new NotFoundException({
                message: "user not found"
            })
        }

        return user
    }

    async desactiveUser(userId: number, isActive: boolean) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new NotFoundException({
                message: "user not found"
            })
        }

        return await this.prisma.user.update({
            where: { id: userId },
            data: { isActive }
        })
    }
}