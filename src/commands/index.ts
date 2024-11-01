import SSH from 'simple-ssh';
import * as env from '../env';
import { setSystemAvailability } from '../helpers';

const execSSH = (cmd: string) => {
  return new Promise((resolve, reject) => {
    const ssh = new SSH({
      host: 'host.docker.internal',
      user: env.SSH_USERNAME,
      pass: env.SSH_PASSWORD,
    });

    ssh.exec(cmd, { 
      // out: (stdout) => resolve(stdout),
      exit(code, stdout, stderr) {
        resolve({code, stdout, stderr});
      },
    }).start();

    ssh.on('error', function (err) {
      ssh.end();
      reject(err);
    });
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