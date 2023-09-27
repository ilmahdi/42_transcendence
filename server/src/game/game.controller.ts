import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/utils/guards/jwt.guard';
import { GameService } from './game.service';

@Controller('game')
export class GameController {

  constructor(private readonly gameService: GameService) {}

    @Get("history/:userId")
    @UseGuards(JwtGuard)
    async getMatchHistory(@Param('userId') userId: number) {
      const formattedMatches = await this.gameService.getMatchHistory(userId);

      return formattedMatches;
    }
}
