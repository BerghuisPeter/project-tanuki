import { AfterViewInit, Component } from '@angular/core';
import { Map, NavigationControl } from 'maplibre-gl';

@Component({
  selector: 'app-goshuin-map',
  standalone: true,
  imports: [],
  templateUrl: './goshuin-map.component.html',
  styleUrl: './goshuin-map.component.scss',
})
export class GoshuinMapComponent implements AfterViewInit {
  private map!: Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = new Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [139.6917, 35.6895], // Tokyo [lng, lat]
      zoom: 7
    });

    this.map.addControl(new NavigationControl());
  }
}
