import { ArrowFunctionExpr } from '@angular/compiler';
import { FormGroup, Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';

export interface QuestionOptions {
  value: any;
  viewValue: string;
}
export type ControlType =
  | 'textbox'
  | 'textarea'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'list'
  | 'file'
  | 'line-group'
  | 'ordering'
  | 'otp';

type ContentType =
  | '*'
  | 'image/*'
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'application/pdf'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/msword'
  | 'text/plain'
  | 'application/zip'
  | 'application/x-rar-compressed';

type StringOrCallable<T> =
  | string
  | ((arg0?: FormGroup, arg1?: Question<T>) => string);

export class Question<T> {
  value: T | undefined;
  key: string;
  label: StringOrCallable<T>;
  // required: boolean;
  order: number;
  controlType: ControlType;
  type: string; // 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox';
  placeholder: StringOrCallable<T>;
  options: QuestionOptions[]; // for select, radio, checkbox
  cols: number; // for textarea and line-group, have very different meaning in both contexts
  subQuestions?: Question<T>[];
  textBoxOptions: { uppercase?: boolean };
  fileOptions: { accept?: string[]; max_size?: number };
  listTypeOptions: { min?: number; max?: number };
  info: string;
  note?: string;
  validators: ValidatorFn[];
  disabled = false;
  showIf?: (form?: FormGroup) => boolean;
  constructor(
    options: {
      value?: T;
      key?: string;
      label?: StringOrCallable<T>;
      placeholder?: StringOrCallable<T>;
      // required?: boolean;
      order?: number;
      controlType?: ControlType;
      type?: string;
      options?: QuestionOptions[];
      cols?: number;
      subQuestions?: Question<T>[];
      info?: string;
      note?: string;
      textBoxOptions?: { uppercase?: boolean };
      fileOptions?: { accept?: ContentType[]; max_size?: number };
      listTypeOptions?: { min?: number; max?: number };
      validators?: ValidatorFn[];
      disabled?: boolean;
      showIf?: (form?: FormGroup) => boolean;
    } = {}
  ) {
    this.controlType = options.controlType || 'textbox';
    this.value =
      options.value == undefined
        ? ((this.controlType === 'file' ? null : '') as T | undefined)
        : options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    // this.required = !!options.required;
    this.order = options.order ?? 1;
    this.type = options.type || 'text';
    this.options = options.options || [];
    this.placeholder = options.placeholder || '';
    this.cols = options.cols || 1;
    this.subQuestions = options.subQuestions || [];
    this.info = options.info || '';
    this.note = options.note || '';
    this.textBoxOptions = options.textBoxOptions || {};
    this.fileOptions = options.fileOptions || {};
    this.listTypeOptions = options.listTypeOptions || {};
    this.validators = options.validators || [Validators.required];
    this.disabled = options.disabled || false;
    this.showIf = options.showIf;
  }
}
