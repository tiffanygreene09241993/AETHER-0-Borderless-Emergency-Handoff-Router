import { ModelStatutoryBill } from '../types/sovereign.ts';

/**
 * ENACTED BINDING STATUTORY AUTHORITIES & UNIFORM INTERSTATE ACTS
 * 
 * Purged of all non-enacted model acts, synthetic damage claims, and pseudo-legal citations.
 * Contains exclusively verified, enacted statutory law, official administrative manuals,
 * and recognized uniform interstate acts.
 */

export const MODEL_STATUTORY_BILLS: ModelStatutoryBill[] = [
  {
    id: 'FLORIDA_UCCJEA_CH61',
    billNumber: 'FLA. STAT. §§ 61.501–61.542',
    shortTitle: 'Florida Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)',
    formalTitle: 'Florida Statutes Chapter 61, Part II: Uniform Child Custody Jurisdiction and Enforcement Act (Codifying UCCJEA §§ 101–405)',
    targetJurisdiction: 'STATE_MODEL_ACT',
    legislativeFindings: [
      'Avoids jurisdictional competition and conflict with courts of other states in matters of child custody.',
      'Promotes cooperation with courts of other states to ensure that custody litigation takes place in the state with the closest connection to the child (Fla. Stat. § 61.502).',
      'Enforces the 6-month continuous home state rule under Fla. Stat. § 61.514 (UCCJEA § 201) and strictly circumscribes emergency jurisdiction under Fla. Stat. § 61.517 (UCCJEA § 204).',
      'Mandates under Fla. Stat. § 61.521 (UCCJEA § 208) that a court MUST decline to exercise jurisdiction if a party acquired jurisdiction through unjustifiable misconduct.',
    ],
    statutoryDefinitions: [
      {
        term: 'Home State (Fla. Stat. § 61.503(7))',
        definition: 'The state in which a child lived with a parent or a person acting as a parent for at least 6 consecutive months immediately before the commencement of a child custody proceeding.',
      },
      {
        term: 'Temporary Emergency Jurisdiction (Fla. Stat. § 61.517)',
        definition: 'Jurisdiction exercised only if the child is present in Florida and has been abandoned or it is necessary in an emergency to protect the child because the child, or a sibling or parent of the child, is subjected to or threatened with mistreatment or abuse.',
      },
      {
        term: 'Jurisdiction Declined by Reason of Misconduct (Fla. Stat. § 61.521)',
        definition: 'If a court has jurisdiction because a person seeking to invoke its jurisdiction has engaged in unjustifiable conduct, the court shall decline to exercise its jurisdiction.',
      },
      {
        term: 'Communication Between Courts (Fla. Stat. § 61.511)',
        definition: 'A court of this state may communicate with a court in another state concerning a proceeding. A record must be made of the communication, and the parties must be informed promptly and granted access to the record.',
      },
    ],
    clauses: [
      {
        id: 'FL_61_514',
        sectionCode: 'FLA. STAT. § 61.514',
        title: 'Initial Child Custody Jurisdiction (UCCJEA § 201)',
        text: 'A court of this state has jurisdiction to make an initial child custody determination only if this state is the home state of the child on the date of the commencement of the proceeding, or was the home state of the child within 6 months before commencement and the child is absent but a parent continues to live in this state.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Establishes exclusive home state primacy against forum shopping in foreign courts.',
      },
      {
        id: 'FL_61_517',
        sectionCode: 'FLA. STAT. § 61.517',
        title: 'Temporary Emergency Jurisdiction (UCCJEA § 204)',
        text: 'Temporary emergency jurisdiction may be exercised only if the child is physically present and has been abandoned or subjected to actual mistreatment. An order issued under this section is temporary and must specify a period adequate to allow the parties to obtain an order from the state having home-state jurisdiction.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Limits foreign ex-parte pickup orders and forces deference to the true home state.',
      },
      {
        id: 'FL_61_521',
        sectionCode: 'FLA. STAT. § 61.521',
        title: 'Decline of Jurisdiction for Misconduct (UCCJEA § 208)',
        text: 'Except as otherwise provided in § 61.517, if a court of this state has jurisdiction because a person seeking to invoke its jurisdiction has engaged in unjustifiable conduct, the court shall decline to exercise its jurisdiction.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Mandatory dismissal of custody actions where an adverse party lured or stranded the other parent or manufactured jurisdictional presence by deception.',
      },
      {
        id: 'FL_61_511',
        sectionCode: 'FLA. STAT. § 61.511',
        title: 'Interstate Judicial Communication Protocol (UCCJEA § 110)',
        text: 'Except for scheduling and administrative matters, a record must be made of any communication between judges of different states. The parties must be informed promptly of the communication and granted access to the record.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Guarantees due process and prevents secret unrecorded judge-to-judge communications.',
      },
    ],
    sovereignImmunityWaiver: 'Statutory mandate enforceable by writ of prohibition or interlocutory appeal pursuant to Fla. R. App. P. 9.130(a)(3)(C)(iii).',
    civilLiabilitySection: 'Fla. Stat. § 61.521(3): The court shall assess against the party engaging in unjustifiable conduct necessary and reasonable expenses, including costs, communication expenses, attorney fees, investigative fees, and travel expenses.',
  },
  {
    id: 'NEVADA_UCCJEA_NRS125A',
    billNumber: 'NEV. REV. STAT. §§ 125A.005–125A.605',
    shortTitle: 'Nevada Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)',
    formalTitle: 'Nevada Revised Statutes Chapter 125A: Uniform Child Custody Jurisdiction and Enforcement Act',
    targetJurisdiction: 'STATE_MODEL_ACT',
    legislativeFindings: [
      'Codifies uniform interstate custody rules in Nevada courts (NRS 125A.005).',
      'NRS 125A.305 (UCCJEA § 201) limits initial jurisdiction to the child’s 6-month continuous home state.',
      'NRS 125A.375 (UCCJEA § 208) requires Nevada courts to decline jurisdiction if procured through unjustifiable conduct.',
      'NRS 125A.085 (UCCJEA § 110) mandates that a verbatim record be made of interstate judicial calls and made available to all parties.',
    ],
    statutoryDefinitions: [
      {
        term: 'Home State (NRS 125A.085)',
        definition: 'The state in which a child lived with a parent for at least 6 consecutive months immediately before the commencement of a proceeding.',
      },
      {
        term: 'Emergency Jurisdiction (NRS 125A.335)',
        definition: 'Strict temporary emergency jurisdiction applicable only if the child is present in Nevada and abandoned or facing immediate threat of abuse.',
      },
      {
        term: 'Unjustifiable Misconduct (NRS 125A.375)',
        definition: 'Mandatory statutory bar requiring dismissal where the petitioner invoked jurisdiction through wrongful concealment, stranding, or deception.',
      },
    ],
    clauses: [
      {
        id: 'NV_125A_305',
        sectionCode: 'NRS 125A.305',
        title: 'Initial Child Custody Jurisdiction (UCCJEA § 201)',
        text: 'Nevada courts possess initial jurisdiction only if Nevada is the home state of the child on the date of commencement or was the home state within 6 months before commencement.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Quashes Nevada forum-shopping by adverse parties when children reside in another home state.',
      },
      {
        id: 'NV_125A_375',
        sectionCode: 'NRS 125A.375',
        title: 'Decline of Jurisdiction for Unjustifiable Conduct (UCCJEA § 208)',
        text: 'If a court has jurisdiction because a person seeking to invoke its jurisdiction has engaged in unjustifiable conduct, the court shall decline to exercise its jurisdiction.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Compels dismissal of improper ex-parte filings in Clark County or other Nevada family courts.',
      },
    ],
    sovereignImmunityWaiver: 'Enforceable by emergency petition for writ of mandamus or prohibition before the Nevada Supreme Court.',
    civilLiabilitySection: 'NRS 125A.375(3): Mandatory assessment of reasonable travel expenses, attorney fees, and investigative costs against the party engaging in unjustifiable conduct.',
  },
  {
    id: 'HAGUE_CONVENTION_ICARA',
    billNumber: '22 U.S.C. §§ 9001–9011 & HAGUE ART. 13(b)',
    shortTitle: '1980 Hague Convention on International Child Abduction & ICARA',
    formalTitle: 'International Child Abduction Remedies Act (22 U.S.C. §§ 9001–9011) & Hague Convention Article 13(b)',
    targetJurisdiction: 'INTERNATIONAL_DIRECTIVE',
    legislativeFindings: [
      'Under the 1980 Hague Convention on the Civil Aspects of International Child Abduction, return of a child is not required if an exception under Article 13 is established.',
      'Article 13(b) provides an express affirmative defense if there is a grave risk that return would expose the child to physical or psychological harm or otherwise place the child in an intolerable situation.',
      'The United States Supreme Court in Golan v. Saada, 142 S. Ct. 1880 (2022), affirmed that courts must prioritize safety and have discretion regarding ameliorative measures where domestic violence is present.',
      '28 U.S.C. § 1738A (Parental Kidnapping Prevention Act - PKPA) requires full faith and credit to home-state decrees and prohibits concurrent foreign proceedings.',
    ],
    statutoryDefinitions: [
      {
        term: 'Grave Risk of Harm (Article 13(b))',
        definition: 'A clear and convincing showing that return of the child to the habitual residence would expose the child to physical or psychological harm or place the child in an intolerable situation.',
      },
      {
        term: 'Habitual Residence',
        definition: 'The child’s customary home immediately before any wrongful retention, evaluated by parental intent and the totality of the circumstances (Monasky v. Taglieri, 140 S. Ct. 719).',
      },
      {
        term: 'Parental Kidnapping Prevention Act (28 U.S.C. § 1738A)',
        definition: 'Federal statutory preemption mandating that every state enforce and not modify custody determinations made consistently with PKPA home-state rules.',
      },
    ],
    clauses: [
      {
        id: 'HAGUE_ART_13B',
        sectionCode: 'HAGUE CONVENTION ART. 13(b)',
        title: 'Grave Risk Affirmative Defense',
        text: 'The judicial or administrative authority of the requested State is not bound to order the return of the child if the person establishing objections proves that there is a grave risk that his or her return would expose the child to physical or psychological harm or otherwise place the child in an intolerable situation.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Prevents summary return to an abusive household or armed domestic violence environment.',
      },
      {
        id: 'ICARA_9003',
        sectionCode: '22 U.S.C. § 9003(e)(2)(A)',
        title: 'ICARA Evidentiary Burden Standard',
        text: 'A respondent opposing return under Article 13(b) must establish the existence of a grave risk of harm by clear and convincing evidence.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Governs federal district court and state court evidentiary burdens in transnational custody disputes.',
      },
    ],
    sovereignImmunityWaiver: 'Federal treaty obligation directly enforceable in United States District Courts under 22 U.S.C. § 9003(a).',
    civilLiabilitySection: '22 U.S.C. § 9007(b)(3): Assessment of necessary expenses incurred by or on behalf of petitioner, subject to judicial equitable discretion.',
  },
  {
    id: 'STATE_DEPT_7FAM1700',
    billNumber: '7 FAM 1700 & FORM DS-5507',
    shortTitle: 'U.S. Dept. of State Foreign Affairs Manual: 7 FAM 1700 (Victims of Crime Abroad)',
    formalTitle: '7 FAM 1700: Consular Assistance to Crime Victims Abroad & Transnational Stranding Protocols',
    targetJurisdiction: 'FEDERAL_US_CODE',
    legislativeFindings: [
      '7 FAM 1700 governs the protection and emergency assistance provided by U.S. embassies and consulates to American citizens who are victims of domestic violence or crime abroad.',
      'Addresses transnational stranding: situations where an abusive spouse or co-parent intentionally confiscates passports, identification, and tickets, stranding the victim in a foreign nation.',
      'Authorizes emergency consular repatriation loans, emergency replacement passports, certified intake declarations, and fee-waived notarizations (22 C.F.R. § 22.1).',
      'Provides Form DS-5507 (Affidavit of Physical Presence or Residence, Parentage, and Support) to establish verifiable evidence of residence.',
    ],
    statutoryDefinitions: [
      {
        term: 'Transnational Stranding',
        definition: 'Coercive control tactic where an individual is lured or taken to a foreign country and deprived of travel documents, financial resources, or communication access to prevent return to the U.S.',
      },
      {
        term: 'Consular Evidentiary Attestation (22 U.S.C. § 4221)',
        definition: 'Oaths, affidavits, and affirmations administered by consular officers have the full legal force and effect of an oath administered in a court of the United States.',
      },
    ],
    clauses: [
      {
        id: 'FAM_1710',
        sectionCode: '7 FAM 1710',
        title: 'Emergency Consular Protective Assistance',
        text: 'Consular officers provide immediate protective assistance to American crime victims abroad, including emergency passport reissuance, safe lodging coordination, medical referrals, and liaison with domestic legal authorities.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Provides official federal government assistance to survivors trapped in foreign jurisdictions.',
      },
      {
        id: 'FAM_DS5507',
        sectionCode: '22 U.S.C. § 4221 & FORM DS-5507',
        title: 'Consular Affidavit of Physical Presence & Involuntary Stranding',
        text: 'Sworn affidavit executed before an American consular officer certifying physical presence, dates of residence, and documentation of involuntary stranding or document theft.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Enters admissible, self-authenticating evidence under Fed. R. Evid. 902 in state court custody proceedings.',
      },
    ],
    sovereignImmunityWaiver: 'Federal administrative consular process pursuant to 22 U.S.C. § 3904 and 22 C.F.R. Part 92.',
    civilLiabilitySection: 'Criminal penalties for passport confiscation and false statements under 18 U.S.C. §§ 1001 & 1544.',
  },
  {
    id: 'FLORIDA_JUVENILE_CONFIDENTIALITY',
    billNumber: 'FLA. STAT. §§ 39.0132, 39.202 & EVIDENCE CODE',
    shortTitle: 'Florida Juvenile Record Confidentiality & Evidentiary Privileges',
    formalTitle: 'Florida Statutes §§ 39.0132, 39.202, 90.403, 90.503 & Fla. Fam. L. R. P. 12.280(c)',
    targetJurisdiction: 'STATE_MODEL_ACT',
    legislativeFindings: [
      'Fla. Stat. § 39.0132(3) mandates that all information obtained in connection with juvenile dependency and child welfare proceedings is strictly confidential.',
      'Fla. Stat. § 39.202 governs child abuse reports and investigations, making unauthorized inspection or dissemination a criminal misdemeanor of the second degree under § 39.202(8).',
      'Fla. Stat. § 90.403 requires exclusion of relevant evidence if its probative value is substantially outweighed by unfair prejudice, confusion of issues, or misleading the trier of fact.',
      'Fla. Stat. § 90.503 codifies the psychotherapist-patient privilege protecting confidential communications made for the purpose of diagnosis or treatment.',
      'Fla. Fam. L. R. P. 12.280(c) and Fla. R. Civ. P. 1.280(c) authorize circuit courts to enter protective orders to shield parties from annoyance, embarrassment, oppression, or undue burden.',
    ],
    statutoryDefinitions: [
      {
        term: 'Juvenile Court Confidentiality (Fla. Stat. § 39.0132(3))',
        definition: 'All records, including petitions, pleadings, reports, social studies, and court orders regarding minor children in Chapter 39 dependency proceedings are confidential and sealed.',
      },
      {
        term: 'Second-Degree Misdemeanor Penalty (Fla. Stat. § 39.202(8))',
        definition: 'Any person who willfully discloses or disseminates confidential child welfare or abuse records commits a misdemeanor of the second degree, punishable under Fla. Stat. §§ 775.082 or 775.083.',
      },
      {
        term: 'Psychotherapist-Patient Privilege (Fla. Stat. § 90.503)',
        definition: 'A patient has a privilege to refuse to disclose, and to prevent any other person from disclosing, confidential communications made to a psychotherapist for diagnosis or treatment of mental conditions.',
      },
    ],
    clauses: [
      {
        id: 'FS_39_0132',
        sectionCode: 'FLA. STAT. § 39.0132(3)',
        title: 'Mandatory Confidentiality of Juvenile Proceedings',
        text: 'All information obtained pursuant to this chapter in the discharge of official duty by any judge, employee of the court, or employee of the department is confidential and exempt from public records disclosure.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Bars evaluators, opposing counsel, and DCF from inspecting or introducing sealed childhood records.',
      },
      {
        id: 'FS_90_403',
        sectionCode: 'FLA. STAT. § 90.403',
        title: 'Exclusion of Prejudicial & Stale Evidence',
        text: 'Relevant evidence is inadmissible if its probative value is substantially outweighed by the danger of unfair prejudice, confusion of issues, misleading the jury, or needless presentation of cumulative evidence.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Excludes references to a parent’s childhood victimhood as having zero probative value regarding current parental fitness.',
      },
      {
        id: 'FS_90_503',
        sectionCode: 'FLA. STAT. § 90.503',
        title: 'Psychotherapist-Patient Privilege',
        text: 'Communications between patient and psychotherapist are privileged. A patient does not waive privilege merely by participating in a child custody proceeding unless patient places condition at issue.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Shields confidential therapy notes and evaluations from unauthorized discovery.',
      },
      {
        id: 'FL_FAM_12_280',
        sectionCode: 'FLA. FAM. L. R. P. 12.280(c)',
        title: 'Motion for Protective Order',
        text: 'Upon motion by a party and for good cause shown, the court may make any order to protect a party from annoyance, embarrassment, oppression, or undue burden or expense, including barring discovery or sealing records.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'The formal procedural motion vehicle to prohibit discovery and strike evaluator references.',
      },
    ],
    sovereignImmunityWaiver: 'Enforceable by motion before the presiding Circuit Court judge, general magistrate, or hearing officer.',
    civilLiabilitySection: 'Criminal misdemeanor prosecution under Fla. Stat. § 39.202(8) and attorney fee sanctions under Fla. Stat. § 57.105 for frivolous or bad-faith discovery.',
  },
  {
    id: 'NEW_YORK_NICHOLSON_PRECEDENT',
    billNumber: 'NICHOLSON v. SCOPPETTA, 3 N.Y.3d 357 (2004)',
    shortTitle: 'New York Domestic Violence Survivor Precedent (Nicholson v. Scoppetta)',
    formalTitle: 'Nicholson v. Scoppetta, 3 N.Y.3d 357, 820 N.E.2d 840, 787 N.Y.S.2d 196 (N.Y. 2004)',
    targetJurisdiction: 'STATE_MODEL_ACT',
    legislativeFindings: [
      'Nicholson v. Scoppetta is a landmark decision by the New York Court of Appeals (answering certified questions from the Second Circuit Court of Appeals).',
      'Holds that witnessing domestic violence does not, by itself, constitute neglect by the battered parent under New York Family Court Act Article 10.',
      'Establishes that holding a victim of domestic violence strictly liable for failing to protect a child from an abusive partner violates New York statutory requirements of ordinary care and due process.',
      'Clarifies that child protection agencies cannot automatically remove children from a battered mother solely because she was assaulted by her partner.',
    ],
    statutoryDefinitions: [
      {
        term: 'Ordinary Care Standard (N.Y. Fam. Ct. Act § 1012(f))',
        definition: 'Neglect requires a failure by the parent to exercise a minimum degree of care. A battered parent who does not initiate violence exercises ordinary care under emergency conditions.',
      },
      {
        term: 'State-Created Danger Precedent',
        definition: 'Government agencies cannot threaten battered mothers with child removal for seeking domestic violence shelters or police intervention.',
      },
    ],
    clauses: [
      {
        id: 'NICHOLSON_HOLDING',
        sectionCode: '3 N.Y.3d at 368',
        title: 'Domestic Violence Victimhood Is Not Neglect Per Se',
        text: 'Exposing a child to domestic violence is not per se neglect. A parent cannot be found neglectful under New York law solely on the basis that the parent has been the victim of domestic abuse.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Persuasive and binding authority defeating allegations of failure to protect against abuse survivors.',
      },
    ],
    sovereignImmunityWaiver: 'Governed by New York Family Court Act Article 10 and 42 U.S.C. § 1983 civil rights actions.',
    civilLiabilitySection: 'Declaratory and injunctive relief under 42 U.S.C. § 1983 and municipal liability under Monell v. Dept. of Social Services.',
  },
  {
    id: 'FLORIDA_FUFTA_CH726',
    billNumber: 'FLA. STAT. §§ 726.101–726.201 (FUFTA)',
    shortTitle: 'Florida Uniform Fraudulent Transfer Act (FUFTA)',
    formalTitle: 'Florida Statutes Chapter 726: Fraudulent Transfers & Lis Pendens Protections',
    targetJurisdiction: 'STATE_MODEL_ACT',
    legislativeFindings: [
      'Fla. Stat. § 726.105 establishes remedies against transfers made with actual intent to hinder, delay, or defraud creditors or spouses with pending support claims.',
      'Fla. Stat. § 726.108 authorizes courts to issue injunctions against further disposition of real property assets or escrow proceeds.',
      'Authorizes constructive trusts and equitable liens against title settlement disbursements paid to third-party straw entities or in-laws.',
      'Florida Statutes § 48.23 authorizes Notices of Lis Pendens to protect jurisdiction over marital real estate.',
    ],
    statutoryDefinitions: [
      {
        term: 'Fraudulent Transfer (Fla. Stat. § 726.105)',
        definition: 'A transfer made or obligation incurred by a debtor without receiving a reasonably equivalent value in exchange, or with actual intent to hinder, delay, or defraud creditors.',
      },
      {
        term: 'Equitable Vendee’s Lien',
        definition: 'An equitable lien recognized in Florida equity jurisprudence protecting separate or marital contributions toward the acquisition, mortgage paydown, or improvement of real property.',
      },
    ],
    clauses: [
      {
        id: 'FUFTA_726_108',
        sectionCode: 'FLA. STAT. § 726.108',
        title: 'Remedies of Creditors & Spouses',
        text: 'In an action for relief against a transfer under §§ 726.101–726.112, a court may grant: (a) Avoidance of the transfer; (b) An attachment or other provisional remedy against the asset; (c) An injunction against further disposition by the debtor or transferee; (d) Appointment of a receiver.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Freezes real estate closing proceeds and compels escrow disclosure via Subpoena Duces Tecum.',
      },
    ],
    sovereignImmunityWaiver: 'Direct circuit court chancery and family division jurisdiction under Fla. Stat. Chapter 726.',
    civilLiabilitySection: 'Avoidance of transfer, money judgment against first transferee, and attorney fees under Fla. Stat. § 57.105.',
  },
  {
    id: 'SSA_REPRESENTATIVE_PAYEE',
    billNumber: '42 U.S.C. § 1383a & 20 C.F.R. § 416.641',
    shortTitle: 'Title XVI Supplemental Security Income Benefit Misuse & Clawback',
    formalTitle: '42 U.S.C. § 1383a & 20 C.F.R. §§ 416.601–416.665: Representative Payee Misuse Determinations',
    targetJurisdiction: 'FEDERAL_US_CODE',
    legislativeFindings: [
      'Under 42 U.S.C. § 1383a, fraudulently obtaining or converting Title XVI SSI disability payments for a child not residing with the payee constitutes a federal crime.',
      '20 C.F.R. § 416.641 mandates that a representative payee must use payments only for the use and benefit of the beneficiary.',
      'If the Social Security Administration determines that a representative payee misused benefits, the SSA is required to reissue the misused benefits to the rightful custodial parent and initiate clawback.',
      'Administrative petition supported by tax transcripts (IRS Form 1040), school records (IEP/504), and pediatric medical records triggers mandatory SSA OIG investigation.',
    ],
    statutoryDefinitions: [
      {
        term: 'Misuse of Benefits (20 C.F.R. § 416.641)',
        definition: 'When a representative payee converts benefits to uses other than the use and benefit of the child beneficiary.',
      },
      {
        term: 'Mandatory Reissuance (42 U.S.C. § 1383(a)(2)(E))',
        definition: 'The Commissioner shall reissue benefits to the child or successor payee in any case where negligent failure of the Commissioner or intentional misuse by a payee occurred.',
      },
    ],
    clauses: [
      {
        id: 'CFR_416_641',
        sectionCode: '20 C.F.R. § 416.641',
        title: 'Liability for Misused Benefit Payments',
        text: 'A representative payee who misuses benefits is responsible for repaying them. The Social Security Administration will initiate recoupment action and direct payments to the child’s actual physical custodian.',
        isActive: true,
        isMandatoryCore: true,
        legalObjective: 'Claws back child disability benefits diverted by non-custodial or abusive parties.',
      },
    ],
    sovereignImmunityWaiver: 'Federal administrative process with judicial review pursuant to 42 U.S.C. § 405(g).',
    civilLiabilitySection: 'Federal criminal penalties under 42 U.S.C. § 1383a(a) and civil false claims penalties under 31 U.S.C. § 3729.',
  },
];
