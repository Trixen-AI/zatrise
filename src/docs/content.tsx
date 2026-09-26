import type { ReactNode } from 'react';
import { bpsToPercent, NETWORKS, PROTOCOL } from '@/lib/protocol';
import { A, Note } from './parts';

export type Doc = { slug: string; title: string; group: string; summary: string; body: ReactNode };

const days = (s: number) => `${s / 86_400} days`;
const genesisDate = new Date(PROTOCOL.genesis * 1000).toUTCString().replace(' GMT', ' UTC');

export const DOCS: Doc[] = [
  // ------------------------------------------------------------------ start here
  {
    slug: '',
    group: 'Start here',
    title: 'What is Zatrise',
    summary: 'The first launchpad powered by a Zcash reward economy, built on Robinhood Chain.',
    body: (
      <>
        <p>
          Zatrise is a token launchpad on Robinhood Chain. Teams run fixed-price token sales, and the people who back those
          sales earn rewards paid in ZEC.
        </p>
        <p>
          Every raise sends a fixed cut ({bpsToPercent(PROTOCOL.feeBps)} at genesis) into one reward pool, zPool. When an epoch
          closes, the pool pays out in ZEC to stakers and committers, split by the weight each of them built during that epoch.
          There is no farm token and no points system: rewards are counted and paid in ZEC.
        </p>
        <h2>The three parts</h2>
        <ul>
          <li>
            <strong>zLaunch</strong> is where teams list a sale and where you commit ETH to the launches you rate.
          </li>
          <li>
            <strong>zPool</strong> holds staked ETH, tracks your weight and settles your ZEC rewards each epoch.
          </li>
          <li>
            <strong>zVote</strong> is where holders set the fee split, the epoch length and the listing rules.
          </li>
        </ul>
        <h2>Where to go next</h2>
        <ul>
          <li>
            New here? Read <A to="/docs/how-it-works">How the reward loop works</A>, then <A to="/docs/getting-started">Getting started</A>.
          </li>
          <li>
            Ready to act? Open the <A to="/app">Zatrise app</A>.
          </li>
          <li>
            Running a team? See <A to="/docs/launch-a-token">Launching a token</A>.
          </li>
        </ul>
      </>
    ),
  },
  {
    slug: 'how-it-works',
    group: 'Start here',
    title: 'How the reward loop works',
    summary: 'Launch fees fill one ZEC pool, and every epoch that pool pays the people who took part.',
    body: (
      <>
        <p>Zatrise runs one loop, over and over:</p>
        <ol>
          <li>A team lists a fixed-price sale on zLaunch.</li>
          <li>You commit ETH to the sale while it is live.</li>
          <li>
            When the sale closes, {bpsToPercent(PROTOCOL.feeBps)} of the raise goes to zPool and is converted to ZEC. The rest goes
            to the team.
          </li>
          <li>Stakers and committers build weight through the epoch.</li>
          <li>The epoch closes, allocations are published, and you claim your ZEC to a Zcash address.</li>
        </ol>
        <h2>Weight</h2>
        <p>
          Weight is how your share of an epoch is measured. Staked ETH earns weight for every second it stays staked, so 1 ETH
          staked for the whole epoch earns more than 1 ETH staked on the last day. ETH you commit to launches during the epoch
          adds weight on top.
        </p>
        <h2>Why ZEC</h2>
        <p>
          Paying in ZEC gives rewards a value that does not depend on Zatrise printing anything, and it lets you choose how
          private your payouts are: claim to a transparent address, or to a shielded one. See <A to="/docs/claiming-zec">Claiming ZEC</A>.
        </p>
      </>
    ),
  },
  {
    slug: 'getting-started',
    group: 'Start here',
    title: 'Getting started',
    summary: 'Add Robinhood Chain to your wallet, fund it with ETH and connect to the app.',
    body: (
      <>
        <h2>1. Add Robinhood Chain</h2>
        <p>
          Zatrise runs on Robinhood Chain, an Ethereum layer 2 that uses ETH for gas. Most wallets add it automatically when you
          connect, but you can also add it by hand:
        </p>
        <div className="doc-table">
          <table>
            <thead>
              <tr>
                <th>Network</th>
                <th>Chain ID</th>
                <th>RPC URL</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {NETWORKS.map((n) => (
                <tr key={n.chainId}>
                  <td>{n.name}</td>
                  <td>{n.chainId}</td>
                  <td>
                    <code>{n.rpc}</code>
                  </td>
                  <td>
                    <a href={n.explorer} target="_blank" rel="noopener noreferrer">
                      {n.explorer.replace('https://', '')}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>2. Fund your wallet</h2>
        <p>
          You need ETH on Robinhood Chain to commit to launches and to stake. Move ETH from Ethereum with the canonical Arbitrum
          bridge or another cross-chain route listed in the Robinhood Chain documentation.
        </p>
        <h2>3. Connect</h2>
        <p>
          Open the <A to="/app">app</A> and press <strong>Connect wallet</strong>. Zatrise supports browser wallets and
          WalletConnect. Once connected, the app reads your real balances and history from the network you are on.
        </p>
        <Note>
          Zatrise never asks for your seed phrase or private key. If anything that looks like Zatrise does, it is not us.
        </Note>
      </>
    ),
  },
  // ------------------------------------------------------------------ using zatrise
  {
    slug: 'launches',
    group: 'Using Zatrise',
    title: 'Committing to a launch',
    summary: 'Back a sale with ETH at a fixed price, within the per-wallet cap.',
    body: (
      <>
        <p>Every sale on zLaunch is fixed price. The page for each launch shows the price, the hard cap and the sale window.</p>
        <h2>Rules</h2>
        <ul>
          <li>You can commit only while the sale is live.</li>
          <li>
            One wallet can commit at most {bpsToPercent(PROTOCOL.walletCapBps)} of a sale's hard cap, across all of its
            commitments.
          </li>
          <li>Your token amount is your ETH divided by the sale price. The app shows it before you approve.</li>
          <li>When the sale closes, tokens are claimable in proportion to what you committed.</li>
        </ul>
        <h2>How to commit</h2>
        <ol>
          <li>
            Open <A to="/app/launches">Launches</A> and pick a live sale.
          </li>
          <li>Enter an amount in ETH. The app checks it against your real balance and your remaining cap.</li>
          <li>Press Commit and approve the request in your wallet.</li>
        </ol>
        <p>Committing also adds to your weight for the current epoch.</p>
      </>
    ),
  },
  {
    slug: 'staking',
    group: 'Using Zatrise',
    title: 'Staking in zPool',
    summary: `Stake ETH to build weight. Stakes lock for ${days(PROTOCOL.lockup)}.`,
    body: (
      <>
        <p>
          Staking is the steady way to earn from the pool. Your staked ETH earns weight every second it stays staked, whether or
          not you commit to a launch that epoch.
        </p>
        <h2>Lockup</h2>
        <p>
          Each new stake locks your whole position for {days(PROTOCOL.lockup)}. After that you can unstake any amount at any time.
          Adding to your stake restarts the lock.
        </p>
        <h2>Weight in numbers</h2>
        <p>
          Weight is counted in ETH-days: 2 ETH staked for 3 days is 6 ETH-days. The <A to="/app/stake">zPool page</A> shows your
          live weight for the current epoch.
        </p>
        <h2>Voting</h2>
        <p>
          Your stake is also your voting weight in zVote. See <A to="/docs/governance">Governance</A>.
        </p>
      </>
    ),
  },
  {
    slug: 'rewards',
    group: 'Using Zatrise',
    title: 'Rewards and epochs',
    summary: `Rewards are counted in ${days(PROTOCOL.epochLength)} epochs and paid in ZEC.`,
    body: (
      <>
        <p>
          Time in Zatrise is split into epochs of {days(PROTOCOL.epochLength)}. Epoch 0 started {genesisDate}; every epoch after
          that starts exactly one week later.
        </p>
        <h2>What happens when an epoch closes</h2>
        <ol>
          <li>Fees collected from launches that closed during the epoch are converted to ZEC.</li>
          <li>Each wallet's share is its weight divided by the total weight of the epoch.</li>
          <li>Allocations are published, and every wallet with a share can claim.</li>
        </ol>
        <p>
          ZEC amounts are shown in ZEC and settled in zatoshis (1 ZEC = {PROTOCOL.zatsPerZec.toLocaleString('en-US')} zats), the
          smallest unit of Zcash.
        </p>
        <p>
          Track the live epoch and claim on the <A to="/app/rewards">Rewards page</A>.
        </p>
      </>
    ),
  },
  {
    slug: 'claiming-zec',
    group: 'Using Zatrise',
    title: 'Claiming ZEC',
    summary: 'Choose a transparent or shielded Zcash address for your payout.',
    body: (
      <>
        <p>
          ZEC lives on the Zcash network, not on Robinhood Chain, so a claim names the Zcash address that should receive your
          payout. You sign the claim with the same wallet that earned the reward.
        </p>
        <h2>Address types the app accepts</h2>
        <div className="doc-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Starts with</th>
                <th>Privacy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Transparent</td>
                <td>
                  <code>t1</code>, <code>t3</code>, <code>tex1</code>
                </td>
                <td>Amounts and addresses are public, like Bitcoin.</td>
              </tr>
              <tr>
                <td>Sapling (shielded)</td>
                <td>
                  <code>zs1</code>
                </td>
                <td>Amount and receiver are encrypted.</td>
              </tr>
              <tr>
                <td>Unified</td>
                <td>
                  <code>u1</code>
                </td>
                <td>Your wallet picks the most private pool it supports.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The app checks each address's checksum before you can sign, so a mistyped address is caught before it reaches your
          wallet. Testnet addresses are rejected.
        </p>
        <Note>
          A payout to a shielded or unified address keeps the amount private on Zcash. Your claim itself is still linked to
          your Robinhood Chain wallet, because that is the wallet that earned it.
        </Note>
      </>
    ),
  },
  {
    slug: 'governance',
    group: 'Using Zatrise',
    title: 'Governance with zVote',
    summary: 'Staked ETH is voting weight. Holders set the fee split, epoch length and listing rules.',
    body: (
      <>
        <p>zVote decides the numbers that run the loop. At genesis those are:</p>
        <ul>
          <li>the share of each raise sent to zPool ({bpsToPercent(PROTOCOL.feeBps)})</li>
          <li>the length of an epoch ({days(PROTOCOL.epochLength)})</li>
          <li>the per-wallet cap on a sale ({bpsToPercent(PROTOCOL.walletCapBps)})</li>
          <li>the listing rules for new launches</li>
        </ul>
        <h2>Voting</h2>
        <p>
          Your voting weight is the ETH you have staked in zPool. You need a stake to vote. Each proposal stays open for{' '}
          {days(PROTOCOL.votingPeriod)}; you can vote For, Against or Abstain, once per proposal.
        </p>
        <h2>Proposing</h2>
        <p>
          Any staker can draft a proposal from the <A to="/app/govern">Governance page</A>: give it a title, the parameter it
          changes and a short case for the change.
        </p>
      </>
    ),
  },
  // ------------------------------------------------------------------ for teams
  {
    slug: 'launch-a-token',
    group: 'For teams',
    title: 'Launching a token',
    summary: 'Zatrise deploys your token on Robinhood Chain and runs your fixed-price sale.',
    body: (
      <>
        <p>
          You do not need to deploy a contract yourself. Fill in the <A to="/app/create">Launch a token</A> form, approve it in your
          wallet, and Zatrise deploys the token and opens the sale.
        </p>
        <h2>What Zatrise deploys</h2>
        <ul>
          <li>A standard ERC-20 token with 18 decimals, using the name and symbol you choose</li>
          <li>The full supply is minted once: the tokens for sale are held by the sale, the rest go to your wallet</li>
          <li>The wallet you approve with is the launch owner and receives the raise</li>
        </ul>
        <h2>What you fill in</h2>
        <ul>
          <li>Project name, category, a one-line pitch and a short description</li>
          <li>
            A logo: PNG, JPG or WebP, exactly <strong>500 x 500 pixels</strong>, up to 1 MB
          </li>
          <li>Token name, symbol (2 to 8 letters or digits) and total supply</li>
          <li>Tokens for sale and the hard cap in ETH, which together set the price</li>
          <li>When the sale opens and closes (at most 30 days)</li>
          <li>Website and X account</li>
        </ul>
        <h2>Economics</h2>
        <p>
          When your sale closes, {bpsToPercent(PROTOCOL.feeBps)} of the ETH raised goes to zPool and the rest to your wallet. Tokens
          that were not sold return to you. One wallet can buy at most {bpsToPercent(PROTOCOL.walletCapBps)} of your sale.
        </p>
      </>
    ),
  },
  // ------------------------------------------------------------------ reference
  {
    slug: 'parameters',
    group: 'Reference',
    title: 'Genesis parameters',
    summary: 'The numbers the loop starts with. zVote can change them.',
    body: (
      <>
        <div className="doc-table">
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fee to zPool</td>
                <td>{bpsToPercent(PROTOCOL.feeBps)} of each raise</td>
              </tr>
              <tr>
                <td>Per-wallet cap</td>
                <td>{bpsToPercent(PROTOCOL.walletCapBps)} of a sale's hard cap</td>
              </tr>
              <tr>
                <td>Epoch length</td>
                <td>{days(PROTOCOL.epochLength)}</td>
              </tr>
              <tr>
                <td>Epoch 0 start</td>
                <td>{genesisDate}</td>
              </tr>
              <tr>
                <td>Stake lockup</td>
                <td>{days(PROTOCOL.lockup)} from your latest stake</td>
              </tr>
              <tr>
                <td>Voting period</td>
                <td>{days(PROTOCOL.votingPeriod)}</td>
              </tr>
              <tr>
                <td>Reward asset</td>
                <td>ZEC, settled in zatoshis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    slug: 'signatures',
    group: 'Reference',
    title: 'Wallet requests and security',
    summary: 'What your wallet shows when you approve an action, and how to check it.',
    body: (
      <>
        <p>
          Every action in the app (stake, unstake, commit, claim, vote, propose, launch a token) is submitted as a typed request that
          your wallet asks you to approve. The request uses the EIP-712 standard, so your wallet shows each field in plain
          words instead of raw bytes.
        </p>
        <h2>What to check before you approve</h2>
        <ul>
          <li>
            The domain reads <code>Zatrise</code>, version <code>1</code>, on the network you expect.
          </li>
          <li>The account is your own address.</li>
          <li>The amount, launch, epoch or Zcash address matches what you entered.</li>
        </ul>
        <p>
          Approving a request signs it. It does not send ETH from your wallet. Each request carries a nonce and a timestamp so it
          cannot be reused.
        </p>
        <p>
          Every request you sign is listed on the <A to="/app/activity">Activity page</A>, where you can re-verify its signature
          against your address.
        </p>
        <Note>Never approve a request you did not start, and never share your seed phrase.</Note>
      </>
    ),
  },
  {
    slug: 'faq',
    group: 'Reference',
    title: 'FAQ',
    summary: 'Short answers to common questions.',
    body: (
      <>
        <h3>Is there a Zatrise token?</h3>
        <p>No. Rewards are paid in ZEC, and voting weight comes from staked ETH.</p>
        <h3>Which wallet do I need?</h3>
        <p>Any EVM wallet that supports Robinhood Chain, through a browser extension or WalletConnect.</p>
        <h3>Do I need a Zcash wallet?</h3>
        <p>Only to receive rewards. Any wallet that gives you a transparent, Sapling or unified address works.</p>
        <h3>How much can I commit to one sale?</h3>
        <p>Up to {bpsToPercent(PROTOCOL.walletCapBps)} of that sale's hard cap per wallet.</p>
        <h3>When can I unstake?</h3>
        <p>{days(PROTOCOL.lockup)} after your latest stake.</p>
        <h3>Is Zatrise affiliated with Robinhood or Zcash?</h3>
        <p>No. Zatrise is an independent project that runs on Robinhood Chain and pays rewards in ZEC.</p>
      </>
    ),
  },
];

export const DOC_GROUPS = [...new Set(DOCS.map((d) => d.group))];
