import { build, files, timestamp } from '$service-worker';
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute([
	{url: '/', revision: String(timestamp) },
	...build.map(url => ({url, revision: String(timestamp)})),
	...files.map(url => ({url, revision: String(timestamp)})),
]);
