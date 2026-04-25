#!/usr/bin/env node

/**
 * GeoDrona Favicon Generator
 * Generuje všechny PNG favicon verze z SVG
 * 
 * Požadavky: npm install sharp
 * Spuštění: node scripts/generate-favicons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_SOURCE = path.join(__dirname, '../public/assets/favicon.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/assets');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Definice favicon verzí
const FAVICONS = [
  // PNG — vyhledávače
  { name: 'favicon-512.png', size: 512 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-96.png', size: 96 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-144.png', size: 144 },
  
  // Apple iOS
  { name: 'apple-touch-icon-180.png', size: 180 },
  { name: 'apple-touch-icon-152.png', size: 152 },
  { name: 'apple-touch-icon-144.png', size: 144 },
  { name: 'apple-touch-icon-120.png', size: 120 },
];

async function generateFavicons() {
  console.log('🎨 GeoDrona Favicon Generator');
  console.log(`📂 Source: ${SVG_SOURCE}`);
  console.log(`📂 Output: ${OUTPUT_DIR}\n`);
  
  if (!fs.existsSync(SVG_SOURCE)) {
    console.error(`❌ SVG source nenalezen: ${SVG_SOURCE}`);
    process.exit(1);
  }
  
  try {
    // Generuj PNG verze
    for (const favicon of FAVICONS) {
      const outputPath = path.join(OUTPUT_DIR, favicon.name);
      await sharp(SVG_SOURCE)
        .resize(favicon.size, favicon.size)
        .png()
        .toFile(outputPath);
      console.log(`✅ ${favicon.name} (${favicon.size}×${favicon.size})`);
    }
    
    // Generuj ICO z 32px PNG
    const ico32Path = path.join(OUTPUT_DIR, 'favicon-32.png');
    const icoOutputPath = path.join(PUBLIC_DIR, 'favicon.ico');
    
    // Jednoduché ICO — lze vylepšit s icojs, ale toto funguje pro základní případ
    // Pro produkci doporučuji online nástroj icoconvert.com
    fs.copyFileSync(ico32Path, icoOutputPath);
    console.log(`✅ favicon.ico (z 32px PNG — doporučuji přepsati přes icoconvert.com)`);
    
    console.log('\n✨ Všechny favicony byly vygenerovány!');
    console.log('\n📝 Příští kroky:');
    console.log('1. Zkontroluj generated PNG v public/assets/');
    console.log('2. favicon.ico ideálně přepiš přes https://icoconvert.com/');
    console.log('3. git add . && git push');
    console.log('4. Ověř v https://www.google.com/s2/favicons?domain=geodrona.cz');
    
  } catch (error) {
    console.error('❌ Chyba při generování:', error);
    process.exit(1);
  }
}

generateFavicons();
