export const environment = {
	production: false,
	sessio_time_in_min: 30, // 0 hace que la sesion no se cierre por inactividad
	api_url: 'https://qa-3.sonora.gob.mx/template/api',
	api_key: '',

	api_sac_url: 'empty',

	recaptcha: {
		site_key: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
	},

	llave_client_id: 'ITDUWIQE3OTQWXF1SJMQA0FHJBP9ZKAD',
	llave_redirect_url: 'http://localhost:4200/auth-callback', // cambiar la parte del HOST (https://localhost:4200)
};
