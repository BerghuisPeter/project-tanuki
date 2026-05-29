import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, NavigationControl, ScaleControl } from 'maplibre-gl';
import { AppConfigService } from 'src/app/core/services/app-config.service';

@Component({
  selector: 'app-goshuin-map',
  standalone: true,
  imports: [],
  templateUrl: './goshuin-map.component.html',
  styleUrl: './goshuin-map.component.scss',
})
export class GoshuinMapComponent implements AfterViewInit, OnDestroy {
  private map!: Map;
  private readonly appConfig = inject(AppConfigService);

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    const japanBounds: LngLatBounds | [LngLatLike, LngLatLike] | [number, number, number, number] = [
      [122.0, 20.0], // southwest lng/lat
      [154.0, 46.0], // northeast lng/lat
    ];

    const tokyo: LngLatLike = [139.6917, 35.6895]; // Tokyo [lng, lat]

    this.map = new Map({
      container: 'map',
      style: `${this.appConfig.get("NG_APP_TILE_SERVER_URL")}/styles/basic-preview/style.json`,
      center: tokyo,
      maxBounds: japanBounds,
      zoom: 8,
      minZoom: 4,
      maxZoom: 18,
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
      cooperativeGestures: true,
      attributionControl: false,
      renderWorldCopies: false,
      maxTileCacheSize: 512,
    });

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

    // Disable rotation completely
    this.map.touchZoomRotate.disableRotation();
    this.map.dragRotate.disable();

    // Add controls
    this.map.addControl(
      new NavigationControl({
        visualizePitch: false,
        showCompass: true,
      }),
      'top-right'
    );

    this.map.addControl(
      new ScaleControl({
        unit: 'metric',
      })
    );
  }
}
