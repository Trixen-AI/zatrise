import { useRef, useState } from 'react';
import { keccak256 } from 'viem';

export type LogoFile = { dataUrl: string; hash: `0x${string}`; name: string; size: number };

const TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 1024 * 1024;
export const LOGO_SIZE = 500;

async function readLogo(file: File): Promise<LogoFile> {
  if (!TYPES.includes(file.type)) throw new Error('Use a PNG, JPG or WebP image.');
  if (file.size > MAX_BYTES) throw new Error(`The file is ${(file.size / 1024 / 1024).toFixed(2)} MB. Keep it under 1 MB.`);
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('This image could not be read.');
  });
  const { width, height } = bitmap;
  bitmap.close();
  if (width !== LOGO_SIZE || height !== LOGO_SIZE) {
    throw new Error(`Your logo is ${width} × ${height}. Upload an image of exactly ${LOGO_SIZE} × ${LOGO_SIZE} pixels.`);
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('This image could not be read.'));
    r.readAsDataURL(file);
  });
  return { dataUrl, hash: keccak256(bytes), name: file.name, size: file.size };
}

/** Drop zone for a launch logo: PNG, JPG or WebP, exactly 500 x 500, up to 1 MB. */
export function LogoUpload({ id, value, onChange, error }: { id: string; value: LogoFile | null; onChange: (v: LogoFile | null) => void; error?: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  async function take(file?: File) {
    if (!file) return;
    try {
      onChange(await readLogo(file));
      setProblem(null);
    } catch (e) {
      onChange(null);
      setProblem(e instanceof Error ? e.message : 'This image could not be read.');
    }
  }

  const message = problem ?? error;

  return (
    <div className="flex flex-col gap-[8px]">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files[0]);
        }}
        className={`flex items-center gap-[16px] rounded-[16px] border-[1.5px] border-dashed p-[16px] transition-colors ${
          over ? 'border-gold bg-gold-deep/40' : message ? 'border-[#ff5f7e]/70' : 'border-line-2 bg-bg'
        }`}
      >
        <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-white/10 bg-surface-2">
          {value ? (
            <img src={value.dataUrl} alt="Logo preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-center text-[1.2rem] leading-130 text-muted">
              500 × 500
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
          {value ? (
            <>
              <p className="t-body-sb truncate">{value.name}</p>
              <p className="t-small text-muted">
                500 × 500 · {(value.size / 1024).toFixed(0)} KB
              </p>
            </>
          ) : (
            <>
              <p className="t-body-sb">Drop your logo here</p>
              <p className="t-small text-muted">PNG, JPG or WebP, exactly 500 × 500 pixels, up to 1 MB.</p>
            </>
          )}
          <div className="flex flex-wrap gap-[8px]">
            <button type="button" onClick={() => input.current?.click()} className="t-small-m rounded-full border border-gold/60 px-[12px] py-[5px] text-gold hover:bg-gold-deep">
              {value ? 'Replace' : 'Choose file'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  if (input.current) input.current.value = '';
                }}
                className="t-small-m rounded-full border border-white/15 px-[12px] py-[5px] text-soft hover:border-line-2"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <input
          ref={input}
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          aria-invalid={!!message}
          onChange={(e) => take(e.target.files?.[0])}
        />
      </div>
      {message && (
        <p className="t-small text-[#ff9aae]" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
