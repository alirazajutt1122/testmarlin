import { FuseNavigationItem } from '@fuse/components/navigation';

import { environment } from 'environments/environment';

import { AdminDashboard } from 'app/admin/dashboard-admin.component';









export class defaultNavigationClass {


    constructor() {

    }


    public static helloWorld = (): void => {
        console.log("Hellow World");
    }



}




export const defaultNavigation: FuseNavigationItem[] = [



    // {
    //     id: 'dashboards',
    //     title: '',
    //     type: 'group',
    //     icon: 'heroicons_outline:home',
    // },
    {
        id: 'dashboards.finance',
        title: 'Dashboard',
        type: 'basic',
        icon: 'dashboard',
        img: 'assets/images2/main/dashboard.png',
        link: '/dashboard',

    }, {
        id: 'trading.portal',
        title: 'Trading Portal',
        type: 'collapsable',
        img: 'assets/images2/Equities/account-activity.png',
        icon: 'account_balance_wallet',
        children: [
            {
                id: 'trading.portal.trading',
                title: 'Trading Dashboard',
                type: 'basic',
                link: '/trading-portal/trading-dashboard',
            },
            {
                id: 'trading.portal.registration',
                title: 'Trading Registration',
                type: 'basic',
                link: '/trading-portal/trading-registration',
            },
            {
                id: 'trading.portal.virtual.trading',
                title: 'Virtual Trading',
                type: 'basic',
                link: '',
            }
        ]
    },
    {
        id: 'trading.oms',
        title: 'Trading',
        type: 'collapsable',
        icon: 'manage_accounts',
        img: 'assets/images2/main/equities.png',
        children: [
            {
                id: 'trading.oms.dashboard',
                title: 'Home',
                type: 'basic',
                img: 'assets/images2/main/dashboard.png',
                link: '/watch/dashboard-oms',
            },
            {
                id: 'trading.oms.equities',
                title: 'Equities',
                type: 'collapsable',
                link: '',
                children: [
                    {
                        id: 'trading.oms.equities.neworder',
                        title: 'New Order',
                        type: 'basic',
                        img: 'assets/images2/main/dashboard.png',
                        link: "",
                    },
                    {
                        id: 'trading.oms.equities.changeorder',
                        title: 'Change Order',
                        type: 'basic',
                        img: 'assets/images2/main/dashboard.png',

                    },
                    {
                        id: 'trading.oms.equities.cancelorder',
                        title: 'Cancel Order',
                        type: 'basic',
                        img: 'assets/images2/main/dashboard.png',

                    },
                    {
                        id: 'trading.oms.equities.cancelorder',
                        title: 'Market Watch',
                        type: 'basic',
                        img: 'assets/images2/main/dashboard.png',

                    },
                ]
            },
            {
                id: 'trading.oms.bonds',
                title: 'Bonds',
                type: 'collapsable',
                link: '',
                children: [
                    {
                        id: 'trading.oms.bonds.neworder',
                        title: 'New Order',
                        type: 'basic',
                        img: 'assets/images2/main/dashboard.png',


                    },
                    {
                        id: 'trading.oms.bonds.changeorder',
                        title: 'Change Order',
                        type: 'basic',
                        img: 'assets/images2/main/dashboard.png',

                    },
                    {
                        id: 'trading.oms.bonds.cancelorder',
                        title: 'Cancel Order',
                        type: 'basic',
                        img: 'assets/images2/main/dashboard.png',

                    },
                    {
                        id: 'trading.oms.bonds.cancelorder',
                        title: 'Market Watch',
                        type: 'basic',
                        img: 'assets/images2/main/dashboard.png',

                    },
                ]
            },
        ]
    },
    {
        id: 'back.office',
        title: 'Back Office',
        type: 'collapsable',
        icon: 'chair',
        img: 'assets/images2/main/future_open_trade.png',
        children: [
            {
                id: 'back.office.equities',
                title: 'Equities',
                type: 'collapsable',
                img: 'assets/images2/main/equities.png',
                // icon : 'insert_chart',
                children: [
                    {
                        id: 'back.office.equities.manual.transaction',
                        title: 'Transaction',
                        type: 'basic',
                        img: 'assets/images2/Equities/transactions.png',
                        // icon : 'repeat',
                        link: '/back-office/equities/manual-transaction-page',

                    },
                    {
                        id: 'back.office.equities.Settlement',
                        title: 'Settlement',
                        type: 'basic',
                        img: 'assets/images2/Equities/settlement.png',
                        // icon : 'repeat',
                        link: '/back-office/equities/settlement-page',

                    },
                    {
                        id: 'back.office.equities.TradingReports',
                        title: 'Reports',
                        type: 'collapsable',
                        img: 'assets/images2/main/sro-list.png',
                        // icon : 'print',
                        children: [
                            {
                                id: 'back.office.equities.trade.confirmation',
                                title: 'Trade Confirmation',
                                type: 'basic',
                                img: 'assets/images2/Equities/trade-confirmation.png',
                                // icon : 'assignment_turned_in',
                                link: '/back-office/equities/Reports/trade-confirmation-report',
                            },
                            {
                                id: 'back.office.equities.account.holding.summary',
                                title: 'Client Ledger Holding ',
                                type: 'basic',
                                img: 'assets/images2/Equities/account-holding-summary.png',
                                link: '/back-office/equities/Reports/account-holding-summary-report',
                            },
                            {
                                id: 'back.office.equities.psx.confirmation.format',
                                title: 'Psx Confirmation Format ',
                                type: 'basic',
                                img: 'assets/images2/Equities/client_last_activity.png',
                                link: '/back-office/equities/Reports/client-last-activity-rpt',
                            },
                            {
                                id: 'back.office.equities.securitywise.client.activity',
                                title: 'Security Wise Client Activity ',
                                type: 'basic',
                                img: 'assets/images2/Equities/sec-client-activity.png',
                                link: '/back-office/equities/Reports/securitywise-client-activity-rpt',
                            },
                            {
                                id: 'back.office.equities.account.activity',
                                title: 'Account Activity ',
                                type: 'basic',
                                img: 'assets/images2/Equities/account-activity.png',
                                link: '/back-office/equities/Reports/account-activity-rpt',
                            },
                            {
                                id: 'back.office.equities.account.margin-detail',
                                title: 'Margin Detail ',
                                type: 'basic',
                                img: 'assets/images2/Equities/account-margin-detail.png',
                                link: '/back-office/equities/Reports/account-margin-detail-rpt',
                            },
                            {
                                id: 'back.office.equities.client-gain-loss',
                                title: 'Clients Gain/Loss ',
                                type: 'basic',
                                img: 'assets/images2/Equities/clients-gain-loss.png',
                                link: '/back-office/equities/Reports/client-gain-loss-rpt',
                            },
                            {
                                id: 'back.office.equities.client-levies',
                                title: 'Client Levies Details ',
                                type: 'basic',
                                img: 'assets/images2/Equities/client-levies-details.png',
                                link: '/back-office/equities/Reports/client-levies-rpt',
                            },
                            {
                                id: 'back.office.equities.participant-levies',
                                title: 'Participant/Exchange Levies ',
                                type: 'basic',
                                img: 'assets/images2/Equities/participant-exchange-levies.png',
                                link: '/back-office/equities/Reports/participant-levies-rpt',
                            },
                            {
                                id: 'back.office.equities.participant-commission',
                                title: 'Participant Commission ',
                                type: 'basic',
                                img: 'assets/images2/Equities/participant-commission.png',
                                link: '/back-office/equities/Reports/participant-commission-rpt',
                            },
                            {
                                id: 'back.office.equities.participant-commission',
                                title: 'Agent Commission ',
                                type: 'basic',
                                img: 'assets/images2/Equities/agent-commission.png',
                                link: '/back-office/equities/Reports/agent-commission-rpt',
                            },
                            {
                                id: 'back.office.equities.broker-client-delivery-money-obligation',
                                title: 'Delivery/Money Obligation ',
                                type: 'basic',
                                img: 'assets/images2/Equities/delivery-money-obligation.png',
                                link: '/back-office/equities/Reports/broker-client-delivery-money-obligation-rpt',
                            },
                        ]
                    },
                ]
            },
            {
                id: 'back.office.vault',
                title: 'Vault',
                type: 'collapsable',
                img: 'assets/images2/main/vault.png',
                // icon : 'insert_chart',
                children: [
                    {
                        id: 'back.office.vault.manual.transaction',
                        title: 'Stock Deposit/Withdraw & Pledge/Release',
                        type: 'basic',
                        img: 'assets/img/vault/stock-deposit-withdraw.png',
                        // icon : 'repeat',
                        link: '/back-office/vault/stock-deposit-withdraw',

                    },
                    {
                        id: 'back.office.vault.reports',
                        title: 'Reports',
                        type: 'collapsable',
                        img: 'assets/images2/main/sro-list.png',
                        children: [
                            {
                                id: 'back.office.vault.stock-receipt',
                                title: 'Stock Receipt',
                                type: 'basic',
                                img: 'assets/img/vault/stock-receipt.png',
                                link: '/back-office/vault/stock-receipt-rpt',

                            },
                            {
                                id: 'back.office.vault.stock-activity',
                                title: 'Stock Activity',
                                type: 'basic',
                                img: 'assets/img/vault/stock-activity.png',
                                link: '/back-office/vault/stock-activity-rpt',

                            },
                            {
                                id: 'back.office.vault.stock-activity-pledge-release',
                                title: 'Stock Activity Pledge/Release',
                                type: 'basic',
                                img: 'assets/img/vault/stock-activity-pledge.png',
                                link: '/back-office/vault/stock-activity-pledge-release-rpt',

                            },
                            {
                                id: 'back.office.vault.share-holding',
                                title: 'Share Holding',
                                type: 'basic',
                                img: 'assets/img/vault/share-holding.png',
                                link: '/back-office/vault/share-holding-rpt',

                            },
                            {
                                id: 'back.office.vault.client-pre-settlement-delivery',
                                title: 'Client Pre-Settlement Delivery',
                                type: 'basic',
                                img: 'assets/img/vault/ic_cps-delivery-report.png',
                                link: '/back-office/vault/client-pre-settlement-delivery-rpt',

                            },
                        ]

                    }
                ]
            },
            {
                id: 'back.office.setup',
                title: 'Setup',
                type: 'collapsable',
                img: 'assets/images2/main/setup.png',
                // icon : 'insert_chart',
                children: [
                    {
                        id: 'back.office.setup.application-setup',
                        title: 'Application Setup',
                        type: 'basic',
                        img: 'assets/img/setup/application_setup.png',
                        // icon : 'repeat',
                        link: '/back-office/setup/application-setup',

                    }
                ]
            }
        ]
    },
    {
        id: 'account.registration',
        title: 'Account Registration',
        type: 'basic',
        icon: 'manage_accounts',
        img: 'assets/images2/main/agent.png',
        link: '/account-registration',
    },
    {
        id: 'portfolio',
        title: 'Portfolio',
        type: 'basic',
        icon: 'shopping_bag',
        img: 'assets/images2/main/voucher-types.png',
        link: '/portfolio'
    },
    {
        id: 'favourites',
        title: 'Favourites',
        type: 'basic',
        icon: 'favorite',
        img: 'assets/images2/Equities/clients-gain-loss.png',
        link: '/favourites'
    },
    {
        id: 'news.advertisements',
        title: 'News & Advertisements',
        type: 'basic',
        icon: 'article',
        img: 'assets/images2/Equities/participant-exchange-levies.png',
        link: 'news_advertisements/news&advertisements'
    },
    {
        id: 'reports',
        title: 'Reports',
        type: 'collapsable',
        icon: 'summarize',
        img: 'assets/images2/main/sro-list.png',
        children: [
            {
                id: 'virtual-trade-history-report',
                title: 'Virtual Trade History Report',
                type: 'basic',
                link: '/reports/virtual-trade-history-report/',
            },
        ]
    },
    {
        id: 'broker.ratings',
        title: 'Broker Ratings',
        type: 'basic',
        icon: 'thumbs_up_down',
        img: 'assets/images2/Equities/account-margin-detail.png',
        link: ''
    },
    // {
    //     id: 'how.it.works',
    //     title: 'How it Works?',
    //     type: 'basic',
    //     icon: 'contact_support',
    //     img : 'assets/images2/Equities/account-holding-summary.png',
    //     link: ''
    // },
    {
        id: 'about.us',
        title: 'About Us',
        type: 'basic',
        icon: 'heroicons_solid:book-open',
        img: 'assets/images2/main/clients-assets.png',
        link: ''
    },
    {
        id: 'contact.us',
        title: 'Contact Us',
        type: 'basic',
        icon: 'heroicons_outline:speakerphone',
        img: 'assets/images2/main/broadcast_sms.png',
        link: ''
    },
];

export const adminNavigation: FuseNavigationItem[] = [
    {
        id: 'admin.home',
        title: 'Home',
        type: 'basic',
        icon: '',
        img: 'assets/images2/main/dashboard.png',
        link: 'admin/dashboard-admin',
    },
    {
        id: 'admin',
        title: 'Admin Configuartion',
        type: 'collapsable',
        icon: '',
        img: 'assets/images2/main/admin.png',
        link: '',
        children: [
            {
                id: 'admin.security',
                title: 'Security',
                type: 'basic',
                link: 'admin/security-page',
                img: "assets/images2/admin_config/security.png"
            },
        ]
    },
];
