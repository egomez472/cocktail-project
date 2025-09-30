import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '@core/services/loading/loading.service';
import { Observable, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loading: LoadingService = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};
