import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async login(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email)

        if (!user) {
            throw new NotFoundException({
                message: "user not found"
            })
        }

        console.log(pass)
        const passwordMatch = await this.userService.passwordMatch(user.password, pass)

        if (!passwordMatch) {
            throw new UnauthorizedException();
        }


        const payload = { id: user.id, email: user.email }
        return {
            access_token: await this.jwtService.signAsync(payload, {
                secret: process.env.SECRET
            }),
            uer: {
                name: user.name,
                email: user.email
            }
        }
    }
}