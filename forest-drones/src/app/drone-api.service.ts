import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export type Drones = Drone[];

export interface Drone {
  id: number;
  isActive: boolean;
  position?: Position;
}

export interface Position {
  x: number;
  y: number;
}

export interface ScanResult {
  dronePosition: DronePosition;
  damagedTrees: DamagedTree[];
}

export interface DronePosition {
  x: number;
  y: number;
}

export interface DamagedTree {
  x: number;
  y: number;
}


@Injectable({
  providedIn: 'root',
})
export class DroneApiService {
  public foresterX?: number;
  public foresterY?: number;

  public allKnownScans?: ScanResult;

  public addScans(scan: ScanResult): void {
    let alreadyIn = false;
    if (this.allKnownScans == null) {
      this.allKnownScans = scan;
    } else {
      scan.damagedTrees.forEach((scanTree) => {
        this.allKnownScans?.damagedTrees.forEach((damagedTree) => {
      if (scanTree.x === damagedTree.x && scanTree.y === damagedTree.y) {
          alreadyIn = true;
      }
      });
      if (!alreadyIn) {
          this.allKnownScans?.damagedTrees?.push(scanTree);
          alreadyIn = false;
  }
});
    }
  }

  constructor(private http: HttpClient) {}

  public getDrones(): Observable<Drones> {
    return this.http.get<Drones>('http://localhost:5110/drones');
  }

  public activateDrone(id: number): Observable<unknown> {
    return this.http.post(`http://localhost:5110/drones/${id}/activate`, {});
  }

  public deactivateDrone(id: number): Observable<unknown> {
    return this.http.post(`http://localhost:5110/drones/${id}/shutdown`, {});
  }

  public callDrone(id: number): Observable<Position> {
    return this.http.post<Position>(
      `http://localhost:5110/drones/${id}/flyTo`,
      {
        x: this.foresterX,
        y: this.foresterY,
      }
    );
  }

  public scan(id: number): Observable<ScanResult> {
    return this.http.get<ScanResult>(`http://localhost:5110/drones/${id}/scan`);
  }

  public examinedTree(x:number,y:number): Observable<Position>{
    return this.http.post<Position>(`http://localhost:5110/trees/markAsExamined`,{
      x: x,
      y: y
    });
  }
}
