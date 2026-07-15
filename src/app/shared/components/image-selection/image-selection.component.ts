import { ChangeDetectionStrategy, Component, computed, input, OnDestroy, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface PreviewImage {
  id: number;
  file: File;
  previewUrl: string;
}

type ImageVisualization = 'circle' | 'rounded' | 'square';

@Component({
  selector: 'app-image-selection',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './image-selection.component.html',
  styleUrl: './image-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageSelectionComponent implements OnDestroy {
  readonly maxImages = input(1);
  readonly maxFileSizeMb = input(5);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly acceptedTypes = input<string[]>(['image/jpeg', 'image/png', 'image/webp']);
  readonly currentImageUrl = input<string | null>(null);
  readonly imageVisualization = input<ImageVisualization>('circle');
  readonly previewAlt = input('Image preview');
  readonly label = input('Upload images');
  readonly hint = input('JPEG, PNG and WEBP are supported.');

  readonly filesChanged = output<File[]>();
  readonly removeRequested = output<void>();

  readonly selectedImages = signal<PreviewImage[]>([]);
  readonly errorMessage = signal<string | null>(null);
  readonly isProcessing = signal(false);
  readonly previewError = signal(false);

  readonly isBusy = computed(() => this.loading() || this.isProcessing());
  readonly selectedCount = computed(() => this.selectedImages().length);
  readonly displayCount = computed(() => {
    if (this.selectedCount() > 0) {
      return this.selectedCount();
    }

    return this.currentImageUrl() ? 1 : 0;
  });
  readonly acceptAttribute = computed(() => this.acceptedTypes().join(','));
  readonly previewUrl = computed(() => {
    const selectedImage = this.selectedImages().at(-1);
    if (selectedImage) {
      return selectedImage.previewUrl;
    }

    return this.currentImageUrl();
  });
  readonly canRemove = computed(() => !this.disabled() && !this.isBusy() && !!this.previewUrl());
  private nextPreviewId = 0;

  triggerFileSelection(input: HTMLInputElement): void {
    if (this.disabled() || this.isBusy()) {
      return;
    }

    input.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    input.value = '';

    if (!files.length || this.disabled() || this.isBusy()) {
      return;
    }

    this.previewError.set(false);
    this.addFiles(files);
  }

  onPreviewError(): void {
    this.previewError.set(true);
  }

  onRemoveClicked(): void {
    if (!this.canRemove()) {
      return;
    }

    if (this.selectedCount() > 0) {
      this.reset();
      return;
    }

    this.removeRequested.emit();
  }

  ngOnDestroy(): void {
    this.revokeAllObjectUrls();
  }

  reset(): void {
    this.revokeAllObjectUrls();
    this.selectedImages.set([]);
    this.errorMessage.set(null);
    this.previewError.set(false);
    this.propagateChanges();
  }

  private addFiles(files: File[]): void {
    const validationResult = this.validateFiles(files);

    if (!validationResult.validFiles.length) {
      this.errorMessage.set(validationResult.message ?? 'No valid files were selected.');
      return;
    }

    this.isProcessing.set(true);

    const currentImages = this.selectedImages();
    const newPreviewImages = validationResult.validFiles.map((file) => this.toPreviewImage(file));

    let nextImages: PreviewImage[];
    const totalCount = currentImages.length + newPreviewImages.length;

    if (totalCount <= this.maxImages()) {
      nextImages = [...currentImages, ...newPreviewImages];
    } else {
      nextImages = [...currentImages, ...newPreviewImages].slice(-this.maxImages());
    }

    currentImages
      .filter((image) => !nextImages.some((nextImage) => nextImage.id === image.id))
      .forEach((image) => URL.revokeObjectURL(image.previewUrl));

    this.selectedImages.set(nextImages);

    if (validationResult.message) {
      this.errorMessage.set(validationResult.message);
    } else {
      this.errorMessage.set(null);
    }

    this.isProcessing.set(false);
    this.propagateChanges();
  }

  private validateFiles(files: File[]): { validFiles: File[]; message: string | null } {
    const maxFileSizeBytes = this.maxFileSizeMb() * 1024 * 1024;
    const acceptedTypes = this.acceptedTypes();

    const validFiles: File[] = [];
    let invalidTypeCount = 0;
    let invalidSizeCount = 0;

    files.forEach((file) => {
      const hasValidType = acceptedTypes.includes(file.type);
      const hasValidSize = file.size <= maxFileSizeBytes;

      if (!hasValidType) {
        invalidTypeCount += 1;
        return;
      }

      if (!hasValidSize) {
        invalidSizeCount += 1;
        return;
      }

      validFiles.push(file);
    });

    if (!invalidTypeCount && !invalidSizeCount) {
      return { validFiles, message: null };
    }

    const messages: string[] = [];
    if (invalidTypeCount) {
      messages.push(`${invalidTypeCount} file(s) have an unsupported format.`);
    }
    if (invalidSizeCount) {
      messages.push(`${invalidSizeCount} file(s) exceed ${this.maxFileSizeMb()}MB.`);
    }

    return { validFiles, message: messages.join(' ') };
  }

  private toPreviewImage(file: File): PreviewImage {
    return {
      id: ++this.nextPreviewId,
      file,
      previewUrl: URL.createObjectURL(file)
    };
  }

  private revokeAllObjectUrls(): void {
    this.selectedImages().forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });
  }

  private propagateChanges(): void {
    const files = this.selectedImages().map((image) => image.file);
    this.filesChanged.emit(files);
  }
}
