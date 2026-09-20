// Sample Presets for Model 1: AI Coding Agent Prediction
export const AGENT_PRESETS = [
  {
    id: 'cursor-pr',
    name: 'Cursor PR Preset',
    badge: 'Cursor',
    description: 'Frontend state refactor with multi-file modifications',
    data: {
      title: 'feat(auth): refactor token refresh flow and improve state persistence',
      body: 'Implemented silent token refreshing with axios interceptors. Updated auth context to persist sessions across page reloads without UI flicker. Closes #142.',
      language: 'TypeScript',
      forks: 45,
      stars: 320,
      is_forked: false,
      followers: 85,
      following: 12,
      created_at: '2025-08-15T14:30:00',
      user_created_at: '2022-03-10T09:15:00'
    }
  },
  {
    id: 'devin-pr',
    name: 'Devin PR Preset',
    badge: 'Devin',
    description: 'Autonomous end-to-end bug reproduction and fix',
    data: {
      title: 'fix(core): resolve concurrency race condition in redis connection pool',
      body: 'Root cause analysis: Connection handles were leaked when timeout occurred before handshake. Added connection pooling safeguards, added automated reproduction test in tests/concurrency_test.py, and verified 0 leaks.',
      language: 'Python',
      forks: 120,
      stars: 890,
      is_forked: false,
      followers: 24,
      following: 3,
      created_at: '2025-07-20T18:45:00',
      user_created_at: '2024-01-15T11:00:00'
    }
  },
  {
    id: 'copilot-pr',
    name: 'Copilot PR Preset',
    badge: 'Copilot',
    description: 'Contextual pull request with automated unit test suite',
    data: {
      title: 'test: add comprehensive test cases for string sanitizer utility',
      body: 'Added unit tests covering edge cases for HTML sanitization, unicode normalization, and null input handling. Verified 100% line coverage.',
      language: 'JavaScript',
      forks: 18,
      stars: 64,
      is_forked: false,
      followers: 12,
      following: 30,
      created_at: '2025-09-02T10:15:00',
      user_created_at: '2021-06-20T14:00:00'
    }
  },
  {
    id: 'claude-code-pr',
    name: 'Claude Code PR Preset',
    badge: 'Claude Code',
    description: 'CLI-driven architectural migration and documentation',
    data: {
      title: 'chore: migrate build tooling from webpack to vite with esbuild',
      body: 'Complete migration of client build pipeline. Reduced development cold start from 14s to 280ms. Updated index.html, created vite.config.ts, and added migration documentation in docs/build.md.',
      language: 'TypeScript',
      forks: 75,
      stars: 450,
      is_forked: false,
      followers: 55,
      following: 18,
      created_at: '2025-08-28T16:00:00',
      user_created_at: '2020-11-12T08:30:00'
    }
  }
];

// Sample Presets for Model 2: Repository Popularity Prediction
export const STARS_PRESETS = [
  {
    id: 'popular-framework',
    name: 'Popular Framework Preset',
    badge: 'High Popularity',
    description: 'Widely used open-source web framework with permissive license',
    data: {
      repository_owner: 'pallets',
      repository_name: 'flask',
      license: 'BSD-3-Clause',
      language: 'Python',
      forks: 15400,
      is_forked: false
    }
  },
  {
    id: 'utility-library',
    name: 'Utility Library Preset',
    badge: 'Moderate Popularity',
    description: 'Specialized developer utility library with moderate community adoption',
    data: {
      repository_owner: 'fastapi-users',
      repository_name: 'fastapi-users',
      license: 'MIT',
      language: 'Python',
      forks: 380,
      is_forked: false
    }
  },
  {
    id: 'personal-fork',
    name: 'Personal Fork Preset',
    badge: 'Fork / Low Activity',
    description: 'A personal fork maintained for experimental tweaks or upstream patches',
    data: {
      repository_owner: 'dev-contributor',
      repository_name: 'flask-patched',
      license: 'BSD-3-Clause',
      language: 'Python',
      forks: 2,
      is_forked: true
    }
  }
];
