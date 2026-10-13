/**
 * Downstream Agent Validation Sandbox (GROUNDING.md Validator)
 * 
 * Verifies that AI agents (Forensic Dossier, CogniVault, MindPal) strictly adhere
 * to the PsychEdge GROUNDING.md contract:
 * 1. Agents may cite ONLY approved artifacts in the Evidence Core inventory.
 * 2. Citing a 'draft' or unapproved artifact is a contract violation.
 * 3. Any factual claim lacking an approved artifact citation MUST be marked exactly [UNREFERENCED].
 */

export interface ValidationIssue {
  line: number;
  type: 'UNAPPROVED_CITATION' | 'UNCITED_ASSERTION';
  snippet: string;
  message: string;
}

export interface GroundingValidationReport {
  passed: boolean;
  totalLines: number;
  approvedInventoryCount: number;
  citationsFound: string[];
  unapprovedCitations: string[];
  unreferencedCount: number;
  issues: ValidationIssue[];
  summary: string;
}

/**
 * Regex patterns for finding artifact citations in agent text.
 * Matches: [CaseID_AETHER_EventCert_YYYY-MM-DD_vN.json] or bare filename
 */
const ARTIFACT_CITATION_REGEX = /([A-Za-z0-9_-]+_AETHER_EventCert_\d{4}-\d{2}-\d{2}_v\d+\.(?:json|md))/g;

/**
 * Common factual assertion indicator verbs and patterns in legal/forensic agent outputs.
 * Lines containing definitive assertions must either:
 * (a) cite an approved artifact, OR
 * (b) contain [UNREFERENCED], OR
 * (c) be purely conversational/structural headers.
 */
const ASSERTION_INDICATORS = [
  /\b(occurred|happened|disconnected|transferred|filed|tampered|intercepted|hijacked|stranded|confirmed|verified|recorded)\b/i,
  /\b(on\s+\d{4}-\d{2}-\d{2}|at\s+\d{2}:\d{2}|at\s+approx|dollars|funds|ex-parte|motion|hearing)\b/i,
];

export function validateAgentGrounding(
  agentOutput: string,
  approvedInventory: string[]
): GroundingValidationReport {
  const approvedSet = new Set(approvedInventory.map((f) => f.trim()));
  const lines = agentOutput.split(/\r?\n/);
  const issues: ValidationIssue[] = [];
  const citationsFoundSet = new Set<string>();
  const unapprovedCitationsSet = new Set<string>();
  let unreferencedCount = 0;

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();

    // Skip empty lines, pure markdown horizontal rules, or short greetings
    if (!trimmed || trimmed === '---' || trimmed === '***' || trimmed === '___') {
      return;
    }

    // Check for [UNREFERENCED] tag
    const hasUnreferencedTag = trimmed.includes('[UNREFERENCED]');
    if (hasUnreferencedTag) {
      unreferencedCount++;
    }

    // Extract all artifact citations on this line
    const citationsOnLine: string[] = [];
    let match: RegExpExecArray | null;
    const regex = new RegExp(ARTIFACT_CITATION_REGEX);
    while ((match = regex.exec(trimmed)) !== null) {
      const filename = match[1];
      citationsOnLine.push(filename);
      citationsFoundSet.add(filename);

      if (!approvedSet.has(filename)) {
        unapprovedCitationsSet.add(filename);
        issues.push({
          line: lineNum,
          type: 'UNAPPROVED_CITATION',
          snippet: trimmed,
          message: `Cited artifact "${filename}" is not in the approved inventory. Per GROUNDING.md, draft or unlisted artifacts cannot be cited.`,
        });
      }
    }

    // If the line makes a definitive factual assertion without a citation or [UNREFERENCED] tag
    const isHeaderOrStructure =
      trimmed.startsWith('#') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('>') ||
      trimmed.startsWith('```') ||
      /^(Summary|Overview|Conclusion|Next Steps|Notice):/i.test(trimmed);

    if (!isHeaderOrStructure && citationsOnLine.length === 0 && !hasUnreferencedTag) {
      const makesFactualAssertion = ASSERTION_INDICATORS.some((pat) => pat.test(trimmed));
      if (makesFactualAssertion && trimmed.length > 25) {
        issues.push({
          line: lineNum,
          type: 'UNCITED_ASSERTION',
          snippet: trimmed,
          message: `Factual claim lacks citation to an approved artifact and is missing the mandatory [UNREFERENCED] marker.`,
        });
      }
    }
  });

  const passed = issues.length === 0;
  const summary = passed
    ? `PASSED: All ${citationsFoundSet.size} citations are grounded in approved inventory. Total unreferenced tags: ${unreferencedCount}.`
    : `FAILED: Found ${issues.length} contract violation(s) across ${lines.length} lines.`;

  return {
    passed,
    totalLines: lines.length,
    approvedInventoryCount: approvedSet.size,
    citationsFound: Array.from(citationsFoundSet),
    unapprovedCitations: Array.from(unapprovedCitationsSet),
    unreferencedCount,
    issues,
    summary,
  };
}
