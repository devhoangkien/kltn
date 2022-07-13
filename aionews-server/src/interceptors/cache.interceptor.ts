/**
 * @file HttpCache interceptor
 * @module interceptor/cache
 * 
 */

import { tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import {
  HttpAdapterHost,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Injectable,
  RequestMethod,
} from '@nestjs/common'
import { getHttpCacheKey, getHttpCacheTTL } from '@app/decorators/cache.decorator'
import { CacheService } from '@app/processors/cache/cache.service'
import * as SYSTEM from '@app/constants/system.constant'
import * as APP_CONFIG from '@app/app.config'

/**
 * @class HttpCacheInterceptor
 * @classdesc 弥补框架不支持单独定义 ttl 参数以及单请求应用的缺陷
 */
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(SYSTEM.HTTP_ADAPTER_HOST)
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly cacheService: CacheService
  ) {}

  // 自定义装饰器，修饰 ttl 参数
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    // 如果想彻底禁用缓存服务，则直接返回 -> return call$;
    const call$ = next.handle()
    const key = this.trackBy(context)

    if (!key) {
      return call$
    }

    const target = context.getHandler()
    const metaTTL = getHttpCacheTTL(target)
    const ttl = metaTTL || APP_CONFIG.APP.DEFAULT_CACHE_TTL

    try {
      const value = await this.cacheService.get(key)
      return value ? of(value) : call$.pipe(tap((response) => this.cacheService.set(key, response, { ttl })))
    } catch (error) {
      return call$
    }
  }

  /**
   * @function trackBy
   * @description 目前的命中规则是：必须手动设置了 CacheKey 才会启用缓存机制，默认 ttl 为 APP_CONFIG.REDIS.defaultCacheTTL
   */
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest()
    const httpServer = this.httpAdapterHost.httpAdapter
    const isHttpApp = Boolean(httpServer?.getRequestMethod)
    const isGetRequest = isHttpApp && httpServer.getRequestMethod(request) === RequestMethod[RequestMethod.GET]
    const cacheKey = getHttpCacheKey(context.getHandler())
    const isMatchedCache = isHttpApp && isGetRequest && cacheKey
    // const requestUrl = httpServer.getRequestUrl(request);
    // logger.debug('isMatchedCache', isMatchedCache, 'requestUrl', requestUrl, 'cacheKey', cacheKey);
    // 缓存命中策略 -> http -> GET -> cachekey -> url -> undefined
    return isMatchedCache ? cacheKey : undefined
    /*
    return undefined;
    return isMatchedCache ? requestUrl : undefined;
    return isMatchedCache ? (cacheKey || requestUrl) : undefined;
    */
  }
}
