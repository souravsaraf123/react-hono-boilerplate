import type { ApiRoutesType } from '@api/app';
import { hc } from 'hono/client';
import * as _ from 'lodash-es';
import ky from 'ky';

function getTimeString(d?: Date): string
{
	const now = d || new Date();
	const formattedDate = now.toLocaleString('en-GB', {
		hour: '2-digit',
		minute: 'numeric',
		second: 'numeric',
		fractionalSecondDigits: 3,
	});

	return formattedDate;
}

let kyInstance = ky.create({
	timeout: 120_000,
	retry: 0,
	hooks: {
		beforeRequest: [
			async request =>
			{
				const formattedDate = getTimeString();
				const method = request.method;
				const url = new URL(request.url).pathname;
				let body = undefined;
				if (request.headers.has('Content-Type') && request.headers.get('Content-Type') === 'application/json')
				{
					const clonedRequest = request.clone();
					body = await clonedRequest.json();
				}
				const queryParams = new URL(request.url).searchParams.toString() || '-';
				// if (isAuthenticated())
				// {
				// 	request.headers.set('Authorization', `Bearer ${getToken()}`);
				// }
				console.log(`[HTTP Request]  [${formattedDate}] : ${method} ${url} QueryParams: ${queryParams} Body: `, body);
			},
		],
		beforeError: [
			async error =>
			{
				let apiResponse: any = await error.response.json();
				error = {
					...error,
					...apiResponse,
				};
				if (apiResponse?.code)
				{
					// if (apiResponse.code === ErrorCode.MAINTENANCE_ERROR)
					// {
					// 	console.log('Under maintenance, redirecting to maintenance page');
					// 	await router.navigate({
					// 		to: '/maintenance',
					// 	});
					// }
					// else if (apiResponse.code === ErrorCode.TOKEN_EXPIRED)
					// {
					// 	console.log('Token expired, redirecting to login page');
					// 	alert('Your session has expired. Please log in again.');
					// 	logout();
					// }
					error.name = _.startCase(apiResponse.code);
				}
				return error;
			},
		],
		afterResponse: [
			async (request, _options, response) =>
			{
				const formattedDate = getTimeString();
				const method = request.method;
				const url = new URL(request.url).pathname;
				const status = response.status;
				const statusText = response.statusText;
				const responseJson = await response.clone().json();
				console.log(`[HTTP Response] [${formattedDate}] : ${method} ${url} Status: ${status} ${statusText} Response : `);
				console.log(responseJson);
				return response;
			},
		],
	},
});

const client = hc<ApiRoutesType>(import.meta.env.VITE_API_URL, {
	fetch: kyInstance,
});

export const healthApi = client.health;
export const api = client.api.v1;
