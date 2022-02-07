import {Request, Response, Router} from "express";
import {CookieMakerApp} from "../index";
import {MyRouter} from "../types/my-router";
import {BaseRouter} from "./base";
import {get} from "../decorators/rest.decorator";

export class OrderRouter extends BaseRouter implements MyRouter {
    public readonly urlPrefix: string = '/order';
    public readonly router: Router = Router();

    // private setUpRoutes(): void {
    //     this.router.get('/summary', this.sumary);
    //     this.router.get('/thanks', this.thanks);
    // }

    @get('/summary')
    private sumary = (req: Request, res: Response): void => {
        const {sum, addons, base, allBases, allAddons} = this.cmapp.getCookieSettings(req);

        res.render('order/summary', {
            cookie: {
                base,
                addons,
            },
            allBases,
            allAddons,
            sum,
        });
    };

    @get('/thanks')
    private thanks = (req: Request, res: Response) => {
        const {sum} = this.cmapp.getCookieSettings(req);

        res
            .clearCookie('cookieBase')
            .clearCookie('cookieAddons')
            .render('order/thanks', {
                sum,
            });
    }
}
