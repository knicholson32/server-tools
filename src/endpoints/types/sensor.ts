import { Endpoint } from ".";
import { getCommonDiscoveryConfigs } from "../../helpers";
import * as env from '../../env';
import { client } from "../../mqtt";

// ---------------------------------------------------------------------------------------------
// Class Definition ----------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------

type SensorOptions = {
  entity_category?: 'diagnostic';
  device_class?: 'duration';
  enabled_by_default?: boolean;
  expire_after?: number;
  force_update?: boolean;
  icon?: string;
  name: string;
  suggested_display_precision?: number;
  state_topic?: 'measurement';
  unit_of_measurement?: string;
}


class NumberSensor extends Endpoint {

  _val: number = 0;

  constructor(endpoint: string, options: SensorOptions, init: () => void) {


    const discovery = {
      ...getCommonDiscoveryConfigs(endpoint),
      state_topic: `server-tools/${env.name}/${endpoint}`,
      value_template: "{{ value_json.value }}",
      ...options,
      unique_id: `${env.name}_${endpoint}`,
    };

    const _init = () => {
      this.value = this._val;
      init();
    }

    super(endpoint, 'sensor', discovery, () => { }, _init);
  }

  get value() {
    return this._val;
  }

  set value(v: number) {
    this._val = v;
    client.publish(`server-tools/${env.name}/${this.endpoint}`, JSON.stringify({ value: this._val }));
  }

}

class StringSensor extends Endpoint {

  _val: string = '';

  constructor(endpoint: string, options: SensorOptions, init: () => void) {


    const discovery = {
      ...getCommonDiscoveryConfigs(endpoint),
      state_topic: `server-tools/${env.name}/${endpoint}`,
      value_template: "{{ value_json.value }}",
      ...options,
      unique_id: `${env.name}_${endpoint}`,
    };

    const _init = () => {
      this.value = this._val;
      init();
    }

    super(endpoint, 'sensor', discovery, () => { }, _init);
  }

  get value() {
    return this._val;
  }

  set value(v: string) {
    this._val = v;
    client.publish(`server-tools/${env.name}/${this.endpoint}`, JSON.stringify({ value: this._val }));
  }

}

// ---------------------------------------------------------------------------------------------
// Class Implementations -----------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------

class ActionCountdown extends NumberSensor {
  constructor() {
    const discoveryOptions: SensorOptions = {
      device_class: 'duration',
      enabled_by_default: true,
      icon: 'mdi:progress-clock',
      name: 'Action Countdown',
      unit_of_measurement: 's'
    }

    const init = () => this.available = false;

    super('action-countdown-delay', discoveryOptions, init);
  }
}
export const actionCountdown = new ActionCountdown();


class Action extends StringSensor {
  constructor() {
    const discoveryOptions: SensorOptions = {
      enabled_by_default: true,
      icon: 'mdi:gesture-tap',
      name: 'Action',
    }

    const init = () => this.available = true;

    super('action', discoveryOptions, init);
    this._val = 'No Action';
  }
}
export const action = new Action();


export const endpoints: Endpoint[] = [actionCountdown, action];