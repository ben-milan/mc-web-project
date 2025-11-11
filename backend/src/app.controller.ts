import { Controller, Post, Body, Get } from '@nestjs/common';
import * as wol from "wol"
import * as dotenv from "dotenv"
dotenv.config();

@Controller()
export class AppController {
  @Get("hello")
  hello() {
    return "Hello"
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
  
    console.log(serverName)
    return "";
  }
  
}
