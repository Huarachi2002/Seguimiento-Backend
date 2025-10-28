import { Controller, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '../tratamiento/services/user.service';
import { TratamientoModule } from '../tratamiento/tratamiento.module';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { jwtConfig } from '../../config/jwt.config';

@Module({
    imports: [
        PassportModule,
        JwtModule.register(jwtConfig),
        TratamientoModule,
    ],
    controllers: [AuthController],
    providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
    exports: [JwtModule, AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
