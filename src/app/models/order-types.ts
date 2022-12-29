import { AppUtility } from '../app.utility';

///////////////////////////////////////////////////////////

export class OrderTypes
{
    id: Number;
    code: String;
    description: String;
    selected: boolean;

    // -------------------------------------------------------------

    public static getOrderTypeViewStr(type: string): string
    {
        let lcType = type.toLowerCase();
        if (lcType === 'sl')
        {
            return 'Stop Limit';
        }
        else if (lcType === 'sm')
        {
            return 'Stop';
        }
        else if (lcType === 'limit' || lcType === 'gtc' || lcType === 'gtd' || lcType === 'fok' ||
                 lcType === 'ioc' || lcType === 'ho')
        {
            return 'Limit';
        }
        else
        {
            return AppUtility.ucFirstLetter(type);
        }

    }

    // -------------------------------------------------------------

    public static getOrderTypeServerStr(type: string): string
    {
        if (type.toLowerCase() === 'sl' || type.toLowerCase() === 'stop limit')
        {
            return 'sl';
        }
        else if (type.toLowerCase() === 'sm' ||
                 type.toLowerCase() === 'stop' ||
                 type.toLowerCase() === 'stop market')
        {
            return 'sm';
        }
        else
        {
            return type.toLowerCase();
        }
    }
}
