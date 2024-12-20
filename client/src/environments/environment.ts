export const environment = {
	production: false,
	sessio_time_in_min: 0, // 0 hace que la sesion no se cierre por inactividad
	api_url: 'http://localhost:3007/api',
	api_titulo: 'http://localhost:3007/api/title',
	api_catalogos: 'http://localhost:3007/api/catalogos',
	api_sac_url: 'EMPTY',
	api_key: '',

	recaptcha: {
		site_key: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
	},

	llave_client_id: 'ITDUWIQE3OTQWXF1SJMQA0FHJBP9ZKAD',
	llave_redirect_url: 'http://localhost:4200/auth-callback',
};
