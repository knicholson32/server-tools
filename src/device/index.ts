
import * as env from '../env';

export let device =  {
  identifiers: [
    env.name
  ],
  connections: [
    ['mac', 'DC:A6:32:61:7E:71']
  ],
  manufacturer: 'Raspberry Pi Trading Ltd',
  model: 'RPI4',
  model_id: 'Tesler',
  name: 'Tesler Server Tools'//name, // TODO: This should be a nicer name
}