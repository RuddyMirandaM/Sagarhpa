import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedInitial1686431827163 implements MigrationInterface {
	name = 'SeedInitial1686431827163'
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			INSERT INTO usr.roles ("name", "active", "order", created_by) VALUES('ADMINISTRADOR', true, 0, NULL) ON CONFLICT DO NOTHING;

			INSERT INTO usr."groups" ("name", active, "order") VALUES('USUARIOS', true, 0) ON CONFLICT DO NOTHING;
			INSERT INTO usr."groups" ("name", active, "order") VALUES('ROLES', true, 0) ON CONFLICT DO NOTHING;
			INSERT INTO usr."groups" ("name", active, "order") VALUES('PERMISSONS', true, 0) ON CONFLICT DO NOTHING;
			INSERT INTO usr."groups" ("name", active, "order") VALUES('GRUPOS', true, 0) ON CONFLICT DO NOTHING;

			INSERT INTO usr.permissions ("name", "key", active, "order", "groupId") VALUES('ACCESO MODULO DE USUARIOS', 'admin.users', true, 0, 1) ON CONFLICT DO NOTHING;
			INSERT INTO usr.permissions ("name", "key", active, "order", "groupId") VALUES('ACCESO MODULO DE ROLES', 'admin.roles', true, 0, 2) ON CONFLICT DO NOTHING;
			INSERT INTO usr.permissions ("name", "key", active, "order", "groupId") VALUES('ACCESO MODULO DE PERMISOS', 'admin.permissions', true, 0, 3) ON CONFLICT DO NOTHING;
			INSERT INTO usr.permissions ("name", "key", active, "order", "groupId") VALUES('ACCESO MODULO DE GRUPOS', 'admin.groups', true, 0, 4) ON CONFLICT DO NOTHING;

			INSERT INTO usr.permission_roles (role_id, permission_id) VALUES(1, 1);
			INSERT INTO usr.permission_roles (role_id, permission_id) VALUES(1, 2);
			INSERT INTO usr.permission_roles (role_id, permission_id) VALUES(1, 3);
			INSERT INTO usr.permission_roles (role_id, permission_id) VALUES(1, 4);

			INSERT INTO usr.users (employee_number, curp, "name", first_name, second_name, avatar, email, created_by, job, active) VALUES('123456', 'ASDQWE123123ZXC', 'USUARIO', 'PRUEBA', 'PRUEBA', NULL, 'admin@admin.com', 0, NULL, true);

			INSERT INTO usr.role_users (role_id, user_id) VALUES(1, 1);
		`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			DELETE FROM usr.role_users;
			DELETE FROM usr.users;
			DELETE FROM usr.permission_roles;
			DELETE FROM usr.permissions;
			DELETE FROM usr.groups;
			DELETE FROM usr.roles;
		`)

	}

}
