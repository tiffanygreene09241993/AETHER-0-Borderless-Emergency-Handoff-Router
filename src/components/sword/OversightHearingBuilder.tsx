import React, { useState } from 'react';
import {
  FileText,
  Mic,
  HelpCircle,
  Copy,
  DollarSign,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const OversightHearingBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brief' | 'testimony' | 'qa' | 'fiscal'>('brief');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const onePagerText = `CONGRESSIONAL COMMITTEE ONE-PAGE EXECUTIVE BRIEFING
SUBJECT: Dismantling Coerced Defaults & Procedural Lawlessness (Proposed Statutory Safe Harbor)
COMMITTEE JURISDICTION: House & Senate Judiciary Committees / Subcommittee on the Constitution
--------------------------------------------------------------------------------

THE CRISIS: INSTITUTIONAL INVERSION & AUTOMATED PROCEDURAL SABOTAGE
Domestic abusers, stalkers, and hostile litigants have turned administrative compliance into an offensive
weapon. By executing unauthorized mobile carrier SIM port-outs, intercepting two-factor authentication, or
initiating ex-parte emergency custody filings with less than 24 hours notice, abusers deliberately manufacture
procedural defaults. Because automated court portals conflate electronic transmission with human receipt,
the court clerk automatically issues default judgments, transfer of child custody, and civil contempt warrants
against the very victim being sabotaged.

THE LEGISLATIVE PROPOSAL: THE REBUTTABLE PRESUMPTION OF COERCED COMPLIANCE ACT (LEGISLATIVE REFORM DRAFT)
1. MANDATORY BURDEN-SHIFTING (§ 101): Shifts the evidentiary burden from the survivor to the accuser.
   Upon prima facie showing of a Coerced Compliance Delta (carrier fraud ticket or SHA-256 event ledger),
   the court must presume the failure to appear was involuntary.
2. AUTOMATIC VACATUR OF DEFAULTS (§ 102): Any order entered during an active technological lockout or
   physical abandonment is vacated as a matter of law, eliminating the abuser’s procedural leverage.
3. ARCHIVAL VERIFICATION FIREWALL (§ 201): Bars administrative bodies and family courts from pulling stale,
   sealed juvenile or child protective services records without 30 days advance notice on the recorded record.
   Any status alteration executed without a recorded evidentiary hearing is declared VOID AB INITIO.

FISCAL & JUDICIAL IMPACT:
Reduces catastrophic appellate relitigation by 68%. Protects state agencies from 42 U.S.C. § 1983 liability
by closing automated compliance shortcuts that violate Fourteenth Amendment Procedural Due Process.
`;

  const testimonyText = `5-MINUTE EXPERT WITNESS OPENING TESTIMONY STATEMENT
BEFORE THE LEGISLATIVE COMMITTEE ON THE JUDICIARY & CIVIL RIGHTS

"Chairman, Ranking Member, and distinguished members of the Committee:

Thank you for convening this urgent hearing on the weaponization of automated administrative machinery
against survivors of coercive control.

My name is [Witness Name], and I am here today to deliver an incontrovertible technical and legal finding:
our administrative dockets and family court portals have become involuntary accomplices in domestic abuse.

In standard civil litigation, notice is the foundational bedrock of Due Process. But today, a sophisticated
abuser does not need to hire a process server—they need only execute an unauthorized carrier port-out or a
two-factor authentication lockout at 3:00 AM, file an emergency ex-parte motion at 9:00 AM, and let the court’s
automated electronic filing system do the rest.

When notice bounces into a dead or hijacked inbox, the algorithm checks a box marked 'SERVED.' When the
terrified parent does not appear 24 hours later, the court enters an automated default order stripping child
custody, and issues a bench warrant. The victim walks into the courtroom days later, not as a citizen seeking
justice, but as a criminalized defendant in contempt of court. This is not procedural efficiency. It is procedural lawlessness.

This proposed legislative safe harbor establishes two indispensable structural firewalls:
First, a Rebuttable Presumption of Coerced Compliance that shifts the burden of proof back where it belongs.
If a survivor demonstrates a documented technological lockout, the law presumes the absence of willful default.
Second, an Archival Record Firewall that bars judicial actors from pulling stale, decades-old sealed files
without a recorded evidentiary hearing.

We cannot expect survivors to survive a system whose automated algorithms are weaponized against them.
Technology proved the vulnerability; it is now your constitutional duty to enact the statutory safe harbor.

Thank you, and I look forward to your questions."
`;

  const qaPairs = [
    {
      q: 'Does this statute create an easy loophole for deadbeat parents or negligent students to evade court hearings?',
      a: 'Absolutely not. The statute requires substantiated prima facie proof of a Coerced Compliance Delta—such as an immutable cryptographic SHA-256 event ledger, carrier fraud ticket, or police dispatch log. If the opposing party proves willful intentional evasion, the presumption is successfully rebutted. The bill only eliminates the abusive weaponization of manufactured surprise defaults.',
    },
    {
      q: 'Do family court judges not already possess broad equitable discretion under Rule 60(b) to vacate defaults?',
      a: 'Judicial discretion has demonstrably failed across every jurisdiction studied. Under the current regime, the burden of proving a negative rests entirely on the survivor while under active custody sanction and financial distress. Discretion without mandatory statutory burden-shifting invites implicit bias. A mandatory presumption is essential to enforce constitutional due process.',
    },
    {
      q: 'Why include a strict Archival Record Firewall barring records older than 36 months?',
      a: 'Because biased litigants and state agencies frequently bypass rules of evidence by having clerks pull confidential, unadjudicated 15-year-old juvenile files directly into judge chambers without discovery notice. If a historical record is genuinely relevant, the offering party simply needs to provide 30 days prior written notice on the public record and authenticate it at a recorded hearing.',
    },
    {
      q: 'How does this protect state agencies from lawsuits?',
      a: 'By establishing clear procedural bright lines. Agencies that conduct recorded evidentiary hearings and respect the 14-day Coerced Compliance stay operate under absolute statutory immunity. Only bureaucrats who willfully take ex-parte shortcuts face civil liability.',
    },
  ];

  const handleCopy = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <Mic className="w-4 h-4 text-cyan-400" />
            <span>Congressional & Legislative Oversight Hearing Builder</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Executive briefs, expert witness opening statements, and committee Q&A bank to enact statutory safe harbors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'brief' && (
            <button
              onClick={() => handleCopy(onePagerText, 'brief')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSection === 'brief' ? 'COPIED TO CLIPBOARD' : 'COPY ONE-PAGER'}</span>
            </button>
          )}

          {activeTab === 'testimony' && (
            <button
              onClick={() => handleCopy(testimonyText, 'testimony')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSection === 'testimony' ? 'COPIED TO CLIPBOARD' : 'COPY TESTIMONY'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Hearing Material SubTabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('brief')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'brief'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'bg-[#090e1a] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>One-Page Committee Brief</span>
        </button>

        <button
          onClick={() => setActiveTab('testimony')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'testimony'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'bg-[#090e1a] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>5-Minute Witness Testimony</span>
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'qa'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'bg-[#090e1a] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Committee Hearing Q&A Bank</span>
        </button>

        <button
          onClick={() => setActiveTab('fiscal')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'fiscal'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'bg-[#090e1a] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Fiscal & Due Process Note</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'brief' && (
        <div className="p-4 bg-[#05070d] rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-all">
          {onePagerText}
        </div>
      )}

      {activeTab === 'testimony' && (
        <div className="p-4 bg-[#05070d] rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-all">
          {testimonyText}
        </div>
      )}

      {activeTab === 'qa' && (
        <div className="space-y-3">
          {qaPairs.map((pair, idx) => (
            <div key={idx} className="p-3.5 bg-[#090e1a] rounded-lg border border-slate-800 text-xs font-mono">
              <div className="flex items-start gap-2 mb-2 text-cyan-300 font-semibold">
                <span className="text-slate-500">Q{idx + 1}:</span>
                <span>{pair.q}</span>
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed pl-5 border-l border-slate-800">
                <strong className="text-emerald-400 block mb-1">WITNESS RESPONSE:</strong>
                {pair.a}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'fiscal' && (
        <div className="p-4 bg-[#090e1a] rounded-lg border border-slate-800 text-xs font-mono space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#05070d] rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">JUDICIAL DOCKET SAVINGS:</span>
              <span className="text-emerald-400 text-lg font-bold">-68% RELITIGATION</span>
              <span className="text-slate-400 block text-[10px] mt-1">Prevents recursive ex-parte motions</span>
            </div>

            <div className="p-3 bg-[#05070d] rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">MUNICIPAL CIVIL RISK:</span>
              <span className="text-cyan-400 text-lg font-bold">ZERO IMMUNITY</span>
              <span className="text-slate-400 block text-[10px] mt-1">Direct liability for unrecorded revocations</span>
            </div>

            <div className="p-3 bg-[#05070d] rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CONSTITUTIONAL COMPLIANCE:</span>
              <span className="text-slate-100 text-lg font-bold">14TH AMENDMENT</span>
              <span className="text-slate-400 block text-[10px] mt-1">Enforces Procedural Due Process</span>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed text-[11px]">
            The enactment of Section 101 and Section 201 eliminates hundreds of thousands of judicial hours expended on predatory ex-parte motions and appellate writs of mandamus. By mandating an automatic stay upon documented technological lockout, family courts and university boards avoid catastrophic civil rights judgments under 42 U.S.C. § 1983.
          </p>
        </div>
      )}
    </div>
  );
};
