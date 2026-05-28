import { AfterViewInit, Component, inject } from '@angular/core';
import { Map, NavigationControl } from 'maplibre-gl';
import { AppConfigService } from "../../../../core/services/app-config.service";

@Component({
  selector: 'app-goshuin-map',
  standalone: true,
  imports: [],
  templateUrl: './goshuin-map.component.html',
  styleUrl: './goshuin-map.component.scss',
})
export class GoshuinMapComponent implements AfterViewInit {
  private map!: Map;
  private readonly appConfig = inject(AppConfigService);

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = new Map({
      container: 'map',
      style: `${this.appConfig.get("NG_APP_TILE_SERVER_URL")}/styles/basic-preview/style.json`,
      center: [139.6917, 35.6895], // Tokyo [lng, lat]
      zoom: 5
    });

    this.map.addControl(new NavigationControl());

    this.map.on('load', () => {
      this.map.getStyle().layers?.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && 'text-field' in layer.layout) {
          const textField = layer.layout['text-field'];
          if (textField) {
            this.map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', 'name:en'],
              ['get', 'name_en'],
              ['get', 'name']
            ]);
          }
        }
      });
    });
  }
}
