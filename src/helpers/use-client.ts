import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useMemo } from "react";
import Axios from 'axios'

export function useClient() {
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    getAccessTokenSilently({
     audience: 'https://boardinghousemassive.com/api',
     scope: "read:current_user"
    }).then(setToken)
  }, [])

  const client = useMemo(() => {
    if (!token) return undefined
    return Axios.create({
      baseURL: '/api',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  }, [token])

  return client
}
