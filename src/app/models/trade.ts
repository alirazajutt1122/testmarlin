import { AppUtility } from '../app.utility';

export class Trade
{
    price: number;
    time: Date;
    formattedTime: string;
    volume: number;

    // ------------------------------------------------------------------------

    static updateTrades(data): Trade[]
    {
        let trades: Trade[] = [];
        if ( data != null && data !== 'undefined')
        {
            for ( let i = 0; i < data.length; i++)
            {
                let trade = new Trade();
                trade.price = Number(data[i].price);
                trade.time = new Date(data[i].time);
                trade.formattedTime = AppUtility.formatTime(data[i].time);
                trade.volume = data[i].volume;

                trades[i] = trade;
            }
        }

        return trades;
    }
}
