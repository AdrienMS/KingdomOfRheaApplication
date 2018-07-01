export class Game {
    is_saved: boolean;
    datas: any[];

    constructor(is_saved, datas){
        this.is_saved = is_saved;
        this.datas = datas;
    }
}