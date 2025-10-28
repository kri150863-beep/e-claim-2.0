import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    imports: [MatIconModule, CommonModule],
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
    @Output() filesSelected = new EventEmitter<File[]>();
    isDragOver = false;
    uploadedFiles: File[] = [];

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;

        if (event.dataTransfer?.files) {
            this.handleFiles(event.dataTransfer.files);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.handleFiles(input.files);
        }
    }

    private handleFiles(files: FileList) {
        const maxSize = 50 * 1024 * 1024; // 50MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml'];

        Array.from(files).forEach(file => {
            if (file.size > maxSize) {
                console.warn(`File ${file.name} exceeds maximum size of 50MB`);
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                console.warn(`File ${file.name} has unsupported type: ${file.type}`);
                return;
            }

            this.uploadedFiles.push(file);
        });

        if (this.uploadedFiles.length > 0) {
            this.filesSelected.emit([...this.uploadedFiles]);
        }
    }

    removeFile(file: File) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
        this.filesSelected.emit([...this.uploadedFiles]);
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}