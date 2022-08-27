import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as deepmerge from 'deepmerge';
import { join } from 'path';

const prod = process.env.NODE_ENV === 'production';

const YAML_CONFIG_FILENAME = 'config.yml';
const ENV_CONFIG_FILENAME = prod ? 'config.production.yaml' : 'config.local.yml';

export default () => {
  const defaultConfig = yaml.load(readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8')) as Record<string, any>;

  const envConfig = yaml.load(readFileSync(join(__dirname, ENV_CONFIG_FILENAME), 'utf8')) as Record<string, any>;

  const config = { env: process.env.NODE_ENV || 'development' } as Record<string, any>;

  return deepmerge.all([defaultConfig, envConfig, config]) as Record<string, any>;
};
