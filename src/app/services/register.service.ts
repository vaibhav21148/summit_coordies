import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { HttpClient } from '@angular/common/http';
import { getErrorMessage } from '../utils/error';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { Question, ControlType } from '@shared/form/question/question';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly API_URL = environment.API_URL;
  private readonly LOCAL_RESPONSE_DATA_KEY = 'es25-tr';
  private readonly LOCAL_RESPONSE_ENDPOINT_KEY = 'es25-te';

  constructor(private http: HttpClient, private auth: AuthService) {}

  formGroupFromQuestions(questions: Question<any>[]) {
    const group: any = {};
    questions.forEach((question) => {
      if (question.controlType === 'line-group') {
        question.subQuestions?.forEach((subQuestion) => {
          group[subQuestion.key] =
            subQuestion.controlType === 'list'
              ? new FormArray([], subQuestion.validators)
              : subQuestion.controlType === 'checkbox'
              ? new FormControl(subQuestion.value ?? [], subQuestion.validators)
              : new FormControl(subQuestion.value, subQuestion.validators);

          if (question.disabled || subQuestion.disabled) {
            group[subQuestion.key].disable();
          }
        });
      } else {
        group[question.key] =
          question.controlType === 'list'
            ? new FormArray([], question.validators)
            : question.controlType === 'checkbox'
            ? new FormControl(question.value ?? [], question.validators)
            : new FormControl(question.value, question.validators);

        if (question.disabled) {
          group[question.key].disable();
        }
      }
    });
    return new FormGroup(group);
  }

  hasFile(questions: Question<any>[]) {
    return this.hasQuestionControlType(questions, 'file');
  }

  hasQuestionControlType(questions: Question<any>[], type: ControlType) {
    return questions.some((question) => question.controlType === type);
  }

  url(endpoint: Endpoint) {
    return `${this.API_URL}/${endpoint}`;
  }

  mutateDataForEndpoint(data: any, endpoint: Endpoint) {
    // if (endpoint === Endpoint.INFLUENCER) {
    //   data['was_invited'] = !!localStorage.getItem('influencer');
    // }
    return data;
  }

  async genericRegister(
    data: any,
    endpoint: Endpoint,
    hasFile = false
  ): Promise<any> {
    data = this.mutateDataForEndpoint(data, endpoint);
    const formData = hasFile ? this.convertJsontoFormData(data) : data;
    try {
      const res = await lastValueFrom(
        this.http.post(this.url(endpoint), formData, {
          headers: this.auth.headers,
        })
      );
      return res;
    } catch (error) {
      throw getErrorMessage(error);
    }
  }

  async hasRegistered(endpoint: Endpoint): Promise<boolean> {
    try {
      const res = await lastValueFrom<any>(
        this.http.get(this.url(endpoint), { headers: this.auth.headers })
      );
      return res['previous_reg'] as boolean;
    } catch (error) {
      return false;
    }
  }

  convertJsontoFormData(
    jsonObject: any,
    parentKey: string = '',
    carryFormData?: FormData,
    deepCopy?: any
  ): FormData {
    const formData = carryFormData || new FormData();

    if (!deepCopy) {
      deepCopy = JSON.parse(JSON.stringify(jsonObject));
    }

    for (var key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
          if (jsonObject[key] instanceof File) {
            formData.append(key, jsonObject[key]);
            deepCopy[key] = undefined;
          } else if (jsonObject[key] instanceof FileList) {
            for (var j = 0; j < jsonObject[key].length; j++) {
              formData.append(key + '[' + j + ']', jsonObject[key].item(j));
            }
            deepCopy[key] = undefined;
          } else if (
            this.isArray(jsonObject[key]) ||
            this.isObject(jsonObject[key])
          ) {
            this.convertJsontoFormData(
              jsonObject[key],
              key,
              formData,
              deepCopy[key]
            );
          }
        }
      }
    }

    if (!parentKey) {
      const serialized = JSON.stringify(deepCopy);
      // const blob = new Blob([serialized], { type: 'application/json' });
      formData.append('data', serialized);
    }

    return formData;
  }

  convertJsontoFlattenedFormData(
    jsonObject: any,
    parentKey: string = '',
    carryFormData?: FormData
  ): FormData {
    const formData = carryFormData || new FormData();
    let index = 0;
    for (var key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
          var propName = parentKey || key;
          if (parentKey && this.isObject(jsonObject)) {
            propName = parentKey + '[' + key + ']';
          }
          if (parentKey && this.isArray(jsonObject)) {
            propName = parentKey + '[' + index + ']';
          }
          if (jsonObject[key] instanceof File) {
            formData.append(propName, jsonObject[key]);
          } else if (jsonObject[key] instanceof FileList) {
            for (var j = 0; j < jsonObject[key].length; j++) {
              formData.append(
                propName + '[' + j + ']',
                jsonObject[key].item(j)
              );
            }
          } else if (
            this.isArray(jsonObject[key]) ||
            this.isObject(jsonObject[key])
          ) {
            this.convertJsontoFormData(jsonObject[key], propName, formData);
          } else if (typeof jsonObject[key] === 'boolean') {
            formData.append(propName, +jsonObject[key] ? '1' : '0');
          } else {
            formData.append(propName, jsonObject[key]);
          }
        }
      }
      index++;
    }
    return formData;
  }

  storeResponseToLocal(formGroup: FormGroup, endpoint: Endpoint) {
    console.log(formGroup.value);
    localStorage.setItem(
      this.LOCAL_RESPONSE_DATA_KEY,
      JSON.stringify(formGroup.value)
    );
    localStorage.setItem(this.LOCAL_RESPONSE_ENDPOINT_KEY, endpoint);
  }

  restoreResponseFromLocal(formGroup: FormGroup, endpoint: Endpoint): boolean {
    const storedDataEndpoint = localStorage.getItem(
      this.LOCAL_RESPONSE_ENDPOINT_KEY
    );
    if (storedDataEndpoint !== endpoint) return false;

    const storedData = localStorage.getItem(this.LOCAL_RESPONSE_DATA_KEY);
    if (!storedData) return false;

    formGroup.patchValue(JSON.parse(storedData));
    return true;
  }

  clearResponseFromLocal() {
    localStorage.removeItem(this.LOCAL_RESPONSE_DATA_KEY);
    localStorage.removeItem(this.LOCAL_RESPONSE_ENDPOINT_KEY);
  }

  isArray(val: any) {
    const toString = {}.toString;
    return toString.call(val) === '[object Array]';
  }

  isObject(val: any) {
    return !this.isArray(val) && typeof val === 'object' && !!val;
  }
}
