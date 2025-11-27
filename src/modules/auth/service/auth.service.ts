import { UserService } from '@/modules/tratamiento/services/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  
  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findByName(username); 

      if (user && user.contrasena === pass) {
        const { contrasena, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Error al validar usuario',
          data: null,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(user: any) {
    try {
      const payload = { name: user.username, userId: user.id };
      console.log("payload-user->", user);
      console.log("payload-out->", payload);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Error al iniciar sesión',
          data: null,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}