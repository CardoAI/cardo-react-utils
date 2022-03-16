const createInterceptor = ({client, start, end}: any) => {
  client.interceptors.request.use((config: any) => {
    start();
    return config;
  }, (error: any) => {
    end();
    return Promise.reject(error);
  });

  client.interceptors.response.use((response: any) => {
    end();
    return response;
  }, (error: any) => {
    end();
    return Promise.reject(error);
  });
}

export default createInterceptor;

