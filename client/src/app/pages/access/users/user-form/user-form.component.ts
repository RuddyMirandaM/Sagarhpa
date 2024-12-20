import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { CreateUpdateUserRequest } from '../../../../core/dtos';
import { UserItemResponse } from '../../../../core/models';
import { ValidatorService, RolesService, UsersService } from '../../../../core/services';
import { PageContentComponent } from '../../../../layouts/main-layout/components';
import { InputComponent, SelectComponent } from '../../../../shared/components';
import { InputUppercaseDirective } from '../../../../shared/directives';
import { cAlert } from '../../../../shared/functions';

declare const $: any;

@Component({
	selector: 'app-usuarios-form',
	templateUrl: './user-form.component.html',
	styleUrls: ['./user-form.component.scss'],
	standalone: true,
	imports: [
		PageContentComponent,
		FormsModule,
		ReactiveFormsModule,
		InputComponent,
		InputUppercaseDirective,
		MultiSelectModule,
		NgClass,
		AsyncPipe,

		SelectComponent,
		JsonPipe
	],
})
export class UserFormComponent implements OnInit {
	qwe = { name: '123' }
	values = [{ name: 'asd' },{ name: 'qwe' },{ name: '123' },{ name: 'zxc' }]

	item?: UserItemResponse;
	isLoading = true
	isUpdate = false
	submitted = false
	title = 'Nuevo Usuario'
	form = this.fb.group(
		{
			employeeNumber: ['', [Validators.required]],
			curp: ['', [Validators.required, Validators.pattern(ValidatorService.curpPattern),]],
			name: ['', [Validators.required]],
			firstName: ['', [Validators.required]],
			secondName: ['', []],
			email: ['', [Validators.required, Validators.pattern(ValidatorService.emailPattern),],],
			job: ['', [Validators.required]],
			confirmEmail: ['', [Validators.required]],
			roles: [[], [Validators.required]],
		},
		{
			validators: [
				this.validatorService.equalInputs('email', 'confirmEmail'),
			],
		}
	);

	catRoles$ = this._roles.getRoles();
	constructor(private validatorService: ValidatorService, private fb: UntypedFormBuilder, private _roles: RolesService, private _usr: UsersService, private router: Router, private activatedRoute: ActivatedRoute,) { }

	async ngOnInit() {
		const uuid: string = this.activatedRoute.snapshot.params.id;

		if (uuid) {
			this.item = await this._usr.getUser(uuid);
			if (this.item) {
				this.isUpdate = true;
				this.title = 'Editar Usuario';
				this.setUsersFormOnEditMode()
			}
		}
		this.isLoading = false;
	}
	isValid(controlName: string) {
		return this.form.get(controlName) && !(this.form.get(controlName)!.invalid && this.form.get(controlName)!.touched) || false
	}
	async save() {

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return cAlert('Se encontraron errores en el formulario', { icon: 'error' })
		}
		this.isLoading = true;
		let data: CreateUpdateUserRequest = {
			...this.form.getRawValue(),
			roleIds: this.form.value.roles.map((i: any) => i.id)
		}
		try {
			if (this.isUpdate) {
				await this._usr.updateUser(this.item!.uuid, data);
			} else {
				await this._usr.createUser(data);
			}
			this.router.navigate(['/app/accesos/usuarios']);
		} catch (error) {
		}
		this.isLoading = false;
	}
	setUsersFormOnEditMode(): void {
		this.form.patchValue(this.item!);
		this.form.get('confirmEmail')?.setValue(this.item!.email);
		this.form.get('confirmEmail')?.setValidators([]);

		this.form.updateValueAndValidity()
	}
}
