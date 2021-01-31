import { Auth0Provider } from "@auth0/auth0-react";

import "rbx/index.css";

function CustomApp({ Component, pageProps }) {
  return <Auth0Provider
      domain="samtgarson.eu.auth0.com"
      clientId="60drZvfdpY07ZDnpfmJCGp2LJZqA5Cq7"
      redirectUri={process.env.APP_URL}
    >
    <Component {...pageProps} />
  </Auth0Provider>
}

export default CustomApp
