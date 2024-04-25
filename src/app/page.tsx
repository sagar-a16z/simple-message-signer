'use client';

import { useState } from 'react';
import { SignerWalletContext } from '@/components/context';
import { Accordion, AccordionDetails, AccordionSummary, Alert, CssBaseline, Link, Snackbar } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MessageForm } from '@/components/messageform';
import ButtonAppBar from '@/components/appbar';
import { ExpandCircleDown } from '@mui/icons-material';

const darkTheme = createTheme({
  palette: {
    // Solana brand colors
    primary: {
      main: '#9945FF',
    },
    secondary: {
      main: '#14F195',
    },
    mode: 'dark',
  },
});

export default function Home() {
  const [verified, setVerifiedInternal] = useState(false);
  const [openVerifiedSnackbar, showVerifiedSnackBar] = useState(false);

  function setVerified(verified: boolean, showSnackBar = false) {
    if (verified || showSnackBar) {
      showVerifiedSnackBar(true);
    }

    setVerifiedInternal(verified);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <SignerWalletContext>
        <CssBaseline />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'auto',
        }}>
          <ButtonAppBar />
          <div style={{
            overflow: 'auto',
            flex: 1,
            paddingTop: '6vw',
          }}>
            <MessageForm reportVerification={setVerified} />
          </div>
          <Accordion style={{ width: '60vw', alignSelf: 'center', marginBottom: '20px' }}>
            <AccordionSummary
              expandIcon={<ExpandCircleDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              How it works.
            </AccordionSummary>
            <AccordionDetails>
              This website uses the <Link href="https://github.com/anza-xyz/wallet-adapter">Solana Wallet Adapter</Link> to sign and verify simple messages offline. No information is stored or transmitted.
              <br></br>
              Github: <Link href="https://github.com/sagar-a16z/simple-message-signer">https://github.com/sagar-a16z/simple-message-signer</Link>
            </AccordionDetails>
          </Accordion>
        </div>
        <Snackbar
          open={openVerifiedSnackbar}
          autoHideDuration={3000}
          onClose={() => showVerifiedSnackBar(false)}
          message={verified ? "Message Verified" : "Message Verification Failed"}
        >
          {verified ?
            <Alert severity="success">Message Verified</Alert> :
            <Alert severity="error">Message Verification Failed</Alert>}
        </Snackbar>
      </SignerWalletContext>
    </ThemeProvider >
  );
}