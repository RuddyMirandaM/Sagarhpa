export const environment = {
	production: true,
	sessio_time_in_min: 30, // 0 hace que la sesion no se cierre por inactividad
	api_url: 'https://template.sonora.gob.mx/api',
	api_key: '',

	api_sac_url: 'empty',

	recaptcha: {
		site_key: '6LfDuDgmAAAAACd69E9waxIqZBwP6dCjlF9DaU9K'
	},

	llave_client_id: 'ITDUWIQE3OTQWXF1SJMQA0FHJBP9ZKAD',
	llave_redirect_url: 'http://localhost:4200/auth-callback', // cambiar la parte del HOST (https://localhost:4200)
};
