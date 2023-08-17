import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces';


@Injectable()
export class TokenService {

  generateToken(payload: JwtPayload) {
    return  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
}