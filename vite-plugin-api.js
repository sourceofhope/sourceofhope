import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pathToFileURL } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function apiPlugin() {
  return {
    name: 'vite-plugin-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        console.log('🔌 API Request:', req.method, req.url);

        try {
          const apiPath = req.url.replace('/api/', '').split('?')[0];
          const apiFile = join(__dirname, 'api', `${apiPath}.js`);
          
          console.log('📁 Looking for file:', apiFile);
          
          const fileUrl = pathToFileURL(apiFile).href;
          console.log('📂 Import URL:', fileUrl);
          
          const module = await import(`${fileUrl}?t=${Date.now()}`);
          const handler = module.default;
          
          if (!handler) {
            throw new Error('No default export found in API handler');
          }
          
          console.log('✅ Handler loaded successfully');

          const expressRes = {
            status: (code) => {
              res.statusCode = code;
              return expressRes;
            },
            json: (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return expressRes;
            },
            send: (data) => {
              res.end(data);
              return expressRes;
            },
            end: (data) => {
              res.end(data);
              return expressRes;
            }
          };

          if (req.method === 'POST' || req.method === 'PUT') {
            let body = '';
            
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', async () => {
              try {
                req.body = JSON.parse(body);
              } catch (e) {
                console.error('❌ Body parse error:', e);
                req.body = {};
              }
              
              console.log('📦 Request body:', req.body);
              
              // Handler'ı çağır
              try {
                await handler(req, expressRes);
              } catch (handlerError) {
                console.error('❌ Handler error:', handlerError);
                if (!res.headersSent) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    error: 'Handler error',
                    message: handlerError.message 
                  }));
                }
              }
            });
          } else {
            await handler(req, expressRes);
          }
          
        } catch (error) {
          console.error('❌ API Plugin Error:', error);
          console.error('Stack:', error.stack);
          
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'Internal Server Error', 
              message: error.message,
              stack: error.stack 
            }));
          }
        }
      });
    }
  };
}
