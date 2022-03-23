import {ICreateClientStorageParams} from "./interfaces";

const createStorage = ({access = 'access', refresh = 'refresh'}: ICreateClientStorageParams) => {

    const storage = {
        getAccess() {
            return localStorage.getItem(access)
        },
        setAccess(token: string) {
            return localStorage.setItem(access, token)
        },
        clearAccess() {
            return localStorage.removeItem(access)
        },
        getRefresh() {
            return localStorage.getItem(refresh)
        },
        setRefresh(token: string) {
            return localStorage.setItem(refresh, token)
        },
        clearRefresh() {
            return localStorage.removeItem(refresh)
        },
        clearEverything() {
            storage.clearAccess();
            storage.clearRefresh()
        }
    }

    return storage;
}

export default createStorage;
