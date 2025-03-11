import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DesactiveUserDTO } from 'src/users/dto/desactive-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private atuhService: AuthService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() data: Record<string, any>) {
        return this.atuhService.login(data.email, data.password)
    }
}
