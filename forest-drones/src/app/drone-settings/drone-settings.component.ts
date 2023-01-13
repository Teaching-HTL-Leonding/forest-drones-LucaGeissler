import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Drone, DroneApiService, ScanResult,DamagedTree } from '../drone-api.service';

@Component({
  selector: 'app-drone-settings',
  templateUrl: './drone-settings.component.html',
  styleUrls: ['./drone-settings.component.css'],
})
export class DroneSettingsComponent implements OnInit {
  public drone!: Drone;
  public droneId !: number;
  public scanResult!: ScanResult;

  constructor(
    private router: ActivatedRoute,
    public droneApiService: DroneApiService
  ) {}

  ngOnInit(): void {
    this.droneId = Number(this.router.snapshot.paramMap.get('id'));
    this.droneApiService.getDrones().subscribe((data) => {
      data.forEach(drone => {
        if (drone.id === this.droneId) {
          this.drone = drone;
        }
      });
    });
  }

  public droneActivate(id:number){
    this.droneApiService.activateDrone(id).subscribe(
      (data) => {
        this.drone.isActive = true;
      }
    );
  }

  public droneDeactivate(id:number){
    this.droneApiService.deactivateDrone(id).subscribe(
      (data) => {
        this.drone.isActive = false;
      }
    );
  }

  public callDrone(id:number){
    this.droneApiService.callDrone(id).subscribe(
      (data) => {
        this.drone.position = data;
      }
    );
  }

  public scan(id:number){
    this.droneApiService.scan(id).subscribe(
      (data) => {
        this.scanResult = data;
        this.droneApiService.addScans(data);
      }
    );
  }

}
