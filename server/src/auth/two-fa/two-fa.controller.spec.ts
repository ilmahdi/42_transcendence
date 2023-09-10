import { Test, TestingModule } from '@nestjs/testing';
import { TwoFaController } from './two-fa.controller';
import { TwoFaService } from './two-fa.service';

describe('TwoFaController', () => {
  let controller: TwoFaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFaController],
      providers: [TwoFaService],
    }).compile();

    controller = module.get<TwoFaController>(TwoFaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
