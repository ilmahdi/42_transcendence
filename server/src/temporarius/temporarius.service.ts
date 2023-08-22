import { Injectable } from '@nestjs/common';
import { CreateTemporariusDto } from './utils/dto/create-temporarius.dto';
import { UpdateTemporariusDto } from './utils/dto/update-temporarius.dto';
import { IHistory } from './utils/interfaces/history.interface';

@Injectable()
export class TemporariusService {

  getMatchHistory() {
      const matchs : IHistory[]  = [
        {
          player1: {
          username : "imahdi",
          avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
          rating: 1245,
          score: 9,
          points: 12,
        },
        player2: {
          username : "imahdi",
          avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
          rating: 1245,
          score: 7,
          points: -12,
        },
        date : new Date(),
        duration : {
          min: 1,
          sec: 10,
        },
      },
        {
          player1: {
          username : "imahdi",
          avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
          rating: 1245,
          score: 7,
          points: -12,
        },
        player2: {
          username : "imahdi",
          avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
          rating: 1245,
          score: 9,
          points: 12,
        },
        date : new Date(),
        duration : {
          min: 1,
          sec: 10,
        },
      },
        {
          player1: {
          username : "imahdi",
          avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
          rating: 1245,
          score: +9,
          points: 12,
        },
        player2: {
          username : "imahdi",
          avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
          rating: 1245,
          score: 7,
          points: -12,
        },
        date : new Date(),
        duration : {
          min: 1,
          sec: 10,
        },
      },
      
    ];
    return matchs;
  }
}
