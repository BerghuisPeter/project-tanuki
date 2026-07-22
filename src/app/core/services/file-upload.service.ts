import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly httpBackend = inject(HttpBackend);
  private readonly externalHttpClient: HttpClient;

  constructor() {
    // Create a dedicated HttpClient that uses HttpBackend to bypass interceptors
    // This ensures that internal Authorization headers are not sent to external URLs (like GCS)
    this.externalHttpClient = new HttpClient(this.httpBackend);
  }

  /**
   * Upload a file to a signed URL without using standard HttpClient interceptors.
   * @param url The signed URL.
   * @param file The file to upload.
   * @returns An Observable of the upload event.
   */
  uploadFile(url: string, file: File): Observable<HttpEvent<unknown>> {
    return this.externalHttpClient.request('PUT', url, {
      body: file,
      headers: { 'Content-Type': file.type },
      reportProgress: true,
      observe: 'events'
    });
  }
}
