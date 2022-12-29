import {Route} from '@angular/router';
import {AuthSignInComponent} from 'app/modules/auth/sign-in/sign-in.component';
import { AboutUsComponent } from '../About-Us/about-us';
import { ContactUsComponent } from '../Contact-Us/contact-us';
import { FAQsComponent } from '../FAQs/faqs';
import {AuthResolvers} from "./auth.resolvers";

export const authSignInRoutes: Route[] = [
    {
        path: '',
        component: AuthSignInComponent,
        resolve: {
            data: AuthResolvers,
        },
    },
    {
        path: 'about-us',
        component: AboutUsComponent,
    },
    {
        path: 'contact-us',
        component: ContactUsComponent,
    },
    {
        path: 'faqs',
        component: FAQsComponent,
    }
];
