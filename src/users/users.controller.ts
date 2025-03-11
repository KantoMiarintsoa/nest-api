import { Body, Controller, Get, Post, Req, UseGuards, Put, Delete, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUSerDto } from './dto/register.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDTO } from './dto/update-user-dto';
import { DesactiveUserDTO } from './dto/desactive-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) { }

    @Post("register")
    async register(
        @Body() data: RegisterUSerDto
    ) {
        return await this.userService.createUser(data)
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async me(
        @Req() req: { user: { id: number } }
    ) {
        return await this.userService.findById(req.user.id)
    }

    @Put("update")
    @UseGuards(AuthGuard)
    async updateUSer(
        @Req() req: { user: { id: number } },
        @Body() data: UpdateUserDTO
    ) {
        return await this.userService.updateUser(req.user.id, data)
    }

    @Delete('delete')
    @UseGuards(AuthGuard)
    async deleteUser(
        @Req() req: { user: { id: number } }
    ) {
        return await this.userService.deleteUser(req.user.id)
    }

    @Patch('id:/desactive')
    async desactiveUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: DesactiveUserDTO
    ) {
        return await this.userService.desactiveUser(id, Boolean(data.isActive))
    }


}
