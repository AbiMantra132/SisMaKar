import { Controller, Param, Body, Get, Put, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CompleteProfileDto, UpdateProfileDto } from './dto/index';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async test() {
    return { message: 'Profile service is working' };
  }

  @Get('/:userId')
  async getCompleteProfile(@Param('userId') userId: number): Promise<CompleteProfileDto> {
    userId = Number(userId);
    return this.profileService.getCompleteProfile(userId);
  }

  @Put('/:userId')
  async updateProfile(
    @Param('userId') userId: number,
    @Body() updateData: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    return this.profileService.updateProfile(userId, updateData);
  }

  @Delete('/:userId')
  async deleteProfile(@Param('userId') userId: number): Promise<void> {
    return this.profileService.deleteProfile(userId);
  }
}