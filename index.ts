import * as express from 'express';
import {Application, json, Request, Response, static as expressStatic} from "express";
import * as cookieParser from 'cookie-parser';
import {engine} from "express-handlebars";
import {HomeRouter} from "./routers/home";
import {ConfiguratorRouter} from "./routers/configurator";
import {OrderRouter} from "./routers/order";
import {handlebarsHelpers} from "./utils/handlebars-helpers";
import {COOKIE_BASES, COOKIE_ADDONS} from "./data/cookies-data";
import {Entries} from "./types/entries";
import {MyRouter} from "./types/my-router";

export class CookieMakerApp {
    private app: Application;
    public readonly data = {
        COOKIE_BASES,
        COOKIE_ADDONS
    }

    private readonly routers = [HomeRouter, ConfiguratorRouter, OrderRouter]

    constructor() {
        this._configureApp();
        this._setRoutes();
        this._run();
    }

    _configureApp(): void {
        this.app = express();

        this.app.use(json());
        this.app.use(expressStatic('public'));
        this.app.use(cookieParser());
        this.app.engine('.hbs', engine({
            extname: '.hbs',
            helpers: handlebarsHelpers,
        }));
        this.app.set('view engine', '.hbs');
    }

    _setRoutes(): void {

        for (const router of this.routers) {
            const obj:MyRouter = new router(this)

            this.app.use(obj.urlPrefix, obj.router)
        }

        // this.app.use(HomeRouter.urlPrefix, new HomeRouter(this).router);
        // this.app.use(ConfiguratorRouter.urlPrefix, new ConfiguratorRouter(this).router);
        // this.app.use('/order', new OrderRouter(this).router);
    }

    _run(): void {
        this.app.listen(3000, '0.0.0.0', () => {
            console.log('Listening on :http://localhost:3000');
        });
    }

    showErrorPage(res: Response, description: string) {
        res.render('error', {
            description,
        });
    }

    getAddonsFromReq(req: Request): any[] { // TODO Check the real type for this one
        const {cookieAddons} = req.cookies as {
            cookieAddons: string,
        };
        return cookieAddons ? JSON.parse(cookieAddons) : [];
    }

    getCookieSettings(req: Request): {
        addons: string[],
        base: string | undefined,
        sum: number,
        allBases: Entries,
        allAddons: Entries,

    } {
        const {cookieBase: base} = req.cookies as {
            cookieBase?: string,
        };

        const addons = this.getAddonsFromReq(req);

        const allBases = Object.entries(this.data.COOKIE_BASES);
        const allAddons = Object.entries(this.data.COOKIE_ADDONS);

        const sum = (base ? handlebarsHelpers.findPrice(allBases, base) : 0)
            + addons.reduce((prev, curr) => (
                prev + handlebarsHelpers.findPrice(allAddons, curr)
            ), 0);

        return {
            // Selected stuff
            addons,
            base,

            // Calculations
            sum,

            // All possibilities
            allBases,
            allAddons,
        };
    }
}

new CookieMakerApp();
