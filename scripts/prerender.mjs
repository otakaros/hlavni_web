import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const publicStaticDir = path.resolve(distDir, 'public-static');

// Routes to prerender
const routes = ['/', '/geodetika'];

async function prerender() {
  console.log('🚀 Starting prerendering...');
  
  try {
    // Import the server handler
    const serverPath = `file://${path.resolve(distDir, 'server', 'server.js').replace(/\\/g, '/')}`;
    const serverModule = await import(serverPath);
    const server = serverModule.default;
    
    if (!server || !server.fetch) {
      throw new Error('Server module does not export a fetch method');
    }

    // Create output directory
    await fs.mkdir(publicStaticDir, { recursive: true });

    // Prerender each route
    for (const route of routes) {
      console.log(`📄 Rendering ${route}...`);
      
      try {
        // Create a Request object
        const url = new URL(`http://localhost:3000${route}`);
        const request = new Request(url.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'text/html',
            'User-Agent': 'node-prerender',
          },
        });

        // Call the server handler
        const response = await server.fetch(request);
        const html = await response.text();
        
        if (html && html.length > 100 && !html.includes('Internal Server Error')) {
          // Determine output path
          let outputPath;
          if (route === '/') {
            outputPath = path.resolve(publicStaticDir, 'index.html');
          } else {
            outputPath = path.resolve(publicStaticDir, `${route.slice(1)}.html`);
            // Also create index.html in subdirectory for nice URLs
            const dirPath = path.resolve(publicStaticDir, route.slice(1));
            await fs.mkdir(dirPath, { recursive: true });
            await fs.writeFile(path.resolve(dirPath, 'index.html'), html);
          }
          
          await fs.writeFile(outputPath, html);
          console.log(`  ✓ Saved (${html.length} bytes)`);
        } else {
          console.warn(`  ⚠ Empty or error response`);
          if (html) console.warn(`  Response snippet: ${html.substring(0, 100)}...`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to render ${route}:`, error.message);
      }
    }

    // Copy client assets
    console.log('📦 Copying assets...');
    const clientDir = path.resolve(distDir, 'client');
    
    try {
      const sourceFiles = await fs.readdir(clientDir, { recursive: true });
      
      for (const file of sourceFiles) {
        const source = path.resolve(clientDir, file);
        const dest = path.resolve(publicStaticDir, file);
        const stat = await fs.stat(source);
        
        if (stat.isDirectory()) {
          await fs.mkdir(dest, { recursive: true });
        } else {
          await fs.mkdir(path.dirname(dest), { recursive: true });
          await fs.copyFile(source, dest);
        }
      }
      console.log('✓ Assets copied');
    } catch (error) {
      console.warn('⚠ Failed to copy assets:', error.message);
    }

    // Copy CNAME if exists
    const cnameSource = path.resolve(projectRoot, 'CNAME');
    try {
      const cnameDest = path.resolve(publicStaticDir, 'CNAME');
      await fs.copyFile(cnameSource, cnameDest);
      console.log('✓ CNAME copied');
    } catch {
      console.log('⚠ No CNAME file found');
    }

    // Copy .nojekyll
    const noJekyllDest = path.resolve(publicStaticDir, '.nojekyll');
    await fs.writeFile(noJekyllDest, '');
    console.log('✓ .nojekyll created');

    console.log('\n✨ Prerendering complete!');
    console.log(`📍 Output directory: ${publicStaticDir}`);
    console.log('\nTo deploy to GitHub Pages:');
    console.log('1. The static files are ready in dist/public-static/');
    console.log('2. Rename dist to dist-old, and dist/public-static to dist');
    console.log('3. Or configure your GitHub Pages to use dist/public-static as source');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

prerender();
