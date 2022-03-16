const createInterceptor = ({client, getToken}: any) => {
  return client.interceptors.request.use((request: any) => {
    request.headers['Authorization'] = 'Bearer ' + getToken();
    return request;
  })
}

export default createInterceptor;