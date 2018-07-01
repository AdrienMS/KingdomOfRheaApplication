export class JsonProvider {
    private jsonFiles = [
        {name: 'characters', path: '../data/json/characters.json'},
        {name: 'game', path: '../data/json/game.json'},
        {name: 'kinematics', path: '../data/json/kinematics.json'},
        {name: 'quests', path: '../data/json/quests.json'},
        {name: 'choices', path: '../data/json/choices.json'},
        {name: 'stuffs', path: '../data/json/stuffs.json'},
        {name: 'inventory', path: '../data/json/inventory.json'},
        {name: 'places', path: '../data/json/place.json'},
    ]

    constructor() {}

    public read_json(json_file) {
        return this.load_json(json_file);
    }

    private load_json(json_file) {
        var actual_JSON = null;
        this.loadJSON(function(response) {
            // Parse JSON string into object
            actual_JSON = JSON.parse(response);
        }, json_file);
        return actual_JSON;
    }

    private loadJSON(callback, json_file) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("json/kinematics");
        xobj.open('GET', json_file, false);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == 200) {
                callback(xobj.responseText);
                return xobj.responseText;
            }
        };
        xobj.send(null);
    }

    public saveInLocalStorage() {
        let file = '';
        for (let i = 0; i < this.jsonFiles.length; i += 1) {
            file = this.read_json(this.jsonFiles[i].path);
            localStorage.setItem(this.jsonFiles[i].name, JSON.stringify(file));
        }
    }

    public getJson(json_name: string) {
        return JSON.parse(localStorage.getItem(json_name));
    }

    public writeJson(json_name: string, datas: {}) {
        localStorage.setItem(json_name, JSON.stringify(datas));
    }
}
