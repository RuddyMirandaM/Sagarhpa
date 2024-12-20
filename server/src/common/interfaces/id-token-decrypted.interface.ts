
export interface IDTokenDecrypted {
	id:               string;
	nombre:           string;
	primer_apellido:  string;
	segundo_apellido: string;
	correo:           string;
	curp:             string;
	verificado:       string;
	numero_empleado:	string;
	puesto:           string;
	iat:              number;
	nonce:            string;
	aud:              string;
	iss:              string;
	sub:              string;
	sid:              string;
	nbf:              number;
	exp:              number;
}
