import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, NavigationControl } from 'maplibre-gl';
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
      style: `${this.appConfig.get("NG_APP_TILE_SERVER_URL")}/styles/goshuin/style.json`,
      center: tokyo,
      maxBounds: japanBounds,
      zoom: 8,
      minZoom: 4,
      maxZoom: 18,
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
      attributionControl: false,
      renderWorldCopies: false,
      maxTileCacheSize: 512,
    });

    // Disable rotation completely
    this.map.touchZoomRotate.disableRotation();
    this.map.dragRotate.disable();

    // Add controls
    this.map.addControl(
      new NavigationControl({
        visualizePitch: false,
        showCompass: false,
        showZoom: false,
      }),
      'top-right'
    );
  }
}
