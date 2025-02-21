import { Injectable }       from '@angular/core';
import { IJsonDiffPayload } from "../../pages/json-difference-page/models/json-diff-payload.interface";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public jsonDifferenceValuesKey: string = 'utilities_json-diff';

  public saveJsonDiff(payload: Partial<IJsonDiffPayload>): void {
    this.set(this.jsonDifferenceValuesKey, payload);
  }

  public getJsonDiff(): IJsonDiffPayload {
    return this.get<IJsonDiffPayload>(this.jsonDifferenceValuesKey) ?? { textareaLeft: null, textareaRight: null };
  }

  private get<T>(key: string): T | null {
    const stringValue = localStorage.getItem(key);

    return stringValue
      ? JSON.parse(stringValue)
      : null;
  }

  private set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
