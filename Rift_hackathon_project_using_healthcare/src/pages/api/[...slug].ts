import app from '../../../backend/src/index';

export const config = {
  api: {
    externalResolver: true, // Tells Next.js that Express will handle the response
    bodyParser: false,      // Tells Next.js to pass the raw stream to Express
  },
};

export default function handler(req: any, res: any) {
  return app(req, res);
}
