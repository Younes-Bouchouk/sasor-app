import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/AuthUser';

@Controller('follows')
export class FollowsController {
    constructor(private readonly followsService: FollowsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('me')
    create(
        @Body() createFollowDto: CreateFollowDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.followsService.create(createFollowDto, req.user);
    }

    @Get()
    findAll() {
        return this.followsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.followsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
        return this.followsService.update(+id, updateFollowDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.followsService.remove(+id);
    }
}
