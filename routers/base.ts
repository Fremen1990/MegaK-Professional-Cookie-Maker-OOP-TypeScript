import {MyRouter} from "../types/my-router";
import {Router} from "express";
import {CookieMakerApp} from "../index";
import {RestDecoratorInfo} from "../types/rest-decorator";

export class BaseRouter {
    public readonly router: Router = Router()

    constructor(
        protected cmapp: CookieMakerApp,
    ) {
        this.setUpRoutes();
    }

    private setUpRoutes(): void {
        // this.router.get('/', this.home);
        // console.log(Reflect.get(this, '_restApiCalls'))
        console.log(this)
        const ar: RestDecoratorInfo[] = Reflect.get(this, '_restApiCalls') ?? [];
        for (const apiOp of ar) {
            this.router[apiOp.httpMethod](apiOp.path,(...args)=> (this as any)[apiOp.propertyName](...args))
        }
    }
}
