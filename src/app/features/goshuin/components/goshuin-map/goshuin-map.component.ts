import { AfterViewInit, Component, inject } from '@angular/core';
import * as L from 'leaflet';
import { TranslocoService } from "@jsverse/transloco";

@Component({
  selector: 'app-goshuin-map',
  standalone: true,
  imports: [],
  templateUrl: './goshuin-map.component.html',
  styleUrl: './goshuin-map.component.scss',
})
export class GoshuinMapComponent implements AfterViewInit {
  private readonly translocoService = inject(TranslocoService);
  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map('map', {
      center: [35.6895, 139.6917], // Tokyo
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: this.translocoService.translate('goshuin.map.attribution')
    }).addTo(this.map);
  }
}
