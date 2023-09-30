import { Body, Controller, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { JwtGuard } from '../utils/guards/jwt.guard';
import { TowFaDto } from '../utils/dtos/two-fa.dto';

@Controller('auth/twofa')
export class TwoFaController {
  constructor(private readonly twoFaService: TwoFaService) {}



  @Get('generate/:userId')
  @UseGuards(JwtGuard)
  async generateTwoFa(@Param('userId') userId: number): Promise<any> {

      const secretKey = await this.twoFaService.generateTwoFa(userId);
      return secretKey;
    
  }

  @Post('enable/:userId')
  @UseGuards(JwtGuard)
  async enableTwoFa(@Param('userId') userId: number, @Body() towFaDto: TowFaDto): Promise<any> {

      const enabled = await this.twoFaService.enableTwoFa(userId, towFaDto.userToken);
      return enabled;
    
  }
  
  @Post('validate/:userId')
  @UseGuards(JwtGuard)
  async validateTwoFa(@Param('userId') userId: number, @Body() towFaDto: TowFaDto): Promise<any> {
    
    const validated = await this.twoFaService.validateTwoFa(userId, towFaDto.userToken);
    return validated;
    
  }
  
  @Get('disable/:userId')
  @UseGuards(JwtGuard)
  async disableTwoFa(@Param('userId') userId: number): Promise<any> {

      const disabled = await this.twoFaService.disableTwoFa(userId);
      return disabled;
    
  }
}
