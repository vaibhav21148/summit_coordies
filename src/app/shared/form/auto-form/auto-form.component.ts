import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { Question } from '../question/question';
import {
  AutoFormOptions,
  InternalAutoFormComponent,
} from '../internal-auto-form/auto-form.component';
import { AuthLayoutComponent } from '../../auth-layout/auth-layout.component';
import { CommonModule } from '@angular/common';

export type { AutoFormOptions };

@Component({
  selector: 'app-auto-form',
  standalone: true,
  imports: [InternalAutoFormComponent, AuthLayoutComponent, CommonModule],
  templateUrl: './auto-form.component.html',
  styleUrl: '../_auto-form.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class AutoFormComponent {
  @Input() questions: Question<any>[] = [];
  @Input() extraData?: any;
  @Input() options!: AutoFormOptions;
  @Input() steps: string[] = [];
  @Input() stepQuestions: string[][] = [];
  @Input() heading: string = 'Complete Registration';
  @Input() description: string = 'Fill out the form to complete your registration';
  @Input() manualSteps: string[] = [];
  @Input() prefillData?: any;
  @Input() showSkipButton: boolean = false;

  @Output() regResponse: EventEmitter<any> = new EventEmitter();
  @Output() skipClick: EventEmitter<void> = new EventEmitter();
  @ViewChild('autoForm', { static: false }) autoForm!: ElementRef;

  currentStep: number = 1;
  currentStepQuestions: Question<any>[] = [];
  stepData: any = {};
  questionsPerStep: number = 3;
  totalSteps: number = 3;
  modifiedOptions!: AutoFormOptions;

  ngOnInit() {
    this.initializeSteps();
    this.updateCurrentStepQuestions();
    this.updateModifiedOptions();
  }

  updateModifiedOptions() {
    const totalSteps = this.stepQuestions.length > 0 ? this.stepQuestions.length : this.steps.length;
    const isLastStep = this.currentStep === totalSteps;
    const isSingleStep = totalSteps <= 1;
    const isMultiStep = totalSteps > 1;
    
    this.modifiedOptions = {
      ...this.options,
      submitText: (isLastStep || isSingleStep) ? (this.options.submitText || 'Register') : 'Next',
      customHandle: this.options.customHandle || isMultiStep
    };
    
    console.log('Step:', this.currentStep, 'Total:', totalSteps, 'IsLast:', isLastStep, 'IsSingle:', isSingleStep, 'CustomHandle:', this.modifiedOptions.customHandle);
  }

  initializeSteps() {
    if (this.stepQuestions.length > 0) {
      this.totalSteps = this.stepQuestions.length;
      if (this.steps.length === 0) {
        this.steps = Array.from({length: this.totalSteps}, (_, i) => `Step ${i + 1}`);
      }
    } else if (this.manualSteps.length > 0) {
      this.steps = this.manualSteps;
      this.totalSteps = this.manualSteps.length;
    } else if (this.steps.length === 0) {
      this.steps = Array.from({length: this.totalSteps}, (_, i) => `Step ${i + 1}`);
    }
  }

  groupFieldsByType(): Question<any>[][] {
    if (this.stepQuestions.length > 0) {
      return this.stepQuestions.map(stepKeys => 
        stepKeys.map(key => this.questions.find(q => q.key === key)!).filter(Boolean)
      );
    }
    
    const questionsPerStep = Math.ceil(this.questions.length / this.totalSteps);
    const groups: Question<any>[][] = [];
    
    for (let i = 0; i < this.totalSteps; i++) {
      const startIndex = i * questionsPerStep;
      const endIndex = Math.min(startIndex + questionsPerStep, this.questions.length);
      groups.push(this.questions.slice(startIndex, endIndex));
    }
    
    return groups;
  }

  updateCurrentStepQuestions() {
    const fieldGroups = this.groupFieldsByType();
    this.currentStepQuestions = fieldGroups[this.currentStep - 1] || [];
  }

  handleStepResponse(response: any) {
    this.stepData = { ...this.stepData, ...response };
    
    const totalSteps = this.stepQuestions.length > 0 ? this.stepQuestions.length : this.steps.length;
    const isLastStep = this.currentStep === totalSteps;
    
    if (isLastStep) {
      console.log('Final step - emitting all data:', this.stepData);
      this.regResponse.emit(this.stepData);
    } else {
      this.nextStep();
    }
  }

  nextStep() {
    const totalSteps = this.stepQuestions.length > 0 ? this.stepQuestions.length : this.steps.length;
    if (this.currentStep < totalSteps) {
      this.currentStep++;
      this.updateCurrentStepQuestions();
      this.updateModifiedOptions();
      window.scrollTo(0, 0);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateCurrentStepQuestions();
      this.updateModifiedOptions();
    }
  }

  onSkipClick() {
    this.skipClick.emit();
  }

  trackByQuestionKey(index: number, question: Question<any>): string {
    return question.key;
  }

  getFinalData() {
    const totalSteps = this.stepQuestions.length > 0 ? this.stepQuestions.length : this.steps.length;
    const isLastStep = this.currentStep === totalSteps;
    
    if (isLastStep) {
      return { ...this.stepData, ...this.extraData };
    }
    
    return this.extraData;
  }
}
