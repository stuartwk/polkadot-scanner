import BlockScannerServer from './server';

/**
 * Start the server
 */
let server = new BlockScannerServer();
server.start(process.env.NODE_ENV === 'development' ? 3001 : 8080);
