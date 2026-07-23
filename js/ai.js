/* ============================================
   AI Resume & Portfolio Builder — AI Suggestions
   ============================================ */

// Action verbs categorized by impact type
const actionVerbs = {
  leadership: ['Spearheaded', 'Directed', 'Orchestrated', 'Championed', 'Pioneered', 'Led', 'Oversaw', 'Managed'],
  creation: ['Developed', 'Designed', 'Engineered', 'Architected', 'Built', 'Created', 'Implemented', 'Launched'],
  improvement: ['Optimized', 'Enhanced', 'Streamlined', 'Revamped', 'Transformed', 'Accelerated', 'Modernized', 'Elevated'],
  analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Identified', 'Diagnosed', 'Researched', 'Discovered'],
  collaboration: ['Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Mentored', 'Trained', 'Liaised', 'Unified'],
  achievement: ['Achieved', 'Delivered', 'Exceeded', 'Surpassed', 'Accomplished', 'Attained', 'Secured', 'Won']
};

// Related skills mapping
const skillRelations = {
  'javascript': ['TypeScript', 'React', 'Node.js', 'Vue.js', 'Angular', 'Next.js', 'Express.js'],
  'python': ['Django', 'Flask', 'FastAPI', 'NumPy', 'Pandas', 'TensorFlow', 'PyTorch'],
  'react': ['Redux', 'Next.js', 'React Native', 'TypeScript', 'Tailwind CSS', 'Material UI'],
  'node.js': ['Express.js', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'Socket.io'],
  'java': ['Spring Boot', 'Hibernate', 'Maven', 'JUnit', 'Microservices', 'Kafka'],
  'html': ['CSS', 'JavaScript', 'Sass', 'Bootstrap', 'Responsive Design', 'Accessibility'],
  'css': ['Sass', 'Tailwind CSS', 'Bootstrap', 'CSS Grid', 'Flexbox', 'Animations'],
  'sql': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Design', 'Query Optimization'],
  'git': ['GitHub', 'GitLab', 'CI/CD', 'Version Control', 'Git Flow'],
  'docker': ['Kubernetes', 'Docker Compose', 'CI/CD', 'AWS', 'Microservices'],
  'aws': ['EC2', 'S3', 'Lambda', 'CloudFormation', 'DynamoDB', 'ECS'],
  'machine learning': ['Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision'],
  'c++': ['Data Structures', 'Algorithms', 'OOP', 'STL', 'Competitive Programming'],
  'typescript': ['React', 'Angular', 'Node.js', 'Next.js', 'NestJS'],
  'mongodb': ['Mongoose', 'NoSQL', 'Redis', 'Node.js', 'Express.js'],
  'figma': ['UI/UX Design', 'Prototyping', 'Adobe XD', 'Sketch', 'Design Systems'],
  'flutter': ['Dart', 'Mobile Development', 'Firebase', 'REST APIs', 'State Management'],
  'rust': ['WebAssembly', 'Systems Programming', 'Cargo', 'Concurrency'],
  'go': ['Microservices', 'gRPC', 'Kubernetes', 'Concurrency', 'REST APIs'],
  'php': ['Laravel', 'WordPress', 'MySQL', 'Composer', 'REST APIs']
};

// Professional summary templates
const summaryTemplates = [
  "Results-driven {role} with {years} of experience in {skills}. Proven track record of {achievement}. Passionate about {passion} and committed to delivering high-quality solutions.",
  "Innovative {role} specializing in {skills}. Experienced in {domains} with a strong focus on {focus}. Adept at {strength} to drive business outcomes.",
  "Detail-oriented {role} with expertise in {skills}. Skilled at {strength} and {additional}. Seeking to leverage technical proficiency and problem-solving abilities to create impactful solutions.",
  "Dynamic {role} proficient in {skills}. Demonstrated ability to {achievement}. Enthusiastic about {passion} with a commitment to continuous learning and professional growth."
];

// Detect role from skills
function detectRole(skills) {
  const skillsLower = skills.map(s => s.toLowerCase());
  
  if (skillsLower.some(s => ['react', 'vue', 'angular', 'html', 'css', 'frontend'].includes(s))) {
    return 'Frontend Developer';
  }
  if (skillsLower.some(s => ['node.js', 'express', 'django', 'flask', 'backend'].includes(s))) {
    return 'Backend Developer';
  }
  if (skillsLower.some(s => ['react', 'node.js', 'full stack', 'fullstack'].includes(s)) && skillsLower.length > 3) {
    return 'Full Stack Developer';
  }
  if (skillsLower.some(s => ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'data science'].includes(s))) {
    return 'Machine Learning Engineer';
  }
  if (skillsLower.some(s => ['figma', 'ui/ux', 'adobe xd', 'sketch', 'design'].includes(s))) {
    return 'UI/UX Designer';
  }
  if (skillsLower.some(s => ['flutter', 'react native', 'swift', 'kotlin', 'mobile'].includes(s))) {
    return 'Mobile Developer';
  }
  if (skillsLower.some(s => ['aws', 'docker', 'kubernetes', 'devops', 'terraform'].includes(s))) {
    return 'DevOps Engineer';
  }
  if (skillsLower.some(s => ['python', 'pandas', 'sql', 'data analysis', 'tableau', 'power bi'].includes(s))) {
    return 'Data Analyst';
  }
  return 'Software Developer';
}

// Generate professional summary
export function generateSummary(data) {
  const skills = data.skills || [];
  const experience = data.experience || [];
  
  if (skills.length === 0) {
    return null;
  }

  const role = detectRole(skills);
  const topSkills = skills.slice(0, 4).join(', ');
  const years = experience.length > 0 ? `${Math.max(1, experience.length)}+ years` : 'hands-on';
  
  const template = summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
  
  const summary = template
    .replace('{role}', role)
    .replace('{skills}', topSkills)
    .replace('{years}', years)
    .replace('{achievement}', 'delivering scalable and efficient solutions')
    .replace('{passion}', 'building innovative technology')
    .replace('{domains}', 'modern web technologies')
    .replace('{focus}', 'clean code and best practices')
    .replace('{strength}', 'translating complex requirements into elegant solutions')
    .replace('{additional}', 'collaborating effectively in cross-functional teams');

  return summary;
}

// Enhance bullet points with action verbs
export function enhanceBulletPoints(text) {
  if (!text || text.trim().length === 0) return [];
  
  const lines = text.split('\n').filter(l => l.trim());
  const suggestions = [];
  
  lines.forEach(line => {
    const trimmed = line.replace(/^[-•*]\s*/, '').trim();
    if (trimmed.length < 5) return;
    
    // Check if line already starts with a strong action verb
    const firstWord = trimmed.split(' ')[0];
    const allVerbs = Object.values(actionVerbs).flat();
    
    if (!allVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase())) {
      // Suggest enhanced versions
      const category = Object.keys(actionVerbs)[Math.floor(Math.random() * Object.keys(actionVerbs).length)];
      const verb = actionVerbs[category][Math.floor(Math.random() * actionVerbs[category].length)];
      
      // Try to intelligently enhance
      let enhanced = `${verb} ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`;
      
      // Remove weak starters
      enhanced = enhanced.replace(/\b(I |i |we |We |helped |Helped |worked on |Worked on |did |Did |was responsible for |Was responsible for )/g, '');
      
      suggestions.push({
        original: trimmed,
        enhanced: enhanced,
        category: 'Bullet Point Enhancement'
      });
    }
  });
  
  return suggestions;
}

// Suggest related skills
export function suggestSkills(currentSkills) {
  const suggestions = new Set();
  
  currentSkills.forEach(skill => {
    const key = skill.toLowerCase();
    if (skillRelations[key]) {
      skillRelations[key].forEach(related => {
        if (!currentSkills.some(s => s.toLowerCase() === related.toLowerCase())) {
          suggestions.add(related);
        }
      });
    }
  });
  
  return Array.from(suggestions).slice(0, 8);
}

// Polish text - basic grammar fixes
export function polishText(text) {
  if (!text) return text;
  
  let polished = text;
  
  // Capitalize first letter of sentences
  polished = polished.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, prefix, letter) => {
    return prefix + letter.toUpperCase();
  });
  
  // Fix double spaces
  polished = polished.replace(/\s{2,}/g, ' ');
  
  // Ensure period at end if it's a full sentence
  if (polished.length > 20 && !polished.match(/[.!?]$/)) {
    polished = polished.trim() + '.';
  }
  
  // Fix common issues
  polished = polished.replace(/\bi\b/g, 'I');
  polished = polished.replace(/\bjavascript\b/gi, 'JavaScript');
  polished = polished.replace(/\btypescript\b/gi, 'TypeScript');
  polished = polished.replace(/\bgithub\b/gi, 'GitHub');
  polished = polished.replace(/\blinkedin\b/gi, 'LinkedIn');
  polished = polished.replace(/\bmongodb\b/gi, 'MongoDB');
  polished = polished.replace(/\bpostgresql\b/gi, 'PostgreSQL');
  polished = polished.replace(/\bmysql\b/gi, 'MySQL');
  polished = polished.replace(/\bnode\.js\b/gi, 'Node.js');
  polished = polished.replace(/\breact\.js\b/gi, 'React.js');
  polished = polished.replace(/\bvue\.js\b/gi, 'Vue.js');
  
  return polished;
}

// Get all AI suggestions for current data
export function getAISuggestions(data) {
  const suggestions = [];
  
  // Summary suggestion
  if ((!data.personal.summary || data.personal.summary.length < 30) && data.skills.length > 0) {
    const summary = generateSummary(data);
    if (summary) {
      suggestions.push({
        category: 'Professional Summary',
        type: 'summary',
        text: summary,
        action: 'Apply this professional summary'
      });
    }
  }
  
  // Skill suggestions
  if (data.skills.length > 0) {
    const relatedSkills = suggestSkills(data.skills);
    if (relatedSkills.length > 0) {
      suggestions.push({
        category: 'Recommended Skills',
        type: 'skills',
        text: `Based on your skills, consider adding: ${relatedSkills.join(', ')}`,
        skills: relatedSkills,
        action: 'Add suggested skills'
      });
    }
  }
  
  // Experience bullet point enhancements
  data.experience.forEach((exp, index) => {
    if (exp.description) {
      const enhanced = enhanceBulletPoints(exp.description);
      enhanced.forEach(item => {
        suggestions.push({
          category: `Experience: ${exp.company || 'Entry ' + (index + 1)}`,
          type: 'bullet',
          text: `Original: "${item.original}"\nEnhanced: "${item.enhanced}"`,
          original: item.original,
          enhanced: item.enhanced,
          experienceIndex: index,
          action: 'Apply enhancement'
        });
      });
    }
  });
  
  // Project description suggestions
  data.projects.forEach((proj, index) => {
    if (proj.description && proj.description.length < 50) {
      suggestions.push({
        category: `Project: ${proj.title || 'Project ' + (index + 1)}`,
        type: 'project-tip',
        text: 'Consider adding more detail: What problem does it solve? What was your role? What impact did it have?',
        action: 'Tip noted'
      });
    }
  });
  
  // General tips
  if (data.education.length === 0) {
    suggestions.push({
      category: 'Missing Section',
      type: 'tip',
      text: 'Consider adding your education background to strengthen your resume.',
      action: 'Go to Education'
    });
  }
  
  if (data.experience.length === 0 && data.projects.length === 0) {
    suggestions.push({
      category: 'Missing Section',
      type: 'tip',
      text: 'Add at least some projects or experience to showcase your practical skills.',
      action: 'Go to Experience'
    });
  }
  
  return suggestions;
}
