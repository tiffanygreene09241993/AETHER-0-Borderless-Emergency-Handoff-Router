import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Lock,
  EyeOff,
  Copy,
  Printer,
  CheckCircle2,
  Scale,
  Users,
  Building2,
  Trash2,
  BookOpen,
  Info,
  ExternalLink,
  Gavel,
  Check,
} from 'lucide-react';

export const ChildhoodVictimShield: React.FC = () => {
  const [parentName, setParentName] = useState('JANE ROE');
  const [caseNumber, setCaseNumber] = useState('26FL04912');
  const [countyName, setCountyName] = useState('MIAMI-DADE');
  const [circuitNumber, setCircuitNumber] = useState('ELEVENTH');
  const [divisionName, setDivisionName] = useState('FAMILY LAW DIVISION');
  const [agencyName, setAgencyName] = useState('DEPARTMENT OF CHILDREN & FAMILIES (DCF)');
  const [evaluatorName, setEvaluatorName] = useState('COURT-APPOINTED CUSTODY EVALUATOR / GAL');
  const [opposingCounsel, setOpposingCounsel] = useState('OPPOSING COUNSEL OF RECORD');
  const [stateJurisdiction, setStateJurisdiction] = useState<'FLORIDA' | 'CALIFORNIA' | 'NEW_YORK' | 'TEXAS'>('FLORIDA');
  const [copiedMotion, setCopiedMotion] = useState(false);
  const [activeTab, setActiveTab] = useState<'court_motion' | 'legal_realities' | 'procedural_guide' | 'legislative_advocacy'>('court_motion');

  // Real-world binding statutory citations
  const getBindingCitations = () => {
    switch (stateJurisdiction) {
      case 'FLORIDA':
        return {
          confidentialityStatute: 'Fla. Stat. § 39.0132(3) & § 39.202',
          misdemeanorPenalty: 'Fla. Stat. § 39.202(8) (Second-Degree Misdemeanor)',
          evidenceCodeRelevance: 'Fla. Stat. § 90.401 & § 90.403 (Unfair Prejudice)',
          privilegeCode: 'Fla. Stat. § 90.503 (Psychotherapist-Patient Privilege)',
          proceduralRule: 'Fla. Fam. L. R. P. 12.280(c) / Fla. R. Civ. P. 1.280(c)',
          courtHeader: `IN THE CIRCUIT COURT OF THE ${circuitNumber.toUpperCase()} JUDICIAL CIRCUIT,\nIN AND FOR ${countyName.toUpperCase()} COUNTY, FLORIDA\n${divisionName.toUpperCase()}`,
        };
      case 'CALIFORNIA':
        return {
          confidentialityStatute: 'Cal. Welf. & Inst. Code §§ 389 & 827',
          misdemeanorPenalty: 'Cal. WIC § 827(b)(2) (Contempt & Confidentiality Breach)',
          evidenceCodeRelevance: 'Cal. Evid. Code § 352 & § 1101 (Prejudice & Character Bar)',
          privilegeCode: 'Cal. Evid. Code § 1014 (Psychotherapist Privilege)',
          proceduralRule: 'Cal. Code Civ. Proc. § 2017.020 & Cal. Rules of Court Rule 5.151',
          courtHeader: `SUPERIOR COURT OF CALIFORNIA, COUNTY OF ${countyName.toUpperCase()}\nFAMILY LAW DIVISION`,
        };
      case 'NEW_YORK':
        return {
          confidentialityStatute: 'N.Y. Fam. Ct. Act § 381.2 & § 166',
          misdemeanorPenalty: 'Social Services Law § 422(4)(A)',
          evidenceCodeRelevance: 'N.Y. CPLR 4504 / Nicholson v. Scoppetta, 3 N.Y.3d 357',
          privilegeCode: 'N.Y. CPLR 4507 (Psychologist Privilege)',
          proceduralRule: 'N.Y. CPLR 3103(a) (Protective Order)',
          courtHeader: `SUPREME COURT OF THE STATE OF NEW YORK\nCOUNTY OF ${countyName.toUpperCase()} - MATRIMONIAL / FAMILY PART`,
        };
      case 'TEXAS':
        return {
          confidentialityStatute: 'Tex. Fam. Code § 58.007 & § 261.002',
          misdemeanorPenalty: 'Tex. Fam. Code § 261.201(f) (Class A Misdemeanor)',
          evidenceCodeRelevance: 'Tex. R. Evid. 403 & 404 (Unfair Prejudice)',
          privilegeCode: 'Tex. R. Evid. 509 & 510 (Mental Health Information Privilege)',
          proceduralRule: 'Tex. R. Civ. P. 192.6 (Protective Orders)',
          courtHeader: `IN THE DISTRICT COURT OF ${countyName.toUpperCase()} COUNTY, TEXAS\n${circuitNumber.toUpperCase()} JUDICIAL DISTRICT`,
        };
    }
  };

  const citations = getBindingCitations();

  // Formal Court Motion ready for filing in the Court E-Filing Portal
  const generateFormalCourtMotion = () => {
    if (stateJurisdiction === 'FLORIDA') {
      return `
${citations.courtHeader}

IN RE: THE MATTER OF:
Case No.: ${caseNumber}
Division: ${divisionName}

${parentName},
               Petitioner / Movant,
and

[RESPONDENT NAME],
               Respondent.
________________________________________/

EMERGENCY MOTION FOR PROTECTIVE ORDER AND TO STRIKE / EXCLUDE 
CONFIDENTIAL JUVENILE RECORDS PURSUANT TO FLA. STAT. § 39.0132, 
§ 39.202, § 90.403, AND § 90.503

COMES NOW, Movant, ${parentName}, proceeding pro se under Fla. Fam. L. R. P. 12.280(c),
and respectfully moves this Court for an Order of Protection prohibiting the subpoena,
disclosure, dissemination, or evidentiary use of sealed childhood records, and in support states:

1. STATUTORY CONFIDENTIALITY: Under Fla. Stat. § 39.0132 and § 39.202, all records and information
concerning juvenile dependency, child abuse investigations, and child welfare proceedings involving
the Movant when she was a minor child are strictly confidential as a matter of law. Under Fla. Stat.
§ 39.202(8), any person who willfully discloses or disseminates confidential child welfare records
commits a misdemeanor of the second degree.

2. LACK OF RELEVANCY AND UNFAIR PREJUDICE: Inquiries into events where Movant was a victim as a juvenile
bear zero probative relevance to Movant’s present fitness as an adult parent. Any marginal probative value
is substantially outweighed by the danger of unfair prejudice, confusion of issues, and retraumatization
under Fla. Stat. § 90.403.

3. PRIVILEGED MENTAL HEALTH RECORDS: Any evaluation, social investigation, or psychological inquiry
predicated on privileged communications without a valid voluntary waiver or prior court order violates
Fla. Stat. § 90.503.

4. MOTION FOR PROTECTIVE ORDER: Under Fla. Fam. L. R. P. 12.280(c) and Fla. R. Civ. P. 1.280(c), this Court
possesses broad authority to enter a protective order to protect a party from annoyance, embarrassment,
oppression, or undue burden and expense.

WHEREFORE, Movant respectfully requests that this Honorable Court enter an Order:
  a. Directing DCF, the Custody Evaluator, Guardian ad Litem, and Opposing Counsel to immediately cease
     requesting, subpoenaing, or citing Movant's confidential juvenile records;
  b. Striking and redacting any and all references to Movant's childhood victimhood from all pending court
     reports, evaluator drafts, social study filings, and agency records;
  c. Barring the admission of any testimony or documentary evidence relating to Movant's childhood victimhood; and
  d. Granting such other and further relief as this Court deems just and proper.

Respectfully submitted this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}.

_______________________________________
${parentName}, Pro Se Litigant
c/o Designated Confidential Legal Safe-Harbor Portal

VERIFICATION PURSUANT TO FLA. STAT. § 92.525:
Under penalties of perjury, I declare that I have read the foregoing Emergency Motion and that the facts stated in it are true.

_______________________________________
${parentName}

CERTIFICATE OF SERVICE
I HEREBY CERTIFY that a true and correct copy hereof has been furnished to:
- Opposing Counsel of Record: ${opposingCounsel}
- Court-Appointed Evaluator / GAL: ${evaluatorName}
- Department of Children and Families: ${agencyName}
via the Florida Courts E-Filing Portal / Electronic Mail on this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}.

_______________________________________
${parentName}
`.trim();
    }

    // Default for California / NY / Texas
    return `
${citations.courtHeader}

CASE NO.: ${caseNumber}

${parentName},
               Moving Party,
v.

[ADVERSE PARTY],
               Respondent.
________________________________________/

EMERGENCY MOTION FOR PROTECTIVE ORDER AND MOTION IN LIMINE TO EXCLUDE 
AND STRIKE CONFIDENTIAL CHILDHOOD JUVENILE RECORDS
[PURSUANT TO ${citations.confidentialityStatute} AND ${citations.evidenceCodeRelevance}]

COMES NOW Moving Party, ${parentName}, proceeding pro se under ${citations.proceduralRule},
and respectfully moves this Court for an Order of Protection prohibiting the subpoena, disclosure,
or evidentiary consideration of confidential childhood victimhood records, and states:

1. ABSOLUTE STATUTORY PRIVILEGE: Under ${citations.confidentialityStatute}, all records concerning Moving
Party's status as a minor child or victim of childhood abuse are strictly confidential and privileged.

2. LACK OF PROBATIVE VALUE & UNDUE PREJUDICE: Under ${citations.evidenceCodeRelevance}, events occurring
decades ago when Moving Party was a minor child have zero probative value regarding current parental fitness.
Any attempt to introduce childhood trauma serves solely to cause unfair prejudice and character assassination.

3. PRIVILEGED COMMUNICATIONS: Under ${citations.privilegeCode}, mental health and therapy records are
privileged and cannot be compelled without an express statutory waiver.

WHEREFORE, Moving Party respectfully requests an Order:
  a. Prohibiting all parties, evaluators, and agencies from seeking or citing Moving Party's juvenile records;
  b. Striking all references to childhood victimhood from pending court reports and evaluator drafts; and
  c. Granting a protective order under ${citations.proceduralRule}.

Respectfully submitted this ${new Date().toLocaleDateString()}.

_______________________________________
${parentName}, Moving Party Pro Se

CERTIFICATE OF SERVICE
I certify that on ${new Date().toLocaleDateString()}, a true copy of the foregoing Motion was served via
court electronic filing service upon all counsel and evaluators of record.

_______________________________________
${parentName}
`.trim();
  };

  const handleCopyMotion = () => {
    navigator.clipboard.writeText(generateFormalCourtMotion());
    setCopiedMotion(true);
    setTimeout(() => setCopiedMotion(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono">
              PARENTAL CHILDHOOD CONFIDENTIALITY SHIELD & COURT MOTION PACKAGER
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
              ● BINDING ENACTED STATUTES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Shielding protective parents from juvenile record dredging and "trauma inversion" under Fla. Stat. §§ 39.0132, 39.202, 90.403 & 90.503.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleCopyMotion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 hover:bg-cyan-900 transition-colors font-bold cursor-pointer"
          >
            {copiedMotion ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMotion ? 'MOTION COPIED!' : 'COPY COURT MOTION'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT</span>
          </button>
        </div>
      </div>

      {/* Critical Legal Reality Warning Callout */}
      <div className="p-4 rounded-xl bg-amber-950/70 border-2 border-amber-600/80 font-mono text-xs text-amber-200 space-y-2.5">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>CRITICAL PROCEDURAL WARNING: BINDING COURT LAW VS. MODEL LEGISLATIVE ADVOCACY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed text-amber-100">
          <div className="p-3 bg-black/40 rounded border border-amber-800/80 space-y-1">
            <span className="font-bold text-rose-300 uppercase">1. Why Unfiled "Cease & Desist" Letters Fail:</span>
            <p>
              In active domestic or dependency litigation, an extrajudicial demand letter ordering an evaluator or DCF to
              expunge files has <strong>zero judicial authority</strong>. Evaluators, Guardians ad Litem, and DCF caseworkers
              report directly to the judge. Only a <strong>formal Court Order</strong> signed by the judge can legally bar discovery or strike report contents.
            </p>
          </div>
          <div className="p-3 bg-black/40 rounded border border-amber-800/80 space-y-1">
            <span className="font-bold text-rose-300 uppercase">2. Never Cite Non-Enacted "Model Acts" in Court:</span>
            <p>
              Citing proposed model acts (like "Model Safe Harbor Act § 206") or demanding fictional liquidated damages ($50,000)
              in live court severely undermines your credibility before judges and invites opposing counsel to move for sanctions.
              <strong>Always cite enacted binding state statutes</strong> (Fla. Stat. §§ 39.0132, 39.202, 90.403).
            </p>
          </div>
        </div>
      </div>

      {/* Case Details Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <label className="text-slate-400 block mb-1">TARGET JURISDICTION:</label>
          <select
            value={stateJurisdiction}
            onChange={(e) => setStateJurisdiction(e.target.value as any)}
            className="w-full bg-[#05070d] border border-slate-700 rounded p-1.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
          >
            <option value="FLORIDA">FLORIDA (Fla. Stat. Ch. 39 & § 90.403)</option>
            <option value="CALIFORNIA">CALIFORNIA (Cal. WIC § 827 & Evid. § 352)</option>
            <option value="NEW_YORK">NEW YORK (FCA § 381.2 & CPLR 3103)</option>
            <option value="TEXAS">TEXAS (Tex. Fam. Code § 58.007 & TRCP 192.6)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">PROTECTIVE PARENT (MOVANT):</label>
          <input
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full bg-[#05070d] border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1">CASE / DOCKET NUMBER:</label>
          <input
            type="text"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            className="w-full bg-[#05070d] border border-slate-800 rounded p-1.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1">COUNTY & CIRCUIT:</label>
          <input
            type="text"
            value={`${countyName} / ${circuitNumber} CIRCUIT`}
            onChange={(e) => {
              const parts = e.target.value.split('/');
              if (parts[0]) setCountyName(parts[0].trim());
            }}
            className="w-full bg-[#05070d] border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab('court_motion')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'court_motion'
              ? 'bg-[#152033] text-cyan-300 font-bold border border-cyan-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gavel className="w-3.5 h-3.5 text-cyan-400" />
          <span>Official Court Motion (Binding Law)</span>
        </button>

        <button
          onClick={() => setActiveTab('legal_realities')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'legal_realities'
              ? 'bg-[#152033] text-amber-300 font-bold border border-amber-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>Statutory Grounding (Fla. Stat. Ch. 39 & § 90.403)</span>
        </button>

        <button
          onClick={() => setActiveTab('procedural_guide')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'procedural_guide'
              ? 'bg-[#152033] text-emerald-300 font-bold border border-emerald-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>E-Filing Portal & Legal Aid Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('legislative_advocacy')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'legislative_advocacy'
              ? 'bg-[#152033] text-purple-300 font-bold border border-purple-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Legislative Policy Proposal (§ 206 Reform)</span>
        </button>
      </div>

      {/* TAB 1: OFFICIAL COURT MOTION */}
      {activeTab === 'court_motion' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-800 gap-2">
            <div>
              <span className="font-bold text-cyan-300 uppercase text-xs">
                OFFICIAL PLEADING READY FOR COURT E-FILING:
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Grounded 100% in {citations.confidentialityStatute}, {citations.evidenceCodeRelevance}, and {citations.proceduralRule}.
              </p>
            </div>
            <button
              onClick={handleCopyMotion}
              className="px-3 py-1.5 bg-cyan-400 text-slate-900 font-bold rounded hover:bg-cyan-300 transition-colors"
            >
              {copiedMotion ? 'COPIED TO CLIPBOARD!' : 'COPY OFFICIAL MOTION TEXT'}
            </button>
          </div>

          <pre className="p-4 bg-[#05070d] rounded-xl border border-slate-800 text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all text-[11px] max-h-[600px] overflow-y-auto">
            {generateFormalCourtMotion()}
          </pre>
        </div>
      )}

      {/* TAB 2: LEGAL REALITIES & BINDING AUTHORITIES */}
      {activeTab === 'legal_realities' && (
        <div className="space-y-4 font-mono text-xs text-slate-300">
          <div className="p-4 bg-[#090e1a] rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <span>BINDING ENACTED STATUTES GOVERNING JUVENILE RECORDS IN {stateJurisdiction}:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#05070d] rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">1. Strict Confidentiality & Crime</span>
                <div className="text-slate-200 font-bold text-[11px]">{citations.confidentialityStatute}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Dependency and child abuse records involving a minor are confidential by statute. Dissemination without court order is a {citations.misdemeanorPenalty}.
                </p>
              </div>

              <div className="p-3 bg-[#05070d] rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-amber-400 font-bold uppercase">2. Unfair Prejudice Exclusion</span>
                <div className="text-slate-200 font-bold text-[11px]">{citations.evidenceCodeRelevance}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Evidence of a parent's childhood abuse decades ago has zero probative value regarding current parental fitness. Its sole effect is unfair prejudice and character assassination.
                </p>
              </div>

              <div className="p-3 bg-[#05070d] rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">3. Psychotherapist Privilege</span>
                <div className="text-slate-200 font-bold text-[11px]">{citations.privilegeCode}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Communications between a patient and therapist/psychologist are privileged. Evaluators cannot compel disclosure of childhood therapy notes without a valid signed waiver.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROCEDURAL FILING GUIDE & LEGAL AID */}
      {activeTab === 'procedural_guide' && (
        <div className="space-y-4 font-mono text-xs text-slate-300">
          <div className="p-4 bg-[#090e1a] rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Info className="w-4 h-4" />
              <span>HOW TO PROPERLY FILE & SERVE THIS MOTION:</span>
            </div>

            <div className="space-y-3 text-[11px] leading-relaxed">
              <div className="p-3 bg-[#05070d] rounded border border-slate-800 space-y-1">
                <strong className="text-slate-100">Step 1: File via the Official Court E-Filing Portal</strong>
                <p className="text-slate-400">
                  In Florida, log into the <strong>Florida Courts E-Filing Portal (myflcourtaccess.com)</strong>. Upload the PDF motion under your active case number. Select document type <em>Motion - Protective Order</em> or <em>Motion - In Limine</em>.
                </p>
              </div>

              <div className="p-3 bg-[#05070d] rounded border border-slate-800 space-y-1">
                <strong className="text-slate-100">Step 2: Serve Copies Simultaneously on All Parties</strong>
                <p className="text-slate-400">
                  The portal will automatically serve Opposing Counsel via their designated e-service email. Additionally, send a copy via certified email to the court-appointed Evaluator and the DCF Child Welfare Legal Services attorney.
                </p>
              </div>

              <div className="p-3 bg-[#05070d] rounded border border-slate-800 space-y-1">
                <strong className="text-slate-100">Step 3: Schedule an Expedited Hearing Before Reports Are Finalized</strong>
                <p className="text-slate-400">
                  Contact the Judicial Assistant (JA) or file a Notice of Hearing. Obtaining an order <em>before</em> the evaluator submits their formal report prevents confidential records from ever entering the judicial record.
                </p>
              </div>

              <div className="p-3 bg-[#06101e] rounded border border-cyan-800 space-y-1 text-cyan-200">
                <strong className="text-cyan-300">Step 4: Consult Local Legal Aid & Self-Help Centers</strong>
                <p>
                  Because Chapter 39 dependency rules and local administrative orders have strict procedural deadlines, consult:
                  <br />• <strong>Florida Legal Aid Services:</strong> Contact Legal Services of Greater Miami, Florida Rural Legal Services, or Legal Aid Society of Palm Beach County.
                  <br />• <strong>Family Court Self-Help Center:</strong> Located in your county courthouse for free form review and local hearing procedure guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEGISLATIVE POLICY ADVOCACY */}
      {activeTab === 'legislative_advocacy' && (
        <div className="p-4 bg-[#090e1a] rounded-xl border border-purple-900/40 font-mono text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>MODEL STATUTORY BILL § 206 (FOR LEGISLATIVE REFORM ONLY):</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The text below is a proposed legislative model for state lawmakers to enact explicit civil damages against caseworkers who weaponize childhood trauma.
            <strong className="text-amber-300"> DO NOT CITE THIS AS ENACTED LAW IN A LIVE COURT FILING.</strong> Use the court motion on Tab 1 for court filings.
          </p>

          <pre className="p-3 bg-[#05070d] rounded border border-slate-800 text-purple-200 text-[10px] whitespace-pre-wrap leading-relaxed">
{`MODEL BILL § 206: THE PARENTAL CHILDHOOD VICTIMHOOD SHIELD ACT
SEC. 206-A. Absolute statutory bar prohibiting child welfare agencies and family courts from considering a parent's status as a childhood sexual abuse victim as evidence of adult unfitness or impaired protective capacity.
SEC. 206-B. Mandatory striking and physical expungement of any reference to sealed juvenile victimhood records from court filings and evaluator reports.
SEC. 206-C. Proposed statutory civil damages of $50,000 against any agency employee or evaluator who willfully unseals or disseminates confidential childhood files.`}
          </pre>
        </div>
      )}
    </div>
  );
};
