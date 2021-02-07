import { AppTitle } from "@/components/app-title";
import { Auth0Provider } from "@auth0/auth0-react";
import { Section, Container } from "rbx";
import React from "react";

import "rbx/index.css";
import { AppProps } from "next/app"

function CustomApp({ Component, pageProps }: AppProps) {
  return <Auth0Provider
      domain="samtgarson.eu.auth0.com"
      clientId="60drZvfdpY07ZDnpfmJCGp2LJZqA5Cq7"
      redirectUri={process.env.NEXT_PUBLIC_APP_URL}
      cacheLocation="localstorage"
    >
    <Section>
      <Container>
        <AppTitle />
        <Component {...pageProps} />
      </Container>
    </Section>
  </Auth0Provider>
}

export default CustomApp
