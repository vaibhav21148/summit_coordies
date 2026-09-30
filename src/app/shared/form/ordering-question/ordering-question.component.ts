import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from '../question/question';

@Component({
  selector: 'app-ordering-question',
  standalone: true,
  imports: [],
  templateUrl: './ordering-question.component.html',
  styleUrl: './ordering-question.component.scss',
})
export class OrderingQuestionComponent {
  @Input() question!: Question<any>;
  @Input() form!: FormGroup;

  _ordered_options: any[] = [];

  ngOnInit() {
    // Clone the options array to avoid changing the original array
    // TODO: Consider if this is necessary
    this._ordered_options = this.question.options.map(
      ({ value, viewValue }) => ({ value, viewValue })
    );
  }

  get options() {
    return this._ordered_options;
  }

  moveUp(index: number) {
    if (index > 0) {
      const options = this.options;
      [options[index - 1], options[index]] = [
        options[index],
        options[index - 1],
      ];
      this.updateFormControl();
    }
  }

  moveDown(index: number) {
    if (index < this.options.length - 1) {
      const options = this.options;
      [options[index + 1], options[index]] = [
        options[index],
        options[index + 1],
      ];
      this.updateFormControl();
    }
  }

  updateFormControl() {
    const value = this.options.map((opt) => opt.value).join(',');
    this.form.get(this.question.key)?.setValue(value);
  }
}
