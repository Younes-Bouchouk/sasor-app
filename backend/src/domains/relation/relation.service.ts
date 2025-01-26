import { Injectable } from '@nestjs/common';
import { CreateRelationDto } from './dto/create-relation.dto';
import { UpdateRelationDto } from './dto/update-relation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelationService {
    constructor(private readonly prisma: PrismaService) {}

    create(createRelationDto: CreateRelationDto) {
        return this.prisma.relation.create({
            data: createRelationDto
        });
    }

    findAll() {
        return this.prisma.relation.findMany();
    }

    findOne(id: number) {
        return this.prisma.relation.findUnique({
            where: { id }
        });
    }

    update(id: number, updateRelationDto: UpdateRelationDto) {
        return this.prisma.relation.update({
            where: { id },
            data: updateRelationDto
        });
    }

    remove(id: number) {
        return this.prisma.relation.delete({
            where: { id }
        });
    }
}
