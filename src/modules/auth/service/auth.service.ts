import { UserService } from '@/modules/tratamiento/services/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// ... otros imports

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  
  async validateUser(username: string, pass: string): Promise<any> {
    // Lógica para buscar el usuario por email en la DB
    const user = await this.usersService.findByName(username); 

    // Lógica para comparar el hash de la contraseña (usando bcrypt)
    // if (user && await bcrypt.compare(pass, user.password)) {
    if (user && user.contrasena === pass) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { name: user.username, userId: user.id };
    console.log("payload-user->", user);
    console.log("payload-out->", payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}