import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TemporariusService } from './temporarius.service';
import { CreateTemporariusDto } from './utils/dto/create-temporarius.dto';
import { UpdateTemporariusDto } from './utils/dto/update-temporarius.dto';
import { JwtGuard } from 'src/auth/utils/guards/jwt.guard';

@Controller('tmp')
export class TemporariusController {
  constructor(private readonly temporariusService: TemporariusService) {}


  @Get("history")
  @UseGuards(JwtGuard)
  getMatchHistory() {
    return this.temporariusService.getMatchHistory();
  }

}
