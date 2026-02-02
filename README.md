# prd-to-issues

Turn PRD (Product Requirements Document) markdown files into GitHub issues automatically.

Stop manually copying requirements into issues. Just write your PRD in markdown and let this tool convert it.

## Install

```bash
npm install -g prd-to-issues
```

## Usage

```bash
# Preview issues from a PRD
prd-to-issues product-requirements.md

# Save to a file
prd-to-issues prd.md -o ISSUES.md

# Output as JSON
prd-to-issues prd.md --json > issues.json

# Create issues directly with gh CLI
prd-to-issues prd.md --gh | bash
```

## How It Works

The tool parses your markdown structure:

```markdown
# My Product PRD

## User Authentication
Implement secure user login.

### OAuth Integration
Support Google and GitHub OAuth.

### Password Reset
Email-based password reset flow.

## Dashboard
Main user dashboard with analytics.
```

Becomes:

**Issue 1: User Authentication**
- Labels: `feature`
- Body includes content + checklist of sub-tasks

**Issue 2: Dashboard**
- Labels: `feature`  
- Standalone issue

## Auto-Labels

Keywords in headers automatically generate labels:

| Keyword | Label |
|---------|-------|
| feature | `feature` |
| bug, fix | `bug` |
| api | `api` |
| ui, ux | `ui` |
| docs, documentation | `documentation` |
| test | `testing` |
| security | `security` |
| performance | `performance` |

## Options

```
-o, --output <file>    Write issues to file
--min-level <n>        Min heading level to convert (default: 2)
--max-level <n>        Max heading level to convert (default: 3)
--label <prefix>       Add label prefix to all issues
--json                 Output as JSON array
--gh                   Output as gh CLI commands
```

## Programmatic API

```typescript
import { parsePRD, sectionsToIssues } from 'prd-to-issues';

const markdown = `## Feature A\nDescription...`;
const sections = parsePRD(markdown);
const issues = sectionsToIssues(sections);

console.log(issues);
// [{ title: 'Feature A', body: 'Description...', labels: ['feature'] }]
```

## License

MIT
