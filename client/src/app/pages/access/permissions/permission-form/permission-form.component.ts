import { NgClass } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PermissionItemResponse, GroupItemResponse } from '../../../../core/models';
import { GroupService, PermissionsService } from '../../../../core/services';
import { ModalContentComponent } from '../../../../shared/components';
import { InputFocusDirective } from '../../../../shared/directives';


@Component({
	selector: 'app-permissions-form',
	templateUrl: './permission-form.component.html',
	styleUrls: ['./permission-form.component.scss'],
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ModalContentComponent,
		InputFocusDirective,
		DropdownModule,
		NgClass,
	],
})
export class PermissionFormComponent implements OnInit {
	item?: PermissionItemResponse;

	@ViewChild(ModalContentComponent) modal!: ModalContentComponent;

	isUpdate: boolean = false;
	title: string = 'Editar permiso';
	catPermissionGroup: GroupItemResponse[] = [];
	permissions = Permissions;

	permissionsForm: FormGroup = this.fb.group({
		name: ['', [Validators.required]],
		group: [null, [Validators.required]]
	});

	constructor(
		private _groups: GroupService,
		private _permissions: PermissionsService,
		private fb: FormBuilder,
		private _dialogService: DynamicDialogConfig
	) {
	}

	async ngOnInit() {
		await this.getCatPermissionGroups();
		this.item = this._dialogService.data.item;
		if (this.item && typeof this.item.key !== undefined) {
			this.isUpdate = true;
			this.title = 'Editar Permiso';

			this.permissionsForm.patchValue({
				name: this.item.name,
				group: this.item.group,
			});
		}
	}

	async save() {
		if (this.permissionsForm.invalid) {
			this.permissionsForm.markAllAsTouched();
			return;
		}

		try {
			const formValues = this.permissionsForm.getRawValue()
			const permissionData = {
				name: formValues.name,
				groupId: formValues.group.id,
			}

			if (this.isUpdate) {
				await this._permissions.updatePermission(this.item!.key, permissionData);
			}
			this.modal.close();
		} catch (error) { }
	}

	async getCatPermissionGroups() {
		const page = await this._groups.getGroups();
		this.catPermissionGroup = page.data;
	}

	validateField(controlName: string) {
		return (
			this.permissionsForm.get(controlName)?.invalid &&
			this.permissionsForm.get(controlName)?.touched
		);
	}
}
