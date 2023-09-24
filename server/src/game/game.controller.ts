import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/utils/guards/jwt.guard';
import { GameService } from './game.service';

@Controller('game')
export class GameController {

  constructor(private readonly gameService: GameService) {}

    @Get("history")
    @UseGuards(JwtGuard)
    getMatchHistory() {
        return this.temporariusService.getMatchHistory();
    }
}
