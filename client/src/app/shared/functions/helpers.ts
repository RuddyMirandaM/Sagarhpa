import { HttpParams } from '@angular/common/http';

export function convertToHttpParams(data: any): HttpParams {
	let params = new HttpParams();

	Object.keys(data).forEach(key => {
		const value = data[key];
		if (Array.isArray(value)) {
			value.forEach((item: any) => {
				params = params.append(`${key}[]`, item);
			});
		} else {
			params = params.set(key, value);
		}
	});

	return params;
}
export function getSiteUrl() {
	let pathArray: string[] = window.location.pathname.split('/');
	pathArray.pop()
	return `${window.location.origin}${pathArray.join('/')}`;
}

export function loadScripts(dynamicAssets: string[]) {
	const isScriptAdded = (src: string) => {
		return Boolean(document.querySelector('script[src="' + src + '"]'));
	}
	return new Promise<void>((resolve) => {
		const da = dynamicAssets.map((i) => ({ url: i, loaded: false }));
		const check = () => {
			const c = da.filter((i) => !i.loaded).length;
			c === 0 && resolve();
		};
		da.forEach((i) => {
			const ext = i.url.split('.').pop();
			let node: HTMLScriptElement | HTMLLinkElement;
			if (ext == 'js') {
				if (isScriptAdded(i.url)) {
					return;
				}
				node = document.createElement('script');
				node.src = i.url;
				node.type = 'text/javascript';
				node.async = false;
				node.charset = 'utf-8';
			} else {
				node = document.createElement('link');
				node.href = i.url;
				node.rel = 'stylesheet';
			}
			node.onload = () => {
				i.loaded = true;
				check();
			};
			document.getElementsByTagName('head')[0].appendChild(node);
		});
	});
}

export function downloadHandled(
	url: string,
	name: string,
	// cb = (error?: any) => { },
	progress = (p: number) => { }
) {
	return new Promise<void>((resolve, reject) => {
		// todo: implementar los resolve y reject
		window.URL = window.URL || window['webkitURL'];

		const xhr = new XMLHttpRequest(),
			a = document.createElement('a');

		let file;

		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onprogress = (evt) => {
			if (evt.lengthComputable) {
				const percentComplete = Math.floor((evt.loaded / evt.total) * 100);
				progress(percentComplete);
			}
		};
		xhr.onload = function() {
			if (this.status === 0 || this.status > 299) {
				const blobError = new Blob([xhr.response], { type: 'application/json' });
				blobError.text().then(function(z) {
					reject(JSON.parse(z))
				})
				return;
			}
			file = new Blob([xhr.response], { type: 'application/octet-stream' });
			const url_object = window.URL.createObjectURL(file);
			a.href = url_object;
			a.download = name;
			a.click();
			setTimeout(() => {
				window.URL.revokeObjectURL(url_object);
				// cb();
				resolve()
			}, 100);
		};
		xhr.onerror = function(error) {
			console.error('downloadHandled', error);
		}
		// xhr.setRequestHeader('Authorization', 'Bearer ' + AppStorageService.token());
		xhr.send();
	})
}
