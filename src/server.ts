require('dotenv').config();
import { createApp } from './config/express';
import config from 'config';
const app = createApp();
debugger;
const port = process.env.PORT || app.get('port') || config.get<number>('server.port');

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
