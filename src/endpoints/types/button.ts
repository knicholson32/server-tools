import { Endpoint } from ".";
import { getCommonDiscoveryConfigs } from "../../helpers";
import * as env from '../../env';
import { actionDelay } from "./number";
import { action, actionCountdown } from "./sensor";
import { executeRestart, executeShutdown } from "../../commands";

// ---------------------------------------------------------------------------------------------
// Class Definition ----------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------

type ButtonOptions = {
  device_class?: 'restart' | 'identify' | 'update';
  entity_category?: 'config' | 'diagnostic';
  enabled_by_default?: boolean;
  icon?: string,
  name: string
}


class Button extends Endpoint {
  constructor(endpoint: string, options: ButtonOptions, callback: () => void, init: () => void) {


    const discovery = {
      ...getCommonDiscoveryConfigs(endpoint),
      command_topic: `server-tools/${env.name}/${endpoint}/set`,
      ...options,
      payload_press: "PRESS",
      unique_id: `${env.name}_${endpoint}`,
    };

    const processor = (topic: string, msg: string) => {
      if (msg === 'PRESS') callback();
    }

    super(endpoint, 'button', discovery, processor, init);
  }
}

let interval: NodeJS.Timeout | null = null;
const generateCountdownCallback = (actionName: string, command: () => void) => {

  const _cancel = () => {
    if (interval !== null) clearInterval(interval);
    interval = null;
    actionCountdown.available = false;
    cancel.available = false;
    action.value = 'No Action';
    for (const b of cancelableButtons) b.available = true; // TODO: This needs to be more intelligent; this could enable an actually unavailable entity
  }

  const callback = () => {
    for (const b of cancelableButtons) b.available = false; // TODO: This needs to be more intelligent; this could enable an actually unavailable entity
    let delay = actionDelay.value;

    if (delay <= 0) {
      command();
      for (const b of cancelableButtons) b.available = true; // TODO: This needs to be more intelligent; this could enable an actually unavailable entity
    } else {
      actionCountdown.value = delay;
      actionCountdown.available = true;
      cancel.available = true;
      action.value = actionName;
      delay--;
      interval = setInterval(() => {
        actionCountdown.value = delay;
        if (delay <= 0) {
          _cancel();
          command();
          for (const b of cancelableButtons) b.available = true; // TODO: This needs to be more intelligent; this could enable an actually unavailable entity
        } else {
          delay--;
        }
      }, 1000)
    }
  }
  return { callback, cancel: _cancel };
}

class Restart extends Button {

  cancel: () => void;

  constructor() {

    const discoveryOptions: ButtonOptions = {
      enabled_by_default: true,
      icon: 'mdi:restart',
      name: 'Restart'
    }

    const init = () => this.available = true;

    const callbacks = generateCountdownCallback('Restarting', executeRestart);
    super('restart', discoveryOptions, callbacks.callback, init);
    this.cancel = callbacks.cancel;
  }

}
export const restart = new Restart();


class Shutdown extends Button {

  cancel: () => void;

  constructor() {

    const discoveryOptions: ButtonOptions = {
      enabled_by_default: true,
      icon: 'mdi:power',
      name: 'Shutdown'
    }

    const init = () => this.available = true;

    const callbacks = generateCountdownCallback('Shuting Down', executeShutdown);
    super('shutdown', discoveryOptions, callbacks.callback, init);
    this.cancel = callbacks.cancel;
  }

}
export const shutdown = new Shutdown();

export const cancelableButtons = [restart, shutdown];

// ---------------------------------------------------------------------------------------------
// Class Implementations -----------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------

class Cancel extends Button {
  constructor() {

    const discoveryOptions: ButtonOptions = {
      entity_category: 'config',
      enabled_by_default: true,
      icon: 'mdi:cancel',
      name: 'Cancel'
    }

    const callback = () => {
      console.log('Cancel!');
      restart.cancel();
      restart.available = true;
    }

    const init = () => this.available = false;

    super('cancel', discoveryOptions, callback, init);

  }
}
export const cancel = new Cancel();



export const endpoints: Endpoint[] = [restart, shutdown, cancel];