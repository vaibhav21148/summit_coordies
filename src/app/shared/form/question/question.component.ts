import {
  Component,
  Input,
  Output,
  EventEmitter,
  Pipe,
  PipeTransform,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  Form,
  FormControl,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Question } from './question';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { OrderingQuestionComponent } from '../ordering-question/ordering-question.component';
import { OtpComponent } from '../otp/otp.component';
import Swal from 'sweetalert2';
import { RegisterService } from '@services/register.service';
import { MultiSelectComponent } from '../multi-select/multi-select.component';

@Pipe({ name: 'valerrors', pure: true, standalone: true })
export class ValidationErrorsPipe implements PipeTransform {
  transform(errors: ValidationErrors): string {
    if (!errors) return '';

    const errStrings = Object.entries(errors).map(([key, value]) => {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'email':
          return 'Invalid email';
        case 'minlength':
          return `Must be at least ${value.requiredLength} characters long`;
        case 'maxlength':
          return `Cannot be more than ${value.requiredLength} characters long`;
        case 'pattern':
          return 'Invalid format';
        default:
          return 'Invalid value';
      }
    });
    return errStrings.join('<br />');
  }
}

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadComponent,
    ValidationErrorsPipe,
    OrderingQuestionComponent,
    OtpComponent,
    MultiSelectComponent,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent {
  @Input() question!: Question<string>;
  @Input() form!: FormGroup;
  @Input() _rootForm?: FormGroup;
  @Input() prefix?: string;
  @Input() index?: number;
  @Input() noMargin = false;
  @Input() supressInfo = false;

  @Output() fileDropped = new EventEmitter<FileList>();

  private registerService = inject(RegisterService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    if (this.question.showIf) {
      this.rootForm?.valueChanges.subscribe(() => {
        this.cdr.markForCheck();
      });
    }

    if (this.question.controlType === 'list') {
      if (this.question.listTypeOptions?.min) {
        while (
          this.question.listTypeOptions!.min > this.controlChildren.length
        ) {
          this.addElement();
        }
      }
    }
  }

  get isVisible(): boolean {
    if (!this.question.showIf) return true;
    return this.question.showIf(this.rootForm);
  }

  get isValid() {
    const control = this.control;
    return !control || control.disabled || control.valid || !control.touched;
  }

  get control(): FormControl | FormArray {
    return this.form.controls[this.question.key] as FormControl | FormArray;
  }

  get rootForm() {
    return this._rootForm ?? this.form;
  }

  get required(): boolean {
    try {
      return this.control?.hasValidator(Validators.required) ?? false;
    } catch (e) {
      console.error(e, this.question);
      return false;
    }
  }

  get controlChildren(): FormGroup[] {
    return (this.control as FormArray).controls as FormGroup[];
  }

  get questionKey(): string {
    return this.prefix
      ? `${this.prefix}_${this.index ?? 0}_${this.question.key}`
      : this.question.key;
  }

  get placeholder(): string {
    const placeholderText =
      typeof this.question.placeholder === 'function'
        ? this.question.placeholder(this.rootForm)
        : this.question.placeholder;

    return this.index === undefined || this.index === null
      ? placeholderText
      : `${placeholderText} ${this.index + 1}`;
  }

  get label(): string {
    return typeof this.question.label === 'function'
      ? this.question.label(this.rootForm)
      : this.question.label;
  }

  get fileName(): string {
    return this.control?.value?.name ?? '';
  }

  uponFileSelect(event: any) {
    const selectedFile = event[0];
    if (selectedFile && this.control) {
      this.control.setValue(selectedFile);
    }

    this.fileDropped.emit(event);
  }

  onOtpChange(event: string) {
    this.control.setValue(event);
  }

  addElement() {
    const control = this.control as FormArray;
    const maxlength = this.question.listTypeOptions.max;

    if (maxlength && control.length >= maxlength) {
      Swal.fire({
        title: 'Error',
        text: `You can add only ${maxlength} ${this.question.type ?? 'items'}`,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    console.log('Adding element with subQuestions:', this.question.subQuestions);
    const formGroup = this.registerService.formGroupFromQuestions(
      this.question.subQuestions!
    );
    console.log('Created formGroup:', formGroup);

    control.push(formGroup);
  }

  removeElement(index: number) {
    const control = this.control as FormArray;
    const minlength = this.question.listTypeOptions.min;

    if (minlength && control.length <= minlength) {
      Swal.fire({
        title: 'Error',
        text: `You must have atleast ${minlength} ${
          this.question.type ?? 'items'
        }`,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    control.removeAt(index);
  }

  makeInputUpperCase(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.control.setValue(input.value);
  }
}
