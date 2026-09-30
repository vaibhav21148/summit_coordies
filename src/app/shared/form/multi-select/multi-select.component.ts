import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Question } from '../question/question';
import Swal from 'sweetalert2';
import { S } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: '../question/question.component.scss',
})
export class MultiSelectComponent {
  @Input() question!: Question<any>;
  @Input() form!: FormGroup;

  optionsSelectState: boolean[] = [];

  ngOnInit() {
    this.optionsSelectState = this.question.options.map(() => false);
  }

  get selectedOptions(): string[] {
    return this.question.options
      .map((option, index) =>
        this.optionsSelectState[index] ? option.value : null
      )
      .filter((value) => value !== null);
  }

  onCheckboxChange(index: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const selectedOptions = this.selectedOptions;
    const { min, max } = this.question.listTypeOptions ?? {};

    if (checkbox.checked) {
      if (max && selectedOptions.length === max) {
        Swal.fire(
          'Error',
          `You can select only upto ${max} option${max > 1 ? 's' : ''}`,
          'error'
        );
        checkbox.checked = false;
        return;
      }
    } else {
      if (min && selectedOptions.length === min) {
        Swal.fire(
          'Error',
          `You must select atleast ${min} option${min > 1 ? 's' : ''}`,
          'error'
        );
        checkbox.checked = true;
        return;
      }
    }

    this.optionsSelectState[index] = checkbox.checked;
    this.updateValue();
  }

  updateValue() {
    const newValue = this.selectedOptions;
    console.log(newValue);
    this.form.controls[this.question.key].setValue(newValue);
  }
}
