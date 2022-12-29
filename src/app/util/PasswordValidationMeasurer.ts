import { AppUtility } from '../app.utility';

export class PasswordValidationMeasurer {
  // password categories that are graded - these are stored as class variables in case access is required in the future
  private _characters: number = 0;
  private _capitals: number = 0;
  private _lower: number = 0;
  private _number: number = 0;
  private _special: number = 0;

  // FUR (Frequently used RegEx)
  private _upperCase: RegExp;
  private _lowerCase: RegExp;
  private _alphabets: RegExp;
  private _numbers: RegExp;
  private _specialchars: RegExp;

  constructor() {
    this._upperCase = new RegExp('[A-Z]');
    this._lowerCase = new RegExp('[a-z]');
    this._alphabets = new RegExp('[A-Za-z]');
    this._numbers = new RegExp('[0-9]');
    // this._specialchars = new RegExp('[~!@#$%^&*()\\-_]*');
    this._specialchars = new RegExp('[!,%,&,@,#,$,^,*,\\-,_,~,),(]');
  }

  /**
   * Measure the strength of the supplied password on a scale of 0-3 
   *
   * @param password: string - String representing a candicate password
   *
   * @return number - 0 = invalid, 1 = low, 2 = medium, 3 = high
   */
  public measure(password: string): number {
    this._characters = 0;
    this._capitals = 0;
    this._lower = 0;
    this._number = 0;
    this._special = 0;

    let level: number = 0;  //  invalid
    let len: number = password.length;
    let char_result: boolean = null;

    if (len >= 8) {
      if (password.match(this._upperCase))
        level++;

      if (password.match(this._lowerCase))
        level++;

      if (password.match(this._numbers))
        level++;

      char_result = this.isValidSpecialCharacters(password);
      if (char_result !== null) {
        if (char_result)
          level++;
        else if (!char_result)
          level = 0;
      }

      if (level === 4)
        level = 3;  //  high
      else if (level === 3)
        level = 2;  //  medium
      else if (level === 1)
        level = 0;  //  invalid
    }
    else {
      level = 1;
      char_result = this.isValidSpecialCharacters(password);
      if (char_result !== null)
        if (!char_result)
          level = 0;
    }
    return level;
  }

  private isValidSpecialCharacters(_pwd: string): boolean {
    let result: boolean = true;
    let char_count: number = 0;
    for (let index = 0; index < _pwd.length; index++) {
      if (!(_pwd.charAt(index).match(this._alphabets) || _pwd.charAt(index).match(this._numbers))) {
        //  it means current character is special character
        if (!(_pwd.charAt(index).match(this._specialchars))) {
          result = false;  //  invalid
          break;
        }
      }
      else {
        char_count++;
      }
    }
    if (_pwd.length === char_count) //  it means no special character exist
      result = null;
    return result;
  }
}
