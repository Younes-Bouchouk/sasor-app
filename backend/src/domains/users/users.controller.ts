import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Parcourir les utilisateurs
    @Get()
    findAll() { 
        return this.usersService.findAll();
    }

    // Voir mon compte
    @Get('me')
    findMe() {
        return this.usersService.findMe();
    }

    // Voir un seul utilisateur
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    // Mettre à jour les infos du compte
    @Patch('me')
    async update(@Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.update(updateUserDto);
    }

    // Supprimer mon compte
    @Delete('me')
    remove() {
        return this.usersService.remove();
    }
}
