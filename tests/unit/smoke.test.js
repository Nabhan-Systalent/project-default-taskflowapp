// Baseline test committed by the AEGIS repo bootstrap so the generated project
// is a runnable Jest project from commit one. The QA agent adds per-story
// acceptance-criteria tests alongside this file under tests/qa/.
const fs = require('fs');
const path = require('path');

test('project scaffold is present', () => {
  const root = path.join(__dirname, '..', '..');
  expect(fs.existsSync(path.join(root, 'VERSION'))).toBe(true);
  expect(fs.existsSync(path.join(root, 'CHANGELOG.md'))).toBe(true);
});
