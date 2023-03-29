import * as GUI from '@babylonjs/gui';

interface EllipseExtends extends GUI.Ellipse {
  isDown?: boolean;
  floatLeft?: number;
  floatTop?: number;
}

interface MakeThumbParams {
  /** 边框 - border */
  thickness: number;
  /** 边框的颜色 */
  color: string;
  background?: string;
  width: string;
  height: string;
  /** 透明度 */
  alpha: number;
  // paddingLeft: string;
  // paddingBottom: string;
  // paddingRight: string;
  // paddingTop: string;
  /** 是否阻断指针事件 */
  isPointerBlocker: boolean;
  /** 设置gui node 相对于 canvas的对其方式  */
  horizontalAlignment: number;
  verticalAlignment: number;
  /** 相对于 canvas 的对其方式后，再设置偏移量 */
  left: number;
  top: number;
  /** 是否显示隐藏 */
  isVisible: boolean;
}

export default class JoystickControl {
  xAddPos = 0;
  yAddPos = 0;
  private sideJoystickOffset = 50;
  private bottomJoystickOffset = -50;
  private sideMaskJoystickOffset = this.sideJoystickOffset - 0;
  private bottomMaskJoystickOffset = this.bottomJoystickOffset + 0;
  constructor() {
    const adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    // 创建拇指区域的遮罩层
    const thumbMask = this._makeThumbArea('thumbContainer', this.THUMB_MASK);
    // 拇指容器区域
    const thumbContainer = this._makeThumbArea('thumbContainer', this.THUMB_CONTANINER);
    // 拇指内圈区域
    const thumbInner = this._makeThumbArea('thumbInner', this.INNER_THUMB_CONTANINER);
    // 拇指游标器
    const thumbPuck = this._makeThumbArea('thumbPuck', this.PUCK_THUMB_CONTANINER);
    // 获取拇指区域的宽、高等信息
    const currentMeasure = thumbContainer._currentMeasure;

    thumbMask.onPointerDownObservable.add((coordinates) => {
      thumbPuck.isVisible = true;
      this.xAddPos = coordinates.x - (currentMeasure.width * .5) - this.sideJoystickOffset;
      this.yAddPos = (adt as any)._canvas.height - coordinates.y - (currentMeasure.height * .5) + this.bottomJoystickOffset;
      thumbPuck.floatLeft = this.xAddPos;
      thumbPuck.floatTop = this.yAddPos * -1;
      thumbPuck.left = thumbPuck.floatLeft;
      thumbPuck.top = thumbPuck.floatTop;
      thumbPuck.isDown = true;
      thumbContainer.alpha = 0.9;
      thumbMask.left = this.sideMaskJoystickOffset + this.xAddPos;
      thumbMask.top = this.bottomMaskJoystickOffset + -this.yAddPos;
      thumbMask.alpha = 0.14;
    });
  
    thumbMask.onPointerUpObservable.add(() => {
      if (thumbPuck.isDown) {
        this.xAddPos = 0;
        this.yAddPos = 0;
        thumbPuck.isDown = false;
        thumbPuck.isVisible = false;
        thumbContainer.alpha = 0.4;
        thumbMask.left = this.sideMaskJoystickOffset + this.xAddPos;
        thumbMask.top = this.bottomMaskJoystickOffset + -this.yAddPos;
        // thumbMask.alpha = 0;
      }
    });
    const angel = 45;
    thumbMask.onPointerMoveObservable.add((coordinates, w) => {
      if (thumbPuck.isDown) {
        this.xAddPos = coordinates.x - (currentMeasure.width * .5) - currentMeasure.left;
        this.yAddPos = (adt as any)._canvas.height - coordinates.y - currentMeasure.height * .5 + this.bottomJoystickOffset;
        const ANGEL = Math.sqrt(Math.pow(this.xAddPos, 2) + Math.pow(this.yAddPos, 2));
        let angel_round = 1;
        if (ANGEL > angel) {
          angel_round = ANGEL / angel;
        }
        thumbMask.left = this.sideMaskJoystickOffset + this.xAddPos;
        thumbMask.top = this.bottomMaskJoystickOffset + -this.yAddPos;
        this.xAddPos /= angel_round;
        this.yAddPos /= angel_round;
        thumbPuck.floatLeft = this.xAddPos;
        thumbPuck.floatTop = this.yAddPos * -1;
        thumbPuck.left = thumbPuck.floatLeft;
        thumbPuck.top = thumbPuck.floatTop;
      }
    });
    adt.addControl(thumbContainer);
    thumbContainer.addControl(thumbInner);
    thumbContainer.addControl(thumbPuck);
    adt.addControl(thumbMask);
  }

  private _makeThumbArea(name: string, cssPropertify: Partial<MakeThumbParams>) {
    const rect: EllipseExtends = new GUI.Ellipse(name);
    
    for (let key in cssPropertify) {
      (rect as any)[key] = (cssPropertify as any)[key];
    }
  
    rect.paddingLeft = '0px';
    rect.paddingBottom = '0px';
    rect.paddingRight = '0px';
    rect.paddingTop = '0px';
    return rect;
  }

  private get THUMB_CONTANINER(): Partial<MakeThumbParams> {
    return {
      thickness: 2,
      color: 'blue',
      width: '100px',
      height: '100px',
      isPointerBlocker: true,
      horizontalAlignment: GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
      left: this.sideJoystickOffset,
      top: this.bottomJoystickOffset,
      alpha: 0.4,
    }
  }
  private get THUMB_MASK(): Partial<MakeThumbParams> {
    return {...this.THUMB_CONTANINER, background: 'red', color: void 0, thickness: 0}
  }
  private get INNER_THUMB_CONTANINER(): Partial<MakeThumbParams> {
    return {
      thickness: 4,
      color: 'blue',
      width: '40px',
      height: '40px',
      isPointerBlocker: false,
    }
  }
  private get PUCK_THUMB_CONTANINER(): Partial<MakeThumbParams> {
    return {
      thickness: 0,
      background: 'blue',
      width: '30px',
      height: '30px',
      isPointerBlocker: false,
      // 默认隐藏
      isVisible: false,
    }
  }
}