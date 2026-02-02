export interface PRDSection {
  title: string;
  level: number;
  content: string;
  children: PRDSection[];
}

export interface Issue {
  title: string;
  body: string;
  labels: string[];
}

export function parsePRD(markdown: string): PRDSection[] {
  const lines = markdown.split('\n');
  const sections: PRDSection[] = [];
  const stack: PRDSection[] = [];
  let currentContent: string[] = [];

  const flushContent = () => {
    if (stack.length > 0 && currentContent.length > 0) {
      stack[stack.length - 1].content = currentContent.join('\n').trim();
    }
    currentContent = [];
  };

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      flushContent();
      
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      
      const section: PRDSection = {
        title,
        level,
        content: '',
        children: []
      };

      // Pop stack until we find a parent with lower level
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        sections.push(section);
      } else {
        stack[stack.length - 1].children.push(section);
      }
      
      stack.push(section);
    } else {
      currentContent.push(line);
    }
  }
  
  flushContent();
  return sections;
}

export function sectionsToIssues(sections: PRDSection[], options: {
  minLevel?: number;
  maxLevel?: number;
  labelPrefix?: string;
} = {}): Issue[] {
  const { minLevel = 2, maxLevel = 3, labelPrefix = '' } = options;
  const issues: Issue[] = [];

  const processSection = (section: PRDSection, parentTitle?: string) => {
    if (section.level >= minLevel && section.level <= maxLevel) {
      const labels: string[] = [];
      
      // Auto-label based on keywords
      const titleLower = section.title.toLowerCase();
      if (titleLower.includes('feature')) labels.push('feature');
      if (titleLower.includes('bug') || titleLower.includes('fix')) labels.push('bug');
      if (titleLower.includes('enhancement')) labels.push('enhancement');
      if (titleLower.includes('documentation') || titleLower.includes('docs')) labels.push('documentation');
      if (titleLower.includes('api')) labels.push('api');
      if (titleLower.includes('ui') || titleLower.includes('ux')) labels.push('ui');
      if (titleLower.includes('test')) labels.push('testing');
      if (titleLower.includes('security')) labels.push('security');
      if (titleLower.includes('performance')) labels.push('performance');
      
      if (labels.length === 0) labels.push('feature');
      if (labelPrefix) labels.unshift(labelPrefix);

      let body = '';
      if (parentTitle) {
        body += `> Part of: **${parentTitle}**\n\n`;
      }
      
      if (section.content) {
        body += section.content + '\n\n';
      }

      // Add child sections as checklist
      if (section.children.length > 0) {
        body += '## Tasks\n\n';
        for (const child of section.children) {
          body += `- [ ] **${child.title}**`;
          if (child.content) {
            const preview = child.content.split('\n')[0].slice(0, 100);
            if (preview) body += `: ${preview}`;
          }
          body += '\n';
        }
      }

      issues.push({
        title: section.title,
        body: body.trim(),
        labels
      });
    }

    // Process children
    for (const child of section.children) {
      processSection(child, section.title);
    }
  };

  for (const section of sections) {
    processSection(section);
  }

  return issues;
}

export function formatIssueAsMarkdown(issue: Issue, index: number): string {
  let output = `## Issue ${index + 1}: ${issue.title}\n\n`;
  output += `**Labels:** ${issue.labels.join(', ')}\n\n`;
  output += `### Body\n\n${issue.body}\n`;
  return output;
}

export function formatIssuesForGitHub(issues: Issue[]): string {
  return issues.map((issue, i) => formatIssueAsMarkdown(issue, i)).join('\n---\n\n');
}
