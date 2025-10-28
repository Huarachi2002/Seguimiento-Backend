import { JwtModuleOptions } from "@nestjs/jwt";
import { config } from 'dotenv';

config()
export const jwtConfig : JwtModuleOptions = {
    secret: process.env.JWT_SECRET || 'secret_key',
    signOptions: { expiresIn: '60m' },
};