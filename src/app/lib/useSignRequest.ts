import { useAppKit } from '@reown/appkit/react';
import { useState } from 'react';
import { UserRejectedRequestError } from 'viem';
import { useAccount, useSignTypedData } from 'wagmi';
import { SUPPORTED_CHAIN_IDS } from '@/app/config/wallet';
import { useToast } from '@/app/ui/toastContext';
import { domain, nextNonce, type RequestKind, saveRequest, type SignedRequest, TYPES } from './requests';

type Fields = Record<string, string | number | bigint>;

function isRejection(e: unknown) {
  if (e instanceof UserRejectedRequestError) return true;
  const msg = e instanceof Error ? e.message : String(e);
  return /reject|denied|cancel/i.test(msg);
}

/**
 * Turns a filled form into an EIP-712 request the user approves in their wallet.
 * Opens the connect modal when no wallet is connected, and the network picker when the wallet is off Robinhood Chain.
 */
export function useSignRequest() {
  const { address, chainId, isConnected } = useAccount();
  const { open } = useAppKit();
  const { signTypedDataAsync } = useSignTypedData();
  const toast = useToast();
  const [pending, setPending] = useState<RequestKind | null>(null);

  async function sign(kind: RequestKind, fields: Fields, success: { title: string; body?: string }): Promise<SignedRequest | null> {
    if (!isConnected || !address) {
      toast.push('info', 'Connect a wallet to continue', 'Your form is kept. Approve it once your wallet is connected.');
      open();
      return null;
    }
    if (!chainId || !SUPPORTED_CHAIN_IDS.has(chainId)) {
      toast.push('info', 'Switch to Robinhood Chain', 'Pick Robinhood Chain or its testnet, then approve again.');
      open({ view: 'Networks' });
      return null;
    }

    const message: Fields = {
      account: address,
      nonce: BigInt(nextNonce(address)),
      issuedAt: BigInt(Math.floor(Date.now() / 1000)),
      ...fields,
    };

    setPending(kind);
    try {
      const signature = await signTypedDataAsync({
        domain: domain(chainId),
        types: { [kind]: TYPES[kind] },
        primaryType: kind,
        message,
      } as unknown as Parameters<typeof signTypedDataAsync>[0]);

      const record: SignedRequest = {
        id: crypto.randomUUID(),
        kind,
        chainId,
        account: address,
        message: Object.fromEntries(Object.entries(message).map(([k, v]) => [k, v.toString()])),
        signature,
        createdAt: Date.now(),
      };
      saveRequest(record);
      toast.push('success', success.title, success.body);
      return record;
    } catch (e) {
      if (isRejection(e)) toast.push('error', 'Request rejected', 'Nothing was signed. You can try again.');
      else toast.push('error', 'Wallet error', e instanceof Error ? e.message.split('\n')[0] : 'Unknown error');
      return null;
    } finally {
      setPending(null);
    }
  }

  return { sign, pending, address, chainId, isConnected };
}
