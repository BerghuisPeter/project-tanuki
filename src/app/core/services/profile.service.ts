import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreferencesProfileService, UploadUrlResponse } from 'src/openApi/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly preferencesProfileService = inject(PreferencesProfileService);
  private readonly httpBackend = inject(HttpBackend);
  private readonly externalHttpClient: HttpClient;

  constructor() {
    // Create a dedicated HttpClient that uses HttpBackend to bypass interceptors
    this.externalHttpClient = new HttpClient(this.httpBackend);
  }

  /**
   * Request a signed URL from the backend for avatar upload.
   * @param contentType The MIME type of the file to be uploaded.
   * @returns An Observable emitting the signed URL response.
   */
  getSignedUrl(contentType: string): Observable<UploadUrlResponse> {
    return this.preferencesProfileService.getAvatarUploadUrl(contentType);
  }

  /**
   * Upload a file to a GCS signed URL without using standard HttpClient interceptors.
   * This ensures that internal Authorization headers are not sent to GCS.
   * @param url The signed URL.
   * @param file The file to upload.
   * @returns An Observable of the upload event.
   */
  uploadFile(url: string, file: File): Observable<HttpEvent<any>> {
    return this.externalHttpClient.request('PUT', url, {
      body: file,
      headers: { 'Content-Type': file.type },
      reportProgress: true,
      observe: 'events'
    });
  }
}
