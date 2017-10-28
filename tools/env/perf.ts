import { EnvConfig } from './env-config.interface';

const SitConfig: EnvConfig = {
  ENV: 'PERF',
  API: 'https://perf1.ols.internal2.eportal.wellpoint.com/solsadmin/senior/admin/',
  SM_API: 'https://perf1.intact.wellpoint.com/SoaService/sos/api/getAgentDetail/'
};

export = SitConfig;

