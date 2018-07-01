import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//data
import { Kinematic } from '../data/kinematic';
import { JsonProvider } from '../data/json';

@Injectable()
export class KinematicProvider {
    kinematics: Kinematic[] = [];
    kinematic_json: string = '../data/json/kinematics.json';
    private json: JsonProvider = new JsonProvider();

  constructor() {
    //this.kinematics = json.read_json(this.kinematic_json);
    this.refresh();
  }

  public getById(id) {
    this.refresh();
    if (id < this.kinematics.length) {
        return this.kinematics[id];
    }
    return null;
  }

  public modify(id) {
    let kinematic = this.getById(id);
    this.json.writeJson('currentKinematic', {kinematic: kinematic});
  }

  public refresh() {
    this.kinematics = this.json.getJson('kinematics');
    if (this.kinematics != null && this.kinematics["kinematics"] != undefined) {
        this.kinematics = this.kinematics["kinematics"];
    } else {
        this.kinematics = null;
    }
  }

  public getFromStorage() {
    return this.json.getJson('currentKinematic').kinematic;
  }
}
