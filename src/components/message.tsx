import { Alert, Button, ButtonProps, Snackbar } from '@mui/material';
import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import React, { useCallback, useState } from 'react';

export interface SigningContext {
    input: string,
    address: string,
    signature: string,
    setInput: (event: { target: { value: string; } }) => void,
    setAddress: (event: { target: { value: string; } }) => void,
    setSignature: (event: { target: { value: string; } }) => void,
    setVerified: (verified: boolean) => void,
}

type Props = ButtonProps & {
    signingcontext: SigningContext,
}

export const SignMessageBox = (props: Props) => {
    const { publicKey, signMessage } = useWallet();
    const [signatureError, setSignatureError] = useState("");
    const [showSnackBar, setShowSnackBar] = useState(false);


    const onClick = useCallback(async () => {
        try {
            if (!publicKey) throw new Error('Wallet not connected!');
            if (!signMessage) throw new Error('Wallet does not support message signing!');

            const formattedMessage = `${props.signingcontext.input}`;
            const signature = await signMessage(new TextEncoder().encode(formattedMessage));
            if (!ed25519.verify(signature, new TextEncoder().encode(formattedMessage), publicKey.toBytes())) throw new Error('Message signature invalid!');

            // update the UI fields to reflect the signed message
            props.signingcontext.setInput({ target: { value: formattedMessage } });
            props.signingcontext.setAddress({ target: { value: publicKey.toBase58() } });
            props.signingcontext.setSignature({ target: { value: bs58.encode(signature) } });
            props.signingcontext.setVerified(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Sign Message failed: ${error.message}`);
                setSignatureError(error.message);
                setShowSnackBar(true);
            }
        }
    }, [publicKey, signMessage, props]);

    return (
        <div>
            <Button {...props} variant="contained" onClick={onClick} disabled={!props.signingcontext.input || !publicKey || !signMessage}>
                Sign Message
            </Button>
            <Snackbar
                open={showSnackBar}
                autoHideDuration={5000}
                onClose={() => setShowSnackBar(false)}
            >
                <Alert severity="error">Signature Failure: {String(signatureError)}</Alert>
            </Snackbar>
        </div>
    );
};
