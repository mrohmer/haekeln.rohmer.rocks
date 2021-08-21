import { build, files } from '$service-worker';
import {registerRoute} from 'workbox-routing';
import {NetworkFirst} from 'workbox-strategies';

const urls = [
	'/',
	...build,
	...files,
];
registerRoute(
	({url}) => urls.includes(url.pathname),
	new NetworkFirst(),
);

skipWaiting();
