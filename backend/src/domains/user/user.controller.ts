import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/*
    Ce fichier contient le CRUD (Create, Read, Update, Delete) de la table User
    Chacune de ces actions fait appel à une fonction du fichier "user.service.ts"
*/

@Controller('user')
export class UserController {

    // Définition de la variable "userService" qui regroupe toutes les fonctions présentes dans le fichier "user.service.ts"
    constructor(private readonly userService: UserService) {}


    // Cette route permet de créer un nouvelle utilisateur dans la table User
    @Post()
    create(@Body() createUserDto: CreateUserDto) { 
        return this.userService.create(createUserDto);
    }

    // Cette route permet de récupérer toutes les infos de tous les utilisateurs dans la table User
    @Get()
    findAll() { 
        return this.userService.findAll();
    }

    // Cette route permet de récupérer les infos d'un seul utilisateur, à partir de son id, dans la table User
    @Get(':id')
    findOne(@Param('id') id: string) { 
        return this.userService.findOne(+id);
    }

    // Cette route permet de modifier les infos d'un utilisateur, à partir de son id, dans la table User
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    // Cette route permet de supprimer un utilisateur, à partir de son id, dans la table User
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}
