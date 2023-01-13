import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DronesComponent } from './drones/drones.component';
import { DroneSettingsComponent } from './drone-settings/drone-settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/drones', pathMatch: 'full' },
  { path: 'drones', component: DronesComponent },
  { path: 'drone-settings/:id', component: DroneSettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
