import { Endpoint } from ".";
import { getCommonDiscoveryConfigs, isJsonString } from "../../helpers";
import * as env from '../../env';
import { client } from "../../mqtt";
import { actionCountdown } from "./sensor";

// ---------------------------------------------------------------------------------------------
// Class Definition ----------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------

type NumberOptions = {
  entity_category?: 'config' | 'diagnostic';
  device_class?: 'duration';
  enabled_by_default?: boolean;
  icon?: string;
  min?: number;
  max?: number;
  mode?: 'auto' | 'box' | 'slider';
  name: string;
  step?: number;
  unit_of_measurement?: string;
  retain: boolean;
  default_value: number;
}


class Number extends Endpoint {

  _val: number;
  _retain: boolean;

  constructor(endpoint: string, options: NumberOptions, callback: (value: number) => void, init: () => void) {

    const discovery = {
      ...getCommonDiscoveryConfigs(endpoint),
      command_topic: `server-tools/${env.name}/${endpoint}/set`,
      state_topic: `server-tools/${env.name}/${endpoint}`,
      value_template: "{{ value_json.value }}",
      ...options,
      unique_id: `${env.name}_${endpoint}`,
    };

    const processor = (topic: string, msg: string) => {
      if (msg.indexOf('{') !== -1 && isJsonString(msg)) {
        const obj = JSON.parse(msg);
        console.log(obj);
        if ('value' in obj) {
          const v = parseInt(obj.value);
          if (!isNaN(v) && v !== this.value) {
            this.value = v;
            callback(v);
          }
        }
      } else {
        const v = parseInt(msg);
        if (!isNaN(v)) {
          this.value = v;
          callback(v);
        }
      }
    }

    const _init = () => {
      init();
    }
  
    super(endpoint, 'number', discovery, processor, _init);

    this._retain = options.retain;
    this._val = options.default_value;
  }

  get value() {
    return this._val;
  }


  set value(v: number) {
    this._val = v;
    client.publish(`server-tools/${env.name}/${this.endpoint}`, JSON.stringify({ value: this._val }), { retain: this._retain });
  }

}

// ---------------------------------------------------------------------------------------------
// Class Implementations -----------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------

class ActionDelay extends Number {
  constructor() {
    const discoveryOptions: NumberOptions = {
      device_class: 'duration',
      entity_category: 'config',
      enabled_by_default: true,
      icon: 'mdi:progress-clock',
      name: 'Action Delay',
      min: 0,
      max: 10,
      unit_of_measurement: 's',
      retain: true,
      default_value: 5
    }

    const callback = (value: number) => {
      console.log('Update', value);
      actionCountdown.value = value;
    }

    const init = () => {
      this.available = true;
    }

    super('action-delay', discoveryOptions, callback, init); 
  }
}
export const actionDelay = new ActionDelay();


export const endpoints: Endpoint[] = [actionDelay];