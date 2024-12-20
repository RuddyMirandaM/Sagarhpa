import { NgClass } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RolesItemResponse } from '../../../../core/models';
import { RolesService } from '../../../../core/services';
import { ModalContentComponent } from '../../../../shared/components';

declare const $: any;

@Component({
	selector: 'app-roles-form',
	templateUrl: './role-form.component.html',
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ModalContentComponent,
		NgClass,
	],
})
export class RoleFormComponent implements OnInit {
	item?: RolesItemResponse;

	@ViewChild(ModalContentComponent) modal!: ModalContentComponent;

	isUpdate: boolean = false;
	isLoading: boolean = true;
	title: string = 'Registrar Rol';
	permissions = Permissions;

	rolesForm: FormGroup = this.fb.group({
		name: ['', [Validators.required]],
	});

	constructor(private _roles: RolesService, private fb: FormBuilder, private _dialogService: DynamicDialogConfig) { }

	ngOnInit(): void {
		this.init();
	}

	async init() {
		this.item = this._dialogService.data.item;
		if (this.item && typeof this.item.id !== undefined) {
			this.isUpdate = true;
			this.title = 'Editar Rol';

			this.rolesForm.patchValue({
				name: this.item.name,
			});
		}

		this.isLoading = false;
	}

	async save() {
		this.isLoading = true;

		if (this.rolesForm.invalid) {
			this.rolesForm.markAllAsTouched();
			this.isLoading = false;
			return;
		}

		try {
			const roleData = { ...this.rolesForm.getRawValue() };

			if (this.isUpdate) {
				await this._roles.updateRole(this.item!.id, roleData);
			} else {
				await this._roles.createRole(roleData);
			}
		} catch (error) {
			this.isLoading = false;
		}

		this.modal.close();
	}

	validateField(campo: string) {
		return (
			this.rolesForm.get(campo)?.invalid && this.rolesForm.get(campo)?.touched
		);
	}
}
