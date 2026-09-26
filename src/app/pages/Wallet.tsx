import { useAppKit } from '@reown/appkit/react';
import { robinhood, robinhoodTestnet } from '@reown/appkit/networks';
import { formatEther, formatUnits } from 'viem';
import { useBalance, useSwitchChain } from 'wagmi';
import { addressUrl, txUrl, useCounters, useEthPrice, useTokenBalances, useTransactions } from '@/app/lib/blockscout';
import { fmtAgo, fmtEth, fmtNumber, shortAddress } from '@/app/lib/format';
import { useActive } from '@/app/lib/useActive';
import { useNow } from '@/app/lib/useNow';
import { IconLink } from '@/app/ui/icons';
import { Badge, Card, CardTitle, CopyButton, Empty, PageHeader, Stat } from '@/app/ui/kit';

function ChainBalance({ address, chainId, name, active, onSwitch }: { address: `0x${string}`; chainId: number; name: string; active: boolean; onSwitch: () => void }) {
  const { data, isLoading } = useBalance({ address, chainId });
  return (
    <div className={`flex items-center justify-between gap-[12px] rounded-[14px] border p-[16px] ${active ? 'border-gold/60 bg-gold-deep/40' : 'border-white/10 bg-bg'}`}>
      <div className="flex flex-col gap-[4px]">
        <span className="t-small text-muted">{name}</span>
        <span className="text-[2rem] font-semibold">{isLoading ? '…' : fmtEth(data?.value ?? 0n, 6)}</span>
      </div>
      {active ? (
        <Badge tone="gold">Active</Badge>
      ) : (
        <button type="button" onClick={onSwitch} className="t-small-m rounded-full border border-white/15 px-[12px] py-[6px] text-soft hover:border-gold hover:text-gold">
          Switch
        </button>
      )}
    </div>
  );
}

export default function Wallet() {
  const { address, chainId, isConnected, balance } = useActive();
  const { open } = useAppKit();
  const { switchChain } = useSwitchChain();
  const now = useNow();
  const tokens = useTokenBalances(chainId, address);
  const txs = useTransactions(chainId, address);
  const counters = useCounters(chainId, address);
  const price = useEthPrice(chainId);

  if (!isConnected || !address) {
    return (
      <>
        <PageHeader eyebrow="Wallet" title="Your wallet on Robinhood Chain" />
        <Empty title="Connect a wallet" action={<button type="button" className="btn btn-primary" onClick={() => open()}>Connect wallet</button>}>
          Balances, tokens and transactions are read live from Robinhood Chain and its explorer.
        </Empty>
      </>
    );
  }

  const usd = balance !== undefined && price.data ? Number(formatEther(balance)) * price.data : null;

  return (
    <>
      <PageHeader eyebrow="Wallet" title="Your wallet on Robinhood Chain">
        Everything here is read live from the chain and the Blockscout explorer.
      </PageHeader>

      <Card className="mb-[16px]">
        <div className="flex flex-wrap items-center justify-between gap-[16px]">
          <div className="flex min-w-0 flex-col gap-[4px]">
            <span className="t-small text-muted">Address</span>
            <span className="flex items-center gap-[6px] font-mono text-[1.5rem] text-white">
              <span className="truncate">{shortAddress(address, 10, 8)}</span>
              <CopyButton text={address} label="Copy address" />
              <a href={addressUrl(chainId, address)} target="_blank" rel="noopener noreferrer" aria-label="Open in explorer" className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[8px] text-muted-2 hover:bg-white/5 hover:text-white">
                <IconLink size={16} />
              </a>
            </span>
          </div>
          <Stat label="Balance" value={balance !== undefined ? fmtEth(balance, 5) : '…'} hint={usd !== null ? `≈ $${fmtNumber(usd, 2)}` : undefined} />
          <Stat label="Transactions" value={counters.data ? fmtNumber(Number(counters.data.transactions_count), 0) : '…'} />
          <Stat label="Token transfers" value={counters.data ? fmtNumber(Number(counters.data.token_transfers_count), 0) : '…'} />
        </div>
      </Card>

      <div className="grid gap-[16px] xl:grid-cols-[400px_1fr]">
        <div className="flex min-w-0 flex-col gap-[16px]">
          <Card>
            <CardTitle>Networks</CardTitle>
            <div className="flex flex-col gap-[10px]">
              <ChainBalance address={address} chainId={robinhood.id} name="Robinhood Chain" active={chainId === robinhood.id} onSwitch={() => switchChain({ chainId: robinhood.id })} />
              <ChainBalance address={address} chainId={robinhoodTestnet.id} name="Robinhood Chain Testnet" active={chainId === robinhoodTestnet.id} onSwitch={() => switchChain({ chainId: robinhoodTestnet.id })} />
            </div>
          </Card>
          <Card>
            <CardTitle>Tokens</CardTitle>
            {tokens.isLoading ? (
              <p className="t-small text-muted">Loading tokens…</p>
            ) : tokens.isError ? (
              <p className="t-small text-[#ff9aae]">The explorer did not respond.</p>
            ) : tokens.data?.length ? (
              <ul className="flex flex-col">
                {tokens.data.map((t) => {
                  const amount = Number(formatUnits(BigInt(t.value), Number(t.token.decimals ?? 18)));
                  return (
                    <li key={t.token.address_hash} className="flex items-center justify-between gap-[12px] border-t border-white/10 py-[12px] first:border-t-0">
                      <div className="flex min-w-0 items-center gap-[10px]">
                        {t.token.icon_url ? (
                          <img src={t.token.icon_url} alt="" className="h-[28px] w-[28px] rounded-full" loading="lazy" />
                        ) : (
                          <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-surface-2 text-[1.1rem] font-semibold text-muted-2">
                            {(t.token.symbol ?? '?').slice(0, 2)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="t-body-sb truncate">{t.token.symbol ?? 'Unknown'}</p>
                          <p className="t-small truncate text-muted">{t.token.name ?? shortAddress(t.token.address_hash)}</p>
                        </div>
                      </div>
                      <span className="t-body-m shrink-0">{fmtNumber(amount, 4)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Empty title="No ERC-20 tokens on this network" />
            )}
          </Card>
        </div>

        <Card className="min-w-0">
          <CardTitle
            action={
              <a href={addressUrl(chainId, address)} target="_blank" rel="noopener noreferrer" className="t-small-m text-gold hover:underline">
                Explorer →
              </a>
            }
          >
            Recent transactions
          </CardTitle>
          {txs.isLoading ? (
            <p className="t-small text-muted">Loading transactions…</p>
          ) : txs.isError ? (
            <p className="t-small text-[#ff9aae]">The explorer did not respond. Try again in a moment.</p>
          ) : txs.data?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="t-small text-muted">
                    <th className="pb-[10px] font-medium">Transaction</th>
                    <th className="pb-[10px] font-medium">Direction</th>
                    <th className="pb-[10px] font-medium">Value</th>
                    <th className="pb-[10px] font-medium">Status</th>
                    <th className="pb-[10px] text-right font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.data.slice(0, 20).map((t) => {
                    const out = t.from.hash.toLowerCase() === address.toLowerCase();
                    return (
                      <tr key={t.hash} className="border-t border-white/10">
                        <td className="py-[12px]">
                          <a href={txUrl(chainId, t.hash)} target="_blank" rel="noopener noreferrer" className="t-body-m hover:text-gold">
                            {t.method ?? 'Transfer'}
                          </a>
                          <p className="t-small font-mono text-muted">{shortAddress(t.hash, 8, 6)}</p>
                        </td>
                        <td className="py-[12px]">
                          <Badge tone={out ? 'blue' : 'green'}>{out ? 'Out' : 'In'}</Badge>
                        </td>
                        <td className="t-body py-[12px]">{fmtNumber(Number(formatEther(BigInt(t.value))), 6)} ETH</td>
                        <td className="py-[12px]">
                          <Badge tone={t.status === 'ok' ? 'green' : t.status === 'error' ? 'red' : 'muted'}>{t.status === 'ok' ? 'Success' : t.status === 'error' ? 'Failed' : 'Pending'}</Badge>
                        </td>
                        <td className="t-small py-[12px] text-right text-muted">{fmtAgo(Math.floor(new Date(t.timestamp).getTime() / 1000), now)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No transactions on this network yet" />
          )}
        </Card>
      </div>
    </>
  );
}
