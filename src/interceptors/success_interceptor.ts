const createInterceptor = ({client}: any) => {
  return client.interceptors.response.use(((response: any) => {
    return response.data
  }))
}

export default createInterceptor;