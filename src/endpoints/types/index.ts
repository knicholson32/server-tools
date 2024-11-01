import { getCommonDiscoveryConfigs, setEndpointAvailability } from "../../helpers";
import * as env from '../../env';
import { client } from "../../mqtt"; 
import { Discovery } from "../../types";

const endpointNames: string[] = [];

export class Endpoint {
  endpoint: string;
  discovery: Discovery;
  type: string;
  matcher: string;
  _private = {
    _available: false,
    _processor: (topic: string, msg: string) => {
      console.error('Unimplemented message function!', topic, msg);
    },
    _init: () => { }
  }

  constructor(endpoint: string, type: string, discovery: Discovery, processor: (topic: string, msg: string) => void, init: () => void) {
    this.endpoint = endpoint;

    if (endpointNames.includes(type + '/' + endpoint)) throw new Error(`The endpoint "${type + '/' + endpoint}" already exists. Duplicate endpoints are not allowed.`);
    endpointNames.push(type + '/' + endpoint);

    this.discovery = discovery;
    this.type = type;

    this._private._processor = processor;
    this._private._init = init;

    this.matcher = `server-tools/${env.name}/${this.endpoint}`;

    // endpoints.push(this);


  }

  init() {
    setEndpointAvailability(this.endpoint, this._private._available);
    client.publish(`homeassistant/${this.type}/${env.name}/${this.endpoint}/config`, JSON.stringify(this.discovery), { retain: true });
    this._private._init();
  }

  process(topic: string, msg: string) {
    this._private._processor(topic, msg);
  }

  get available() {
    return this._private._available;
  }

  set available(val: boolean) {
    setEndpointAvailability(this.endpoint, val);
    this._private._available = val;
  }
}