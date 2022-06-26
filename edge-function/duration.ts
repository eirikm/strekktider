const sprintf = require("sprintf-js").sprintf;

export class Duration {
    private static r = /\+?((\d+):)?(\d+)\.(\d+)/;
  
    public hours: number;
    public minutes: number;
    public seconds: number;
  
    private constructor(hours: number, minutes: number, seconds: number) {
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
    }
  
    public static parse(str: string | undefined): Duration | undefined {
      if (str === undefined) return undefined;
  
      const m = this.r.exec(str);
      if (!!m) {
        const hStr: string | undefined = m?.[2];
        const h = !!hStr ? Number(hStr) : 0;
  
        const minsStr: string | undefined = m?.[3];
        const mins: number | undefined =
          minsStr !== undefined ? Number(minsStr) : undefined;
  
        const secsStr: string | undefined = m?.[4];
        const secs: number | undefined =
          secsStr !== undefined ? Number(secsStr) : undefined;
  
        if (secs === undefined || mins === undefined) return undefined;
        else return new Duration(h, mins, secs);
      } else {
        return undefined;
      }
    }
  
    public toString() {
      if (this.hours > 0) {
        return sprintf("%d:%02d.%02d", this.hours, this.minutes, this.seconds);
      } else {
        return sprintf("%d.%02d", this.minutes, this.seconds);
      }
    }
  
    public asSeconds() {
      return (this.hours * 60 + this.minutes) * 60 + this.seconds;
    }
  }
  
  