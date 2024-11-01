import { device } from "../device";
import { client } from "../mqtt";
import * as env from "../env";
import chalk from "chalk";


export const setSystemAvailability = (availability: boolean) => {
  client.publish(`server-tools/${env.name}/availability`, JSON.stringify({
    state: availability ? 'online' : 'offline'
  }), { retain: true });
}

export const setEndpointAvailability = (endpoint: string, availability: boolean) => {
  client.publish(`server-tools/${env.name}/${endpoint}/availability`, JSON.stringify({
    state: availability ? 'online' : 'offline'
  }), { retain: true });
}

export const getCommonDiscoveryConfigs = (endpoint: string) => {
  return {
    availability: [
      { topic: `server-tools/${env.name}/availability`, value_template: "{{ value_json.state }}" },
      { topic: `server-tools/${env.name}/${endpoint}/availability`, value_template: "{{ value_json.state }}" }
    ],
    availability_mode: "all",
    device: device,
  }
}

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const syntaxHighlight = (json: string) => {
  // if (typeof json != 'string') {
  //   json = JSON.stringify(json, undefined, 2);
  // }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    switch (cls) {
      case 'key':
        return chalk.green(match)
      case 'string':
        return chalk.yellow(match)
      case 'boolean':
        return chalk.blue(match)
      case 'null':
        return chalk.red(match)
      default:
        return match;
    }
  });
}