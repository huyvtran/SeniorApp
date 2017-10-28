import { EnvConfig } from './env-config.interface';

const DevelopConfig: EnvConfig = {
  ENV: 'DEVELOP',
  API: 'https://ols.dev1.internal3.eportal.anthem.com/solsadmin/senior/admin/',
  SM_API: 'http://va10dlvwbs309.wellpoint.com:9080/solsadmin/senior/admin/roles/loginSM'
};

export = DevelopConfig;

