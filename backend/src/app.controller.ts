import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Param,
  All,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as http from 'http';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './auth/guards/jwt.auth.guard';

dotenv.config();

interface CommandType {
  response: string;
  success: boolean;
}

interface ServerStatus {
  pid: string | null;
  status: 'online' | 'offline';
}

type ServerStatusResponse = Record<string, ServerStatus>;

interface WakeSuccessResponse {
  status: 'success';
  message: string;
}

interface WakeInfoResponse {
  status: 'info';
  message: string;
}

interface WakeWarningResponse {
  status: 'warning';
  message: string;
  response?: string; // only present when start API returned non-200
  error?: string; // only present when the request itself failed
}

interface WakeErrorResponse {
  status: 'error';
  reason?: string; // used for unauthorized / "PC did not wake" / outer except
  message?: string; // used for "Invalid JSON response from server"
}

type WakeResponse =
  | WakeSuccessResponse
  | WakeInfoResponse
  | WakeWarningResponse
  | WakeErrorResponse;

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get('/')
  hello() {
    return 'Hello';
  }

  @Get('/status')
  async status() {
    const url = `${process.env.STATUS_URL}`;

    const response = await firstValueFrom(
      this.httpService.get<ServerStatusResponse>(url),
    );

    return response.data;

    //return url;
  }

  @Post('mod-server-check-pw')
  checkMod(@Body('password') password: string) {
    return {
      valid: password === process.env.MOD_SERVER_PW,
      server: 'mod-server',
    };
  }

  @Post('smp-server-check-pw')
  checkSMP(@Body('password') password: string) {
    return {
      valid: password === process.env.SMP_SERVER_PW,
      server: 'smp-server',
    };
  }

  @Post('dev-server-check-pw')
  checkDev(@Body('password') password: string) {
    return {
      valid: password === process.env.DEV_SERVER_PW,
      server: 'dev-server',
    };
  }

  @Post('start-server')
  async startServer(@Body('server') serverName: string) {
    const url = `${process.env.URL}`;
    const payload = { token: `${process.env.TOKEN}`, server: `${serverName}` };

    const response = await firstValueFrom(
      this.httpService.post<WakeResponse>(url, payload),
    );

    if (response.data.status === 'info') {
      return { state: 'running' };
    }

    if (response.data.status === 'success') {
      return { state: 'started' };
    }
  }

  @Get('/stream')
  stream(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const url = new URL(process.env.STREAM_URL ?? ''); // e.g. http://PI_IP:5000/stream

    http.get(url, (piRes) => {
      piRes.on('data', (chunk) => res.write(chunk));
      piRes.on('end', () => res.end());
      piRes.on('error', () => res.end());
    });

    // cleanup when client disconnects
    res.on('close', () => res.end());
  }

  @Get('/logs/:server')
  logs(@Param('server') server: string, @Res() res: Response) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Type', 'text/event-stream');

    const url = new URL(`${process.env.PI_URL}/logs/${server}`);

    http.get(url, (piRes) => {
      piRes.on('data', (chunk) => res.write(chunk));
      piRes.on('end', () => res.end());
      piRes.on('error', () => res.end());
    });

    res.on('close', () => res.end());
  }

  @Post('/cmd')
  async cmd(@Body('server') serverName: string, @Body('cmd') cmd: string) {
    const url = `${process.env.PI_URL}/cmd`;
    const token = process.env.TOKEN;

    const response = await firstValueFrom(
      this.httpService.post<CommandType>(
        url,
        {
          token: token,
          server: serverName,
          cmd: cmd,
        },
        { headers: { 'Content-Type': 'application/json' } },
      ),
    );

    return response.data;
  }
}

const PREFIX = '/map/smp';

@Controller(PREFIX.slice(1))
export class MapController {
  @All(['/', '*'])
  proxy(@Req() req: Request, @Res() res: Response) {
    // Redirect bare path (no trailing slash) so relative asset URLs resolve correctly
    if (req.url === PREFIX) {
      return res.redirect(301, `${PREFIX}/`);
    }

    const subPath = req.url.startsWith(PREFIX)
      ? req.url.slice(PREFIX.length) || '/'
      : req.url;
    const target = new URL(subPath, process.env.MAP_ORIGIN);

    const upstreamReq = http.get(target, (upstreamRes) => {
      res.status(upstreamRes.statusCode ?? 200);
      for (const [key, value] of Object.entries(upstreamRes.headers)) {
        if (
          value !== undefined &&
          !['content-encoding', 'transfer-encoding'].includes(key)
        ) {
          res.setHeader(key, value as string);
        }
      }
      upstreamRes.pipe(res);
    });

    upstreamReq.on('error', () => res.status(502).end());
    req.on('close', () => upstreamReq.destroy());
  }
}

@Controller('areas')
export class AreaController {
  @Get()
  async list(@Res() res: Response) {
    const upstream = await fetch(`${process.env.PI_URL}/areas`);
    res.status(upstream.status).json(await upstream.json());
  }

  @Post()
  async save(@Req() req: Request, @Res() res: Response) {
    const upstream = await fetch(`${process.env.PI_URL}/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    res.status(upstream.status).json(await upstream.json());
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const upstream = await fetch(`${process.env.PI_URL}/areas/${username}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': process.env.ADMIN_TOKEN ?? '' },
    });
    res.status(upstream.status).json(await upstream.json());
  }
}
