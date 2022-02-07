import {HttpMethod} from "../types/http-method"
import {MyRouter} from "../types/my-router";
import {RestDecoratorInfo} from "../types/rest-decorator";

export function rest(
    httpMethod: HttpMethod,
    path: string,
) {
        // console.log("Czy dekorator dziala?? ")
        // console.log(target as any, [propertyName])

        return (target: MyRouter, propertyName: string): any => {
            const ar:RestDecoratorInfo[] = Reflect.get(target, '_restApiCalls') ?? [];

            ar.push( {
                httpMethod,
                path,
                propertyName,
            } )

            Reflect.set(target, '_restApiCalls', ar)
        }
}
