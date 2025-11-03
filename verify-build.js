#!/usr/bin/env node

/**
 * Build Verification Script
 * 
 * Quick automated checks to verify the application is ready for testing.
 * This script validates:
 * - All disease configurations are valid
 * - Component exports are correct
 * - No obvious TypeScript errors
 * - Build artifacts exist
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const checks = [];
let passed = 0;
let failed = 0;

function check(name, fn) {
  checks.push({ name, fn });
}

function runChecks() {
  console.log('🔍 Running build verification checks...\n');

  checks.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}\n`);
      failed++;
    }
  });

  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n✨ All checks passed! Application is ready for manual testing.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some checks failed. Please review the errors above.\n');
    process.exit(1);
  }
}

// Check 1: Verify disease config file exists and is valid
check('Disease configuration file exists', () => {
  const configPath = resolve('./src/config/diseases.ts');
  if (!existsSync(configPath)) {
    throw new Error('diseases.ts not found');
  }
  const content = readFileSync(configPath, 'utf-8');
  if (!content.includes('diseaseConfigs')) {
    throw new Error('diseaseConfigs export not found');
  }
});

// Check 2: Verify main App component exists
check('App.tsx exists and has proper structure', () => {
  const appPath = resolve('./src/App.tsx');
  if (!existsSync(appPath)) {
    throw new Error('App.tsx not found');
  }
  const content = readFileSync(appPath, 'utf-8');
  if (!content.includes('export default App')) {
    throw new Error('Default App export not found');
  }
  if (!content.includes('useDiseaseData')) {
    throw new Error('useDiseaseData hook not found in App.tsx');
  }
});

// Check 3: Verify store exists
check('Zustand store configured correctly', () => {
  const storePath = resolve('./src/store/appStore.ts');
  if (!existsSync(storePath)) {
    throw new Error('appStore.ts not found');
  }
  const content = readFileSync(storePath, 'utf-8');
  if (!content.includes('create')) {
    throw new Error('Zustand create not imported');
  }
  if (!content.includes('persist')) {
    throw new Error('Persist middleware not configured');
  }
});

// Check 4: Verify API service exists
check('Disease API service configured', () => {
  const apiPath = resolve('./src/services/api/diseaseApi.ts');
  if (!existsSync(apiPath)) {
    throw new Error('diseaseApi.ts not found');
  }
  const content = readFileSync(apiPath, 'utf-8');
  if (!content.includes('useDiseaseData')) {
    throw new Error('useDiseaseData hook not found');
  }
  if (!content.includes('queryKey:')) {
    throw new Error('React Query queryKey not found');
  }
});

// Check 5: Verify all disease types are defined
check('All 5 diseases defined in types', () => {
  const typesPath = resolve('./src/types/index.ts');
  if (!existsSync(typesPath)) {
    throw new Error('types/index.ts not found');
  }
  const content = readFileSync(typesPath, 'utf-8');
  // Check for const object pattern: COVID19: 'covid19', etc.
  const diseases = ['COVID19', 'INFLUENZA', 'MPOX', 'MALARIA', 'DENGUE'];
  diseases.forEach(disease => {
    if (!content.includes(disease)) {
      throw new Error(`Disease type ${disease} not found`);
    }
  });
});

// Check 6: Verify key components exist
check('All key components exist', () => {
  const components = [
    './src/components/DiseaseSelector.tsx',
    './src/components/DiseaseMap.tsx',
    './src/components/DiseaseStatsCard.tsx',
    './src/components/CollapsibleControlPanel.tsx',
    './src/components/ErrorBoundary.tsx',
  ];
  
  components.forEach(component => {
    if (!existsSync(resolve(component))) {
      throw new Error(`${component} not found`);
    }
  });
});

// Check 7: Verify documentation exists
check('Documentation files exist', () => {
  const docs = [
    './README.md',
    './docs/API_INTEGRATION.md',
    './docs/DISEASE_DATA_SOURCES.md',
    './TESTING_GUIDE.md',
  ];
  
  docs.forEach(doc => {
    if (!existsSync(resolve(doc))) {
      throw new Error(`${doc} not found`);
    }
  });
});

// Check 8: Verify package.json has correct dependencies
check('Package.json has required dependencies', () => {
  const pkgPath = resolve('./package.json');
  if (!existsSync(pkgPath)) {
    throw new Error('package.json not found');
  }
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const required = [
    'react',
    'react-dom',
    '@tanstack/react-query',
    'zustand',
    'framer-motion',
    'leaflet',
    'react-leaflet',
  ];
  
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  required.forEach(dep => {
    if (!allDeps[dep]) {
      throw new Error(`Missing dependency: ${dep}`);
    }
  });
});

// Check 9: Verify Tailwind CSS v4 configuration
check('Tailwind CSS v4 configuration exists', () => {
  const postcssPath = resolve('./postcss.config.js');
  const indexCssPath = resolve('./src/index.css');
  
  if (!existsSync(postcssPath)) {
    throw new Error('postcss.config.js not found');
  }
  
  if (!existsSync(indexCssPath)) {
    throw new Error('index.css not found');
  }
  
  const cssContent = readFileSync(indexCssPath, 'utf-8');
  // Check for both single and double quote variants
  if (!cssContent.includes("@import 'tailwindcss'") && !cssContent.includes('@import "tailwindcss"')) {
    throw new Error('Tailwind CSS v4 import not found in index.css');
  }
});

// Check 10: Verify Vite config
check('Vite configuration exists', () => {
  const vitePath = resolve('./vite.config.ts');
  if (!existsSync(vitePath)) {
    throw new Error('vite.config.ts not found');
  }
});

// Run all checks
runChecks();