import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { N8NService } from "./service/n8n.service";

@Global()
@Module({
    imports: [ConfigModule, HttpModule],
    providers: [N8NService],
    exports: [N8NService],
})
export class CommonModule {}