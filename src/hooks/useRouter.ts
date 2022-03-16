/*
import {useMemo} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";

const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  return useMemo(() => {
    return {
      navigate: navigate,
      pathname: location.pathname,
      query: {
        ...params,
      },
      location,
    };
  }, [params, location]);
}

export default useRouter;*/
