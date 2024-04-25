import * as React from 'react';
import AppBar, { AppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import dynamic from 'next/dynamic';
import { Link } from '@mui/material';

const ConnectButton = dynamic(async () => ((await import('@solana/wallet-adapter-react-ui')).WalletMultiButton), { ssr: false });

export default function ButtonAppBar(props: AppBarProps) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ ...props }}>
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        <Link underline="none" href="/" color={'inherit'}>
                            Simple Message Signer
                        </Link>
                    </Typography>
                    <ConnectButton />
                </Toolbar>
            </AppBar>
        </Box>
    );
}