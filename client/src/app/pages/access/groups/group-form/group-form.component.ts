import { NgClass } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CreateUpdateGroupRequest } from '../../../../core/dtos';
import { GroupItemResponse } from '../../../../core/models';
import { GroupService } from '../../../../core/services';
import { ModalContentComponent, InputComponent } from '../../../../shared/components';
import { InputFocusDirective } from '../../../../shared/directives';

declare const $: any;

@Component({
	selector: 'app-groups-form',
	templateUrl: './group-form.component.html',
	styleUrls: ['./group-form.component.scss'],
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ModalContentComponent,
		InputComponent,
		InputFocusDirective,
		NgClass,
	],
})
export class GroupFormComponent implements OnInit {
	item?: GroupItemResponse;

	@ViewChild(ModalContentComponent) modal!: ModalContentComponent;
	isUpdate = false;
	title = 'Registrar Grupo';

	frm: CreateUpdateGroupRequest = {};

	permissions = Permissions;

	groupsForm: FormGroup = this.fb.group({
		name: ['', [Validators.required]],
	});

	constructor(
		private _groups: GroupService,
		private fb: FormBuilder,
		private _dialogService: DynamicDialogConfig
	) { }

	ngOnInit(): void {
		this.init();
	}

	async init() {
		this.item = this._dialogService.data.item;
		if (this.item && typeof this.item.id !== undefined) {
			this.isUpdate = true;
			this.title = 'Editar Grupo';

			this.groupsForm.patchValue({
				name: this.item.name,
			});
		}
	}

	async save() {
		this.groupsForm.markAllAsTouched();
		if (this.groupsForm.invalid) {
			return;
		}

		const groupData = { ...this.groupsForm.getRawValue() };
		if (this.isUpdate) {
			await this._groups.updateGroup(this.item!.id, groupData);
		} else {
			await this._groups.createGroup(groupData);
		}
		this.modal.close();
	}

	invalidField(campo: string): boolean {
		return (
			this.groupsForm.get(campo)?.invalid && (this.groupsForm.get(campo)?.dirty || this.groupsForm.get(campo)?.touched)
		) || false;
	}
}
