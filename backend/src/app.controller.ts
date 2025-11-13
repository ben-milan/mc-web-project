import { Controller, Post, Body, Get } from '@nestjs/common'
import * as dotenv from "dotenv"
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
dotenv.config();

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService ) {}

  @Get("/")
  hello() {
    return "Hello"
  }

  @Get("/status")
  async status() {
    
    const url = `${process.env.STATUS_URL}`;
    
    const response = await firstValueFrom(
      this.httpService.get(url)
    );
    
    return response.data;
  }

  @Post('mod-server-check-pw')
  checkMod(@Body('password') password: string) {
    return { valid: password === process.env.MOD_SERVER_PW, server:"mod-server"}
  }

  @Post('smp-server-check-pw')
  checkSMP(@Body('password') password: string) {
    return { valid: password === process.env.SMP_SERVER_PW, server:"smp-server"}
  }

  @Post('dev-server-check-pw')
  checkDev(@Body('password') password: string) {
    return { valid: password === process.env.DEV_SERVER_PW, server:"dev-server"}
  }

  @Post('start-server')
  async startServer(@Body('server') serverName: string) {
    
    const url = `${process.env.URL}`;
    const payload = { token: `${process.env.TOKEN}`, server:`${serverName}`}
    
    const response = await firstValueFrom(
      this.httpService.post(url, payload)
    );
    
    if (response.data.status === "info") {
      return { state: "running"}
    } 

    if (response.data.status === "success") {
      return { state: "started"}
    }
  }
  
}
