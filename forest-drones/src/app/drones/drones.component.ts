import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DroneApiService, Drone, Drones,DamagedTree } from '../drone-api.service';

@Component({
  selector: 'app-drones',
  templateUrl: './drones.component.html',
  styleUrls: ['./drones.component.css'],
})
export class DronesComponent implements OnInit {
  public inputX?: number;
  public inputY?: number;

  public nearestDist?: number;

  public drones!: Drones;

  constructor(
    private router: Router,
    public droneApiService: DroneApiService
  ) {}

  ngOnInit(): void {
    this.droneApiService.getDrones().subscribe((data) => {
      this.drones = data;
    });
  }

  public droneSettingsPage(id: number): void {
    this.router.navigate(['/drone-settings', id]);
  }

  public UpdatePos() {
    if (this.droneApiService.foresterX != null && this.inputX == null) {
      this.inputX = this.droneApiService.foresterX;
    }
    if (this.droneApiService.foresterY != null && this.inputY == null) {
      this.inputY = this.droneApiService.foresterY;
    }

    this.droneApiService.foresterX = this.inputX;
    this.droneApiService.foresterY = this.inputY;
  }

  public checkPos(x: number, y: number) {
    if (
      this.droneApiService.foresterX == x &&
      this.droneApiService.foresterY == y
    ) {
      return true;
    }
    return false;
  }

  public examinedTree(x: number, y: number) {
    this.droneApiService.examinedTree(x, y).subscribe((data) => {
      if (data.x == x && data.y == y) {
        this.droneApiService.allKnownScans?.damagedTrees.forEach((tree) => {
          if (tree.x == x && tree.y == y) {
            this.droneApiService.allKnownScans?.damagedTrees.splice(
              this.droneApiService.allKnownScans.damagedTrees.indexOf(tree),
              1
            );
          }
        });
      }
    });
  }

  public getClosestTree(): DamagedTree {
    let closestTree!: DamagedTree;
    this.droneApiService.allKnownScans?.damagedTrees.forEach((tree) => {
      if (closestTree == null) {
        closestTree = tree;
      } else if (
        this.droneApiService.foresterX != null &&
        this.droneApiService.foresterY != null
      ) {
        if (
          Math.abs(this.droneApiService.foresterX - tree.x) +
            Math.abs(this.droneApiService.foresterY - tree.y) <
          Math.abs(this.droneApiService.foresterX - closestTree.x) +
            Math.abs(this.droneApiService.foresterY - closestTree.y)
        ) {
          closestTree = tree;
          this.nearestDist =
            Math.abs(this.droneApiService.foresterX - tree.x) +
            Math.abs(this.droneApiService.foresterY - tree.y);
        }
      }
    });
    return closestTree;
  }

  public callDroneAndScan(id:number){
    this.droneApiService.callDrone(id).subscribe(
      (data) => {
        this.droneApiService.scan(id).subscribe(
          (data) => {
            this.droneApiService.addScans(data);
            this.drones.forEach((drone) => {
              if (drone.id == id) {
                drone.position!.x = data.dronePosition.x;
                drone.position!.y = data.dronePosition.y;
              }
            });
      });
    });
  }
}
