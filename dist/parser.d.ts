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
export declare function parsePRD(markdown: string): PRDSection[];
export declare function sectionsToIssues(sections: PRDSection[], options?: {
    minLevel?: number;
    maxLevel?: number;
    labelPrefix?: string;
}): Issue[];
export declare function formatIssueAsMarkdown(issue: Issue, index: number): string;
export declare function formatIssuesForGitHub(issues: Issue[]): string;
