import {
  Component,
  HostListener,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import Swal from 'sweetalert2';

@Pipe({
  name: 'contentTypeToExtension',
  standalone: true,
  pure: true,
})
export class ContentTypeToExtensionPipe implements PipeTransform {
  private readonly contentTypeMap: { [key: string]: string } = {
    '*': 'Any',
    'image/*': 'Image',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      '.pptx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      '.docx',
    'application/msword': '.doc',
    'text/plain': '.txt',
    'application/zip': '.zip',
    'application/x-rar-compressed': '.rar',
    default: '',
  };

  transform(contentTypes: string[] | string): string {
    const isArray = Array.isArray(contentTypes);
    if (isArray) {
      return contentTypes
        .map(
          (contentType) =>
            this.contentTypeMap[contentType] || this.contentTypeMap['default']
        )
        .join(', ');
    } else {
      return (
        this.contentTypeMap[contentTypes] || this.contentTypeMap['default']
      );
    }
  }
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [ContentTypeToExtensionPipe],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Output() fileDropped = new EventEmitter<FileList>();
  @Input() fileName = '';
  @Input() options: { accept?: string[]; max_size?: number } = {};

  constructor(private el: ElementRef) {}

  get accept() {
    return this.options?.accept || ['image/*', 'application/pdf'];
  }

  get max_size() {
    return this.options?.max_size || 5 * 1024 * 1024;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.el.nativeElement.classList.add('dragover');
    console.log('dragover', event.target);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.el.nativeElement.classList.remove('dragover');
    console.log('dragleave', event.target);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.el.nativeElement.classList.remove('dragover');
    const files = event.dataTransfer?.files;
    if (files) {
      this.fileDropped.emit(files);
    }
    console.log('drop');
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      const fileListLength = files.length;
      for (let i = 0; i < fileListLength; i++) {
        const selectedFile = files[i];
        if (selectedFile.size > this.max_size) {
          Swal.fire({
            title: 'Error',
            text: `File size must be less than ${this.fileSizeToFriendlyString(
              this.max_size
            )}`,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
          return;
        }

        if (
          !this.accept.includes('*') &&
          !this.accept.includes(selectedFile.type) &&
          !this.accept.includes(selectedFile.type.split('/')[0] + '/*')
        ) {
          Swal.fire({
            title: 'Error',
            text: `File type must be ${
              this.accept.length === 1 ? '' : 'one among '
            } ${new ContentTypeToExtensionPipe().transform(this.accept)}`,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
          return;
        }
      }
      this.fileDropped.emit(files);
    }
  }

  fileSizeToFriendlyString(size: number): string {
    let unit = 'B';

    if (size < 1024) {
      return `${size} ${unit}`;
    } else if (size < 1024 * 1024) {
      size = size / 1024;
      unit = 'KB';
    } else if (size < 1024 * 1024 * 1024) {
      size = size / (1024 * 1024);
      unit = 'MB';
    } else {
      size = size / (1024 * 1024 * 1024);
      unit = 'GB';
    }
    return size % 1 === 0 ? `${size} ${unit}` : `${size.toFixed(2)} ${unit}`;
  }
}
