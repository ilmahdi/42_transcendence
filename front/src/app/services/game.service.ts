import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  public maps = [
    {
      id: 1,
      name: 'Map 3',
      boardColor: '#000',
      ballColor: '#ED5252',
      paddleColor: '#DEC8C8',
      objColor: '#DEC8C8',
    },
    {
      id: 2,
      name: 'Map 2',
      boardColor: '#DEC8C8',
      ballColor: '#ED5252',
      paddleColor: '#000',
      objColor: '#000',
    },
    {
      id: 3,
      name: 'Map 1',
      boardColor: '#D38146',
      ballColor: '#DEC8C8',
      paddleColor: '#231C1C',
      objColor: '#231C1C',
    },
    {
      id: 4,
      name: 'Map 2',
      boardColor: '#231C1C',
      ballColor: '#DEC8C8',
      paddleColor: '#D38146',
      objColor: '#D38146',
    },
  ];
  public mapIndex :number = 0;
  public playerId1 :number = 0;
  public playerId2 :number = 0;
  public isToStart :boolean = false;

}
