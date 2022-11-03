import createCache from "./create_cache";
import createClient from "./create_client";
import createCallApi from "./create_call_api";
import createController from "./create_controller";
import createDownload from "./create_download";
import createUseQuery, { QueryServices } from "./use_query_services";
import useLazyForm, {
    date,
    file,
    radio,
    email,
    array,
    object,
    string,
    number,
    select,
    checkbox,
    password,
    multiselect
} from './lazy_form';

const LazyForm: any = {
    date,
    file,
    radio,
    email,
    array,
    object,
    string,
    number,
    select,
    checkbox,
    password,
    multiselect,
    useLazyForm,
};

export {
    createCache,
    createClient,
    createCallApi,
    createController,
    createDownload,
    createUseQuery,
    QueryServices,
    LazyForm,
};
