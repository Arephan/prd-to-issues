#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parsePRD, sectionsToIssues, formatIssuesForGitHub } from './parser.js';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
prd-to-issues - Turn PRD markdown files into GitHub issues

Usage:
  prd-to-issues <prd-file.md> [options]

Options:
  -o, --output <file>    Write issues to file (default: stdout)
  --min-level <n>        Minimum heading level to convert (default: 2)
  --max-level <n>        Maximum heading level to convert (default: 3)
  --label <prefix>       Add a label prefix to all issues
  --json                 Output as JSON array
  --gh                   Output as gh CLI commands
  -h, --help             Show this help

Examples:
  prd-to-issues product-requirements.md
  prd-to-issues prd.md --json > issues.json
  prd-to-issues prd.md --gh | bash  # Create issues directly
  prd-to-issues prd.md -o ISSUES.md

The tool parses markdown headers and converts them to GitHub issues:
  - ## Headers become issue titles
  - Content under headers becomes issue body
  - Nested ### headers become task checklists
  - Keywords auto-generate labels (feature, bug, api, ui, etc.)
`);
}

function main() {
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  const inputFile = args[0];
  let outputFile: string | null = null;
  let minLevel = 2;
  let maxLevel = 3;
  let labelPrefix = '';
  let jsonOutput = false;
  let ghOutput = false;

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '-o':
      case '--output':
        outputFile = args[++i];
        break;
      case '--min-level':
        minLevel = parseInt(args[++i], 10);
        break;
      case '--max-level':
        maxLevel = parseInt(args[++i], 10);
        break;
      case '--label':
        labelPrefix = args[++i];
        break;
      case '--json':
        jsonOutput = true;
        break;
      case '--gh':
        ghOutput = true;
        break;
    }
  }

  if (!existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  const markdown = readFileSync(inputFile, 'utf-8');
  const sections = parsePRD(markdown);
  const issues = sectionsToIssues(sections, { minLevel, maxLevel, labelPrefix });

  if (issues.length === 0) {
    console.error('No issues found. Make sure your PRD has ## or ### headings.');
    process.exit(1);
  }

  let output: string;

  if (jsonOutput) {
    output = JSON.stringify(issues, null, 2);
  } else if (ghOutput) {
    // Generate gh CLI commands
    output = issues.map(issue => {
      const labels = issue.labels.map(l => `-l "${l}"`).join(' ');
      const body = issue.body.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      return `gh issue create --title "${issue.title}" --body "${body}" ${labels}`;
    }).join('\n');
  } else {
    output = formatIssuesForGitHub(issues);
  }

  if (outputFile) {
    writeFileSync(outputFile, output);
    console.log(`✅ Generated ${issues.length} issues → ${outputFile}`);
  } else {
    console.log(output);
  }
}

main();
