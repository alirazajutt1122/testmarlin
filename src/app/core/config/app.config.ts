import {Layout} from 'app/layout/layout.types';

export type Scheme = 'auto' | 'dark' | 'light';
export type Theme = 'default' | string;


export interface AppConfig {
    layout: Layout;
    scheme: Scheme;
    theme: Theme;
}

export const appConfig: AppConfig = {
    layout: 'classy',
    scheme: 'dark',
    theme: 'amber'
};
