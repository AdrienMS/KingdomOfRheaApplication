export class Choice {
    id: number;
    kinematicId: number;
    text: string;
    image: string;
    start: number;
    is_travel: boolean;
    is_travel_end: boolean;

    constructor(id, kinematicId, text, image, start, is_travel, is_travel_end){
        this.id = id;
        this.kinematicId = kinematicId;
        this.text = text;
        this.image = image;
        this.start = start;
        this.is_travel = is_travel;
        this.is_travel_end = is_travel_end;
    }
}