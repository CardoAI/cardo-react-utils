import axios from "axios";
import {ICreateClientParams} from "./interfaces"

const createClient = ({baseURL}: ICreateClientParams) => {
    const client = axios.create({baseURL: baseURL}) as any;
    client.isCancel = axios.isCancel;
    client.CancelToken = axios.CancelToken;
    return client;
}
export default createClient;
