import { Module } from '@nestjs/common';
import { ConnectionGateway } from './connection.gateway';
import { TokenService } from '../services/token.service';


@Module({
    imports: [],
    providers: [ConnectionGateway, TokenService],
    exports: [ConnectionGateway],
})
export class ConnectionModule {}
