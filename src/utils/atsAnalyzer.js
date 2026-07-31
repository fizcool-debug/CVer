// Dictionary of action verbs for resume checking
const ACTION_VERBS = new Set([
  'managed', 'created', 'developed', 'designed', 'optimized', 'led', 'formulated',
  'executed', 'structured', 'engineered', 'increased', 'decreased', 'saved',
  'implemented', 'coordinated', 'launched', 'delivered', 'improved', 'resolved',
  'streamlined', 'generated', 'initiated', 'transformed', 'negotiated', 'cultivated',
  'automated', 'authored', 'mentored', 'orchestrated', 'pioneered', 'spearheaded'
]);

/**
 * Calculates a comprehensive ATS compatibility score for the resume data
 * @param {Object} data Resume structure containing personal, experience, education, projects, etc.
 * @param {string} jobDescription Target job description to match keywords against
 */
export function analyzeResume(data, jobDescription = '') {
  let score = 100;
  const recommendations = [];
  const keywordMatches = [];
  const missingKeywords = [];

  // 1. Check Personal Info
  if (!data.personal?.email) {
    score -= 10;
    recommendations.push({
      type: 'critical',
      message: 'Email address is missing. Recruiter contact is mandatory.'
    });
  }
  if (!data.personal?.phone) {
    score -= 10;
    recommendations.push({
      type: 'critical',
      message: 'Phone number is missing.'
    });
  }

  // 2. Check Layout Formatting Dangers
  recommendations.push({
    type: 'info',
    message: 'Single-column structure locked: guarantees 100% reading accuracy by older ATS systems.'
  });

  // 3. Work Experience Action Verbs & Metrics Check
  const experiences = data.workHistory || [];
  if (experiences.length === 0) {
    score -= 20;
    recommendations.push({
      type: 'critical',
      message: 'No professional work history declared.'
    });
  } else {
    let missingMetricsCount = 0;
    let weakVerbsCount = 0;

    experiences.forEach((exp, idx) => {
      const bullets = exp.bullets || [];
      if (bullets.length === 0) {
        recommendations.push({
          type: 'warning',
          message: `Work history entry #${idx + 1} (${exp.role || 'Unnamed Role'}) has no detail bullets.`
        });
      } else {
        bullets.forEach((bullet) => {
          if (bullet.trim() === '') return;

          // Check for metrics (numbers, %, $, etc.)
          const hasMetrics = /[\d%#$]/.test(bullet);
          if (!hasMetrics) {
            missingMetricsCount++;
          }

          // Check if starts with Action Verb
          const firstWord = bullet.trim().split(' ')[0].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
          if (!ACTION_VERBS.has(firstWord)) {
            weakVerbsCount++;
          }
        });
      }
    });

    if (missingMetricsCount > 0) {
      score -= Math.min(15, missingMetricsCount * 3);
      recommendations.push({
        type: 'warning',
        message: `${missingMetricsCount} achievements lack quantitative metrics (e.g. $, %, figures). Add metrics to prove business impact.`
      });
    }

    if (weakVerbsCount > 0) {
      score -= Math.min(10, weakVerbsCount * 2);
      recommendations.push({
        type: 'warning',
        message: `${weakVerbsCount} bullets do not begin with strong action verbs. Use action verbs (e.g., "Led", "Optimized", "Engineered") instead of passive terms.`
      });
    }
  }

  // 4. Keyword Matcher
  if (jobDescription.trim()) {
    const jobWords = extractImportantKeywords(jobDescription);
    const resumeText = JSON.stringify(data).toLowerCase();

    let matches = 0;
    jobWords.forEach(word => {
      if (resumeText.includes(word.toLowerCase())) {
        matches++;
        keywordMatches.push(word);
      } else {
        missingKeywords.push(word);
      }
    });

    const matchRatio = jobWords.length > 0 ? (matches / jobWords.length) : 0;
    const keywordScoreImpact = Math.round((1 - matchRatio) * 30);
    score -= keywordScoreImpact;

    if (jobWords.length === 0) {
      recommendations.push({
        type: 'keyword',
        message: 'No critical technical skills identified in the job description (0%). Please paste a detailed technical job description.'
      });
    } else {
      recommendations.push({
        type: 'keyword',
        message: `Keyword Match: You matched ${matches} of ${jobWords.length} critical skills found in the job description (${Math.round(matchRatio * 100)}%).`
      });
    }
  }

  return {
    score: Math.max(0, score),
    recommendations,
    keywordMatches,
    missingKeywords
  };
}

/**
 * Extracts key software terms and dynamic proper nouns (like Chef, ServSafe, Kubernetes)
 * from a job description, filtering out common English stop-words.
 */
function extractImportantKeywords(text) {
  const techDictionary = [
    'react', 'vue', 'angular', 'node.js', 'node', 'javascript', 'typescript', 'rust', 'go',
    'python', 'java', 'c++', 'c#', '.net', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql',
    'project management', 'agile', 'scrum', 'ci/cd', 'testing', 'cypress', 'jest',
    'security', 'rest api', 'git', 'webpack', 'figma', 'ui/ux', 'analytics',
    'developer', 'engineer', 'programmer', 'analyst', 'specialist', 'lead',
    'manager', 'architect', 'frontend', 'backend', 'fullstack', 'full stack',
    'coding', 'development', 'software', 'microservices', 'serverless', 'cloud',
    'responsive design', 'database', 'caching', 'automation'
  ];

  const extracted = new Set();
  const lowerText = text.toLowerCase();
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 1. Match terms from the core dictionary
  techDictionary.forEach(keyword => {
    const escaped = escapeRegex(keyword);
    const prefix = /^\w/.test(keyword) ? '\\b' : '';
    const suffix = /\w$/.test(keyword) ? '\\b' : '(?=$|\\s|[.,;!?])';
    const regex = new RegExp(prefix + escaped + suffix, 'i');
    
    if (regex.test(lowerText)) {
      const match = text.match(new RegExp(escaped, 'i'));
      extracted.add(match ? match[0] : keyword);
    }
  });

  // 2. Dynamic proper noun extraction (Capitalized words like Chef, ServSafe)
  const stopWords = new Set([
    'we', 'you', 'the', 'our', 'they', 'this', 'that', 'with', 'from', 'your',
    'have', 'will', 'more', 'about', 'their', 'there', 'here', 'what', 'when',
    'who', 'whom', 'which', 'some', 'each', 'both', 'only', 'very', 'head',
    'requirements', 'responsibilities', 'experience', 'qualifications', 'role',
    'job', 'candidate', 'position', 'apply', 'description', 'skills', 'duties',
    'ability', 'proven', 'strong', 'excellent', 'must', 'should', 'could',
    'team', 'work', 'working', 'opportunity', 'company', 'office',
    'benefits', 'salary', 'location', 'preferred', 'required', 'ideal', 'key',
    'seeking', 'certified'
  ]);

  // Find capitalized words starting with capital letters
  const capitalizedRegex = /\b[A-Z][a-z0-9+#]*\b/g;
  const matches = text.match(capitalizedRegex) || [];

  matches.forEach(word => {
    const lowerWord = word.toLowerCase();
    // Ignore short words unless in core list
    if (word.length <= 2 && !['go', 'r', 'c', 'js', 'ip'].includes(lowerWord)) return;
    // Ignore grammatical stop-words
    if (stopWords.has(lowerWord)) return;
    extracted.add(word);
  });

  return Array.from(extracted);
}
