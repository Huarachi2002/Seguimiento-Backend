import { Controller, Get } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";


@Controller()
export class AppController {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    @Get('health')
    async healthCheck() {
        const dbStatus = await this.dataSource.isInitialized ? 'connected' : 'disconnected';
        return { 
            status: 'OK', 
            database: dbStatus,
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        };
    }
}