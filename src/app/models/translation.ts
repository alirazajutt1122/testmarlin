import { Language } from "./language";

export class Translation {
    translationsId: Number = null;
    textContentId: Number = null;
    language: Language
    languageCode: String = '';
    translation: String = '';
    columnKey: String = '';

    constructor() {
        this.language = new Language()
    }
}