import * as path from 'path';
import * as express from 'express';

import { Server } from '@overnightjs/core';
import Logger from 'jet-logger';
import * as basicAuth from 'express-basic-auth'
import * as dotenv from 'dotenv';

class BlockScannerServer extends Server {

    private readonly SERVER_START_MSG = 'Server started on port: ';

    constructor() {
        super(true);

        dotenv.config();

        const user = this.getAuthUser();

        this.app.use(basicAuth(
            {
                challenge: true,
                users: user
            }
        ));

        this.serveFrontEndProd();
    }

    private getAuthUser(): { [key: string]: string } {
        const user = process.env.USER;
        const pass = process.env.PASSWORD;
        if (user && pass) {
            return { [user]: pass };
        } else {
            throw new Error('Error fetching USER or PASSWORD from .env');
        }
    }

    private serveFrontEndProd(): void {
        const dir = path.join(__dirname, '../../client/build');
        // Set the static and views directory
        this.app.set('views', dir);
        this.app.use(express.static(dir));
        // Serve front-end content
        this.app.get('*', (req, res) => {
            res.sendFile('index.html', { root: dir });
        });
    }


    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Imp(this.SERVER_START_MSG + port);
        });
    }
}

export default BlockScannerServer;
