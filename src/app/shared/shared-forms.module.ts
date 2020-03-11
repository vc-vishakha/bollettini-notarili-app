import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const sharedForms: any[] = [
    FormsModule, ReactiveFormsModule
];

@NgModule({
    imports: [sharedForms],
    exports: [sharedForms],
})

export class SharedFormsModule { }
