import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from 'app/core/auth/auth.service';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _authService: AuthService, private toast: ToastrService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newReq = req.clone();

        return next.handle(newReq).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 417) {
                    this.toast.error('Something Went Wrong', 'Error')
                }
                return throwError(error);
            })
        );
    }
}
