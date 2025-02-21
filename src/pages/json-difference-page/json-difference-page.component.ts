import { Component, inject, OnInit, signal }           from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { LocalStorageService }                         from '../../services/common/local-storage.service';
import { IJsonDiffPayload }                            from "./models/json-diff-payload.interface";

@Component({
  selector: 'app-json-difference-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: 'json-difference-page.component.html',
  styleUrl: 'json-difference-page.component.scss'
})
export default class JsonDifferencePageComponent implements OnInit {
  private ls = inject(LocalStorageService);

  public isEdit = signal(true);
  public differenceForm = new FormGroup({
    textareaLeft: new FormControl<string | null>(null),
    textareaRight: new FormControl<string | null>(null),
  });
  public errors: IJsonDiffPayload = {
    textareaLeft: null,
    textareaRight: null
  }

  public obj1Lines: string = 'start 1';
  public obj2Lines: string[] = [ 'start 2' ];

  public ngOnInit(): void {
    this.differenceForm.setValue(this.ls.getJsonDiff());
    this.compare();
  }

  public setIsEdit(isEdit = false): void {
    this.isEdit.set(isEdit);
  }

  public compare(): void {
    this.ls.saveJsonDiff(this.differenceForm.value);
    const parseResult = this.tryParse();

    if (!parseResult) return;

    this.setIsEdit();

    if (parseResult.textareaLeft) {
      // this.obj1Lines = this.getObjectLines(parseResult.textareaLeft, [], 0)
      console.log('RESULT: ', this.getObjectLines(parseResult.textareaLeft, [], 0));
    } else {
      this.obj1Lines = 'FUCKED LEFT'
    }

    if (parseResult.textareaRight) {
      // this.obj2Lines = [ this.getObjectLines(parseResult.textareaRight, 0).join('\n') ];
    } else {
      this.obj2Lines = [ 'FUCKED RIGHT' ]
    }

    console.log('obj1Lines: ', this.obj1Lines);
    console.log('obj2Lines: ', this.obj2Lines);
  }

  public tryParse(): { textareaRight: object, textareaLeft: object } | null {
    this.errors.textareaLeft = null;
    this.errors.textareaRight = null;

    let leftObj: any = null
    try {
      const textareaLeftValue = this.differenceForm.controls.textareaLeft.value as string;
      leftObj = JSON.parse(textareaLeftValue);
    } catch (e) {
      this.errors.textareaLeft = `${ e }`;
    }

    let rightObj: any = null
    try {
      const textareaRightValue = this.differenceForm.controls.textareaRight.value as string;
      rightObj = JSON.parse(textareaRightValue);
    } catch (e) {
      this.errors.textareaRight = `${ e }`;
    }

    if (this.errors.textareaLeft !== null || this.errors.textareaRight !== null) return null;

    return {
      textareaRight: rightObj,
      textareaLeft: leftObj
    };
  }

  private getObjectLines(obj: object, lines: string[] = [], spaces = 1): string[] {

    if (Array.isArray(obj)) {
      return this.getArrayLines(obj, lines, spaces);
    }

    Object.entries(obj)?.forEach(([ key, value ]) => {
      if (this.isPrimitive(value)) {
        lines.push(this.getKeyValueLine(key, value, spaces + 1));
      } else if (value?.length !== undefined) {
        console.log('[getObjectLines] is array: ', value)
        // lines.push(...this.getArrayLines(value, lines, spaces + 2));
      } else if (value) {
        lines.push(this.getKeyValueLine(key, this.getObjectLines(value, lines, spaces), spaces));
      }
    });

    lines.push(this.getLine('}', spaces));
    // `${ this.getTab(spaces) }{\n` + lines.join('\n')
    return lines;
  }

  private getArrayLines(arr: Array<any>, lines: string[] = [], spaces = 1): string[] {
    arr.forEach((value) => {
      if (this.isPrimitive(value)) {
        lines.push(this.getLine(`${ value }`, spaces));
      } else if (value?.length !== undefined) {
        lines.push(...this.getArrayLines(value, lines, spaces));
      } else if (value) {
        lines.push(...this.getObjectLines(value, lines, spaces));
      }
    });

    lines.push(this.getLine(`]`, spaces - 1));

    // const arrayLines = lines.join(',\n');
    return lines;
  }

  private isPrimitive(value: any): boolean {
    const primitives = [ 'string', 'number', 'boolean', 'undefined' ];
    return primitives.includes(typeof value);
  }

  private getKeyValueLine(key: string, value: any, spaces: number = 1): string {
    const lineContent = this.getLine(`"${ key.trim() }": ${ value?.toString()?.trim() };`, spaces)
    return `<div class="codeline"><span class="code">${ lineContent }</span></div>`
    // return this.getLine(`<div class="codeline"><span class="code">${ key.trim() }: ${ value?.toString()?.trim() };</span></div>`, spaces);
  }

  private getLine(value: any, spaces: number = 1): string {
    return `${ this.getTab(spaces) }${ value?.toString()?.trim() }`
  }

  private getTab(spaces: number = 1): string {
    return ' '.repeat(spaces * 4);
  }
}

