import axios from 'axios';

const initInterceptor = store => {
	axios.interceptors.response.use(
		response => response,
		err => {
			if (axios.isCancel(err)) return Promise.reject(err);
			
			let errorMessage = (err.response && err.response.data && err.response.data.errMsg) || 'Unknown Error';
			// store.dispatch(logError(errorMessage));
			/*if (!err.response) {
				const payload = {
					title: 'Connection Error',
					message: 'It looks like the server is down!'
				};
				store.dispatch({type: actionTypes.SHOW_POPUP, payload});
			}*/
			console.error(errorMessage);
			return Promise.reject(err);
		}
	);
};

export default initInterceptor;
