import Phaser from 'phaser';

export class Clock {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private dayText: Phaser.GameObjects.Text;
  private x: number;
  private y: number;
  private size: number;

  public constructor(scene: Phaser.Scene, dayNumber: number) {
    this.scene = scene;
    this.size = 40;
    this.x = 10;
    this.y = 30;

    this.graphics = scene.add.graphics();
    this.graphics.setPosition(this.x, this.y);

    this.dayText = scene.add.text(this.x - 10, this.y + 10, `Day ${dayNumber}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#000000',
      align: 'center',
    }).setOrigin(0, 0);

    this.setTime(0);
  }

  public setTime(fraction: number): void {
    const radius = this.size * 0.5;
    const centerX = radius;
    const centerY = radius;

    const hourPerc = fraction;
    const minutePerc = fraction * 60;
    const hourAngle = Math.PI / 2 + 2 * Math.PI * hourPerc;
    const minuteAngle = -Math.PI / 2 + 2 * Math.PI * minutePerc;

    let hourColor = 0x000000;
    if (fraction >= 0.75 && Math.floor(fraction * 300) % 2 === 0) {
      hourColor = 0xff0000;
    }

    this.graphics.clear();
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeCircle(centerX, centerY, radius);
    this.graphics.lineStyle(2, hourColor, 1);
    this.graphics.lineBetween(
      centerX,
      centerY,
      centerX + radius * 0.75 * Math.cos(hourAngle),
      centerY + radius * 0.75 * Math.sin(hourAngle),
    );
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.lineBetween(
      centerX,
      centerY,
      centerX + radius * Math.cos(minuteAngle),
      centerY + radius * Math.sin(minuteAngle),
    );
  }
}
