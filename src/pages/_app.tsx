import { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Swingby Token Bridge - Under Construction</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

