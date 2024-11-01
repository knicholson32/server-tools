import { NodeSSH } from 'node-ssh';
import * as env from '../env';
import { setSystemAvailability } from '../helpers';

const execSSH = (cmd: string) => {
  return new Promise((resolve, reject) => {
    const ssh = new NodeSSH();

    ssh.connect({
      host: env.SSH_HOSTNAME,
      username: env.SSH_USERNAME,
      password: env.SSH_PASSWORD,
    }).then(() => {
      ssh.execCommand(cmd).then((result) => {
        resolve(result);
      }).catch(reject);
    }).catch(reject);
  });
}

export const executeRestart = async () => {
  setSystemAvailability(false);
  try {
    const res = await execSSH(`echo ${env.SSH_PASSWORD} | sudo -S reboot`);
    console.log(res);
  } catch (e) {
    console.log('Oops, something went wrong.');
    console.log(e);
    setSystemAvailability(true);
  }
}

export const executeShutdown = async () => {
  setSystemAvailability(false);
  try {
    const res = await execSSH(`echo ${env.SSH_PASSWORD} | sudo -S shutdown -h now`);
    console.log(res);
  } catch (e) {
    console.log('Oops, something went wrong.');
    console.log(e);
    setSystemAvailability(true);
  }
}