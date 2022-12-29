import { MajGainerLooser } from './ss-maj-gainer-looser';
import { VolLeader } from './ss-vol-leader';

export class SecStats {
  sector: string;
  volume: number;
  percentage: number;
  gainers: MajGainerLooser[];
  loosers: MajGainerLooser[];
  leaders: VolLeader[];
}