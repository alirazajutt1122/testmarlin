
import { AppConstants } from '../app.utility';
import { AlertMessage } from './alert-message';
import * as wijmo from '@grapecity/wijmo';
import { AppUtility } from 'app/app.utility';

//////////////////////////////////////////////////////////////////

export class Order {

    broker: string = '';


    order_no: string = '';
    ref_no: string = '';

    exchange: string = '';
    market: string = '';
    symbol: string = '';
    symbolMktExch: string = '';

    type_: string = 'limit';
    type: string = 'limit';
    side: string = '';

    price: string = '';
    price_: number = 0;
    yield: number = 0;
    accrudeProfit: number = 0;
    pricingMechanism: number = 0;
    triggerPrice: string = '';
    triggerPrice_: number = 0;
    volume: number = 500;
    actual_volume: number = 0;
    sVolume: string = '';
    value: number = 0;
    settlementValue: number = 0;
    account: string = '';
    custodian: string = '';

    tifOption: string = '';
    gtd: Date; // Date string
    qualifier: string = "";
    discQuantity: number = 0;

    username: string = "";
    state_time: Date = null;
    order_state: string = '';

    expiryDate: string = '';
    disclosedVolume: number = 0;
    lang: any

    // counterBroker: string = '';
    // counterCustodian: string = '';
    // counterClient: string = '';

    is_negotiated: boolean = false;
    counter_broker_code: string = ""
    counter_client_code: string = ""
    counter_user_id: number = 0;
    counter_username: string = ""
    negotiated_order_state: string = ""
    negotiated_order_status: string = ""

    // -----------------------------------------------------------------

    public static setStuffBasedOnType(order, obj) {
        order.tifOption = 'DO';
        order.gtd = new Date(obj.state_time);   //  in case of 'DO', gtd field remains empty so when we export event log, empty fields shows in excel file against 'DO' @ 21/Jun/2017 - AiK
        order.qualifier = 'No Qualifier';
        if (order.type === 'limit' || order.type === 'gtc' || order.type === 'gtd' || order.type === 'fok' ||
            order.type === 'ioc' || order.type === 'ho') {
            order.type_ = 'limit';

            if (order.type === 'gtc') {
                order.tifOption = 'GTC';
                order.gtd = new Date(obj.expiry_date);
            }

            if (order.type === 'gtd') {
                order.tifOption = 'GTD';
                order.gtd = new Date(obj.expiry_date);
                order.expiryDate = AppUtility.toYYYYMMDD(order.gtd);
            }

            if (order.type === 'fok') {
                order.qualifier = 'FOK';
            }

            if (order.type === 'ioc') {
                order.qualifier = 'IOC';
            }

            if (order.type === 'ho') {
                order.qualifier = 'HO';
                order.discQuantity = obj.disclosed_volume;
            }
        }
        else {
            order.type_ = order.type;
        }
    }

    // -----------------------------------------------------------------

    constructor() {
        this.gtd = new Date();
        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
    }

    // -----------------------------------------------------------------

    clearOrder(): void {
        this.exchange = '';
        this.market = '';
        this.symbol = '';
        this.symbolMktExch = '';
        this.side = '';
        this.price = '';
        this.yield = 0;
        this.accrudeProfit = 0;
        this.pricingMechanism = 2;
        this.price_ = 0;
        this.triggerPrice = '';
        this.triggerPrice_ = 0;
        this.volume = 0;
        this.sVolume = '';
        this.actual_volume = 0;
        this.value = 0;
        this.settlementValue = 0;
        this.account = '';
        this.custodian = '';
        this.type = '';
        this.type_ = '';
        this.ref_no = '';
        this.tifOption = '';
        this.broker = "";
        this.qualifier = '';
        this.username = AppConstants.username;
    }



    // -----------------------------------------------------------------

    setOrder(obj): void {

        this.order_no = (AppUtility.isEmpty(obj.order_no) ? '' : String(obj.order_no));
        this.exchange = (AppUtility.isEmpty(obj.exchange) ? '' : obj.exchange);
        this.market = (AppUtility.isEmpty(obj.market) ? '' : obj.market);
        this.symbol = (AppUtility.isEmpty(obj.symbol) ? '' : obj.symbol);
        this.symbolMktExch = this.symbol + AppConstants.LABEL_SEPARATOR + this.market + AppConstants.LABEL_SEPARATOR + this.exchange;
        this.side = (AppUtility.isEmpty(obj.side) ? '' : obj.side);
        this.price = (AppUtility.isEmpty(obj.price) ? '' : obj.price);
        this.price_ = (AppUtility.isEmpty(obj.price) ? 0 : Number(obj.price));
        this.yield = (AppUtility.isEmpty(obj.yield) ? 0 : Number(obj.yield));
        this.settlementValue = (AppUtility.isEmpty(obj.settlement_amount) ? 0 : Number(obj.settlement_amount));
        this.accrudeProfit = (AppUtility.isEmpty(obj.accrued_profit) ? 0 : Number(obj.accrued_profit));
        this.pricingMechanism = (AppUtility.isEmpty(obj.pricingMechanism) ? 0 : Number(obj.pricingMechanism));
        this.triggerPrice = (AppUtility.isEmpty(obj.trigger_price) ? '' : obj.trigger_price);
        this.triggerPrice_ = (AppUtility.isEmpty(obj.trigger_price) ? 0 : Number(obj.trigger_price));
        this.volume = (AppUtility.isEmpty(obj.volume) ? 0 : obj.volume);
        this.actual_volume = (AppUtility.isEmpty(obj.actual_volume) ? 0 : obj.actual_volume);
        this.sVolume = (AppUtility.isEmpty(obj.volume) ? '' : String(obj.volume));
        this.value = (AppUtility.isEmpty(obj.value) ? 0 : Number(obj.value));
        this.account = (AppUtility.isEmpty(obj.account) ? '' : obj.account);
        this.custodian = (!AppUtility.isValidVariable(obj.custodian)) ? '' : obj.custodian;
        this.type = (AppUtility.isEmpty(obj.type) ? '' : obj.type);

        Order.setStuffBasedOnType(this, obj);

        this.ref_no = (AppUtility.isEmpty(obj.ref_no) ? '' : obj.ref_no);
        this.username = (AppUtility.isEmpty(obj.username) ? '' : obj.username);
        this.state_time = new Date(obj.state_time);
        this.broker = (AppUtility.isEmpty(obj.broker) ? '' : obj.broker);
    }

    // -----------------------------------------------------------------

    public formatOrderSubmitMsg(marketType: string): string {
        let str: string = '';
        let price: string = '';
        let of_: string = " do "
        let in_: string = " dentro "
        let side = this.side

        if (this.lang == 'pt') {
            if (side == "buy") { side = "comprar" }
            else if (side == "sell") { side = "vender" }
        }


        if (this.type.toLowerCase() === AppConstants.ORDER_TYPE_MARKET.toLowerCase()) {

            price = 'Market';
        }
        else if (this.type.toLowerCase() === AppConstants.ORDER_TYPE_SM.toLowerCase()) {
            price = wijmo.Globalize.formatNumber(Number(this.triggerPrice), 'n4');
        }
        else {
            price = wijmo.Globalize.formatNumber(Number(this.price), 'n4');
        }

        if (marketType == 'Bond') {
            if (this.lang == "en") {
                str = AppUtility.ucFirstLetter(this.side) + ' ' + this.symbol.toUpperCase() + ' ' +
                    wijmo.Globalize.formatNumber(this.volume, 'n0') + ' @ ' + wijmo.Globalize.formatNumber(Number(this.yield), 'n4') + ' yield with Price ' + price + " in " +
                    this.market + " of " + this.exchange + ' ?';
            }
            else if (this.lang == 'pt') {
                str = AppUtility.ucFirstLetter(side) + ' ' + this.symbol.toUpperCase() + ' ' +
                    wijmo.Globalize.formatNumber(this.volume, 'n0') + ' @ ' + wijmo.Globalize.formatNumber(Number(this.yield), 'n4') + ' rendimento com Pre??o ' + price + in_ +
                    this.market + of_ + this.exchange + ' ?';
            }

        }
        else {
            if (this.lang == "en") {
                str = AppUtility.ucFirstLetter(this.side) + ' ' + this.symbol.toUpperCase() + ' ' +
                    wijmo.Globalize.formatNumber(this.volume, 'n0') + ' @ ' + price + " in " +
                    this.market + " of " + this.exchange + ' ?';
            }
            else if (this.lang == 'pt') {
                str = AppUtility.ucFirstLetter(side) + ' ' + this.symbol.toUpperCase() + ' ' +
                    wijmo.Globalize.formatNumber(this.volume, 'n0') + ' @ ' + price + in_ +
                    this.market + of_ + this.exchange + ' ?';
            }
        }
        return str;
    }

    // -----------------------------------------------------------------

    formatOrderConfirmationMsg(data, marketType: string): AlertMessage {
         
        let orderConfirmMsg: string = '';
        let alertMessage: AlertMessage = new AlertMessage();

        // AppUtility.printConsole("order confirmation received"+JSON.stringify(data));
        let price: string = '';
        let volume: string = '';
        // ..........................................................................................................
        let rejectionMsg: string = data.rejection_message
        let side: string = data.side
        let in_ = " dentro "
        let of_ = " do "
        let OrderSubmitted = "Encomenda Submetida: "
        let OrderChanged = "Pedido Alterado: "
        let OrderCancelled = "Pedido Cancelado: "
        let OrderReceived = "Pedido Recebido: "
        let OrderPurged = "Pedido Removido: "
        let OrderRejected = "Pedido Rejeitado: "
        let OrderTraded = "Pedido Negociado: "

        if (this.lang == 'pt') {

            if (side == "buy")
                side = "comprar"
            else if (side == "sell")
                side = "vender"

            if (rejectionMsg === "The specified market is not in valid state to place orders.")
                rejectionMsg = "O mercado especificado n??o est?? em estado v??lido para fazer pedidos."
            else if (rejectionMsg === "Unknown Rejection.")
                rejectionMsg = "Rejei????o Desconhecida"
            else if (rejectionMsg === "External Rejection.")
                rejectionMsg = "Rejei????o Externa"
            else if (rejectionMsg === "The specified client is invalid.")
                rejectionMsg = "O cliente especificado ?? inv??lido."
            else if (rejectionMsg === "The specified exchange is invalid.")
                rejectionMsg = "A troca especificada ?? inv??lida."
            else if (rejectionMsg === "The specified market is invalid.")
                rejectionMsg = "O mercado especificado ?? inv??lido."
            else if (rejectionMsg === "The specified symbol is invalid.")
                rejectionMsg = "O s??mbolo especificado ?? inv??lido."
            else if (rejectionMsg === "The specified client is not allowed for the specified market.")
                rejectionMsg = "O cliente especificado n??o ?? permitido para o mercado especificado."
            else if (rejectionMsg === "Clearing Id is not defined.")
                rejectionMsg = "O ID de compensa????o n??o est?? definido."
            else if (rejectionMsg === "The specified symbol is suspended.")
                rejectionMsg = "O s??mbolo especificado est?? suspenso."
            else if (rejectionMsg === "The user placing orders is suspended.")
                rejectionMsg = "O usu??rio que faz pedidos est?? suspenso."
            else if (rejectionMsg === "The specified volume is not a multiple of board lot.")
                rejectionMsg = "O volume especificado n??o ?? um m??ltiplo do lote do tabuleiro."
            else if (rejectionMsg === "The specified price is not a multiple of tick size.")
                rejectionMsg = "O pre??o especificado n??o ?? um m??ltiplo do tamanho do tick."
            else if (rejectionMsg === "The specified price is not a multiple of tick size.")
                rejectionMsg = "O pre??o especificado n??o ?? um m??ltiplo do tamanho do tick."
            else if (rejectionMsg === "The specified price is not in the valid range.")
                rejectionMsg = "O pre??o especificado n??o est?? no intervalo v??lido."
            else if (rejectionMsg === "The specified volume exceeds upper limit.")
                rejectionMsg = "O volume especificado excede o limite superior."
            else if (rejectionMsg === "The specified volume exceeds lower limit.")
                rejectionMsg = "O volume especificado excede o limite inferior."
            else if (rejectionMsg === "The specified value exceeds upper limit.")
                rejectionMsg = "O valor especificado excede o limite superior."
            else if (rejectionMsg === "The specified value exceeds lower limit.")
                rejectionMsg = "O valor especificado excede o limite inferior."
            else if (rejectionMsg === "The specified terminal is invalid.")
                rejectionMsg = "O terminal especificado ?? inv??lido."
            else if (rejectionMsg === "There is no opposite side for a market order.")
                rejectionMsg = "N??o h?? lado oposto para uma ordem de mercado."
            else if (rejectionMsg === "You don't have grants to place order for this user.")
                rejectionMsg = "Voc?? n??o tem concess??es para fazer pedidos para este usu??rio."
            else if (rejectionMsg === "Order value exceeds broker's credit line limit.")
                rejectionMsg = "O valor do pedido excede o limite da linha de cr??dito do corretor."
            else if (rejectionMsg === "Short sale is not allowed.")
                rejectionMsg = "A venda a descoberto n??o ?? permitida."
            else if (rejectionMsg === "Order is rejected by counter party.")
                rejectionMsg = "A ordem ?? rejeitada pela contraparte."
            else if (rejectionMsg === "You can not change negotiate order.")
                rejectionMsg = "Voc?? n??o pode alterar a ordem de negocia????o."
            else if (rejectionMsg === "The specified order is not valid.")
                rejectionMsg = "A ordem especificada n??o ?? v??lida."
            else if (rejectionMsg === "Disclosed volume is not less than actual volume.")
                rejectionMsg = "O volume divulgado n??o ?? inferior ao volume real."
            else if (rejectionMsg === "Disclosed volume is not a multiple of board lot.")
                rejectionMsg = "O volume divulgado n??o ?? um m??ltiplo do lote do tabuleiro."
            else if (rejectionMsg === "Volume is not a multiple of disclosed volume.")
                rejectionMsg = "O volume n??o ?? um m??ltiplo do volume divulgado."
            else if (rejectionMsg === "Order value exceeds the specified client's buying power.")
                rejectionMsg = "O valor do pedido excede o poder de compra do cliente especificado."
            else if (rejectionMsg === "The specified user is not valid.")
                rejectionMsg = "O usu??rio especificado n??o ?? v??lido."
            else if (rejectionMsg === "The specified order is not allowed in PreOpen market state.")
                rejectionMsg = "A ordem especificada n??o ?? permitida no estado de mercado PreOpen."
            else if (rejectionMsg === "The specified client is not active.")
                rejectionMsg = "O cliente especificado n??o est?? ativo."
            else if (rejectionMsg === "Order value exceeds broker's cash limit.")
                rejectionMsg = "O valor do pedido excede o limite de caixa do corretor."
            else if (rejectionMsg === "Opposite side is not sufficient for this type of order to be fully consumed.")
                rejectionMsg = "O lado oposto n??o ?? suficiente para que esse tipo de pedido seja totalmente consumido."
            else if (rejectionMsg === "This action is prohibited for current user.")
                rejectionMsg = "Esta a????o ?? proibida para o usu??rio atual."
            else if (rejectionMsg === "you are not allowed to place an order as you are view only user.")
                rejectionMsg = "voc?? n??o tem permiss??o para fazer um pedido, pois voc?? ?? um usu??rio apenas para visualiza????o."
            else if (rejectionMsg === "You are not allowed to place an order as you are not active.")
                rejectionMsg = "Voc?? n??o tem permiss??o para fazer um pedido porque n??o est?? ativo."
            else if (rejectionMsg === "You are not allowed to place an order as you don't administering rights on selected user.")
                rejectionMsg = "Voc?? n??o tem permiss??o para fazer um pedido, pois n??o administra os direitos do usu??rio selecionado."
            else if (rejectionMsg === "Access Denied.")
                rejectionMsg = "Acesso negado."
            else if (rejectionMsg === "Specified client is not allowed to work from this terminal.")
                rejectionMsg = "O cliente especificado n??o tem permiss??o para trabalhar neste terminal."
            else if (rejectionMsg === "Specified expire date has reached.")
                rejectionMsg = "A data de expira????o especificada foi atingida."
            else if (rejectionMsg === "Quantity should be in volume limit.")
                rejectionMsg = "A quantidade deve estar no limite de volume."
            else if (rejectionMsg === "Market Administrator is Only allowed to Sell in Sell Out Market.")
                rejectionMsg = "O Administrador de Mercado s?? tem permiss??o para vender no Mercado de Vendas."
            else if (rejectionMsg === "Market Administrator is Only allowed to Buy in Buy In Market.")
                rejectionMsg = "O Administrador do Mercado s?? pode comprar no Mercado Buy In."
            else if (rejectionMsg === "Non Administrative user is only allowed to sell in BUY IN market.")
                rejectionMsg = "O usu??rio n??o administrativo s?? pode vender no mercado BUY IN."
            else if (rejectionMsg === "Non Administrative user is only allowed to buy in SELL OUT market.")
                rejectionMsg = "O usu??rio n??o administrativo s?? pode comprar no mercado SELL OUT."
            else if (rejectionMsg === "Only Limit is allowed in Odd Lot Market.")
                rejectionMsg = "Apenas Limite ?? permitido no mercado de lotes ??mpares."
            else if (rejectionMsg === "Order Volume must be less then the Board Lot.")
                rejectionMsg = "O Volume do Pedido deve ser menor que o Lote da Placa."
            else if (rejectionMsg === "The specified expire date is invalid.")
                rejectionMsg = "A data de expira????o especificada ?? inv??lida."
            else if (rejectionMsg === "The specified Market Maker for the symbol is invalid.")
                rejectionMsg = "O Market Maker especificado para o s??mbolo ?? inv??lido."
            else if (rejectionMsg === "Opposite side in the specified Quote rejected.")
                rejectionMsg = "Lado oposto na cota????o especificada rejeitada."
            else if (rejectionMsg === "The Quote Spread difference between sell order price and buy order price is invalid.")
                rejectionMsg = "A diferen??a do Spread de cota????o entre o pre??o da ordem de venda e o pre??o da ordem de compra ?? inv??lida."
            else if (rejectionMsg === "Quote Buy order price must be less then sell order price.")
                rejectionMsg = "O pre??o da ordem de compra deve ser menor que o pre??o da ordem de venda."
            else if (rejectionMsg === "Volume must be greater then minimum quote volume.")
                rejectionMsg = "O volume deve ser maior que o volume m??nimo de cota????o."
            else if (rejectionMsg === "Volume must be less then maximum quote volume.")
                rejectionMsg = "O volume deve ser menor que o volume m??ximo de cota????o."
            else if (rejectionMsg === "Value must be greater then minimum quote value.")
                rejectionMsg = "O valor deve ser maior que o valor m??nimo da cota????o."
            else if (rejectionMsg === "Value must be less then maximum quote value.")
                rejectionMsg = "O valor deve ser menor que o valor m??ximo da cota????o."
            else if (rejectionMsg === "Market Maker can only place limit orders.")
                rejectionMsg = "O Formador de Mercado s?? pode colocar ordens limitadas."
            else if (rejectionMsg === "Specified user can only place FOK in Quote Market.")
                rejectionMsg = "O usu??rio especificado s?? pode colocar FOK no mercado de cota????es."
            else if (rejectionMsg === "Market Maker is not allowed to initiate Negotiated deal.")
                rejectionMsg = "O Formador de Mercado n??o tem permiss??o para iniciar uma negocia????o negociada."
            else if (rejectionMsg === "Volume is not greater than zero.")
                rejectionMsg = "O volume n??o ?? maior que zero."
            else if (rejectionMsg === "Price is not greater than zero.")
                rejectionMsg = "O pre??o n??o ?? maior que zero."
            else if (rejectionMsg === "Trigger price is not a multiple of tick size.")
                rejectionMsg = "O pre??o do gatilho n??o ?? um m??ltiplo do tamanho do tick."
            else if (rejectionMsg === "Disclosed volume should be greater than or equal to allowed percentage.")
                rejectionMsg = "O volume divulgado deve ser maior ou igual ao percentual permitido."
            else if (rejectionMsg === "The specified odd market volume is not less than board lot.")
                rejectionMsg = "O volume de mercado ??mpar especificado n??o ?? inferior ao lote do tabuleiro."
            else if (rejectionMsg === "The specified execution condition is not valid.")
                rejectionMsg = "A condi????o de execu????o especificada n??o ?? v??lida."
            else if (rejectionMsg === "Invalid Trigger Price.")
                rejectionMsg = "Pre??o de accionamento inv??lido."
            else if (rejectionMsg === "The specified order side is not supported.")
                rejectionMsg = "O lado da ordem  especificado n??o ?? suportado."
            else if (rejectionMsg === "The specified custodian is invalid.")
                rejectionMsg = "O custodiante especificado ?? inv??lido."
            else if (rejectionMsg === "Invalid price for SL order.")
                rejectionMsg = "Pre??o inv??lido para pedido SL."
            else if (rejectionMsg === "System is in Offline mode.")
                rejectionMsg = "O sistema est?? no modo Offline."
            else if (rejectionMsg === "Not Found in Active List.")
                rejectionMsg = "N??o encontrado na lista activa."
            else if (rejectionMsg === "Minimum volume is zero.")
                rejectionMsg = "O volume m??nimo ?? zero."
            else if (rejectionMsg === "Minimum volume is greater than full volume.")
                rejectionMsg = "O volume m??nimo ?? maior que o volume total."
            else if (rejectionMsg === "Minimum volume is not multiple of board lot.")
                rejectionMsg = "O volume m??nimo n??o ?? m??ltiplo do lote do tabuleiro."
            else if (rejectionMsg === "The specified counter client is invalid.")
                rejectionMsg = "O cliente do contrario especificado ?? inv??lido."
            else if (rejectionMsg === "The specified order is not allowed in PostClose market state.")
                rejectionMsg = "A ordem especificada n??o ?? permitida no estado de mercado PostClose."
            else if (rejectionMsg === "Administrator Disapproved the Negotiated Order.")
                rejectionMsg = "O administrador reprovou o pedido negociado."
            else if (rejectionMsg === "CDC rejected the sent order.")
                rejectionMsg = "O CDC rejeitou a ordem enviada."
            else if (rejectionMsg === "CDC didn't reply in timely fashion.")
                rejectionMsg = "O CDC n??o respondeu em tempo ??til"
            else if (rejectionMsg === "Change volume is not less than previous volume")
                rejectionMsg = "O volume de mudan??a n??o ?? menor que o volume anterior"
            else if (rejectionMsg === "There is no opposite side for a market order in Dynamic Circuit Breaker Range")
                rejectionMsg = "N??o h?? lado oposto para uma ordem de mercado nos limites din??micos de varia????o de pre??os"
            else if (rejectionMsg === "Opposite side is not sufficient for this type of order, pre-approval")
                rejectionMsg = "Lado oposto n??o ?? suficiente para este tipo de pedido, pr??-aprova????o"
            else if (rejectionMsg === "unable to reach CDC web service.")
                rejectionMsg = "incapaz de acessar o servi??o web CDC."
            else if (rejectionMsg === "Change in volume is not allowed.")
                rejectionMsg = "N??o ?? permitido alterar o volume."
            else if (rejectionMsg === "The specified negotiated price is not in the valid range.")
                rejectionMsg = "O pre??o negociado especificado n??o est?? no intervalo v??lido."
            else if (rejectionMsg === "Repo Termination Date is Invalid or greater than REPO_MAX_MATURITY_DAYS.")
                rejectionMsg = "A data de encerramento do repo ?? inv??lida ou maior que REPO_MAX_MATURITY_DAYS."
            else if (rejectionMsg === "Repo Termination Date must be less than BOND Maturity date.")
                rejectionMsg = "A Data de Rescis??o do Compromisso deve ser menor que a Data de Vencimento do BOND."
            else if (rejectionMsg === "Repo b/w Proprietary accounts of same broker is not allowed.")
                rejectionMsg = "Repo b/w Contas propriet??rias do mesmo corretor n??o s??o permitidas."
            else if (rejectionMsg === "Different broker can perform Repo from their Proprietary accounts only.")
                rejectionMsg = "Diferentes corretores podem realizar Repo apenas de suas contas pr??prias"
            else if (rejectionMsg === "There must be at least one Settlement Member in Repo.")
                rejectionMsg = "Deve haver pelo menos um Membro do Acordo no Repo."
            else if (rejectionMsg === "Trading Session Start/End Time should be synchronized with Markets Open/Close Time.")
                rejectionMsg = "A hora de in??cio/t??rmino da sess??o de negocia????o deve ser sincronizada com a hora de abertura/fechamento dos mercados."
            else if (rejectionMsg === "The specified price is not in valid Dynamic Circuit Breaker Range.")
                rejectionMsg = "O pre??o especificado n??o est?? dentro dos limites din??micos de varia????o de pre??os"
            else if (rejectionMsg === "No Default Trader is defined for Counter Participant.")
                rejectionMsg = "Nenhum Negociador Padr??o ?? definido para o Participante Contr??rio"
            else if (rejectionMsg === "Custodian Disapproved the Order.")
                rejectionMsg = "O Custodiante reprovou a Ordem."
            else if (rejectionMsg === "Specified Negotiated Price is not in valid Negotiated Dynamic Circuit Breaker Range.")
                rejectionMsg = "O pre??o negociado especificado n??o est?? dentro dos limites din??micos de varia????o de pre??os"
            else if (rejectionMsg === "Connection between Exchange & Marlin has been broken, please contact administrator.")
                rejectionMsg = "A conex??o entre o Exchange e o Marlin foi interrompida, entre em contato com o administrador."
            else if (rejectionMsg === "No Connection between Exchange & Marlin, please contact administrator.")
                rejectionMsg = "Sem conex??o entre Exchange e Marlin, entre em contato com o administrador."

        }
        // ..........................................................................................................

        if (!('symbol' in data)) {
            orderConfirmMsg = data.rejection_message;
            alertMessage.type = 'danger';
        }
        else {
            if (marketType == 'Bond') {
                price = (data.price > 0) ? wijmo.Globalize.formatNumber(Number(data.price), 'n4') : 'Market';
                volume = wijmo.Globalize.formatNumber(Number(data.volume), 'n0');

                orderConfirmMsg = '';
                alertMessage.type = 'success';

                if (data.state === 'submitted') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Submitted: ' + AppUtility.ucFirstLetter(data.side) + ' ' +
                            data.symbol + ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' yield with Price ' + price + ', Order No. ' + data.order_no + ' in ' +
                            data.market + ' of ' + data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderSubmitted + AppUtility.ucFirstLetter(side) + ' ' +
                            data.symbol + ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' rendimento com Pre??o ' + price + ', N??mero do Pedido. ' + data.order_no + in_ +
                            data.market + of_ + data.exchange;
                    }
                }
                else if (data.state === 'changed') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Changed: ' + AppUtility.ucFirstLetter(data.side) + ' ' +
                            data.symbol + ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' yield with Price ' + price + ', Order No. ' + data.order_no + ' in ' +
                            data.market + ' of ' + data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderChanged + AppUtility.ucFirstLetter(side) + ' ' +
                            data.symbol + ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' rendimento com Pre??o ' + price + ', N??mero do Pedido. ' + data.order_no + in_ +
                            data.market + of_ + data.exchange;
                    }
                }
                else if (data.state === 'cancelled') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Cancelled: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol + ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' yield with Price ' +
                            price + ', Order No. ' + data.order_no + ' in ' + data.market + ' of ' + data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderCancelled + AppUtility.ucFirstLetter(side) + ' ' + data.symbol + ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' rendimento com Pre??o ' +
                            price + ', N??mero do Pedido. ' + data.order_no + in_ + data.market + of_ + data.exchange;
                    }
                }
                else if (data.state === 'received') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Received: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' yield with Price ' + price + ', Order No. ' + data.order_no + ' in ' + data.market + ' of ' +
                            data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderReceived + AppUtility.ucFirstLetter(side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' rendimento com Pre??o ' + price + ', N??mero do Pedido. ' + data.order_no + in_ + data.market + of_ +
                            data.exchange;
                    }
                }
                else if (data.state === 'purged') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Purged: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' yield with Price ' + price + ', Order No. ' + data.order_no + ' in ' + data.market + ' of ' +
                            data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderPurged + AppUtility.ucFirstLetter(side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' rendimento com Pre??o ' + price + ', N??mero do Pedido. ' + data.order_no + in_ + data.market + of_ +
                            data.exchange;
                    }
                }
                else if (data.state === 'rejected') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Rejected: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol + ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' yield with Price ' +
                            price + ' in ' + data.market + ' of ' + data.exchange + ', ' + data.rejection_message;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderRejected + AppUtility.ucFirstLetter(side) + ' ' + data.symbol + ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' rendimento com Pre??o ' +
                            price + in_ + data.market + of_ + data.exchange + ', ' + rejectionMsg;
                    }
                    alertMessage.type = 'danger';
                }
                else if (data.state === 'filled') {
                    // orderConfirmMsg = "Order Filled: " +", Order No. "+data.order_no+" in "+ data.market+" of "+ data.exchange;
                    //    orderConfirmMsg = "Order Traded: " +AppUtility.ucFirstLetter(data.side)+ " "+data.symbol+" "+volume+" @ "+
                    //     price + " in "+ data.market+" of "+ data.exchange;
                }
                else if (data.state === 'trade') {
                    if (this.lang == "en") {
                        AppUtility.printConsole('trade confirmation received' + JSON.stringify(data));
                        orderConfirmMsg = 'Order Traded: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' yield with Price ' + price + ', Remaining Volume ' + data.remaining_volume + ', Ticket No. ' +
                            data.ticket_no + ' in ' + data.market + ' of ' + data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        AppUtility.printConsole('trade confirmation received' + JSON.stringify(data));
                        orderConfirmMsg = OrderTraded + AppUtility.ucFirstLetter(side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + wijmo.Globalize.formatNumber(Number(data.yield), 'n4') + ' rendimento com Pre??o ' + price + ', Volume Restante ' + data.remaining_volume + ', N??mero do bilhete. ' +
                            data.ticket_no + in_ + data.market + of_ + data.exchange;
                    }
                }
                else if (data.state === 'partial_filled') {
                    // orderConfirmMsg = "Order Partial Traded: " + "Remaining Volume "+ volume +", Order No. "+data.order_no+" in "+ data.market+" of "+ data.exchange;
                }
            }
            else {
                price = (data.price > 0) ? wijmo.Globalize.formatNumber(Number(data.price), 'n4') : 'Market';
                volume = wijmo.Globalize.formatNumber(Number(data.volume), 'n0');

                orderConfirmMsg = '';
                alertMessage.type = 'success';

                if (data.state === 'submitted') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Submitted: ' + AppUtility.ucFirstLetter(data.side) + ' ' +
                            data.symbol + ' ' + volume + ' @ ' + price + ', Order No. ' + data.order_no + ' in ' +
                            data.market + ' of ' + data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderSubmitted + AppUtility.ucFirstLetter(side) + ' ' +
                            data.symbol + ' ' + volume + ' @ ' + price + ', N??mero do Pedido. ' + data.order_no + in_ +
                            data.market + of_ + data.exchange;
                    }
                }
                else if (data.state === 'changed') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Changed: ' + AppUtility.ucFirstLetter(data.side) + ' ' +
                            data.symbol + ' ' + volume + ' @ ' + price + ', Order No. ' + data.order_no + ' in ' +
                            data.market + ' of ' + data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderChanged + AppUtility.ucFirstLetter(side) + ' ' +
                            data.symbol + ' ' + volume + ' @ ' + price + ', N??mero do Pedido. ' + data.order_no + in_ +
                            data.market + of_ + data.exchange;
                    }
                }
                else if (data.state === 'cancelled') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Cancelled: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol + ' ' + volume + ' @ ' +
                            price + ', Order No. ' + data.order_no + ' in ' + data.market + ' of ' + data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderCancelled + AppUtility.ucFirstLetter(side) + ' ' + data.symbol + ' ' + volume + ' @ ' +
                            price + ', N??mero do Pedido. ' + data.order_no + in_ + data.market + of_ + data.exchange;
                    }
                }
                else if (data.state === 'received') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Received: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + price + ', Order No. ' + data.order_no + ' in ' + data.market + ' of ' +
                            data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderReceived + AppUtility.ucFirstLetter(side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + price + ', N??mero do Pedido. ' + data.order_no + in_ + data.market + of_ +
                            data.exchange;
                    }

                }
                else if (data.state === 'purged') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Purged: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + price + ', Order No. ' + data.order_no + ' in ' + data.market + ' of ' +
                            data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderPurged + AppUtility.ucFirstLetter(side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + price + ', N??mero do Pedido. ' + data.order_no + in_ + data.market + of_ +
                            data.exchange;
                    }
                }
                else if (data.state === 'rejected') {
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Rejected: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol + ' ' + volume + ' @ ' +
                            price + ' in ' + data.market + ' of ' + data.exchange + ', ' + data.rejection_message;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderRejected + AppUtility.ucFirstLetter(side) + ' ' + data.symbol + ' ' + volume + ' @ ' +
                            price + in_ + data.market + of_ + data.exchange + ', ' + rejectionMsg;
                    }
                    alertMessage.type = 'danger';
                }
                else if (data.state === 'filled') {
                    // orderConfirmMsg = "Order Filled: " +", Order No. "+data.order_no+" in "+ data.market+" of "+ data.exchange;
                    //    orderConfirmMsg = "Order Traded: " +AppUtility.ucFirstLetter(data.side)+ " "+data.symbol+" "+volume+" @ "+
                    //     price + " in "+ data.market+" of "+ data.exchange;
                }
                else if (data.state === 'trade') {
                    AppUtility.printConsole('trade confirmation received' + JSON.stringify(data));
                    if (this.lang == "en") {
                        orderConfirmMsg = 'Order Traded: ' + AppUtility.ucFirstLetter(data.side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + price + ', Remaining Volume ' + data.remaining_volume + ', Ticket No. ' +
                            data.ticket_no + ' in ' + data.market + ' of ' + data.exchange;
                    }
                    else if (this.lang == 'pt') {
                        orderConfirmMsg = OrderTraded + AppUtility.ucFirstLetter(side) + ' ' + data.symbol +
                            ' ' + volume + ' @ ' + price + ', Volume Restante ' + data.remaining_volume + ', N??mero do Bilhete. ' +
                            data.ticket_no + in_ + data.market + of_ + data.exchange;
                    }
                }
                else if (data.state === 'partial_filled') {
                    // orderConfirmMsg = "Order Partial Traded: " + "Remaining Volume "+ volume +", Order No. "+data.order_no+" in "+ data.market+" of "+ data.exchange;
                }
            }
        }


        // Added on 16-02-2016, to handle empty response on order confirmation
        if ('' === orderConfirmMsg.trim()) {
            alertMessage.message = AppConstants.UNKNOWN_ERROR_MSG;
            alertMessage.type = 'danger';
        }
        else {
            alertMessage.message = orderConfirmMsg;
        }

        return alertMessage;
    }



}
