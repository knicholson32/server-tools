import chalk from "chalk";

import * as env from './env';
import { client } from './mqtt';
import { isJsonString, setSystemAvailability, syntaxHighlight } from "./helpers";
import { endpoints } from "./endpoints";
chalk.level = 1;




client.on('connect', () => {
  console.log(`${chalk.green('Connected')} with ${chalk.gray('clientId =')} ${chalk.magenta(env.clientId)}`);

  client.subscribe(`server-tools/${env.name}/#`, (err) => { });
  client.subscribe(`homeassistant/+/${env.name}/#`, (err) => { });

  setSystemAvailability(true);

  for (const endpoint of endpoints) endpoint.init();
  

  let longest_topic = 0;
  client.on("message", (topic, message) => {
    // message is Buffer
    if (topic.length > longest_topic) longest_topic = topic.length;
    const msg = message.toString();

    // if (isJsonString(msg)) {
    //   console.log(chalk.gray('→'), chalk.gray(topic), ' '.repeat(longest_topic - topic.length) + syntaxHighlight(JSON.stringify(JSON.parse(message.toString()), null, 2)));
    // } else {
    //   console.log(chalk.gray('→'), chalk.gray(topic), ' '.repeat(longest_topic - topic.length) + msg);
    // }


    for (const endpoint of endpoints) {
      if (topic.startsWith(endpoint.matcher)) endpoint.process(topic, message.toString());
    }


  });
  
});

// Declare exit code ------------------------------------------------------------------------
const exiting = () => {

  setSystemAvailability(false);
  client.end();
}
process.on('SIGTERM', exiting);


client.on('error', (error) => {
  console.log(error);
});


console.log(chalk.magenta('Node started'), process.platform);