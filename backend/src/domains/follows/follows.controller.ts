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
import { DeleteFollowDto } from './dto/delete-follow.dto';

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

    @UseGuards(JwtAuthGuard)
    @Get('/me/followers')
    findMyFollowers(@Req() req: AuthenticatedRequest) {
        return this.followsService.findMyFollowers(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/me/following')
    findMyFollowing(@Req() req: AuthenticatedRequest) {
      return this.followsService.findMyFollowing(req.user);
    }

    @Get('/:userId/followers')
    findUserFollowers(@Param('userId')userId:string) {
      return this.followsService.findUserFollowers(+userId);
    }
    
    @Get('/:userId/following')
    findUserFollowing(@Param('userId')userId:string ) {
      return this.followsService.findUserFollowing(+userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('me')
    unfollow (@Body() deleteFollowDto: DeleteFollowDto,@Req() req: AuthenticatedRequest) {
        return this.followsService.remove(deleteFollowDto, req.user);
    }
}
