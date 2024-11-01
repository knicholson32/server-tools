import { Endpoint } from "./types";
import * as button from './types/button';
import * as number from './types/number';
import * as sensor from './types/sensor';

export const endpoints: Endpoint[] = [...button.endpoints, ...number.endpoints, ...sensor.endpoints];