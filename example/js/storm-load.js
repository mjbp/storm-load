/**
 * @name storm-load: Lightweight promise-based script loader
 * @version 1.0.3: Fri, 29 Jun 2018 12:47:49 GMT
 * @author stormid
 * @license MIT
 */
const create = (url, async = true) => {
	return new Promise((resolve, reject) => {
		let s = document.createElement('script');
		s.src = url;
		s.async = async;
		s.onload = s.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'complete') resolve();
		};
		s.onerror = s.onabort = reject;
		document.head.appendChild(s);
	});
};

export const synchronous = urls => {
	return new Promise((resolve, reject) => {
		let next = () => {
			if (!urls.length) return resolve();
			create(urls.shift(), false).then(next).catch(reject);
		};
		next();
	});
};

export default (urls, async = true) => {
	urls = [].concat(urls);
	if (!async) return synchronous(urls);

	return Promise.all(urls.map(url => create(url)));
};