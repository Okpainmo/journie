import '@/styles/globals.css';
import GlobalContextProvider from '@/context/GlobalContext';
// import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <Component {...pageProps} />
    </GlobalContextProvider>
  );
}
