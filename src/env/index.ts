export const name = (process.env.NAME ?? 'servertools').toLocaleLowerCase().replace(' ', '')

export const protocol = 'mqtt';
export const port = '1883';
export const host = process.env.MQTT_HOSTNAME;
export const clientId = `${name}`;

if (process.env.SSH_USERNAME === undefined || process.env.SSH_PASSWORD === undefined) throw new Error('SSH_USER and SSH_PASS must be set as environmental variables.');

export const SSH_USERNAME = process.env.SSH_USERNAME;
export const SSH_PASSWORD = process.env.SSH_PASSWORD;


export const connectUrl = `${protocol}://${host}:${port}`;

const v = (process.env.MQTT_VERSION === undefined ? undefined : parseInt(process.env.MQTT_VERSION));
export const version = (v === 3 || v === 4 || v === 5) ? v : undefined;