import { Box, Button, TextField, Tooltip, Typography } from "@mui/material"
import bs58 from 'bs58';
import { SignMessageBox, SigningContext } from "./message"
import { ContentCopy } from "@mui/icons-material"
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { PublicKey } from "@solana/web3.js"
import { ed25519 } from "@noble/curves/ed25519"
import { MeteredMessageBox } from "./meteredmessagebox";

/// Set the message verification state and request to display it
export type ReportMessageVerification = (verified: boolean, show?: boolean) => void;

const MAX_MSG_LENGTH = 1500;
function getPluralizedWord(count: number): string {
    return count === 1 ? "character" : "characters";
}

function sanitizeInput(input: string) {
    input = input.replace(/<script.*?>.*?<\/script>/gi, '');
    if (input.length > MAX_MSG_LENGTH) {
        console.log("Message length limit reached. Truncating...");
        input = input.substring(0, MAX_MSG_LENGTH);
    }
    return input;
};

export const MessageForm = (props: { reportVerification: ReportMessageVerification }) => {
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [signature, setSignature] = useState("");
    const [addressError, setAddressError] = useState(false);
    const [verified, setVerifiedInternal] = useState(false);

    const setVerified = useCallback((verified: boolean, show = false) => {
        setVerifiedInternal(verified);
        props.reportVerification(verified, show);
    }, [props]);

    const handleAddressChange = useCallback((event: { target: { value: SetStateAction<string>; }; }) => {
        setVerified(false);
        const update = event.target.value;
        setAddress(update);

        try {
            let isError = false;
            if (update.length > 0 && !PublicKey.isOnCurve(update)) {
                isError = true;
            }
            setAddressError(isError);
        } catch (error: any) {
            setAddressError(true);
        }
    }, [setVerified]);

    const handleSignatureChange = useCallback((event: { target: { value: SetStateAction<string>; }; }) => {
        setVerified(false);
        setSignature(event.target.value);
    }, [setVerified]);

    const handleInputChange = useCallback((event: { target: { value: string; }; }) => {
        setVerified(false);
        setMessage(sanitizeInput(event.target.value));
    }, [setVerified]);

    const handleVerifyClick = useCallback(() => {
        // Handle verification logic
        try {
            const verified = ed25519.verify(bs58.decode(signature), new TextEncoder().encode(message), bs58.decode(address));
            if (verified) {
                setVerified(true);
            }
        } catch (error) {
            console.error("Message verification failed!");
            setVerified(false, true);
        }
    }, [setVerified, address, message, signature]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlAddress = urlParams.get('address');
        const urlMessage = urlParams.get('message');
        const urlSignature = urlParams.get('signature');

        if (urlAddress && urlMessage && urlSignature) {
            handleAddressChange({ target: { value: urlAddress } });
            handleInputChange({ target: { value: urlMessage } });
            handleSignatureChange({ target: { value: urlSignature } });
        }
    }, [handleAddressChange, handleInputChange, handleSignatureChange]);

    const signingContext = useMemo(() => {
        const context: SigningContext = {
            input: message,
            address,
            signature,
            setAddress: handleAddressChange,
            setSignature: handleSignatureChange,
            setInput: handleInputChange,
            setVerified
        };
        return context;
    }, [message, address, signature, handleAddressChange, handleSignatureChange, handleInputChange, setVerified]);

    function writeToClipboard() {
        // prepare UI to share the signed message
        const encodedAddress = encodeURIComponent(address);
        const encodedMessage = encodeURIComponent(message);
        const encodedSignature = encodeURIComponent(signature);
        const newUrl = `${window.location.origin}${window.location.pathname}?address=${encodedAddress}&message=${encodedMessage}&signature=${encodedSignature}`;
        navigator.clipboard.writeText(newUrl).then(() => {
            console.log("Copied to clipboard!");
        }, (err) => {
            console.error("Failed to copy to clipboard: ", err);
        });
    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, overflowY: 'auto' }}>
            <Typography
                variant="h6"
                component="h2"
                style={{
                    alignSelf: 'center',
                    marginBottom: '10px'
                }}
            >
                Message Details
            </Typography>
            <TextField
                label="address"
                autoComplete='off'
                type="text"
                error={addressError}
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter an address"
                style={{ width: '50vw', margin: '10px' }}
            />
            <MeteredMessageBox
                label="message"
                autoComplete='off'
                value={message}
                onChange={handleInputChange}
                placeholder="Type a message here..."
                multiline
                style={{ width: '50vw', margin: '10px' }}
                word={getPluralizedWord(MAX_MSG_LENGTH - message.length)}
                limit={MAX_MSG_LENGTH}
                count={message.length}
                charactersremaining={MAX_MSG_LENGTH - message.length}
            />
            <TextField
                label="signature"
                autoComplete='off'
                type="text"
                value={signature}
                onChange={handleSignatureChange}
                placeholder="Enter a signature here"
                style={{ width: '50vw', margin: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'end', width: '50vw', margin: '10px' }}>
                <Tooltip title={!verified ? "Verify to enable" : "Copy URL"}>
                    <span>
                        <Button startIcon={<ContentCopy />} disabled={!verified} variant="text" color="secondary" style={{ margin: '10px', }} onClick={writeToClipboard}>
                            Copy
                        </Button>
                    </span>
                </Tooltip>
                <Button variant="contained" style={{ margin: '10px' }} color="secondary" onClick={handleVerifyClick} disabled={addressError || !address || !message || !signature}>
                    Verify
                </Button>
                <SignMessageBox style={{ margin: '10px' }} color="secondary" signingcontext={signingContext} />
            </div>
        </Box>
    )
}
