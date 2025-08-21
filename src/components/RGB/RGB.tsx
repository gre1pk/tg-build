import type { FC } from 'react';

import { classNames } from '@/css/classnames.ts';

import type { RGB as RGBType } from '@telegram-apps/sdk-react';

import stales from './RGB.module.scss';

export type RGBProps = JSX.IntrinsicElements['div'] & {
  color: RGBType;
};

export const RGB: FC<RGBProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames(stales.rgb, className)}>
    <i className={stales.rgb__icon} style={{ backgroundColor: color }} />
    {color}
  </span>
);
