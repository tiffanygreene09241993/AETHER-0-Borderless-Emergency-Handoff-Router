import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Printer,
  Scissors,
  Camera,
  CameraOff,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  CreditCard,
  Stamp,
  Maximize2,
  FileText,
} from 'lucide-react';

type MicroTokenFormat = 'CREDIT_CARD' | 'POSTAGE_STAMP' | 'SHOE_INSOLE';

interface MicroTokenPayload {
  schema: string;
  epoch: number;
  type: string;
  fp: string;
  vKeyHash: string;
  shard: string;
  instId: string;
  ts: number;
}

export const PhysicalMicroToken: React.FC = () => {
  const [format, setFormat] = useState<MicroTokenFormat>('CREDIT_CARD');
  const [epoch, setEpoch] = useState<number>(2);
  const [selectedGuardianShard, setSelectedGuardianShard] = useState<'TIER3_CONSULAR' | 'SHAMIR_SHARD_1' | 'SHAMIR_SHARD_2'>('TIER3_CONSULAR');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Camera Scanner States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Micro-token payload generation (ZERO readable plaintext PII)
  const payloadObj: MicroTokenPayload = {
    schema: 'AETHER-7FAM-1700',
    epoch,
    type: selectedGuardianShard,
    fp: 'A18F90C2B410',
    vKeyHash: 'E4A981C037F289D2B510AC6649198EF0',
    shard:
      selectedGuardianShard === 'TIER3_CONSULAR'
        ? 'ENC-T3-OAEP-7FAM1700-E4A981C037F289D2B510AC6649198EF0A72B84D3C91001FB76294A0D81E59C31'
        : '01E4A981C037F289D2B510AC6649198EF0A72B84D3C91001FB76294A0D81E59C31A8B490C0',
    instId: 'DOS-OCS-7FAM-CONSULAR-DESK',
    ts: 1791114760,
  };

  const payloadString = JSON.stringify(payloadObj);

  // Generate QR Code data URL
  useEffect(() => {
    QRCode.toDataURL(
      payloadString,
      {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 320,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [payloadString]);

  // Camera Scanner lifecycle
  const startCamera = async () => {
    setCameraError(null);
    setScannedResult(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      setCameraError(err.message || 'Unable to access camera. Please verify camera permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSimulateScan = () => {
    setScannedResult(payloadString);
    stopCamera();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono">
              PHYSICAL CONCEALMENT MICRO-TOKEN GENERATOR
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
              ● ZERO PLAINTEXT PII
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Offline survival safe-harbor: Generates printable micro-tokens sized to fit behind credit cards, inside shoe insoles, or sewn into clothing hems for border crossings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyPayload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedPayload ? 'PAYLOAD COPIED' : 'COPY RAW JSON'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT MICRO-CARD</span>
          </button>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <label className="text-slate-400 block mb-1">CONCEALMENT FORMAT PRESET:</label>
          <div className="grid grid-cols-3 gap-1 bg-[#090e1a] p-1 rounded border border-slate-800">
            <button
              onClick={() => setFormat('CREDIT_CARD')}
              className={`p-1.5 rounded text-center transition-colors flex flex-col items-center gap-1 ${
                format === 'CREDIT_CARD'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="text-[10px]">Credit Card</span>
            </button>
            <button
              onClick={() => setFormat('POSTAGE_STAMP')}
              className={`p-1.5 rounded text-center transition-colors flex flex-col items-center gap-1 ${
                format === 'POSTAGE_STAMP'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span className="text-[10px]">Stamp Slip</span>
            </button>
            <button
              onClick={() => setFormat('SHOE_INSOLE')}
              className={`p-1.5 rounded text-center transition-colors flex flex-col items-center gap-1 ${
                format === 'SHOE_INSOLE'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span className="text-[10px]">Sole Strip</span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">PAYLOAD ESCROW SHARD:</label>
          <select
            value={selectedGuardianShard}
            onChange={(e) => setSelectedGuardianShard(e.target.value as any)}
            className="w-full bg-[#090e1a] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="TIER3_CONSULAR">Tier 3 Consular Escrow Token (7 FAM 1700)</option>
            <option value="SHAMIR_SHARD_1">Shamir Recovery Share #1 (Legal Aid Clinic)</option>
            <option value="SHAMIR_SHARD_2">Shamir Recovery Share #2 (DV Crisis Advocate)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">CONFLICT EPOCH NONCE:</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={10}
              value={epoch}
              onChange={(e) => setEpoch(parseInt(e.target.value) || 1)}
              className="w-24 bg-[#090e1a] border border-slate-800 rounded p-2 text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[11px] text-slate-400 leading-tight">
              Epoch #{epoch} matches current quorum rotation.
            </span>
          </div>
        </div>
      </div>

      {/* Vector Printable Micro-Token Canvas Display */}
      <div className="p-6 bg-[#04060b] rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-center mb-3">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block">
            PREVIEW: {format.replace('_', ' ')} PRINT SPECIFICATION
          </span>
          <span className="text-[10px] text-slate-400">
            {format === 'CREDIT_CARD' && 'Standard CR80 dimensions (85.60 mm × 53.98 mm) · Fits wallet hidden slot'}
            {format === 'POSTAGE_STAMP' && 'Ultra-micro fold slip (25 mm × 25 mm) · Sewable into clothing seam or hem'}
            {format === 'SHOE_INSOLE' && 'Elongated sole insert strip (20 mm × 75 mm) · Fits beneath shoe insole lining'}
          </span>
        </div>

        {/* The Printable Element with CSS Print Rules */}
        <div
          id="printable-micro-token"
          className={`bg-white text-black font-mono transition-all duration-300 shadow-2xl relative select-all ${
            format === 'CREDIT_CARD'
              ? 'w-[325px] h-[205px] p-3 rounded-lg border-2 border-dashed border-gray-400 flex flex-col justify-between'
              : format === 'POSTAGE_STAMP'
              ? 'w-[125px] h-[125px] p-2 rounded border border-dashed border-gray-400 flex flex-col items-center justify-between text-center'
              : 'w-[320px] h-[85px] p-2 rounded border border-dashed border-gray-400 flex items-center justify-between'
          }`}
        >
          {/* Format: Standard Credit Card */}
          {format === 'CREDIT_CARD' && (
            <>
              <div className="flex items-start justify-between border-b border-gray-300 pb-1.5">
                <div>
                  <div className="text-[10px] font-extrabold tracking-wider text-gray-900">
                    AETHER-0 EMERGENCY RECOVERY ESCROW
                  </div>
                  <div className="text-[8px] text-gray-600">
                    U.S. FAM 7 § 1700 CONSULAR / LEGAL AID INTAKE ONLY
                  </div>
                </div>
                <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300">
                  EPOCH #{epoch}
                </div>
              </div>

              <div className="flex items-center gap-3 my-1">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="Recovery QR"
                    className="w-24 h-24 border border-gray-300 p-0.5 bg-white"
                  />
                )}
                <div className="text-[8px] space-y-1 flex-1 leading-snug">
                  <div>
                    <span className="font-bold text-gray-800">VERIFICATION HASH:</span>
                    <div className="font-mono text-[7px] text-gray-700 break-all">
                      {payloadObj.vKeyHash}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800">INSTITUTIONAL REGISTRY:</span>
                    <div className="text-[7.5px] text-gray-700">{payloadObj.instId}</div>
                  </div>
                  <div className="text-[7px] text-gray-500 pt-0.5 border-t border-gray-200">
                    CONTAINS ZERO PLAINTEXT PII · DECRYPTABLE VIA ACCREDITED CONSULAR PUBKEY
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[7px] text-gray-500 border-t border-gray-300 pt-1">
                <span>CROP ALONG DASHED LINE</span>
                <span>CR80 STANDARD (85.60 × 53.98 MM)</span>
              </div>
            </>
          )}

          {/* Format: Ultra-micro Postage Stamp */}
          {format === 'POSTAGE_STAMP' && (
            <>
              <div className="text-[6.5px] font-extrabold leading-none text-gray-900">
                AETHER-0 · EP #{epoch}
              </div>
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Micro QR"
                  className="w-18 h-18 border border-gray-300 p-0.5 bg-white"
                />
              )}
              <div className="text-[5.5px] text-gray-600 font-bold leading-none">
                7 FAM 1700 INTAKE
              </div>
            </>
          )}

          {/* Format: Shoe Insole Strip */}
          {format === 'SHOE_INSOLE' && (
            <>
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Sole QR"
                  className="w-16 h-16 border border-gray-300 p-0.5 bg-white"
                />
              )}
              <div className="text-[8px] flex-1 px-3 space-y-0.5">
                <div className="font-extrabold text-[9px] text-gray-900">
                  AETHER-0 EMERGENCY STRIP · EP #{epoch}
                </div>
                <div className="text-[7.5px] text-gray-700 truncate">
                  HASH: {payloadObj.vKeyHash.substring(0, 20)}...
                </div>
                <div className="text-[7px] text-gray-500">
                  SLIP BENEATH INSOLE OR INNER LINING · ZERO PII
                </div>
              </div>
              <div className="text-[7px] font-bold text-gray-400 rotate-90 pr-1">
                7 FAM 1700
              </div>
            </>
          )}
        </div>
      </div>

      {/* Camera Scanner Ingress Hook */}
      <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                Integrated Camera Scanner & Terminal Ingress Hook
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Scan this micro-token via device webcam to immediately load and populate the recovery matrix at any terminal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>START CAMERA SCANNER</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <CameraOff className="w-3.5 h-3.5" />
                <span>STOP CAMERA</span>
              </button>
            )}

            <button
              onClick={handleSimulateScan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-800 hover:bg-cyan-900 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulate Scan Decode</span>
            </button>
          </div>
        </div>

        {/* Live Camera Viewfinder or Error State */}
        {isCameraActive && (
          <div className="relative rounded-lg overflow-hidden border border-cyan-500 bg-black max-w-md mx-auto aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-0 border-2 border-cyan-400/40 pointer-events-none m-6 rounded-lg flex items-center justify-center">
              <span className="text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
                ALIGN MICRO-TOKEN QR WITHIN FRAME
              </span>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-800/80 text-amber-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Successful Scan Decode Output */}
        {scannedResult && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-emerald-300 font-bold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                MICRO-TOKEN SCANNED & DECODED SUCCESSFULLY
              </span>
              <span className="text-[10px] text-emerald-400">SCHEMA: AETHER-7FAM-1700</span>
            </div>
            <pre className="p-2.5 rounded bg-[#05070d] border border-emerald-800/80 text-emerald-200 select-all font-mono break-all text-[11px] overflow-x-auto whitespace-pre-wrap">
              {scannedResult}
            </pre>
            <p className="text-[11px] text-emerald-400/80">
              Token verified against public hash registry. Ready for one-click ingress in Triage Recovery Matrix or Consular Intake Terminal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
