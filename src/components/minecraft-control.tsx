import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";

export const MinecraftControl = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    getAccessTokenSilently({
     audience: 'https://boardinghousemassive.com/api',
     scope: "read:current_user"
    }).then(setToken)
  }, [])

  return <p>{ token }</p>;
}
