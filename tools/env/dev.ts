import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  API: 'https://ols.dev1.internal3.eportal.anthem.com/solsadmin/senior/admin/',
  SM_API: 'https://va10dlvwbs309.wellpoint.com/SoaService/sos/api/getSolsDetails/'
  //API: 'http://va10dlvwbs316.wellpoint.com/olsadminconsole/senior/admin/'
};

export = DevConfig;

