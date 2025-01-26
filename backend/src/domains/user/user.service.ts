import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email}
        })

        if (existingUser) { throw new BadRequestException("L'email est déjà utilisé")}
        
        return this.prisma.user.create({
            data: createUserDto,
        });
    }

    findAll() {
        return this.prisma.user.findMany({
            // include: {
            //     followers: {
            //         include: {
            //             following: true
            //         }
            //     },
            //     following: {
            //         include: {
            //             follower: true
            //         }
            //     }
            // }
        });
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
