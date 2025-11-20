import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { N8NService } from "./service/n8n.service";
import { IAService } from "./service/ia.service";

@Global()
@Module({
    imports: [ConfigModule],
    providers: [N8NService, IAService],
    exports: [N8NService, IAService],
})
export class CommonModule {}