# `simple-message-signer`

A simple webpage that lets you sign and verify text based messages on Solana.

## Storage

This server has no storage and perfoms all the work on the client side. No data is collected.

As a side effect, because no storage is available, there's a 1500 character limit on the message length to prevent the share URL from getting unreasonably large.

## Usage 

### Signing 

1. Connect a compatible Solana Wallet to the webpage. 
2. Type out your message in the message field.
3. Click on the sign message button.
4. Review and approve the signing request in the wallet.

### Verifying

1. Fill out the address, message, and signature fields.
2. Click on the verify button. 
3. A notification indicating the status of the verification will be displayed briefly.

### Sharing

A copy button is enabled on successful message verification and lets users copy a url to the verified message.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
