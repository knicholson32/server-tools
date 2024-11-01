import mqtt from "mqtt"; 
import * as env from '../env';

export const client = mqtt.connect(env.connectUrl, {
  clientId: env.clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocolVersion: env.version,
  reconnectPeriod: 1000,
});
