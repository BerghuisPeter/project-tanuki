import { computed, Injectable, signal } from '@angular/core';

export interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionState | null;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly state = signal<LocationState>({
    coords: null,
    error: null,
    loading: false,
    permissionStatus: null
  });

  readonly locationState = this.state.asReadonly();
  readonly coords = computed(() => this.state().coords);
  readonly error = computed(() => this.state().error);
  readonly loading = computed(() => this.state().loading);
  readonly permissionStatus = computed(() => this.state().permissionStatus);

  async checkPermission() {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        this.state.update(s => ({ ...s, permissionStatus: result.state }));
        result.onchange = () => {
          this.state.update(s => ({ ...s, permissionStatus: result.state }));
        };
      } catch (e) {
        console.error('Error checking location permission', e);
      }
    }
  }

  ensureLocation(): void {
    const { coords, loading, error, permissionStatus } = this.state();
    if (coords || loading || error || permissionStatus === 'denied') return;
    this.refreshLocation();
  }

  refreshLocation() {
    this.checkPermission();
    if (!('geolocation' in navigator)) {
      this.state.update(s => ({ ...s, error: 'Geolocation not supported' }));
      return;
    }

    this.state.update(s => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.state.update(s => ({
          ...s,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          loading: false,
          error: null
        }));
      },
      (error) => {
        let errorMessage = 'Unknown error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout';
            break;
        }
        this.state.update(s => ({
          ...s,
          loading: false,
          error: errorMessage,
          coords: null
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }
}
